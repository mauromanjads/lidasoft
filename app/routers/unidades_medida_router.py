# routers/unidades_medida.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.productos import UnidadMedida
from app.schemas.productos_schema import UnidadMedidaCreate, UnidadMedidaRead

router = APIRouter(prefix="/unidades", tags=["Unidades de Medida"])

@router.post("/", response_model=UnidadMedidaRead)
def crear_unidad(unidad: UnidadMedidaCreate, db: Session = Depends(get_db)):
    db_unidad = UnidadMedida(**unidad.dict())
    db.add(db_unidad)
    db.commit()
    db.refresh(db_unidad)
    return db_unidad

@router.get("/", response_model=List[UnidadMedidaRead])
def listar_unidades(db: Session = Depends(get_db)):
    return db.query(UnidadMedida).all()
