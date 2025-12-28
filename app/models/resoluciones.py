from sqlalchemy import Column, Integer, String, BigInteger, Date, Text
from app.database import Base
 
class ResolucionDian(Base):
    __tablename__ = "resoluciones_dian"

    id = Column(Integer, primary_key=True, autoincrement=True)

    numero_resolucion = Column(String(50), nullable=False)
    prefijo = Column(String(10))

    rango_inicial = Column(BigInteger, nullable=False)
    rango_final = Column(BigInteger, nullable=False)
    rango_actual = Column(BigInteger, nullable=False)


    fecha_resolucion = Column(Date, nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)

    llave_tecnica = Column(Text)

    tipo_documento = Column(String(5), nullable=False, default="FE")
    activo = Column(Integer, nullable=False, default=1)

    id_sucursal = Column(Integer, nullable=False)
    predeterminado = Column(Integer, nullable=False, default=1)
