from pydantic import BaseModel,ConfigDict
from typing import Optional

# Schema para crear o actualizar una sucursal
class SucursalBase(BaseModel):
    nombre: str
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    estado: Optional[bool] = True

class SucursalCreate(SucursalBase):
    pass  # lo mismo que SucursalBase para creación

class SucursalUpdate(SucursalBase):
    pass  # para actualizaciones, todos opcionales si quieres

# Schema para respuesta (incluye id)
class SucursalResponse(SucursalBase):
    id: int

    model_config = ConfigDict(from_attributes=True) 