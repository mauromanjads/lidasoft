from sqlalchemy import Column, Integer, String, Boolean, Text, TIMESTAMP
from sqlalchemy.sql import func
from app.database_master import Base  # Ajusta la importación según tu proyecto

class Empresa(Base):
    __tablename__ = "empresa"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(150), nullable=False)
    razon_social = Column(String(200), nullable=True)
    nit = Column(String(50), nullable=True)
    logo_url = Column(Text, nullable=True)
    subdominio = Column(String(100), nullable=False, unique=True)
    dominio_personalizado = Column(String(150), nullable=True)
    db_name = Column(String(100), nullable=False, unique=True)
    db_user = Column(String(100), nullable=False)
    db_password = Column(Text, nullable=False)
    db_host = Column(String(100), nullable=False)
    db_port = Column(Integer, nullable=False, default=5432)
    plan = Column(String(50), nullable=True, default="basic")
    activa = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
