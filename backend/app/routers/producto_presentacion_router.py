from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Integer

from app.models.productos import Producto

from app.dependencias.empresa import get_empresa_db



from app.schemas.productopresentacion_schema import (
    ProductoPresentacionCreate,
    ProductoPresentacionUpdate,
    ProductoPresentacionOut
)
from app.models.producto_presentacion import ProductoPresentacion

from sqlalchemy import func
from app.models.inventario import Inventario

router = APIRouter(prefix="/productos", tags=["Productos - Presentaciones"])


# 🔥 LISTAR presentaciones DE UN PRODUCTO
from sqlalchemy import select, func

@router.get("/{producto_id}/presentaciones", response_model=list[ProductoPresentacionOut])
def listar_presentaciones_producto(
    producto_id: int,
    db: Session = Depends(get_empresa_db),
    id_sucursal: int | None = None,
    con_stock: bool = False  # no filtra
):
    query = (
        db.query(
            ProductoPresentacion,
            cast(
                func.floor(
                    func.coalesce(func.sum(Inventario.stock_actual), 0)
                    / ProductoPresentacion.cantidad_equivalente
                ),
                Integer
            ).label("stock_actual"),
            Producto.control_inventario.label("control_inventario")
        )
        .join(Producto, Producto.id == ProductoPresentacion.producto_id)
        .filter(ProductoPresentacion.producto_id == producto_id)       
    )

    # JOIN dinámico inventario
    if id_sucursal is not None:
        query = query.outerjoin(
            Inventario,
            (Inventario.producto_id == Producto.id)
            & (Inventario.id_sucursal == id_sucursal)
        )
    else:
        query = query.outerjoin(
            Inventario,
            Inventario.producto_id == Producto.id
        )

    # 🔑 GROUP BY obligatorio (una fila por presentación)
    query = query.group_by(
        ProductoPresentacion.id,
        Producto.control_inventario
    )
    
    query = query.order_by(ProductoPresentacion.id.asc())
    rows = query.all()

    resultado = []
    for presentacion, stock_actual, control_inventario in rows:
        presentacion.stock_actual = stock_actual
        presentacion.control_inventario = control_inventario
        resultado.append(presentacion)

    return resultado


# 🔥 CREAR presentación
@router.post("/{producto_id}/presentaciones", response_model=ProductoPresentacionOut)
def crear_presentacion(producto_id: int, data: ProductoPresentacionCreate, db: Session = Depends(get_empresa_db)):

    nueva = ProductoPresentacion(
        producto_id=producto_id,
        **data.model_dump()
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

# 🔥 OBTENER una presentación por ID
@router.get("/presentaciones/{id}", response_model=ProductoPresentacionOut)
def obtener_presentacion(id: int, db: Session = Depends(get_empresa_db)):
    present = db.query(ProductoPresentacion).filter(ProductoPresentacion.id == id).first()
    if not present:
        raise HTTPException(404, "Presentación no encontrada")
    return present

# 🔥 ACTUALIZAR presentación
@router.put("/presentaciones/{id}", response_model=ProductoPresentacionOut)
def actualizar_presentacion(id: int, data: ProductoPresentacionUpdate, db: Session = Depends(get_empresa_db)):
    present = db.query(ProductoPresentacion).filter(ProductoPresentacion.id == id).first()
    if not present:
        raise HTTPException(404, "Presentación no encontrada")

    for k, v in data.model_dump().items():
        setattr(present, k, v)

    db.commit()
    db.refresh(present)
    return present

# 🔥 ELIMINAR presentación
@router.delete("/presentaciones/{id}")
def eliminar_presentacion(id: int, db: Session = Depends(get_empresa_db)):
    present = db.query(ProductoPresentacion).filter(ProductoPresentacion.id == id).first()
    if not present:
        raise HTTPException(404, "Presentación no encontrada")

    db.delete(present)
    db.commit()
    return {"mensaje": "Presentación eliminada"}
