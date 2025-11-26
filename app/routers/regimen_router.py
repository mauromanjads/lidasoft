# routes/tiposdocumento.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.regimenestributarios import RegimenesTributarios
from app.schemas.regimenestributarios_schema import RegimenesTributariosBase
from typing import List


router = APIRouter(prefix="/regimen", tags=["Regimenes Tributarios"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[RegimenesTributariosBase])
def obtener_generos(db: Session = Depends(get_db)):
    return db.query(RegimenesTributarios).all()
