from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from app.schemas.factura_detalle_schema import FacturaDetalleSchema

class FacturaSchema(BaseModel):
    tercero_id: int
    vendedor_id: int
    resolucion_id: int
    prefijo: str
    consecutivo: int
    forma_pago_id: int
    medio_pago_id: int
    subtotal: Decimal
    descuento_total: Decimal
    iva_total: Decimal
    total: Decimal
    notas: Optional[str] = None
    id_sucursal: int
    id_usuario: int

    detalles: List[FacturaDetalleSchema]

class FacturaResponse(FacturaSchema):
    id: int
    numero_completo: str
    fecha: datetime
    usuario_creacion: Optional[str] = None
    fecha_creacion: Optional[datetime] = None
    usuario_modifico: Optional[str] = None
    fecha_modificacion: Optional[datetime] = None 
