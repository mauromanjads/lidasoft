# routes/tiposdocumento.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.tiporesponsable import TipoResponsable
from app.schemas.tiporesponsable_schema import TipoResponsablesBase
from typing import List


router = APIRouter(prefix="/tiposresponsables", tags=["Tipos de Responsabilidades"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[TipoResponsablesBase])
def obtener_tiposresponsables(db: Session = Depends(get_db)):
    return db.query(TipoResponsable).all()
