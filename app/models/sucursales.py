from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, func, Sequence
from app.database import Base  # Base de la DB de la empresa

# Definimos la secuencia
sucursales_id_seq = Sequence('sucursales_id_seq')

class Sucursal(Base):
    __tablename__ = "sucursales"

    id = Column(Integer, sucursales_id_seq, primary_key=True, server_default=sucursales_id_seq.next_value())
    nombre = Column(String(100), nullable=False)
    direccion = Column(Text, nullable=True)
    telefono = Column(String(50), nullable=True)
    email = Column(String(100), nullable=True)
    estado = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
