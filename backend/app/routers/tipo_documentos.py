# routes/tiposdocumento.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencias.empresa import get_empresa_db
from app.models.tipodocumentos import TipoDocumento
from app.schemas.tipodocumentos_schema import TipoDocumentosBase
from typing import List


router = APIRouter(prefix="/tiposdocumento", tags=["Tipos de Documento"])

@router.get("/", response_model=List[TipoDocumentosBase])
def obtener_tipos_documento(db: Session = Depends(get_empresa_db)):
    return db.query(TipoDocumento).all()
