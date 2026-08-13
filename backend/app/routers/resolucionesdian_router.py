# app/routers/resolucionesdian_router.py

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime, timezone

from app.dependencias.empresa import get_empresa_db
from app.models.resoluciones import ResolucionDian
from app.schemas.resoluciones_schema import (
    ResolucionDianCreate,
    ResolucionDianUpdate,
    ResolucionDianResponse
)

router = APIRouter(prefix="/resolucionesdian", tags=["resoluciones_dian"])


# 👉 Crear resolución DIAN
@router.post("/", response_model=ResolucionDianResponse)
def crear_resolucion(
    request: Request,
    data: ResolucionDianCreate,
    db: Session = Depends(get_empresa_db)
):
    usuario_logueado = request.cookies.get("usuario")

    # Validar duplicado por nit + prefijo + nro_resolucion
    existe = db.query(ResolucionDian).filter(      
        ResolucionDian.prefijo == data.prefijo,
        ResolucionDian.numero_resolucion == data.numero_resolucion
    ).first()

    if existe:
        raise HTTPException(status_code=409,
                            detail="La resolución ya existe para este NIT y prefijo")

    payload = data.model_dump(exclude_unset=True)

    if payload.get("rango_actual") is None:
        payload["rango_actual"] = payload["rango_inicial"]
    
    db_res = ResolucionDian(**payload)

    db.add(db_res)
    db.commit()
    db.refresh(db_res)
    return db_res


# 👉 Listar todas o por tipo de documento
@router.get("/", response_model=list[ResolucionDianResponse])
def listar_resoluciones(
    idsucursal: int | None = None,
    tipodocumento: str | None = None,
    predeterminado: str | None = None,
    db: Session = Depends(get_empresa_db)
):
    query = db.query(ResolucionDian)

    filtros = []

    if idsucursal:
        
        filtros.append(ResolucionDian.id_sucursal == idsucursal)
        filtros.append(ResolucionDian.activo == 1)

    if tipodocumento:
        filtros.append(ResolucionDian.tipo_documento == tipodocumento)

    if predeterminado:
        filtros.append(ResolucionDian.predeterminado == 1)

    query = query.filter(*filtros)


    return query.order_by(ResolucionDian.prefijo.asc()).all()


# 👉 Buscar por prefijo o número resolución
@router.get("/buscar", response_model=list[ResolucionDianResponse])
def buscar_resolucion(
    query: str = Query(..., description="Prefijo o número de resolución"),
    db: Session = Depends(get_empresa_db)
):

    regs = db.query(ResolucionDian).filter(
        or_(
            ResolucionDian.prefijo.ilike(f"%{query}%"),
            ResolucionDian.numero_resolucion.ilike(f"%{query}%")
        )
    ).all()

    if not regs:
        raise HTTPException(status_code=404, detail="No se encontraron resultados")

    return regs


# 👉 Obtener por ID
@router.get("/{resolucion_id}", response_model=ResolucionDianResponse)
def obtener_resolucion(resolucion_id: int, db: Session = Depends(get_empresa_db)):
    res = db.query(ResolucionDian).filter(
        ResolucionDian.id == resolucion_id
    ).first()

    if not res:
        raise HTTPException(status_code=404, detail="Resolución no encontrada")

    return res


# 👉 Actualizar resolución DIAN
@router.put("/{resolucion_id}", response_model=ResolucionDianResponse)
def actualizar_resolucion(
    request: Request,
    resolucion_id: int,
    data: ResolucionDianUpdate,
    db: Session = Depends(get_empresa_db)
):
    try:
        usuario_logueado = request.cookies.get("usuario")

        res = db.query(ResolucionDian).filter(
            ResolucionDian.id == resolucion_id
        ).first()

        if not res:
            raise HTTPException(status_code=404, detail="Resolución no existe")

        # Validación duplicado excepto sí mismo
        existe = db.query(ResolucionDian).filter(           
            ResolucionDian.prefijo == data.prefijo,
            ResolucionDian.numero_resolucion == data.numero_resolucion,
            ResolucionDian.id != resolucion_id
        ).first()

        if existe:
            raise HTTPException(status_code=409,
                                detail="Ya existe una resolución con ese NIT, prefijo y número")

        # Actualizar campos (seguro)
        data_dict = data.model_dump(exclude_unset=True)

        # Campos que NO se deben modificar manualmente
        for campo in ("rango_actual", "tipo_documento"):
            data_dict.pop(campo, None)

        for key, value in data_dict.items():
            setattr(res, key, value)

        db.commit()
        db.refresh(res)
        return res


    except Exception as e:
        print("❌ ERROR EN ENDPOINT:", e)
        raise HTTPException(status_code=500, detail=str(e))


# 👉 Eliminar
@router.delete("/{resolucion_id}")
def eliminar_resolucion(resolucion_id: int, db: Session = Depends(get_empresa_db)):
    res = db.query(ResolucionDian).filter(
        ResolucionDian.id == resolucion_id
    ).first()

    if not res:
        raise HTTPException(status_code=404, detail="Resolución no encontrada")

    db.delete(res)
    db.commit()

    return {"msg": "Resolución DIAN eliminada correctamente"}
