# app/schemas.py
from pydantic import BaseModel
from typing import Optional

class UnidadesMedidaBase(BaseModel):
    codigo: str
    nombre: str    

class UnidadesMedidaCreate(UnidadesMedidaBase):
    pass

class UnidadesMedidaUpdate(BaseModel):
    codigo: Optional[str]
    nombre: Optional[str]    

class UnidadesMedidaResponse(UnidadesMedidaBase):
    id: int   

    class Config:
        orm_mode = True
