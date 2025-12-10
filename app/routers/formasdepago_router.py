
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.formasdepago import FormasDePago
from app.schemas.formaspago_schema import FormasDePagoBase
from typing import List


router = APIRouter(prefix="/formaspago", tags=["Formas de pago"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[FormasDePagoBase])
def obtener_formaspago(db: Session = Depends(get_db)):
    return db.query(FormasDePago).all()
