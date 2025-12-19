# routes/tiposdocumento.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database_empresa import get_db
from app.models.generos import Generos
from app.schemas.generos_schema import GeneroBase
from typing import List


router = APIRouter(prefix="/generos", tags=["Generos"])


@router.get("/", response_model=List[GeneroBase])
def obtener_generos(db: Session = Depends(get_db)):
    return db.query(Generos).all()
