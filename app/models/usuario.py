# app/models/clientes.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime,ForeignKey
from datetime import datetime,timezone
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    usuario = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)  # 👈 HASH
    nombre = Column(String(100))
    id_rol = Column(Integer, ForeignKey("roles.id"), nullable=True)
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime, default=lambda: datetime.now(timezone.utc))
