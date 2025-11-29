# schemas.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

# ===========================================================
# UNIDAD DE MEDIDA
# ===========================================================
class UnidadMedidaBase(BaseModel):
    codigo: str
    nombre: str

class UnidadMedidaCreate(UnidadMedidaBase):
    pass

class UnidadMedidaRead(UnidadMedidaBase):
    id: int
    class Config:
        orm_mode = True


# ===========================================================
# PRODUCTO
# ===========================================================
class ProductoBase(BaseModel):
    codigo: str
    nombre: str
    descripcion: Optional[str] = None
    activo: Optional[bool] = True
    codigo_barra: Optional[str] = None

class ProductoCreate(ProductoBase):
    pass

class ProductoRead(ProductoBase):
    id: int
    presentaciones: List["ProductoPresentacionRead"] = []
    class Config:
        orm_mode = True


# ===========================================================
# PRESENTACION
# ===========================================================
class ProductoPresentacionBase(BaseModel):
    tipo_presentacion: str
    cantidad_equivalente: float
    unidad_medida_id: int
    activo: Optional[bool] = True

class ProductoPresentacionCreate(ProductoPresentacionBase):
    producto_id: int

class ProductoPresentacionRead(ProductoPresentacionBase):
    id: int
    precios: List["ProductoPrecioRead"] = []
    class Config:
        orm_mode = True


# ===========================================================
# PRECIO
# ===========================================================
class ProductoPrecioBase(BaseModel):
    lista_precio: str
    precio: float
    iva_porcentaje: float
    fecha_desde: date
    fecha_hasta: Optional[date] = None
    activo: Optional[bool] = True

class ProductoPrecioCreate(ProductoPrecioBase):
    presentacion_id: int

class ProductoPrecioRead(ProductoPrecioBase):
    id: int
    class Config:
        orm_mode = True


# Para resolver referencias circulares
ProductoRead.model_rebuild()
ProductoPresentacionRead.model_rebuild()