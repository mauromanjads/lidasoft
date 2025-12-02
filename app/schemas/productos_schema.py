from pydantic import BaseModel
from typing import Optional, List

class ProductoBase(BaseModel):
    codigo: str
    nombre: str
    descripcion: Optional[str] = None
    activo: Optional[bool] = True
    codigo_barra: Optional[str] = None
    categoria_id: Optional[int] = None
    iva: Optional[float] = 0
    tipo_impuesto: Optional[str] = None
    unidad_medida_id: Optional[int] = None
    control_inventario: Optional[str] = None

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(ProductoBase):
    pass

class ProductoOut(ProductoBase):
    id: int

    class Config:
        from_attributes = True