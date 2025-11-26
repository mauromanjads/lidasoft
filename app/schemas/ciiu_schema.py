from pydantic import BaseModel

class CiiuBase(BaseModel):
    id: int
    codigo: str   
    descripcion: str

    class Config:
        orm_mode = True  
