# app/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

# -----------------------------
# Base de la Variante
# -----------------------------
class ProductoVarianteBase(BaseModel):
    producto_id: int
    parametros: Optional[Dict[str, Any]] = Field(default_factory=dict)  # campo: valor
    precio_venta: float = 0
    precio_compra: float = 0
    activo: bool = True

# -----------------------------
# Crear Variante
# -----------------------------
class ProductoVarianteCreate(ProductoVarianteBase):
    pass

# -----------------------------
# Actualizar Variante
# -----------------------------
class ProductoVarianteUpdate(BaseModel):
    parametros: Optional[Dict[str, Any]] = None
    precio_venta: Optional[float] = None
    precio_compra: Optional[float] = None
    activo: Optional[bool] = None

# -----------------------------
# Respuesta Variante
# -----------------------------
class ProductoVarianteResponse(ProductoVarianteBase):
    id: int
    creado: datetime
    actualizado: datetime

    class Config:
        from_attributes = True  # pydantic v2
