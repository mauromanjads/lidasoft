# app/schemas/usuarios.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.rol_schema import RolResponse
from app.schemas.sucursales_schema import SucursalResponse  # importamos el schema ya existente

# --- Login ---
class UsuarioLogin(BaseModel):
    usuario: str
    password: str

# --- Usuario ---
class UsuarioBase(BaseModel):
    usuario: str
    nombre: Optional[str] = None
    id_rol: Optional[int] = None
    activo: bool = True

# Crear usuario (requiere password)
class UsuarioCreate(UsuarioBase):
    password: str
    sucursales_ids: List[int] = []

# Actualizar usuario (sin password)
class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    id_rol: Optional[int] = None
    activo: Optional[bool] = None
    sucursales_ids: Optional[List[int]] = None

# Cambiar contraseña (endpoint separado)
class UsuarioPasswordUpdate(BaseModel):
    password: str


# Response de usuario
class UsuarioResponse(BaseModel):
    id: int
    usuario: str
    nombre: Optional[str]
    activo: bool
    creado_en: datetime
    rol: Optional[RolResponse] = None
    sucursales: List[SucursalResponse] = []

    class Config:
        from_attributes = True
