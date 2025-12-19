
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database_empresa import get_db
from app.models.mediosdepago import MediosDePago  
from app.schemas.mediospago_schema import MediosPagoBase
from typing import List


router = APIRouter(prefix="/mediospago", tags=["Medios de pago"])

@router.get("/", response_model=List[MediosPagoBase])
def obtener_mediospago(db: Session = Depends(get_db)):
    return db.query(MediosDePago).all()