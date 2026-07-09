# schemas.py

from pydantic import BaseModel,ConfigDict
from typing import Optional

class TipoDocumentosBase(BaseModel):
    id: int
    codigo: str
    descripcion: str

    model_config = ConfigDict(from_attributes=True)


class TerceroResponse(BaseModel):
    id: int
    nombre: Optional[str]
    documento: Optional[str]
    tipo_documento: Optional[TipoDocumentosBase] = None  # 🔹 relación

    model_config = ConfigDict(from_attributes=True)
