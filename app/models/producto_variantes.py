from sqlalchemy import Column, Integer, ForeignKey, Numeric, Boolean, JSON, DateTime, func, Sequence
from sqlalchemy.orm import relationship
from app.database import Base

class ProductoVariante(Base):
    __tablename__ = "productos_variantes"

    id = Column(Integer, Sequence('productos_variantes_id_seq'), primary_key=True)
    producto_id = Column(Integer, ForeignKey("productos.id", ondelete="CASCADE"), nullable=False)
    parametros = Column(JSON, nullable=False, default={})  # JSON dinámico
    precio_venta = Column(Numeric(12, 2), nullable=False, default=0)
    precio_compra = Column(Numeric(12, 2), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=False), server_default=func.now())
    updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now())
