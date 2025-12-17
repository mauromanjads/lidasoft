from pydantic import BaseModel,ConfigDict
from typing import Optional

# =========================
# Modelo base compartido
# =========================
class ProductoPresentacionBase(BaseModel):
    tipo_presentacion: str
    cantidad_equivalente: float
    unidad_medida_id: int
    activo: Optional[bool] = True
    precio_venta: Optional[float] = 0
    precio_compra: Optional[float] = 0

# =========================
# Modelo para creación
# =========================
class ProductoPresentacionCreate(ProductoPresentacionBase):
    # Hacemos obligatorios los campos que en la base son opcionales
    precio_venta: float
    precio_compra: float
    activo: bool = True

# =========================
# Modelo para actualización
# =========================
class ProductoPresentacionUpdate(BaseModel):
    # Todos opcionales para permitir updates parciales
    tipo_presentacion: Optional[str] = None
    cantidad_equivalente: Optional[float] = None
    unidad_medida_id: Optional[int] = None
    activo: Optional[bool] = None
    precio_venta: Optional[float] = None
    precio_compra: Optional[float] = None

# =========================
# Modelo de salida
# =========================
class ProductoPresentacionOut(ProductoPresentacionBase):
    id: int
    stock_actual:int = 0
    model_config = ConfigDict(from_attributes=True)
