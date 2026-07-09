from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class DocumentosInventario(Base):
    __tablename__ = "documentos_inventario"

    id = Column(Integer, primary_key=True, index=True)
    
    tipo_documento = Column(String(50), nullable=False)
    numero = Column(Integer, nullable=False)
    
    fecha = Column(DateTime, server_default=func.now(), nullable=False)
    
    costo_total = Column(Numeric(14, 4), nullable=False, default=0)
    
    id_sucursal = Column(Integer, ForeignKey("sucursales.id"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

    origen_tipo = Column(String(30), nullable=True)
    origen_id = Column(Integer, nullable=True)
