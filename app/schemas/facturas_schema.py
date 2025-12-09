from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from app.schemas.factura_detalle_schema import FacturaDetalleSchema

class FacturaSchema(BaseModel):
    tercero_id: int
    resolucion_id: int
    prefijo: str
    consecutivo: int
    forma_pago: str
    medio_pago: Optional[str] = None
    subtotal: Decimal
    descuento_total: Decimal
    iva_total: Decimal
    total: Decimal
    notas: Optional[str] = None
    detalles: List[FacturaDetalleSchema]

class FacturaResponse(FacturaSchema):
    id: int
    numero_completo: str
    fecha: datetime
    creado_en: datetime
