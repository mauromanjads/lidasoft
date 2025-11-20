# app/schemas/clientes_schema.py
from pydantic import BaseModel

class ClienteBase(BaseModel):
    nombre: str
    nit: str
    tipo_persona: str = "N"
    regimen: str = "COMUN"
    direccion: str | None = None
    correo: str | None = None
    telefono: str | None = None

class ClienteCreate(ClienteBase):
    pass

class ClienteResponse(ClienteBase):
    id: int

    class Config:
        orm_mode = True
