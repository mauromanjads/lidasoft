# app/models/documentos_tipo.py
from sqlalchemy import Column, String, Boolean, CHAR, BIGINT, TIMESTAMP, Sequence, func
from app.database import Base


documentos_tipo_id_seq = Sequence('documentos_tipo_id_seq')

class DocumentosTipo(Base):
    __tablename__ = "documentos_tipo"

    id = Column(BIGINT, documentos_tipo_id_seq, primary_key=True, server_default=documentos_tipo_id_seq.next_value())
    codigo = Column(String(20), nullable=False, unique=True)
    descripcion = Column(String(100), nullable=False)

    # Reglas del negocio
    afecta_inventario = Column(Boolean, nullable=False, default=False)    
    afecta_cartera = Column(Boolean, nullable=False, default=False)
    afecta_contabilidad = Column(Boolean, nullable=False, default=False)

    # Para inventario
    tipo_movimiento = Column(CHAR(1), nullable=False, default='N')  # E = Entrada, S = Salida, N = Neutro
    activo = Column(Boolean, nullable=False, default=True)

    creado_en = Column(TIMESTAMP, nullable=False, server_default=func.now())
    actualizado_en = Column(TIMESTAMP, nullable=False, server_default=func.now(), onupdate=func.now())
