from pydantic import BaseModel

class CIIUModel(BaseModel):
    id: int
    codigo: str   
    descripcion: str

    class Config:
        orm_mode = True  
