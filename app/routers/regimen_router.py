# routes/tiposdocumento.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database_empresa import get_db
from app.models.regimenestributarios import RegimenesTributarios
from app.schemas.regimenestributarios_schema import RegimenesTributariosBase
from typing import List


router = APIRouter(prefix="/regimen", tags=["Regimenes Tributarios"])


@router.get("/", response_model=List[RegimenesTributariosBase])
def obtener_generos(db: Session = Depends(get_db)):
    return db.query(RegimenesTributarios).all()
