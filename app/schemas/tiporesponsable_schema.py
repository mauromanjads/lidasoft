from pydantic import BaseModel,ConfigDict

class TipoResponsablesBase(BaseModel):
    id: int
    codigo: str   
    descripcion: str
        
    model_config = ConfigDict(from_attributes=True)  
