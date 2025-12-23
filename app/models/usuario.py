# app/models/clientes.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

# Tabla intermedia usuarios_sucursales
usuarios_sucursales = Table(
    "usuarios_sucursales",
    Base.metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("usuario_id", Integer, ForeignKey("usuarios.id", ondelete="CASCADE")),
    Column("sucursal_id", Integer, ForeignKey("sucursales.id", ondelete="CASCADE")),    
)

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    usuario = Column(String(50), unique=True, nullable=False)
    password = Column(String(255), nullable=False)  # 👈 HASH
    nombre = Column(String(100))
    id_rol = Column(Integer, ForeignKey("roles.id"), nullable=True)
    activo = Column(Boolean, default=True)
    creado_en = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    cambia_clave = Column(Boolean, default=True)  # 👈 CLAVE
    # Relaciones
    rol = relationship("Rol", back_populates="usuarios")
    sucursales = relationship(
        "Sucursal",
        secondary=usuarios_sucursales,
        back_populates="usuarios"
    )
