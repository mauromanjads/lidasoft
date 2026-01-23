from pydantic import BaseModel,ConfigDict
from typing import Optional
from app.schemas.categorias_schema import CategoriaResponse


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

    categoria: Optional[CategoriaResponse]
    
    model_config = ConfigDict(from_attributes=True)

class ProductoConStockOut(BaseModel):
    id: int
    nombre: str
    codigo: str
    activo: bool
    iva: Optional[float] = 0
    control_inventario: Optional[str] = "S"
    stock_actual: float

    class Config:
        from_attributes = True