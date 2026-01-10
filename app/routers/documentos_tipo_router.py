# app/routers/documentos_tipo_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.dependencias.empresa import get_empresa_db
from app.models.documentos_tipo import DocumentosTipo
from app.schemas.documentos_tipo_schema import DocumentosTipoSchema

router = APIRouter(prefix="/documentos_tipo", tags=["DocumentosTipo"])

# GET: obtener todos los documentos tipo activos
@router.get("/", response_model=List[DocumentosTipoSchema])
def listar_documentos_tipo(db: Session = Depends(get_empresa_db)):
    documentos = db.query(DocumentosTipo).filter(DocumentosTipo.activo==True).all()
    return documentos
