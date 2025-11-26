from datetime import date, datetime
from typing import Optional, Annotated
from pydantic import field_validator

from pydantic import BaseModel, EmailStr, Field, StringConstraints


# ====================================================
# 🧩 1. BASE (Campos comunes)
# ====================================================
class ClienteBase(BaseModel):
    tipo_persona: Annotated[
        str | None,
        StringConstraints(min_length=1, max_length=5)
    ] = None

    tipo_documento_id: Optional[int] = None

    documento: Annotated[
        str,
        StringConstraints(min_length=1, max_length=20)
    ]

    dv: Annotated[
        str | None,
        StringConstraints(max_length=1)
    ] = None

    nombre: Annotated[str | None, StringConstraints(max_length=150)] = None
    primer_nombre: Annotated[str | None, StringConstraints(max_length=100)] = None
    segundo_nombre: Annotated[str | None, StringConstraints(max_length=100)] = None
    primer_apellido: Annotated[str | None, StringConstraints(max_length=100)] = None
    segundo_apellido: Annotated[str | None, StringConstraints(max_length=100)] = None

    fecha_nacimiento: Optional[date] = None
    genero_id: Optional[int] = None

    razon_social: Annotated[str | None, StringConstraints(max_length=200)] = None
    nombre_comercial: Annotated[str | None, StringConstraints(max_length=150)] = None

    regimen_id: Optional[int] = None
    tipo_responsable_id: Optional[int] = None

    gran_contribuyente: Optional[bool] = None
    autoretenedor: Optional[bool] = None

    ciiu_id: Optional[int] = None

    direccion: Annotated[str | None, StringConstraints(max_length=200)] = None
    municipio_id: Optional[int] = None
    departamento_id: Optional[int] = None

    telefono: Annotated[str | None, StringConstraints(max_length=50)] = None
    celular: Annotated[str | None, StringConstraints(max_length=50)] = None
    whatsapp: Annotated[str | None, StringConstraints(max_length=50)] = None

    correo: Optional[EmailStr] = None
    pagina_web: Annotated[str | None, StringConstraints(max_length=150)] = None

    pais_id: Optional[int] = None
    lista_precio_id: Optional[int] = None
    vendedor_id: Optional[int] = None

    tiene_cupo: Optional[bool] = None
    cupo_credito: Optional[float] = None
    plazo_dias: Optional[int] = None

    acepta_factura_electronica: Optional[bool] = None
    recibe_correo: Optional[bool] = None

    estado: Annotated[str | None, StringConstraints(max_length=1)] = None
    notas: Annotated[str | None, StringConstraints(max_length=1000)] = None


# ====================================================
# 🟢 2. CREATE (Validación adicional)
# ====================================================
class ClienteCreate(ClienteBase):
    @field_validator("fecha_nacimiento", mode="before")
    def vacio_a_null(cls, value):
        if value in ("", None):
            return None  # 👈 Se convierte a null en Python
        return value


# ====================================================
# ✏️ 3. UPDATE (Todos opcionales)
# ====================================================
class ClienteUpdate(BaseModel):
    tipo_persona: Optional[str] = None
    tipo_documento_id: Optional[int] = None
    documento: Optional[str] = None
    dv: Optional[str] = None
    nombre: Optional[str] = None
    primer_nombre: Optional[str] = None
    segundo_nombre: Optional[str] = None
    primer_apellido: Optional[str] = None
    segundo_apellido: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    genero_id: Optional[int] = None
    razon_social: Optional[str] = None
    nombre_comercial: Optional[str] = None
    regimen_id: Optional[int] = None
    tipo_responsable_id: Optional[int] = None
    gran_contribuyente: Optional[bool] = None
    autoretenedor: Optional[bool] = None
    ciiu_id: Optional[int] = None
    direccion: Optional[str] = None
    municipio_id: Optional[int] = None
    telefono: Optional[str] = None
    celular: Optional[str] = None
    whatsapp: Optional[str] = None
    correo: Optional[EmailStr] = None
    pagina_web: Optional[str] = None
    pais_id: Optional[int] = None
    lista_precio_id: Optional[int] = None
    vendedor_id: Optional[int] = None
    tiene_cupo: Optional[bool] = None
    cupo_credito: Optional[float] = None
    plazo_dias: Optional[int] = None
    acepta_factura_electronica: Optional[bool] = None
    recibe_correo: Optional[bool] = None
    estado: Optional[str] = None
    notas: Optional[str] = None


# ====================================================
# 📤 4. RESPONSE (Lo que devuelves en la API)
# ====================================================
class ClienteResponse(ClienteBase):
    id: int
    usuario_creacion: Optional[str] = None
    fecha_creacion: Optional[datetime] = None
    usuario_modifico: Optional[str] = None
    fecha_modificacion: Optional[datetime] = None

    class Config:
        from_attributes = True  # ⚠️ IMPORTANTE para trabajar con SQLAlchemy
