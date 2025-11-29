# models.py
from sqlalchemy import Column, Integer, String, Boolean, Numeric, Text, Date, ForeignKey, Sequence
from sqlalchemy.orm import relationship
from app.database import Base  # tu declarative_base()

# ===========================================================
# 1️⃣ UNIDADES DE MEDIDA
# ===========================================================
class UnidadMedida(Base):
    __tablename__ = "unidades_medida"

    id = Column(Integer, Sequence("unidades_medida_id_seq"), primary_key=True)
    codigo = Column(String(10), nullable=False)
    nombre = Column(String(50), nullable=False)

    presentaciones = relationship("ProductoPresentacion", back_populates="unidad_medida")


# ===========================================================
# 2️⃣ PRODUCTOS
# ===========================================================
class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, Sequence("productos_id_seq"), primary_key=True)
    codigo = Column(String(50), nullable=False, unique=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text)
    activo = Column(Boolean, default=True)
    codigo_barra = Column(String(50), unique=True, nullable=True)

    presentaciones = relationship("ProductoPresentacion", back_populates="producto", cascade="all, delete")


# ===========================================================
# 3️⃣ PRESENTACIONES DE PRODUCTO
# ===========================================================
class ProductoPresentacion(Base):
    __tablename__ = "productos_presentaciones"

    id = Column(Integer, Sequence("productos_presentaciones_id_seq"), primary_key=True)
    producto_id = Column(Integer, ForeignKey("productos.id", ondelete="CASCADE"), nullable=False)
    tipo_presentacion = Column(String(50), nullable=False)
    cantidad_equivalente = Column(Numeric(14, 2), default=1)
    unidad_medida_id = Column(Integer, ForeignKey("unidades_medida.id"), nullable=False)
    activo = Column(Boolean, default=True)

    producto = relationship("Producto", back_populates="presentaciones")
    unidad_medida = relationship("UnidadMedida", back_populates="presentaciones")
    precios = relationship("ProductoPrecio", back_populates="presentacion", cascade="all, delete")


# ===========================================================
# 4️⃣ PRECIOS DE PRODUCTO
# ===========================================================
class ProductoPrecio(Base):
    __tablename__ = "productos_precios"

    id = Column(Integer, Sequence("productos_precios_id_seq"), primary_key=True)
    presentacion_id = Column(Integer, ForeignKey("productos_presentaciones.id", ondelete="CASCADE"), nullable=False)
    lista_precio = Column(String(50), nullable=False, default="GENERAL")
    precio = Column(Numeric(14,2), nullable=False)
    iva_porcentaje = Column(Numeric(5,2), default=0)
    fecha_desde = Column(Date, nullable=False)
    fecha_hasta = Column(Date, nullable=True)
    activo = Column(Boolean, default=True)

    presentacion = relationship("ProductoPresentacion", back_populates="precios")
