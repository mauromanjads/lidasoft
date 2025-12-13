# app/models/producto_variante.py
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Numeric,
    Boolean,
    JSON,
    DateTime,
    Sequence,
    func,
)
from app.database import Base

class ProductoVariante(Base):
    __tablename__ = "productos_variantes"

    # ID con SEQUENCE
    id = Column(Integer, Sequence("productos_variantes_id_seq"), primary_key=True)

    # Relación con producto
    producto_id = Column(Integer, ForeignKey("productos.id", ondelete="CASCADE"), nullable=False)

    # SKU único
    sku = Column(String(50), nullable=False, unique=True)

    # JSON dinámico de parámetros (campo: valor)
    parametros = Column(JSON, nullable=False, default={})

    # Precios
    precio_venta = Column(Numeric(12, 2), nullable=False, default=0)
    precio_compra = Column(Numeric(12, 2), nullable=False, default=0)

    # Estado
    activo = Column(Boolean, nullable=False, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=False), server_default=func.now())
    updated_at = Column(DateTime(timezone=False), server_default=func.now(), onupdate=func.now())
