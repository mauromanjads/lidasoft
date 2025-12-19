# app/routers/configuracionesdian_router.py

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime, timezone

from app.database_empresa import get_db
from app.models.configuracionesdian import ConfiguracionDian
from app.schemas.configuracionesdian_schema import (
    ConfiguracionDianCreate,
    ConfiguracionDianResponse
)

router = APIRouter(prefix="/configuraciondian", tags=["configuracion_dian"])


# 👉 Crear configuración DIAN (validación software + nit)
@router.post("/", response_model=ConfiguracionDianResponse)
def crear_configuracion_dian(
    request: Request,
    config: ConfiguracionDianCreate,
    db: Session = Depends(get_db)
):
    usuario_logueado = request.cookies.get("usuario")

    # Validar duplicado por nit + software_id
    existe = db.query(ConfiguracionDian).filter(
        ConfiguracionDian.nit_emisor == config.nit_emisor,
        ConfiguracionDian.software_id == config.software_id
    ).first()

    if existe:
        raise HTTPException(status_code=409, detail="Configuración DIAN duplicada")

    db_config = ConfiguracionDian(
        **config.model_dump(),        
    )

    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config


# 👉 Listar todas las configuraciones
@router.get("/", response_model=list[ConfiguracionDianResponse])
def listar_configuraciones(db: Session = Depends(get_db)):
    return db.query(ConfiguracionDian).order_by(ConfiguracionDian.id.asc()).all()


# 👉 Buscar configuración por software_id o nit
@router.get("/buscar", response_model=list[ConfiguracionDianResponse])
def buscar_configuracion(
    query: str = Query(..., description="buscar por NIT emisor o Software ID"),
    db: Session = Depends(get_db)
):

    regs = db.query(ConfiguracionDian).filter(
        or_(
            ConfiguracionDian.nit_emisor.ilike(f"%{query}%"),
            ConfiguracionDian.software_id.ilike(f"%{query}%")
        )
    ).all()

    if not regs:
        raise HTTPException(status_code=404, detail="No se encontraron resultados")

    return regs


# 👉 Obtener configuración por ID
@router.get("/{config_id}", response_model=ConfiguracionDianResponse)
def obtener_config(config_id: int, db: Session = Depends(get_db)):
    config = db.query(ConfiguracionDian).filter(
        ConfiguracionDian.id == config_id
    ).first()

    if not config:
        raise HTTPException(status_code=404, detail="Configuración DIAN no encontrada")

    return config


# 👉 Actualizar configuración DIAN
@router.put("/{config_id}", response_model=ConfiguracionDianResponse)
def actualizar_configuracion(
    request: Request,
    config_id: int,
    config_data: ConfiguracionDianCreate,
    db: Session = Depends(get_db)
):
    try:
        usuario_logueado = request.cookies.get("usuario")

        config = db.query(ConfiguracionDian).filter(
            ConfiguracionDian.id == config_id
        ).first()

        if not config:
            raise HTTPException(status_code=404, detail="Configuración no existe")

        # Validar duplicado (excepto él mismo)
        existe = db.query(ConfiguracionDian).filter(
            ConfiguracionDian.nit_emisor == config_data.nit_emisor,
            ConfiguracionDian.software_id == config_data.software_id,
            ConfiguracionDian.id != config_id
        ).first()

        if existe:
            raise HTTPException(status_code=409, detail="Ya existe un registro con ese NIT + Software ID")

        # Actualizar campos
        for key, value in config_data.model_dump().items():
            setattr(config, key, value)

        config.usuario_modifico = usuario_logueado
        config.fecha_modificacion = datetime.now(timezone.utc)

        db.commit()
        db.refresh(config)
        return config

    except Exception as e:
        print("❌ ERROR EN ENDPOINT:", e)
        raise HTTPException(status_code=500, detail=str(e))


# 👉 Eliminar configuración DIAN
@router.delete("/{config_id}")
def eliminar_configuracion(config_id: int, db: Session = Depends(get_db)):
    config = db.query(ConfiguracionDian).filter(
        ConfiguracionDian.id == config_id
    ).first()

    if not config:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")

    db.delete(config)
    db.commit()

    return {"msg": "Configuración DIAN eliminada correctamente"}
