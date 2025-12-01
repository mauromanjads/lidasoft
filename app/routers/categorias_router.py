# app/routers/categorias_router.py

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.categorias import Categoria  
from app.schemas.categorias_schema import CategoriaCreate, CategoriaResponse
from datetime import datetime, timezone

router = APIRouter(prefix="/categorias", tags=["categorias"])

# ------------------------------------------------------------
# 👉 Crear categoría (validando que NO exista el nombre)
# ------------------------------------------------------------
@router.post("/", response_model=CategoriaResponse)
def crear_categoria(
    request: Request,
    categoria: CategoriaCreate,
    db: Session = Depends(get_db)
):
    usuario_logueado = request.cookies.get("usuario")

    existe = db.query(Categoria).filter(
        Categoria.nombre.ilike(categoria.nombre)
    ).first()

    if existe:
        raise HTTPException(status_code=409, detail="La categoría ya existe")

    db_cat = Categoria(
        **categoria.model_dump(),
        usuario_creacion=usuario_logueado,
        fecha_creacion=datetime.now(timezone.utc)
    )

    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)

    return db_cat


# ------------------------------------------------------------
# 👉 Listar todas
# ------------------------------------------------------------
@router.get("/", response_model=list[CategoriaResponse])
def listar_categorias(db: Session = Depends(get_db)):
    return db.query(Categoria).order_by(Categoria.nombre.asc()).all()


# ------------------------------------------------------------
# 👉 Buscar por nombre
# ------------------------------------------------------------
@router.get("/buscar", response_model=list[CategoriaResponse])
def buscar_categoria(
    query: str = Query(..., description="Nombre parcial de la categoría"),
    db: Session = Depends(get_db)
):
    categorias = db.query(Categoria).filter(
        Categoria.nombre.ilike(f"%{query}%")
    ).all()

    if not categorias:
        raise HTTPException(status_code=404, detail="No se encontraron categorías con ese criterio")

    return categorias


# ------------------------------------------------------------
# 👉 Buscar por ID
# ------------------------------------------------------------
@router.get("/{categoria_id}", response_model=CategoriaResponse)
def obtener_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()

    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    return categoria


# ------------------------------------------------------------
# 👉 Actualizar
# ------------------------------------------------------------
@router.put("/{categoria_id}", response_model=CategoriaResponse)
def actualizar_categoria(
    request: Request,
    categoria_id: int,
    categoria_data: CategoriaCreate,
    db: Session = Depends(get_db)
):
    try:
        usuario_logueado = request.cookies.get("usuario")
        categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()

        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no existe")

        # Validar duplicado excepto la misma categoría
        existe = db.query(Categoria).filter(
            Categoria.nombre.ilike(categoria_data.nombre),
            Categoria.id != categoria_id
        ).first()

        if existe:
            raise HTTPException(status_code=409, detail="Otra categoría ya tiene ese nombre")

        for key, value in categoria_data.model_dump().items():
            setattr(categoria, key, value)

        categoria.usuario_modifico = usuario_logueado
        categoria.fecha_modificacion = datetime.now(timezone.utc)

        db.commit()
        db.refresh(categoria)
        return categoria

    except Exception as e:
        print("❌ ERROR EN ENDPOINT:", e)
        raise HTTPException(status_code=500, detail=str(e))


# ------------------------------------------------------------
# 👉 Eliminar
# ------------------------------------------------------------
@router.delete("/{categoria_id}")
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()

    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    db.delete(categoria)
    db.commit()

    return {"msg": "Categoría eliminada correctamente"}
