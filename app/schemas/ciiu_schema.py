from pydantic import BaseModel,ConfigDict

class CiiuBase(BaseModel):
    id: int
    codigo: str   
    descripcion: str

    class Config:
        model_config = ConfigDict(from_attributes=True)
