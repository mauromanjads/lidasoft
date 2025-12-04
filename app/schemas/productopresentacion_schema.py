from pydantic import BaseModel
from typing import Optional

class ProductoPresentacionBase(BaseModel):
    producto_id: int
    tipo_presentacion: str
    cantidad_equivalente: float
    unidad_medida_id: int
    activo: Optional[bool] = True
    precio_venta: Optional[float] = 0
    precio_compra: Optional[float] = 0

class ProductoPresentacionCreate(ProductoPresentacionBase):
    tipo_presentacion: str
    cantidad_equivalente: float
    unidad_medida_id: int
    precio_venta: float
    precio_compra: float
    activo: bool

class ProductoPresentacionUpdate(ProductoPresentacionBase):
    pass

class ProductoPresentacionOut(ProductoPresentacionBase):
    id: int

    class Config:
        from_attributes = True
