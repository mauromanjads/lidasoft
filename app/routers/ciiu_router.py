# routes/tiposdocumento.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.ciius import Ciuu
from app.schemas.ciiu_schema import CiiuBase 
from typing import List


router = APIRouter(prefix="/ciiu", tags=["Ciiu"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[CiiuBase])
def obtener_ciiu(db: Session = Depends(get_db)):
    return db.query(Ciuu).all()
