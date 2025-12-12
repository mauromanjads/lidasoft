# app/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, Dict, Literal
from datetime import datetime

ParametroTipo = Literal["string", "number", "boolean"]

# -----------------------------
# Base
# -----------------------------
class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    estado: Optional[str] = Field(default="A", min_length=1, max_length=1)
    parametros: Optional[Dict[str, ParametroTipo]] = None


# -----------------------------
# Crear
# -----------------------------
class CategoriaCreate(CategoriaBase):
    pass


# -----------------------------
# Actualizar
# -----------------------------
class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    estado: Optional[str] = Field(default=None, min_length=1, max_length=1)
    parametros: Optional[Dict[str, ParametroTipo]] = None


# -----------------------------
# Respuesta
# -----------------------------
class CategoriaResponse(CategoriaBase):
    id: int
    creado: datetime

    class Config:
        from_attributes = True  # pydantic v2
