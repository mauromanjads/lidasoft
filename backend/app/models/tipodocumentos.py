# models.py

from sqlalchemy import Column, Integer, String
from app.database import Base

class TipoDocumento(Base):
    __tablename__ = "tiposdocumento"

    id = Column(Integer, primary_key=True, autoincrement=True)
    codigo = Column(String(20), nullable=False)
    descripcion = Column(String(100), nullable=False)
