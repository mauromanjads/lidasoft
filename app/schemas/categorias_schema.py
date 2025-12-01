# app/schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    estado: Optional[bool] = True

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaUpdate(BaseModel):
    nombre: Optional[str]
    descripcion: Optional[str]
    estado: Optional[bool]

class CategoriaResponse(CategoriaBase):
    id: int
    creado: datetime

    class Config:
        orm_mode = True
