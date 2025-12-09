from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from decimal import Decimal
from datetime import datetime,timezone
from fastapi import Request

from app.models.facturas import Factura
from app.models.factura_detalle import FacturaDetalle

from app.schemas.facturas_schema import FacturaSchema, FacturaResponse

from app.database import get_db  # tu dependencia de DB

router = APIRouter(
    prefix="/facturas",
    tags=["Facturas"]
)

# -----------------------
# Crear factura con cálculos automáticos
# -----------------------
@router.post("/", response_model=FacturaResponse)
def crear_factura(request: Request, factura_data: FacturaSchema, db: Session = Depends(get_db)):
    # Calcular subtotales y totales de la factura
    subtotal_total = Decimal(0)
    descuento_total = Decimal(0)
    iva_total = Decimal(0)
    total_total = Decimal(0)

    detalles_model = []
    for det in factura_data.detalles:
        # Calcular subtotal del detalle
        detalle_subtotal = det.cantidad * det.precio_unitario
        detalle_iva = detalle_subtotal * det.iva / 100  # si IVA viene en porcentaje
        detalle_total = detalle_subtotal + detalle_iva - det.descuento

        subtotal_total += detalle_subtotal
        descuento_total += det.descuento
        iva_total += detalle_iva
        total_total += detalle_total

        detalle_model = FacturaDetalle(
            producto_id=det.producto_id,
            presentacion_id=det.presentacion_id,
            descripcion=det.descripcion,
            cantidad=det.cantidad,
            precio_unitario=det.precio_unitario,
            descuento=det.descuento,
            iva=detalle_iva,
            subtotal=detalle_subtotal,
            total=detalle_total
        )
        detalles_model.append(detalle_model)

    # Calcular numero_completo
    numero_completo = f"{factura_data.prefijo}{factura_data.consecutivo}"

    # Crear instancia Factura
    factura = Factura(
        tercero_id=factura_data.tercero_id,
        vendedor_id=factura_data.vendedor_id,
        resolucion_id=factura_data.resolucion_id,
        prefijo=factura_data.prefijo,
        consecutivo=factura_data.consecutivo,
        numero_completo=numero_completo,
        forma_pago=factura_data.forma_pago,
        medio_pago=factura_data.medio_pago,
        subtotal=subtotal_total,
        descuento_total=descuento_total,
        iva_total=iva_total,
        total=total_total,
        notas=factura_data.notas
    )

    # Asignar detalles
    factura.detalles = detalles_model

    usuario_logueado = request.cookies.get("usuario") 
    factura.usuario_creacion = usuario_logueado
    factura.fecha_creacion = datetime.now(timezone.utc)


    db.add(factura)
    db.commit()
    db.refresh(factura)

    return factura

# -----------------------
# Listar facturas
# -----------------------
@router.get("/", response_model=List[FacturaResponse])
def listar_facturas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    facturas = db.query(Factura).offset(skip).limit(limit).all()
    return facturas

# -----------------------
# Obtener factura por ID
# -----------------------
@router.get("/{factura_id}", response_model=FacturaResponse)
def obtener_factura(factura_id: int, db: Session = Depends(get_db)):
    factura = db.query(Factura).filter(Factura.id == factura_id).first()
    if not factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return factura

# -----------------------
# Actualizar factura
# -----------------------
@router.put("/{factura_id}", response_model=FacturaResponse)
def actualizar_factura(request: Request, factura_id: int, factura_data: FacturaSchema, db: Session = Depends(get_db)):
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
    factura.forma_pago = factura_data.forma_pago
    factura.medio_pago = factura_data.medio_pago
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
def eliminar_factura(factura_id: int, db: Session = Depends(get_db)):
    factura = db.query(Factura).filter(Factura.id == factura_id).first()
    if not factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")

    db.delete(factura)
    db.commit()
    return {"mensaje": f"Factura {factura.numero_completo} eliminada correctamente"}




