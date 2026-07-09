from pydantic import BaseModel, ConfigDict
from typing import Optional

class EmpresaBase(BaseModel):  
   nombre: str
   razon_social: str
   nit: str
   logo_url: Optional[str] = None
   subdominio: str
   dominio_personalizado: Optional[str] = None   


class EmpresaCreate(EmpresaBase):
    pass


class EmpresaUpdate(BaseModel):
   nombre: Optional[str] = None
   razon_social: Optional[str] = None
   nit: Optional[str] = None
   logo_url: Optional[str] = None
   subdominio: Optional[str] = None
   dominio_personalizado: Optional[str] = None


class EmpresaResponse(EmpresaBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
