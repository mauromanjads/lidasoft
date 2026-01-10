# app/schemas/documentos_tipo_schema.py
from pydantic import BaseModel,ConfigDict

class DocumentosTipoSchema(BaseModel):
    id: int
    codigo: str
    descripcion: str

    model_config = ConfigDict(from_attributes=True)

