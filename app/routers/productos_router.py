from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal

from app.schemas.productos_schema import ProductoCreate, ProductoUpdate, ProductoOut
from app.models.productos import Producto

router = APIRouter(prefix="/productos", tags=["Productos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[ProductoOut])
def listar_productos(db: Session = Depends(get_db)):
    return db.query(Producto).order_by(Producto.nombre.asc()).all()


@router.post("/", response_model=ProductoOut)
def crear_producto(data: ProductoCreate, db: Session = Depends(get_db)):
    nuevo = Producto(**data.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.get("/{id}", response_model=ProductoOut)
def obtener_producto(id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == id).first()
    if not producto:
        raise HTTPException(404, "Producto no encontrado")
    return producto


@router.put("/{id}", response_model=ProductoOut)
def actualizar_producto(id: int, data: ProductoUpdate, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == id).first()
    if not producto:
        raise HTTPException(404, "Producto no encontrado")

    for k, v in data.model_dump().items():
        setattr(producto, k, v)

    db.commit()
    db.refresh(producto)
    return producto


@router.delete("/{id}")
def eliminar_producto(id: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.id == id).first()
    if not producto:
        raise HTTPException(404, "Producto no encontrado")

    db.delete(producto)
    db.commit()
    return {"mensaje": "Producto eliminado"}
