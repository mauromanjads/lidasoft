# app/schemas.py
from pydantic import BaseModel, Field,ConfigDict,computed_field
from typing import Optional, Dict, Any
from datetime import datetime
from app.utils.variantes import build_descripcion_from_parametros

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
    stock_actual:int = 0
    created_at: datetime
    updated_at: datetime

    @computed_field    
    def descripcion(self) -> str:
        return build_descripcion_from_parametros(self.parametros)

    model_config = ConfigDict(from_attributes=True)

