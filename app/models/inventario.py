from sqlalchemy import Column, Integer, String, Boolean, Numeric, ForeignKey,UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class Inventario(Base):
    __tablename__ = "inventario"
    __table_args__ = (
        UniqueConstraint("producto_id", "presentacion_id", "variante_id","id_sucursal", name="uc_inventario"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    presentacion_id = Column(Integer, ForeignKey("productos_presentaciones.id"), nullable=False)
    variante_id = Column(Integer, ForeignKey("productos_variantes.id"), nullable=True)
    stock_actual = Column(Integer, nullable=False, default=0)
    id_sucursal = Column(Integer, nullable=False)


