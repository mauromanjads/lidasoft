from pydantic import BaseModel

class RegimenesTributariosBase(BaseModel):
    id: int
    codigo: str   
    descripcion: str
        
    class Config:
        orm_mode = True  
