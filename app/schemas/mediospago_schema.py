from pydantic import BaseModel
from typing import Optional

class MediosPagoBase(BaseModel):
    id: int
    codigo: str  
    nombre:str 
    descripcion: Optional[str] = None
        
    class Config:
        orm_mode = True  
