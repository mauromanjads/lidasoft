from pydantic import BaseModel

class GenerosModel(BaseModel):
    id: int
    codigo: str   
    descripcion: str
        
    class Config:
        orm_mode = True  
