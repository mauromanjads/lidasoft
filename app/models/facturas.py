from sqlalchemy import Column, Integer, BigInteger, String, Numeric, Text, DateTime, func
from sqlalchemy.orm import relationship

from app.database import Base

class Factura(Base):
    __tablename__ = "facturas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    fecha = Column(DateTime, nullable=False, server_default=func.now())
    tercero_id = Column(Integer, nullable=False)
    vendedor_id = Column(Integer, nullable=False)
    resolucion_id = Column(Integer, nullable=False)
    prefijo = Column(String(10), nullable=False)
    consecutivo = Column(BigInteger, nullable=False)
    numero_completo = Column(String(30), nullable=False)
    forma_pago_id = Column(Integer, nullable=False)
    medio_pago_id = Column(Integer, nullable=False)
    subtotal = Column(Numeric(14,2), nullable=False, default=0)
    descuento_total = Column(Numeric(14,2), nullable=False, default=0)
    iva_total = Column(Numeric(14,2), nullable=False, default=0)
    total = Column(Numeric(14,2), nullable=False, default=0)
    notas = Column(Text, nullable=True)    
    usuario_creacion = Column(String(100), nullable=True)
    fecha_creacion = Column(DateTime, server_default=func.now())
    usuario_modifico = Column(String(100), nullable=True)
    fecha_modificacion = Column(DateTime, nullable=True)
    id_sucursal = Column(Integer, nullable=False)
    id_usuario = Column(Integer, nullable=False)
    
    detalles = relationship("FacturaDetalle", back_populates="factura", cascade="all, delete-orphan")
