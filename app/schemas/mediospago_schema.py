from pydantic import BaseModel,ConfigDict
from typing import Optional

class MediosPagoBase(BaseModel):
    id: int
    codigo: str  
    nombre:str 
    descripcion: Optional[str] = None
        
    model_config = ConfigDict(from_attributes=True)
