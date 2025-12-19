
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencias.empresa import get_empresa_db
from app.models.formasdepago import FormasDePago
from app.schemas.formaspago_schema import FormasDePagoBase
from typing import List


router = APIRouter(prefix="/formaspago", tags=["Formas de pago"])


@router.get("/", response_model=List[FormasDePagoBase])
def obtener_formaspago(db: Session = Depends(get_empresa_db)):
    return db.query(FormasDePago).all()
