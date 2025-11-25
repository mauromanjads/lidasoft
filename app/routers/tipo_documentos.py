# routes/tiposdocumento.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.tipodocumentos import TipoDocumento
from app.schemas.tipodocumentos_schema import TipoDocumentosBase
from typing import List


router = APIRouter(prefix="/tiposdocumento", tags=["Tipos de Documento"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[TipoDocumentosBase])
def obtener_tipos_documento(db: Session = Depends(get_db)):
    return db.query(TipoDocumento).all()
