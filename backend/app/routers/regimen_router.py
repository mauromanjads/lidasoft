# routes/tiposdocumento.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencias.empresa import get_empresa_db
from app.models.regimenestributarios import RegimenesTributarios
from app.schemas.regimenestributarios_schema import RegimenesTributariosBase
from typing import List


router = APIRouter(prefix="/regimen", tags=["Regimenes Tributarios"])


@router.get("/", response_model=List[RegimenesTributariosBase])
def obtener_generos(db: Session = Depends(get_empresa_db)):
    return db.query(RegimenesTributarios).all()
