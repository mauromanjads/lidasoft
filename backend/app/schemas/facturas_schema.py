from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from app.schemas.factura_detalle_schema import FacturaDetalleSchema

class TipoDocumentoResponse(BaseModel):
    id: int
    codigo: str
    descripcion: str

    class Config:
        orm_mode = True

# Schema para el cliente/tercero
class TerceroResponse(BaseModel):
    id: int
    nombre: Optional[str]
    documento: Optional[str]
    tipo_documento: Optional[TipoDocumentoResponse] = None  # 🔥 AQUÍ

    class Config:
        orm_mode = True  # Muy importante para relaciones SQLAlchemy

# Schema base para crear/actualizar factura
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

    class Config:
        orm_mode = True

# Schema de respuesta de la factura
class FacturaResponse(FacturaSchema):
    id: int
    numero_completo: str
    fecha: datetime
    usuario_creacion: Optional[str] = None
    fecha_creacion: Optional[datetime] = None
    usuario_modifico: Optional[str] = None
    fecha_modificacion: Optional[datetime] = None
    tercero: Optional[TerceroResponse] = None  # <-- aquí incluimos el cliente

    class Config:
        orm_mode = True  # Muy importante

