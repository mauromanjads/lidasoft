from sqlalchemy import Column, Integer, Boolean, DateTime, func, Sequence
from app.database import Base


class ConfiguracionImpresion(Base):
    __tablename__ = "configuracion_impresion"

    id = Column(Integer, Sequence('seq_config_impresion'), primary_key=True)
    habilitar_pos = Column(Boolean, nullable=False, default=True)
    habilitar_a4 = Column(Boolean, nullable=False, default=True)
    fecha_creacion = Column(DateTime, server_default=func.now())
    fecha_actualizacion = Column(DateTime, server_default=func.now(), onupdate=func.now())
