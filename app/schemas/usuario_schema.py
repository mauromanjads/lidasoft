from pydantic import BaseModel,ConfigDict

class UsuarioCreate(BaseModel):
    usuario: str
    password: str
    nombre: str | None = None

class UsuarioLogin(BaseModel):
    usuario: str
    password: str

class UsuarioResponse(BaseModel):
    id: int

    model_config = ConfigDict(from_attributes=True)