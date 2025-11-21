from pydantic import BaseModel

class UsuarioCreate(BaseModel):
    usuario: str
    password: str
    nombre: str | None = None

class UsuarioLogin(BaseModel):
    usuario: str
    password: str

class UsuarioResponse(BaseModel):
    id: int

    class Config:
        orm_mode = True