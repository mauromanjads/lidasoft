from pydantic import BaseModel

class RegimenesTributariosModel(BaseModel):
    id: int
    codigo: str   
    descripcion: str
        
    class Config:
        orm_mode = True  
