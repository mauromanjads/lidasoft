from fastapi import APIRouter, HTTPException, Depends,Response
import requests
from sqlalchemy.orm import Session
from typing import List
from decimal import Decimal
from datetime import datetime,timezone
from fastapi import Request
from sqlalchemy import desc
from sqlalchemy.orm import joinedload

from app.models.empresa import Empresa

from app.models.facturas import Factura
from app.models.factura_detalle import FacturaDetalle
from app.models.terceros import Terceros
from app.schemas.facturas_schema import FacturaSchema, FacturaResponse
from app.models.resoluciones import ResolucionDian
from app.models.configuracionesdian import ConfiguracionDian
from app.services.factura_builder import construir_factura_json
import os

from app.dependencias.empresa import get_empresa_db
from app.database_master import get_db_master

from app.services.inventario_service import (
    actualizar_inventario,
    actualizar_inventario_encabezado,
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
            nuevo_consecutivo = resolucion.rango_actual

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
                        iva_porcentaje=det.iva,
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

            tiene_productos_con_inventario = any(
                item.producto.control_inventario == "S"
                for item in factura.detalles
            )
            if not tiene_productos_con_inventario:
                # ❌ No crear documento de inventario
                return

            movimiento = actualizar_inventario_encabezado(
                db=db,                                 
                documento_tipo="SAL_INV",
                tipo_movimiento="SALIDA",                                                    
                id_sucursal=factura.id_sucursal,
                id_usuario=factura.id_usuario,
                origen_tipo = "FACTURA",
                origen_id = factura.id,
                costo_total = total_total

            )         

            for det in factura.detalles:
                actualizar_inventario( 
                    db=db, 
                    documento_inventario_id=movimiento.id,   
                    producto_id=det.producto_id,
                    presentacion_id=det.presentacion_id,
                    variante_id=det.variante_id,
                    cantidad=det.cantidad,                    
                    tipo_movimiento="SALIDA",                    
                    nombre_producto=det.descripcion,
                    controla_inventario=det.producto.control_inventario,
                    id_sucursal=factura.id_sucursal,
                    id_usuario=factura.id_usuario,                    
                    precio_unitario= det.precio_unitario
                )

            # 6️⃣ Actualizar consecutivo en resolución
            resolucion.rango_actual = nuevo_consecutivo + 1            

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
        .options(            
            joinedload(Factura.tercero).joinedload(Terceros.tipo_documento)
        )
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
    id_empresa: int,
    db: Session = Depends(get_empresa_db),
    db_master: Session = Depends(get_db_master)
):
    factura_json = construir_factura_json(db, factura_id,id_empresa,db_master)

    configdian = db.query(ConfiguracionDian).first()
  
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

    cufecude = extraer_cufe_o_cude(xml)

    if not cufecude:
        raise HTTPException(
            status_code=500,
            detail="No se pudo extraer CUFE/CUDE del XML DIAN"
        )

    # 🔹 Guardar en base de datos
    factura = db.query(Factura).filter(Factura.id == factura_id).first()
    
    resolucion = db.query(ResolucionDian).filter(
        ResolucionDian.id == factura.resolucion_id
    ).first()
        
    if resolucion.tipo_documento == "FE": factura.tipo_codigo_fiscal ="CUFE"    
    if resolucion.tipo_documento == "DE": factura.tipo_codigo_fiscal ="CUDE"
        
    factura.codigo_fiscal = cufecude

    db.commit()


    return Response(
        content=xml,
        media_type="application/xml",
        headers={
            "Content-Disposition": f'attachment; filename="{factura_json["numero"]}.xml"'
        }
    )


# -----------------------
# Imprimir factura en PDF
# -----------------------

from fastapi.responses import FileResponse
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import qrcode

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(BASE_DIR, "..", "templates")

env = Environment(
    loader=FileSystemLoader(TEMPLATES_DIR),
    autoescape=True
)

@router.get("/{factura_id}/pdf")
def generar_factura(
    factura_id: int,
    id_empresa: int,
    formato: str = "a4",    
    db: Session = Depends(get_empresa_db),
    db_master: Session = Depends(get_db_master)
): 
    factura = construir_factura_json(db, factura_id, id_empresa,db_master)
  
    empresa = db_master.query(Empresa).filter(Empresa.id == id_empresa).first()

    BASE_INVOICES_FOLDER  = "invoices"
    year = datetime.now().year

    PDF_FOLDER = os.path.join(
        BASE_INVOICES_FOLDER,
        str(empresa.subdominio),
        str(year)
    )

    os.makedirs(PDF_FOLDER, exist_ok=True)

    # Generar QR
    qr_img_path = os.path.join(
        PDF_FOLDER,
        f"qr_{factura['numero']}.png"
    )
    
    qr_data = f"Pago factura {factura['numero']} total ${factura['total_con_impuesto']}"
    qr = qrcode.QRCode(box_size=4, border=2)
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(qr_img_path)
    qr_path = os.path.abspath(qr_img_path).replace("\\", "/")

    template = env.get_template(
        "factura_pos.html" if formato.lower() == "pos" else "factura_a4.html"
    )
   
    BASE_API_URL = os.getenv("NEXT_PUBLIC_API_URL")  

   

    logo_url = (
        f"{BASE_API_URL}{empresa.logo_url}"
        if empresa.logo_url
        else None
    )

    html_out = template.render(
        factura=factura,
        qr_path=qr_path,
        logo_url=logo_url   
    )

    pdf_file = os.path.join(PDF_FOLDER, f"factura_{factura['numero']}_{formato}.pdf")

    HTML(
        string=html_out,
        base_url=os.getcwd()
    ).write_pdf(pdf_file)

    return FileResponse(
        pdf_file,
        media_type="application/pdf",
        filename=os.path.basename(pdf_file)
    )


import xml.etree.ElementTree as ET

def extraer_cufe_o_cude(xml_string: str) -> str | None:
    namespaces = {
        "cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
    }

    root = ET.fromstring(xml_string)

    uuid = root.find(".//cbc:UUID", namespaces)

    if uuid is not None:
        return uuid.text.strip()

    return None

    

