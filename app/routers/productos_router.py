# routers/productos.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal
from app.models.productos import Producto, ProductoPresentacion, ProductoPrecio
from app.schemas.productos_schema import ProductoCreate, ProductoRead, ProductoPresentacionCreate, ProductoPresentacionRead, ProductoPrecioCreate, ProductoPrecioRead

router = APIRouter(prefix="/productos", tags=["Productos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===========================================================
# PRODUCTOS CRUD
# ===========================================================
@router.post("/", response_model=ProductoRead)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

@router.get("/", response_model=List[ProductoRead])
def listar_productos(db: Session = Depends(get_db)):
    return db.query(Producto).all()

@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto

@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(producto_id: int, producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    for key, value in producto.dict().items():
        setattr(db_producto, key, value)
    db.commit()
    db.refresh(db_producto)
    return db_producto

@router.delete("/{producto_id}")
def eliminar_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.id == producto_id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(db_producto)
    db.commit()
    return {"detail": "Producto eliminado"}


# ===========================================================
# PRESENTACIONES CRUD
# ===========================================================
@router.post("/{producto_id}/presentaciones", response_model=ProductoPresentacionRead)
def crear_presentacion(producto_id: int, presentacion: ProductoPresentacionCreate, db: Session = Depends(get_db)):
    db_presentacion = ProductoPresentacion(**presentacion.dict())
    db_presentacion.producto_id = producto_id
    db.add(db_presentacion)
    db.commit()
    db.refresh(db_presentacion)
    return db_presentacion

@router.get("/{producto_id}/presentaciones", response_model=List[ProductoPresentacionRead])
def listar_presentaciones(producto_id: int, db: Session = Depends(get_db)):
    return db.query(ProductoPresentacion).filter(ProductoPresentacion.producto_id == producto_id).all()


# ===========================================================
# PRECIOS CRUD
# ===========================================================
@router.post("/presentaciones/{presentacion_id}/precios", response_model=ProductoPrecioRead)
def crear_precio(presentacion_id: int, precio: ProductoPrecioCreate, db: Session = Depends(get_db)):
    db_precio = ProductoPrecio(**precio.dict())
    db_precio.presentacion_id = presentacion_id
    db.add(db_precio)
    db.commit()
    db.refresh(db_precio)
    return db_precio

@router.get("/presentaciones/{presentacion_id}/precios", response_model=List[ProductoPrecioRead])
def listar_precios(presentacion_id: int, db: Session = Depends(get_db)):
    return db.query(ProductoPrecio).filter(ProductoPrecio.presentacion_id == presentacion_id).all()
