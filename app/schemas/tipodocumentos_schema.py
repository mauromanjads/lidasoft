# schemas.py

from pydantic import BaseModel,ConfigDict

class TipoDocumentosBase(BaseModel):
    id: int
    codigo: str
    descripcion: str

    model_config = ConfigDict(from_attributes=True)
