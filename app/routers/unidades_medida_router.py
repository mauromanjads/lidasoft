# routers/unidades_medida.py
from fastapi import APIRouter, Depends, HTTPException,Query
from sqlalchemy.orm import Session
from typing import List
from app.dependencias.empresa import get_empresa_db
from app.models.unidadesmedida import UnidadMedida
from app.schemas.unidadesmedida_schema import UnidadMedidaCreate, UnidadMedidaRead

router = APIRouter(prefix="/unidades", tags=["Unidades de Medida"])

@router.post("/", response_model=UnidadMedidaRead)
def crear_unidad(unidad: UnidadMedidaCreate, db: Session = Depends(get_empresa_db)):
    db_unidad = UnidadMedida(**unidad.dict())
    db.add(db_unidad)
    db.commit()
    db.refresh(db_unidad)
    return db_unidad

@router.get("/", response_model=List[UnidadMedidaRead])
def listar_unidades(db: Session = Depends(get_empresa_db)):
    return db.query(UnidadMedida).order_by(UnidadMedida.nombre.asc()).all()

# ------------------------------------------------------------
# 👉 Buscar por nombre
# ------------------------------------------------------------
@router.get("/buscar", response_model=list[UnidadMedidaRead])
def buscar_unidadesmedida(
    query: str = Query(..., description="Nombre parcial de la unidad de medida"),
    db: Session = Depends(get_empresa_db)
):
    unidades = db.query(UnidadMedida).filter(
        UnidadMedida.nombre.ilike(f"%{query}%")
    ).all()

    if not unidades:
        raise HTTPException(status_code=404, detail="No se encontraron unidades con ese criterio")

    return unidades


# ------------------------------------------------------------
# 👉 Buscar por ID
# ------------------------------------------------------------
@router.get("/{unidad_id}", response_model=UnidadMedidaRead)
def obtener_unidad(unidad_id: int, db: Session = Depends(get_empresa_db)):
    unidad = db.query(UnidadMedida).filter(UnidadMedida.id == unidad_id).first()

    if not unidad:
        raise HTTPException(status_code=404, detail="Unidad no encontrada")

    return unidad


# ------------------------------------------------------------
# 👉 Actualizar
# ------------------------------------------------------------
@router.put("/{unidad_id}", response_model=UnidadMedidaRead)
def actualizar_unidad(
    unidad_id: int,
    unidad_data: UnidadMedidaCreate,
    db: Session = Depends(get_empresa_db)
):
    unidad = db.query(UnidadMedida).filter(UnidadMedida.id == unidad_id).first()

    if not unidad:
        raise HTTPException(status_code=404, detail="Unidad no existe")

    # Validar duplicado excepto el mismo registro
    existe = db.query(UnidadMedida).filter(
        UnidadMedida.nombre.ilike(unidad_data.nombre),
        UnidadMedida.id != unidad_id
    ).first()

    if existe:
        raise HTTPException(status_code=409, detail="Otra unidad ya tiene ese nombre")

    # Actualizar campos
    for key, value in unidad_data.model_dump().items():
        setattr(unidad, key, value)

    db.commit()
    db.refresh(unidad)

    return unidad


# ------------------------------------------------------------
# 👉 Eliminar
# ------------------------------------------------------------
@router.delete("/{unidad_id}")
def eliminar_unidad(unidad_id: int, db: Session = Depends(get_empresa_db)):
    unidad = db.query(UnidadMedida).filter(UnidadMedida.id == unidad_id).first()

    if not unidad:
        raise HTTPException(status_code=404, detail="Unidad no encontrada")

    db.delete(unidad)
    db.commit()

    return {"msg": "Unidad eliminada correctamente"}