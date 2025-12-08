from sqlalchemy import Column, Integer, String, Text
from app.database import Base

 
class ConfiguracionDian(Base):
    __tablename__ = "configuracion_dian"
    

    id = Column(Integer, primary_key=True, autoincrement=True)

    nit_emisor = Column(String(20), nullable=False)
    software_id = Column(String(100), nullable=False)
    pin_software = Column(String(100), nullable=False)
    ambiente = Column(String(20), nullable=False)

    certificado_firma = Column(Text)
    clave_certificado = Column(Text)

    activo = Column(Integer, default=1)
