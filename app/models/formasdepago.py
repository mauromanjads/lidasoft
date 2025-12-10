from sqlalchemy import Column, Integer, String
from app.database import Base

class FormasDePago(Base):
    __tablename__ = "formas_de_pago"

    id = Column(Integer, primary_key=True, autoincrement=True)
    codigo = Column(String(10), nullable=False)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(100), nullable=False)