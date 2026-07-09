# models.py

from sqlalchemy import Column, Integer, String
from app.database import Base

class Paises(Base):
    __tablename__ = "paises"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    codigo_dian = Column(String(10), nullable=False)
