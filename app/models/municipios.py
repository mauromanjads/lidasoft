# models.py

from sqlalchemy import Column, Integer, String
from app.database import Base

class Municipios(Base):
    __tablename__ = "municipios"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    codigo_dian = Column(String(10), nullable=False)
    departamento_id = Column(Integer, nullable=True)
