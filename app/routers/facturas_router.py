from concurrent.futures import process
import json
from fastapi import APIRouter, HTTPException, Depends,Response
import requests
from sqlalchemy.orm import Session
from typing import List
from decimal import Decimal
from datetime import datetime,timezone
from fastapi import Request
from sqlalchemy import desc

from app.models.facturas import Factura
from app.models.factura_detalle import FacturaDetalle

from app.schemas.facturas_schema import FacturaSchema, FacturaResponse
from app.models.resoluciones import ResolucionDian
from app.models.mediosdepago import MediosDePago
from app.models.formasdepago import FormasDePago
from app.models.terceros import Terceros
from app.models.configuracionesdian import ConfiguracionDian
import os


from app.dependencias.empresa import get_empresa_db

from app.services.inventario_service import (
    descontar_inventario,
    InventarioError
)

router = APIRouter(
    prefix="/facturas",
    tags=["Facturas"]
)

# -----------------------
# Crear factura con cálculos automáticos
# -----------------------
@router.post("/", response_model=FacturaResponse)
def crear_factura(
    request: Request,
    factura_data: FacturaSchema,
    db: Session = Depends(get_empresa_db)
):
    try:
        with db.begin():  # 🔐 TRANSACCIÓN ATÓMICA

            # 1️⃣ Bloquear resolución
            resolucion = (
                db.query(ResolucionDian)
                .filter(ResolucionDian.id == factura_data.resolucion_id)
                .with_for_update()
                .first()
            )

            if not resolucion:
                raise HTTPException(status_code=404, detail="Resolución no encontrada")

            # 2️⃣ Calcular nuevo consecutivo
            nuevo_consecutivo = resolucion.rango_actual + 1

            # 3️⃣ Calcular totales
            subtotal_total = Decimal(0)
            descuento_total = Decimal(0)
            iva_total = Decimal(0)
            total_total = Decimal(0)

            detalles_model = []

            for det in factura_data.detalles:
                detalle_subtotal = det.cantidad * det.precio_unitario
                base_gravable = detalle_subtotal - det.descuento
                detalle_iva = base_gravable * det.iva / 100
                detalle_total = base_gravable + detalle_iva

                subtotal_total += detalle_subtotal
                descuento_total += det.descuento
                iva_total += detalle_iva
                total_total += detalle_total

                detalles_model.append(
                    FacturaDetalle(
                        producto_id=det.producto_id,
                        presentacion_id=det.presentacion_id,
                        variante_id=det.variante_id,
                        descripcion=det.descripcion,
                        cantidad=det.cantidad,
                        precio_unitario=det.precio_unitario,
                        descuento=det.descuento,
                        iva=detalle_iva,
                        subtotal=detalle_subtotal,
                        total=detalle_total
                    )
                )

            # 4️⃣ Crear número completo
            numero_completo = f"{resolucion.prefijo}{nuevo_consecutivo}"

            # 5️⃣ Crear factura
            factura = Factura(
                tercero_id=factura_data.tercero_id,
                vendedor_id=factura_data.vendedor_id,
                resolucion_id=resolucion.id,
                prefijo=resolucion.prefijo,
                consecutivo=nuevo_consecutivo,
                numero_completo=numero_completo,
                forma_pago_id=factura_data.forma_pago_id,
                medio_pago_id=factura_data.medio_pago_id,
                subtotal=subtotal_total,
                descuento_total=descuento_total,
                iva_total=iva_total,
                total=total_total,
                notas=factura_data.notas,
                usuario_creacion=request.cookies.get("usuario"),
                fecha_creacion=datetime.now(timezone.utc),
                id_sucursal=factura_data.id_sucursal,
                id_usuario=factura_data.id_usuario,
                detalles=detalles_model
            )

            db.add(factura)

            db.flush()
            for det in factura.detalles:
                descontar_inventario( 
                    db=db,                 
                    producto_id=det.producto_id,
                    presentacion_id=det.presentacion_id,
                    variante_id=det.variante_id,
                    cantidad=det.cantidad,
                    documento_tipo="FACTURA",
                    tipo_movimiento="SALIDA",
                    documento_id=factura.id,
                    nombre_producto=det.descripcion,
                    controla_inventario=det.producto.control_inventario,
                    id_sucursal=factura.id_sucursal,
                    id_usuario=factura.id_usuario,
                )

            # 6️⃣ Actualizar consecutivo en resolución
            resolucion.rango_actual = nuevo_consecutivo

        # 🔁 commit automático si todo salió bien
        db.refresh(factura)
        return factura

    except Exception as e:        
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------
# Listar facturas
# -----------------------

@router.get("/", response_model=List[FacturaResponse])
def listar_facturas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_empresa_db)
):
    facturas = (
        db.query(Factura)
        .order_by(desc(Factura.fecha))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return facturas


# -----------------------
# Obtener factura por ID
# -----------------------
@router.get("/{factura_id}", response_model=FacturaResponse)
def obtener_factura(factura_id: int, db: Session = Depends(get_empresa_db)):
    factura = db.query(Factura).filter(Factura.id == factura_id).first()
    if not factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return factura

# -----------------------
# Actualizar factura
# -----------------------
@router.put("/{factura_id}", response_model=FacturaResponse)
def actualizar_factura(request: Request, factura_id: int, factura_data: FacturaSchema, db: Session = Depends(get_empresa_db)):
    factura = db.query(Factura).filter(Factura.id == factura_id).first()
    if not factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")

    # Limpiar detalles antiguos
    factura.detalles.clear()
    db.flush()  # asegura que los detalles se eliminen antes de agregar los nuevos

    # Recalcular totales
    subtotal_total = Decimal(0)
    descuento_total = Decimal(0)
    iva_total = Decimal(0)
    total_total = Decimal(0)

    detalles_model = []
    for det in factura_data.detalles:
        detalle_subtotal = det.cantidad * det.precio_unitario
        detalle_iva = detalle_subtotal * det.iva / 100
        detalle_total = detalle_subtotal + detalle_iva - det.descuento

        subtotal_total += detalle_subtotal
        descuento_total += det.descuento
        iva_total += detalle_iva
        total_total += detalle_total

        detalle_model = FacturaDetalle(
            producto_id=det.producto_id,
            presentacion_id=det.presentacion_id,
            variante_id=det.variante_id,
            descripcion=det.descripcion,
            cantidad=det.cantidad,
            precio_unitario=det.precio_unitario,
            descuento=det.descuento,
            iva=detalle_iva,
            subtotal=detalle_subtotal,
            total=detalle_total
        )
        detalles_model.append(detalle_model)

    # Actualizar factura
    factura.tercero_id = factura_data.tercero_id
    factura.vendedor_id = factura_data.tercero_id
    factura.resolucion_id = factura_data.resolucion_id
    factura.prefijo = factura_data.prefijo
    factura.consecutivo = factura_data.consecutivo
    factura.numero_completo = f"{factura.prefijo}{factura.consecutivo}"
    factura.forma_pago_id = factura_data.forma_pago_id
    factura.medio_pago_id = factura_data.medio_pago_id
    factura.subtotal = subtotal_total
    factura.descuento_total = descuento_total
    factura.iva_total = iva_total
    factura.total = total_total
    factura.notas = factura_data.notas
    factura.detalles = detalles_model

    usuario_logueado = request.cookies.get("usuario") 
    factura.usuario_modifico = usuario_logueado
    factura.fecha_modificacion = datetime.now(timezone.utc)

    db.commit()
    db.refresh(factura)
    return factura

# -----------------------
# Eliminar factura
# -----------------------
@router.delete("/{factura_id}", response_model=dict)
def eliminar_factura(factura_id: int, db: Session = Depends(get_empresa_db)):
    factura = db.query(Factura).filter(Factura.id == factura_id).first()
    if not factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")

    db.delete(factura)
    db.commit()
    return {"mensaje": f"Factura {factura.numero_completo} eliminada correctamente"}

# -----------------------
# Generar el XML de la factura
# -----------------------

@router.post("/{factura_id}/xml")
def generar_xml_factura(
    factura_id: int,
    db: Session = Depends(get_empresa_db)
):
    # 1️⃣ Obtener factura + tipo_documento
    resultado = (
        db.query(
            Factura, 
            ResolucionDian.tipo_documento,
            MediosDePago,
            FormasDePago,
            Terceros
        )
        .join(ResolucionDian, Factura.resolucion_id == ResolucionDian.id)
        .join(MediosDePago, Factura.medio_pago_id == MediosDePago.id)
        .join(FormasDePago, Factura.forma_pago_id == FormasDePago.id)
        .join(Terceros, Factura.tercero_id == Terceros.id)
        .filter(Factura.id == factura_id)
        .first()
    )

    configdian = db.query(ConfiguracionDian).first()


    if not resultado:
        raise HTTPException(status_code=404, detail="Factura no encontrada")

    factura, tipo_documento,mediospago,formaspago,tercero = resultado  # ✅ desempaquetamos la tupla

    if not factura.detalles:
        raise HTTPException(status_code=400, detail="Factura sin detalle")

    #  Construir JSON DIAN
    factura_json = {}
    if tipo_documento == "FE":
        
         #  FACTURA ELECTRÓNICA

        factura_json = {
        "tipo_documento": tipo_documento,  
        "regimen": configdian.regimen,
        "metodo_pago": mediospago.codigo,
        "forma_pago": formaspago.nombre,
        "observaciones": factura.notas or "",

        "emisor_nombre":configdian.nombre_emisor,
        "emisor_nit": str(configdian.nit_emisor),
        "pin_dian": str(configdian.pin_software),

        "numero": factura.numero_completo,
        "fecha": factura.fecha.date().isoformat(),

        "cliente_nombre": str(tercero.nombre),
        "cliente_nit": str(tercero.documento),

        "items": [
            {
                "codigo": str(det.producto.codigo),
                "descripcion": det.producto.nombre,
                "cantidad": float(det.cantidad),
                "unidad": det.producto.unidad_medida.codigo,
                "precio_unitario": float(det.precio_unitario),
                "subtotal": float(det.subtotal),
                "impuesto": float(det.iva),
                "descuento": float(det.descuento)
            }
            for det in factura.detalles
        ],

        "total_sin_impuesto": float(factura.subtotal),
        "total_impuesto": float(factura.iva_total),
        "total_con_impuesto": float(factura.total),
        "moneda": "COP"
    }
  
    else:
       #  DOCUMENTO EQUIVALENTE DE FACTURA - DIFERENTE A FE
       factura_json = {
        "tipo_documento": tipo_documento,  
        "numero": factura.numero_completo,
        "fecha": factura.fecha.date().isoformat(),
        "moneda": "COP",        

        "emisor_nombre":configdian.nombre_emisor,
        "emisor_nit": str(configdian.nit_emisor),

        "cliente_nombre": str(tercero.nombre),
        "cliente_nit": str(tercero.documento),

        "motivo": factura.notas or "",
        "regimen": configdian.regimen,
        
        "total_sin_impuesto": float(factura.subtotal),
        "total_impuesto": float(factura.iva_total),
        "total_con_impuesto": float(factura.total),

        "items": [
            {
                "codigo": str(det.producto.codigo),
                "descripcion": det.producto.nombre,
                "cantidad": float(det.cantidad),
                "unidad": det.producto.unidad_medida.codigo,
                "precio_unitario": float(det.precio_unitario),
                "subtotal": float(det.subtotal),
                "impuesto": float(det.iva),
                "descuento": float(det.descuento)
            }
            for det in factura.detalles
        ],
        
    }
  
    XMLSERVICE_URL = os.getenv("NEXT_PUBLIC_API_DIAN")
    XMLSERVICE_TOKEN = configdian.token
     
    try:
        response = requests.post(
            XMLSERVICE_URL,
            json=factura_json,
            headers={
                "Authorization": f"Bearer {XMLSERVICE_TOKEN}",
                "Content-Type": "application/json"
            },
            timeout=20
         )
    except requests.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error conectando con XMLService: {str(e)}"
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=f"XMLService error: {response.text}"
        )

    xml = response.text
    
    return Response(
        content=xml,
        media_type="application/xml",
        headers={
            "Content-Disposition": f'attachment; filename="{factura.numero_completo}.xml"'
        }
    )
