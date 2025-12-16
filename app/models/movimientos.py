from sqlalchemy import Column, Integer, String, Boolean, Numeric, ForeignKey,UniqueConstraint,DateTime,func
from sqlalchemy.orm import relationship
from app.database import Base


class MovimientoInventario(Base):
    __tablename__ = "movimientos_inventario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    presentacion_id = Column(Integer, ForeignKey("productos_presentaciones.id"), nullable=False)
    variante_id = Column(Integer, ForeignKey("productos_variantes.id"), nullable=True)
    cantidad = Column(Integer, nullable=False)
    tipo_movimiento = Column(String(50), nullable=False)
    documento_tipo = Column(String(50), nullable=True)
    documento_id = Column(Integer, nullable=True)
    fecha = Column(DateTime, nullable=False, server_default=func.now())

    # Relaciones opcionales
    producto = relationship("Producto", back_populates="movimientos")
    presentacion = relationship("ProductoPresentacion", back_populates="movimientos")
    variante = relationship("ProductoVariante", back_populates="movimientos")
