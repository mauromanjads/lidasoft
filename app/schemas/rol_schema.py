from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class RolBase(BaseModel):
    codigo: str
    nombre: str
    descripcion: Optional[str] = None
    activo: bool = True

class RolCreate(RolBase):
    permisos_ids: List[int] = []

class RolUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = None
    permisos_ids: Optional[List[int]] = None

class PermisoRolResponse(BaseModel):
    id: int
    codigo: str
    descripcion: Optional[str]

    class Config:
        from_attributes = True

class RolPermisoResponse(BaseModel):
    permiso: PermisoRolResponse


class RolResponse(BaseModel):
    id: int
    codigo: str
    nombre: str
    descripcion: Optional[str]
    activo: bool
    creado_en: datetime
    permisos: List[RolPermisoResponse]

    class Config:
        from_attributes = True
