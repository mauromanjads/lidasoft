from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from typing import List

class MovimientoInventarioBase(BaseModel):
    producto_id: int
    presentacion_id: int
    variante_id: Optional[int] = None
    cantidad: int
    tipo_movimiento: Optional[str] = None
    documento_tipo: Optional[str] = None
    documento_id: Optional[int] = None
    id_sucursal: int
    id_usuario: int

class MovimientoInventarioCreate(MovimientoInventarioBase):
    pass

class MovimientoInventarioRead(MovimientoInventarioBase):
    id: int
    fecha: datetime

class MovimientoInventarioLote(BaseModel):
    movimientos: List[MovimientoInventarioBase]     

model_config = {
        "from_attributes": True
    }

