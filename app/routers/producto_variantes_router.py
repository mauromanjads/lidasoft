# app/routers/productos_variantes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal

from app.schemas.productovariantes_schema import (
    ProductoVarianteCreate,
    ProductoVarianteUpdate,
    ProductoVarianteResponse
)
from app.models.producto_variantes import ProductoVariante
from sqlalchemy import func
from app.models.inventario import Inventario

# ✅ PREFIX CORRECTO
router = APIRouter(
    prefix="/productos/{producto_id}/variantes",
    tags=["Productos - Variantes"]
)

# -----------------------------
# Dependencia de DB
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔥 LISTAR variantes de un producto
@router.get("/", response_model=list[ProductoVarianteResponse])
def listar_variantes_producto(
    producto_id: int,
    db: Session = Depends(get_db)
):
    variantes = (
    db.query(ProductoVariante)
    .add_columns(
        func.coalesce(Inventario.stock_actual, 0).label("stock_actual")
    )
    .outerjoin(
        Inventario,
        Inventario.variante_id == ProductoVariante.id
    )
    .filter(ProductoVariante.producto_id == producto_id)
    .order_by(ProductoVariante.id.asc())
    .all()
)

# 🔥 Convertimos a objetos "compatibles"
    resultado = []
    for variante, stock_actual in variantes:
            variante.stock_actual = stock_actual  # atributo dinámico ✔️
            resultado.append(variante)
            
    return resultado

# 🔥 CREAR variante
@router.post("/", response_model=ProductoVarianteResponse)
def crear_variante(
    producto_id: int,
    data: ProductoVarianteCreate,
    db: Session = Depends(get_db)
):   
    nueva = ProductoVariante(
        producto_id=producto_id,        
        **data.model_dump()
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

# 🔥 OBTENER una variante por ID
@router.get("/{id}", response_model=ProductoVarianteResponse)
def obtener_variante(
    producto_id: int,
    id: int,
    db: Session = Depends(get_db)
):
    variante = (
        db.query(ProductoVariante)
        .filter(
            ProductoVariante.id == id,
            ProductoVariante.producto_id == producto_id
        )
        .first()
    )

    if not variante:
        raise HTTPException(status_code=404, detail="Variante no encontrada")

    return variante

# 🔥 ACTUALIZAR variante
@router.put("/{id}", response_model=ProductoVarianteResponse)
def actualizar_variante(
    producto_id: int,
    id: int,
    data: ProductoVarianteUpdate,
    db: Session = Depends(get_db)
):
    variante = (
        db.query(ProductoVariante)
        .filter(
            ProductoVariante.id == id,
            ProductoVariante.producto_id == producto_id
        )
        .first()
    )

    if not variante:
      raise HTTPException(status_code=404, detail="Variante no encontrada")

    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(variante, k, v)

    db.commit()
    db.refresh(variante)
    return variante

# 🔥 ELIMINAR variante
@router.delete("/{id}")
def eliminar_variante(
    producto_id: int,
    id: int,
    db: Session = Depends(get_db)
):
    variante = (
        db.query(ProductoVariante)
        .filter(
            ProductoVariante.id == id,
            ProductoVariante.producto_id == producto_id
        )
        .first()
    )

    if not variante:
        raise HTTPException(status_code=404, detail="Variante no encontrada")

    db.delete(variante)
    db.commit()
    return {"mensaje": "Variante eliminada"}
