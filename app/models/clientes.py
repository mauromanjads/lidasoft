# app/models/clientes.py
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class Cliente(Base):
    __tablename__ = "Clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    nit = Column(String(20), nullable=False, unique=True)
    tipo_persona = Column(String(1), default="N")    
    regimen = Column(String(50), default="COMUN")
    direccion = Column(String(200))
    correo = Column(String(150))
    telefono = Column(String(50))
    fecha_creacion = Column(DateTime, default=datetime.now)
