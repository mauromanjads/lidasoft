# routes/tiposdocumento.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencias.empresa import get_empresa_db
from app.models.ciius import Ciuu
from app.schemas.ciiu_schema import CiiuBase 
from typing import List


router = APIRouter(prefix="/ciiu", tags=["Ciiu"])


@router.get("/", response_model=List[CiiuBase])
def obtener_ciiu(db: Session = Depends(get_empresa_db)):
    return db.query(Ciuu).all()
