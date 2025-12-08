from pydantic import BaseModel
from datetime import date


class ResolucionDianBase(BaseModel):
    numero_resolucion: str
    prefijo: str | None = None
    rango_inicial: int
    rango_final: int
    fecha_resolucion: date
    fecha_inicio: date
    fecha_fin: date
    llave_tecnica: str | None = None
    tipo_documento: str = "FV"
    activo: int = 1


class ResolucionDianCreate(ResolucionDianBase):
    pass


class ResolucionDianUpdate(BaseModel):
    numero_resolucion: str | None = None
    prefijo: str | None = None
    rango_inicial: int | None = None
    rango_final: int | None = None
    fecha_resolucion: date | None = None
    fecha_inicio: date | None = None
    fecha_fin: date | None = None
    llave_tecnica: str | None = None
    tipo_documento: str | None = None
    activo: int | None = None


class ResolucionDianResponse(ResolucionDianBase):
    id: int

    class Config:
        orm_mode = True  
