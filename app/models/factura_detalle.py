from sqlalchemy import Column, Integer, Numeric, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base

class FacturaDetalle(Base):
    __tablename__ = "facturas_detalle"

    id = Column(Integer, primary_key=True, autoincrement=True)
    factura_id = Column(Integer, ForeignKey("facturas.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    presentacion_id = Column(Integer, nullable=False)
    variante_id = Column(Integer, nullable=True)
    descripcion = Column(String(255), nullable=False)
    cantidad = Column(Numeric(14,2), nullable=False)
    precio_unitario = Column(Numeric(14,2), nullable=False)
    descuento = Column(Numeric(14,2), nullable=False, default=0)
    iva = Column(Numeric(14,2), nullable=False)
    iva_porcentaje = Column(Numeric(5, 2), nullable=False, default=0)
    subtotal = Column(Numeric(14,2), nullable=False)
    total = Column(Numeric(14,2), nullable=False)

    factura = relationship("Factura", back_populates="detalles")
    producto = relationship("Producto")