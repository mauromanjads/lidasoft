from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MovimientoInventarioBase(BaseModel):
    producto_id: int
    presentacion_id: int
    variante_id: Optional[int] = None
    cantidad: int
    tipo_movimiento: str
    documento_tipo: Optional[str] = None
    documento_id: Optional[int] = None

class MovimientoInventarioCreate(MovimientoInventarioBase):
    pass

class MovimientoInventarioRead(MovimientoInventarioBase):
    id: int
    fecha: datetime

model_config = {
        "from_attributes": True
    }
