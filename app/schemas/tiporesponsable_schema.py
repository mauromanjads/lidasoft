from pydantic import BaseModel

class TipoResponsable(BaseModel):
    id: int
    codigo: str   
    descripcion: str
        
    class Config:
        orm_mode = True  
