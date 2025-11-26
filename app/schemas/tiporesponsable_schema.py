from pydantic import BaseModel

class TipoResponsablesBase(BaseModel):
    id: int
    codigo: str   
    descripcion: str
        
    class Config:
        orm_mode = True  
