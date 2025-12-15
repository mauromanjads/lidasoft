from pydantic import BaseModel
from decimal import Decimal

class FacturaDetalleSchema(BaseModel):
    producto_id: int
    presentacion_id: int
    variante_id: int
    descripcion: str
    cantidad: Decimal
    precio_unitario: Decimal
    descuento: Decimal = 0
    iva: Decimal
    subtotal: Decimal
    total: Decimal
