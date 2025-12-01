# app/models.py
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, func
from app.database import Base

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    estado = Column(String(1), nullable=True)
    creado = Column(DateTime(timezone=False), server_default=func.now())
