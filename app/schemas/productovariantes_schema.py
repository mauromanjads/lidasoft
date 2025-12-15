# app/schemas.py
from pydantic import BaseModel, Field,ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime

# -----------------------------
# Base de la Variante
# -----------------------------
class ProductoVarianteBase(BaseModel):
    sku: str
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
    sku: Optional[str] = None
    parametros: Optional[Dict[str, Any]] = None
    precio_venta: Optional[float] = None
    precio_compra: Optional[float] = None
    activo: Optional[bool] = None

# -----------------------------
# Respuesta Variante
# -----------------------------
class ProductoVarianteResponse(ProductoVarianteBase):
    id: int
    producto_id:int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

