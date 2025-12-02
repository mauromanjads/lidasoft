# app/models.py
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, func
from app.database import Base

class Unidadmedida(Base):
    __tablename__ = "unidades_medida"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(10), nullable=False)
    nombre = Column(String(50), nullable=False)    
