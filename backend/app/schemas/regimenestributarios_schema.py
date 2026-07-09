from pydantic import BaseModel,ConfigDict

class RegimenesTributariosBase(BaseModel):
    id: int
    codigo: str   
    descripcion: str
        
    model_config = ConfigDict(from_attributes=True)
