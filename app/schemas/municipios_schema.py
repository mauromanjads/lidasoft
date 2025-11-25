from pydantic import BaseModel

class MunicipiosModel(BaseModel):
    id: int
    nombre: str   
    codigo_dian: str
    departamento_id:int
    
    class Config:
        orm_mode = True  
