from pydantic import BaseModel

class ConfiguracionImpresionBase(BaseModel):
    habilitar_pos: bool = True
    habilitar_a4: bool = True

class ConfiguracionImpresionCreate(ConfiguracionImpresionBase):
    pass

class ConfiguracionImpresionUpdate(BaseModel):
    habilitar_pos: bool | None = None
    habilitar_a4: bool | None = None

class ConfiguracionImpresionResponse(ConfiguracionImpresionBase):
    id: int

    class Config:
        orm_mode = True
