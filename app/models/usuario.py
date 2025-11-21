# app/models/clientes.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    usuario = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)  # 👈 HASH
    nombre = Column(String(100))
    rol = Column(String(50), default="usuario")
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime, default=datetime.utcnow)
