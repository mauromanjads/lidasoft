# models.py

from sqlalchemy import Column, Integer, String
from app.database import Base

class Departamentos(Base):
    __tablename__ = "departamentos"


    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    codigo_dian = Column(String(10), nullable=False)
    pais_id = Column(Integer, nullable=True) 
