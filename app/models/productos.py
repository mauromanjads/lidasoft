from sqlalchemy import Column, Integer, String, Boolean, Text, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True)
    codigo = Column(String(50), nullable=False, unique=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)

    activo = Column(Boolean, default=True)
    codigo_barra = Column(String(50), unique=True, nullable=True)

    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=True)
    categoria = relationship("Categoria", back_populates="productos")

    iva = Column(Numeric(5, 2), default=0)
    tipo_impuesto = Column(String(10), nullable=True)

    unidad_medida_id = Column(Integer, ForeignKey("unidades_medida.id"), nullable=True)
    unidad_medida = relationship("UnidadMedida")

    control_inventario = Column(String(1), nullable=True)

    presentaciones = relationship(
        "ProductoPresentacion",
        back_populates="producto",
        cascade="all, delete-orphan"
    )
