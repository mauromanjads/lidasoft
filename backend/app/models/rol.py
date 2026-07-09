# app/models/rol.py
from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime,ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime,timezone
from app.database import Base

class Rol(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(50), nullable=False, unique=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(Text)
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relaciones
    permisos = relationship(
        "RolPermiso",
        back_populates="rol",
        cascade="all, delete-orphan"
    )

    usuarios = relationship("Usuario", back_populates="rol")  # ⬅️ relación con Usuario


class RolPermiso(Base):
    __tablename__ = "roles_permisos"

    id = Column(Integer, primary_key=True, index=True)
    rol_id = Column(Integer, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    permiso_id = Column(Integer, ForeignKey("permisos.id", ondelete="CASCADE"), nullable=False)

    # Relaciones
    rol = relationship("Rol", back_populates="permisos")
    permiso = relationship("Permiso")
