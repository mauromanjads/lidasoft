from pydantic import BaseModel
from typing import Optional

class InventarioBase(BaseModel):
    producto_id: int
    presentacion_id: int
    variante_id: Optional[int] = None
    stock_actual: int = 0

class InventarioCreate(InventarioBase):
    pass

class InventarioUpdate(BaseModel):
    stock_actual: Optional[int]

class InventarioRead(InventarioBase):
    id: int

model_config = {
        "from_attributes": True
    }