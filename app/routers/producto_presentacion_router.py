from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal

from app.schemas.productopresentacion_schema import (
    ProductoPresentacionCreate,
    ProductoPresentacionUpdate,
    ProductoPresentacionOut
)
from app.models.producto_presentacion import ProductoPresentacion

router = APIRouter(prefix="/productos", tags=["Productos - Presentaciones"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔥 LISTAR presentaciones DE UN PRODUCTO
@router.get("/{producto_id}/presentaciones", response_model=list[ProductoPresentacionOut])
def listar_presentaciones_producto(producto_id: int, db: Session = Depends(get_db)):
    return (
        db.query(ProductoPresentacion)
        .filter(ProductoPresentacion.producto_id == producto_id)
        .order_by(ProductoPresentacion.id.asc())
        .all()
    )

# 🔥 CREAR presentación
@router.post("/{producto_id}/presentaciones", response_model=ProductoPresentacionOut)
def crear_presentacion(producto_id: int, data: ProductoPresentacionCreate, db: Session = Depends(get_db)):

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
def obtener_presentacion(id: int, db: Session = Depends(get_db)):
    present = db.query(ProductoPresentacion).filter(ProductoPresentacion.id == id).first()
    if not present:
        raise HTTPException(404, "Presentación no encontrada")
    return present

# 🔥 ACTUALIZAR presentación
@router.put("/presentaciones/{id}", response_model=ProductoPresentacionOut)
def actualizar_presentacion(id: int, data: ProductoPresentacionUpdate, db: Session = Depends(get_db)):
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
def eliminar_presentacion(id: int, db: Session = Depends(get_db)):
    present = db.query(ProductoPresentacion).filter(ProductoPresentacion.id == id).first()
    if not present:
        raise HTTPException(404, "Presentación no encontrada")

    db.delete(present)
    db.commit()
    return {"mensaje": "Presentación eliminada"}
