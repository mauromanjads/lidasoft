from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# 🔹 Base
class PermisoBase(BaseModel):
    codigo: str = Field(
        ...,
        min_length=3,
        max_length=100,
        examples=["usuarios.crear", "facturas.anular"]
    )
    descripcion: Optional[str] = None
    activo: bool = True


# 🔹 Crear
class PermisoCreate(PermisoBase):
    pass


# 🔹 Actualizar
# ⚠️ IMPORTANTE: no permitimos actualizar el código
class PermisoUpdate(BaseModel):
    descripcion: Optional[str] = None
    activo: Optional[bool] = None


# 🔹 Respuesta básica (listas, selects, asignación a roles)
class PermisoResponse(BaseModel):
    id: int
    codigo: str
    descripcion: Optional[str]
    activo: bool
    creado_en: datetime

    class Config:
        from_attributes = True
