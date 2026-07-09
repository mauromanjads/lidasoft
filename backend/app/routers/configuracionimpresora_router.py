from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.configuracion_impresion import ConfiguracionImpresion
from app.schemas.configuracionimpresion_schema import (
    ConfiguracionImpresionCreate,
    ConfiguracionImpresionUpdate,
    ConfiguracionImpresionResponse
)
from app.dependencias.empresa import get_empresa_db

router = APIRouter(prefix="/configuracion-impresion", tags=["configuracion_impresion"])

# Obtener configuración (solo un registro)
@router.get("/", response_model=ConfiguracionImpresionResponse)
def obtener_configuracion(db: Session = Depends(get_empresa_db)):
    config = db.query(ConfiguracionImpresion).first()
    if not config:
        raise HTTPException(status_code=404, detail="No hay configuración de impresión")
    return config

# Crear configuración (solo si no existe)
@router.post("/", response_model=ConfiguracionImpresionResponse)
def crear_configuracion(config_data: ConfiguracionImpresionCreate, db: Session = Depends(get_empresa_db)):
    existente = db.query(ConfiguracionImpresion).first()
    if existente:
        raise HTTPException(status_code=409, detail="Ya existe configuración de impresión")
    
    config = ConfiguracionImpresion(**config_data.model_dump())
    db.add(config)
    db.commit()
    db.refresh(config)
    return config

# Actualizar configuración
@router.put("/", response_model=ConfiguracionImpresionResponse)
def actualizar_configuracion(config_data: ConfiguracionImpresionUpdate, db: Session = Depends(get_empresa_db)):
    config = db.query(ConfiguracionImpresion).first()
    if not config:
        raise HTTPException(status_code=404, detail="No hay configuración de impresión para actualizar")
    
    for key, value in config_data.model_dump(exclude_unset=True).items():
        setattr(config, key, value)
    
    db.commit()
    db.refresh(config)
    return config

@router.get("/impresion")
def obtener_configuracion_impresion(
    db: Session = Depends(get_empresa_db),    
):
    config = (db.query(ConfiguracionImpresion).first())

    if not config:
        # 🔹 valores por defecto
        return {
            "pos": True,
            "carta": True
        }

    return {
        "pos": config.habilitar_pos,
        "carta": config.habilitar_a4
    }
