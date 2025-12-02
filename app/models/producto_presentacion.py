from sqlalchemy import Column, Integer, String, Boolean, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class ProductoPresentacion(Base):
    __tablename__ = "productos_presentaciones"

    id = Column(Integer, primary_key=True)

    producto_id = Column(Integer, ForeignKey("productos.id", ondelete="CASCADE"), nullable=False)
    producto = relationship("Producto", back_populates="presentaciones")

    tipo_presentacion = Column(String(50), nullable=False)

    cantidad_equivalente = Column(Numeric(14, 2), default=1)

    unidad_medida_id = Column(Integer, ForeignKey("unidades_medida.id"), nullable=False)
    unidad_medida = relationship("UnidadMedida", back_populates="presentaciones")

    activo = Column(Boolean, default=True)

    precio_venta = Column(Numeric(14, 2), default=0)
    precio_compra = Column(Numeric(14, 2), default=0)
