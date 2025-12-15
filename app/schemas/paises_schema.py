from pydantic import BaseModel,ConfigDict

class PaisesModel(BaseModel):
    id: int
    nombre: str   
    codigo_dian: str
        
    model_config = ConfigDict(from_attributes=True)
