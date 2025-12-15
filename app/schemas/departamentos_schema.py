from pydantic import BaseModel,ConfigDict

class DepartamentosModel(BaseModel):
    id: int
    nombre: str   
    codigo_dian: str
    pais_id:int
    
    model_config = ConfigDict(from_attributes=True)
