from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.models.categorias import Categoria
from app.schemas.categorias_schema import (
    CategoriaCreate, CategoriaUpdate, CategoriaResponse
)
from app.dependencias.empresa import get_empresa_db

router = APIRouter(prefix="/categorias", tags=["categorias"])

# Crear categoría
@router.post("/", response_model=CategoriaResponse)
def crear_categoria(categoria: CategoriaCreate, db: Session = Depends(get_empresa_db)):
    existe = db.query(Categoria).filter(Categoria.nombre.ilike(categoria.nombre)).first()
    if existe:
        raise HTTPException(status_code=409, detail="La categoría ya existe")

    db_cat = Categoria(**categoria.model_dump())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

# Listar todas
@router.get("/", response_model=list[CategoriaResponse])
def listar_categorias(db: Session = Depends(get_empresa_db)):
    return db.query(Categoria).order_by(Categoria.nombre.asc()).all()

# Buscar por nombre
@router.get("/buscar", response_model=list[CategoriaResponse])
def buscar_categoria(query: str = Query(...), db: Session = Depends(get_empresa_db)):
    categorias = db.query(Categoria).filter(Categoria.nombre.ilike(f"%{query}%")).all()
    if not categorias:
        raise HTTPException(status_code=404, detail="No se encontraron categorías con ese criterio")
    return categorias

# Buscar por ID
@router.get("/{categoria_id}", response_model=CategoriaResponse)
def obtener_categoria(categoria_id: int, db: Session = Depends(get_empresa_db)):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

# Actualizar categoría
@router.put("/{categoria_id}", response_model=CategoriaResponse)
def actualizar_categoria(categoria_id: int, categoria_data: CategoriaUpdate, db: Session = Depends(get_empresa_db)):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no existe")

    if categoria_data.nombre:
        existe = db.query(Categoria).filter(
            Categoria.nombre.ilike(categoria_data.nombre),
            Categoria.id != categoria_id
        ).first()
        if existe:
            raise HTTPException(status_code=409, detail="Otra categoría ya tiene ese nombre")

    for key, value in categoria_data.model_dump(exclude_unset=True).items():
        setattr(categoria, key, value)

    db.commit()
    db.refresh(categoria)
    return categoria

# Eliminar categoría
@router.delete("/{categoria_id}")
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_empresa_db)):
    categoria = db.query(Categoria).filter(Categoria.id == categoria_id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    db.delete(categoria)
    db.commit()
    return {"msg": "Categoría eliminada correctamente"}
