from pydantic import BaseModel, ConfigDict, field_validator
from datetime import date
from typing import Optional


# =========================
# Base
# =========================
class ResolucionDianBase(BaseModel):
    numero_resolucion: str
    prefijo: Optional[str] = None

    rango_inicial: int
    rango_final: int
    rango_actual: int

    fecha_resolucion: date
    fecha_inicio: date
    fecha_fin: date

    llave_tecnica: Optional[str] = None

    tipo_documento: str = "FV"   # FV | POS
    modalidad: str = "FE"        # FE | DE
    activo: int = 1

    id_sucursal: int


    @field_validator("modalidad")
    @classmethod
    def validar_modalidad(cls, v: str) -> str:
        if v not in ("FE", "DE"):
            raise ValueError("modalidad debe ser 'FE' o 'DE'")
        return v

    @field_validator("rango_final")
    @classmethod
    def validar_rango(cls, v: int, info) -> int:
        rango_inicial = info.data.get("rango_inicial")
        if rango_inicial is not None and v < rango_inicial:
            raise ValueError("rango_final no puede ser menor que rango_inicial")
        return v


# =========================
# Create
# =========================
class ResolucionDianCreate(ResolucionDianBase):
    pass


# =========================
# Update (parcial)
# =========================
class ResolucionDianUpdate(BaseModel):
    numero_resolucion: Optional[str] = None
    prefijo: Optional[str] = None

    rango_inicial: Optional[int] = None
    rango_final: Optional[int] = None
    rango_actual: Optional[int] = None

    fecha_resolucion: Optional[date] = None
    fecha_inicio: Optional[date] = None
    fecha_fin: Optional[date] = None

    llave_tecnica: Optional[str] = None

    tipo_documento: Optional[str] = None
    modalidad: Optional[str] = None
    activo: Optional[int] = None
    id_sucursal: Optional[int] = None


# =========================
# Response
# =========================
class ResolucionDianResponse(ResolucionDianBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
