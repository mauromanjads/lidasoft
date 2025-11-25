from pydantic import BaseModel

class PaisesModel(BaseModel):
    id: int
    nombre: str   
    codigo_dian: str
        
    class Config:
        orm_mode = True  
