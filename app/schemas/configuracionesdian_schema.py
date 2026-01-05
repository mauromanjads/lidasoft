from pydantic import BaseModel,ConfigDict
from typing import Optional


class ConfiguracionDianBase(BaseModel):
    nit_emisor: str
    software_id: str
    pin_software: str
    ambiente: str
    certificado_firma: Optional[str] = None
    clave_certificado: Optional[str] = None
    activo: int = 1
    nombre_emisor: str
    regimen: str


class ConfiguracionDianCreate(ConfiguracionDianBase):
    pass


class ConfiguracionDianUpdate(BaseModel):
    nit_emisor: Optional[str] = None
    software_id: Optional[str] = None
    pin_software: Optional[str] = None
    ambiente: Optional[str] = None
    certificado_firma: Optional[str] = None
    clave_certificado: Optional[str] = None
    activo: Optional[int] = None
    nombre_emisor: Optional[str] = None
    regimen: Optional[str] = None


class ConfiguracionDianResponse(ConfiguracionDianBase):
    id: int

    
