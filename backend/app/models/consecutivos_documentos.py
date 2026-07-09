# app/models/consecutivos_documentos.py
from sqlalchemy import Column, String, BIGINT, TIMESTAMP, Sequence, func, ForeignKey
from sqlalchemy.orm import  relationship
from app.database import Base

 
consecutivos_documentos_id_seq = Sequence('consecutivos_documentos_id_seq')

class ConsecutivosDocumentos(Base):
    __tablename__ = "consecutivos_documentos"

    id = Column(BIGINT, consecutivos_documentos_id_seq, primary_key=True, server_default=consecutivos_documentos_id_seq.next_value())
    tipo_documento = Column(String(20), ForeignKey("documentos_tipo.codigo"), nullable=False)
    id_sucursal = Column(BIGINT, nullable=False)
    ultimo_numero = Column(BIGINT, nullable=False, default=0)
  
    # Relación opcional con documentos_tipo
    documento_tipo = relationship("DocumentosTipo", backref="consecutivos")
