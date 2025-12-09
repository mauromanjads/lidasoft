from sqlalchemy import Column, Integer, BigInteger, String, Numeric, Text, DateTime, func
from sqlalchemy.orm import relationship

from app.database import Base

class Factura(Base):
    __tablename__ = "facturas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha = Column(DateTime, nullable=False, server_default=func.now())
    tercero_id = Column(Integer, nullable=False)
    resolucion_id = Column(Integer, nullable=False)
    prefijo = Column(String(10), nullable=False)
    consecutivo = Column(BigInteger, nullable=False)
    numero_completo = Column(String(30), nullable=False)
    forma_pago = Column(String(20), nullable=False)
    medio_pago = Column(String(20), nullable=True)
    subtotal = Column(Numeric(14,2), nullable=False, default=0)
    descuento_total = Column(Numeric(14,2), nullable=False, default=0)
    iva_total = Column(Numeric(14,2), nullable=False, default=0)
    total = Column(Numeric(14,2), nullable=False, default=0)
    notas = Column(Text, nullable=True)
    creado_en = Column(DateTime, server_default=func.now())

    detalles = relationship("FacturaDetalle", back_populates="factura", cascade="all, delete-orphan")
