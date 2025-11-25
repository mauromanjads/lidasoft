# schemas.py

from pydantic import BaseModel

class TipoDocumentosBase(BaseModel):
    id: int
    codigo: str
    descripcion: str

    class Config:
        orm_mode = True
