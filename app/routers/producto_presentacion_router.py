from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal

from app.schemas.productopresentacion_schema import (
    ProductoPresentacionCreate,
    ProductoPresentacionUpdate,
    ProductoPresentacionOut
)
from models.producto_presentacion import ProductoPresentacion

router = APIRouter(prefix="/productos-presentacion", tags=["Productos - Presentaciones"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[ProductoPresentacionOut])
def listar_presentaciones(db: Session = Depends(get_db)):
    return db.query(ProductoPresentacion).all()


@router.post("/", response_model=ProductoPresentacionOut)
def crear_presentacion(data: ProductoPresentacionCreate, db: Session = Depends(get_db)):
    nueva = ProductoPresentacion(**data.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.get("/{id}", response_model=ProductoPresentacionOut)
def obtener_presentacion(id: int, db: Session = Depends(get_db)):
    present = db.query(ProductoPresentacion).filter(ProductoPresentacion.id == id).first()
    if not present:
        raise HTTPException(404, "Presentación no encontrada")
    return present


@router.put("/{id}", response_model=ProductoPresentacionOut)
def actualizar_presentacion(id: int, data: ProductoPresentacionUpdate, db: Session = Depends(get_db)):
    present = db.query(ProductoPresentacion).filter(ProductoPresentacion.id == id).first()
    if not present:
        raise HTTPException(404, "Presentación no encontrada")

    for k, v in data.model_dump().items():
        setattr(present, k, v)

    db.commit()
    db.refresh(present)
    return present


@router.delete("/{id}")
def eliminar_presentacion(id: int, db: Session = Depends(get_db)):
    present = db.query(ProductoPresentacion).filter(ProductoPresentacion.id == id).first()
    if not present:
        raise HTTPException(404, "Presentación no encontrada")

    db.delete(present)
    db.commit()
    return {"mensaje": "Presentación eliminada"}
