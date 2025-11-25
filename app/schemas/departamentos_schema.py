from pydantic import BaseModel

class DepartamentosModel(BaseModel):
    id: int
    nombre: str   
    codigo_dian: str
    pais_id:int
    
    class Config:
        orm_mode = True  
