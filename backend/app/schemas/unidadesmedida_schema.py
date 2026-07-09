# app/schemas.py
from pydantic import BaseModel,ConfigDict
from typing import Optional

class UnidadesMedidaBase(BaseModel):
    codigo: str
    nombre: str    

class UnidadMedidaCreate(UnidadesMedidaBase):
    pass

class UnidadesMedidaUpdate(BaseModel):
    codigo: Optional[str]
    nombre: Optional[str]    

class UnidadMedidaRead(UnidadesMedidaBase):
    id: int   

    model_config = ConfigDict(from_attributes=True)
