from sqlalchemy import (
    Column, Integer, String, Boolean, Text, DateTime
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Permiso(Base):
    __tablename__ = "permisos"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(100), nullable=False, unique=True)
    descripcion = Column(Text)
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    roles = relationship(
        "RolPermiso",
        back_populates="permiso",
        cascade="all, delete-orphan"
    )
