
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.mediosdepago import MediosDePago  
from app.schemas.mediospago_schema import MediosPagoBase
from typing import List


router = APIRouter(prefix="/mediospago", tags=["Medios de pago"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[MediosPagoBase])
def obtener_mediospago(db: Session = Depends(get_db)):
    return db.query(MediosDePago).all()