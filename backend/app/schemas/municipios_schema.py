from pydantic import BaseModel,ConfigDict

class MunicipiosModel(BaseModel):
    id: int
    nombre: str   
    codigo_dian: str
    departamento_id:int
    
    model_config = ConfigDict(from_attributes=True)
