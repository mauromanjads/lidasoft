from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.dependencias.empresa import get_empresa_db
from app.models.sucursales import Sucursal
from app.schemas.sucursales_schema import (
    SucursalCreate,
    SucursalUpdate,
    SucursalResponse
)

router = APIRouter(prefix="/sucursales", tags=["sucursales"])


# 👉 Crear sucursal
@router.post("/", response_model=SucursalResponse)
def crear_sucursal(
    request: Request,
    data: SucursalCreate,
    db: Session = Depends(get_empresa_db)
):
    usuario_logueado = request.cookies.get("usuario")

    # Validar duplicado por código o nombre
    existe = db.query(Sucursal).filter(
        or_(            
            Sucursal.nombre == data.nombre
        )
    ).first()

    if existe:
        raise HTTPException(
            status_code=409,
            detail="Ya existe una sucursal con ese código o nombre"
        )

    db_sucursal = Sucursal(
        **data.model_dump(),
    )

    db.add(db_sucursal)
    db.commit()
    db.refresh(db_sucursal)
    return db_sucursal


# 👉 Listar todas (o solo activas)
@router.get("/", response_model=list[SucursalResponse])
def listar_sucursales(
    solo_activas: bool | None = None,
    db: Session = Depends(get_empresa_db)
):
    query = db.query(Sucursal)

    if solo_activas:
        query = query.filter(Sucursal.activo == 1)

    return query.order_by(Sucursal.nombre.asc()).all()


# 👉 Buscar por código o nombre
@router.get("/buscar", response_model=list[SucursalResponse])
def buscar_sucursal(
    query: str = Query(..., description="Código o nombre de la sucursal"),
    db: Session = Depends(get_empresa_db)
):
    regs = db.query(Sucursal).filter(
        or_(            
            Sucursal.nombre.ilike(f"%{query}%")
        )
    ).all()

    if not regs:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron sucursales"
        )

    return regs


# 👉 Obtener por ID
@router.get("/{sucursal_id}", response_model=SucursalResponse)
def obtener_sucursal(
    sucursal_id: int,
    db: Session = Depends(get_empresa_db)
):
    sucursal = db.query(Sucursal).filter(
        Sucursal.id == sucursal_id
    ).first()

    if not sucursal:
        raise HTTPException(
            status_code=404,
            detail="Sucursal no encontrada"
        )

    return sucursal


# 👉 Actualizar sucursal
@router.put("/{sucursal_id}", response_model=SucursalResponse)
def actualizar_sucursal(
    request: Request,
    sucursal_id: int,
    data: SucursalUpdate,
    db: Session = Depends(get_empresa_db)
):
    try:
        usuario_logueado = request.cookies.get("usuario")

        sucursal = db.query(Sucursal).filter(
            Sucursal.id == sucursal_id
        ).first()

        if not sucursal:
            raise HTTPException(
                status_code=404,
                detail="La sucursal no existe"
            )

        # Validar duplicado excepto la misma sucursal
        existe = db.query(Sucursal).filter(
            or_(                
                Sucursal.nombre == data.nombre
            ),
            Sucursal.id != sucursal_id
        ).first()

        if existe:
            raise HTTPException(
                status_code=409,
                detail="Ya existe otra sucursal con ese código o nombre"
            )

        # Actualizar campos
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(sucursal, key, value)

        db.commit()
        db.refresh(sucursal)
        return sucursal

    except Exception as e:
        print("❌ ERROR EN ENDPOINT SUCURSALES:", e)
        raise HTTPException(status_code=500, detail=str(e))


# 👉 Eliminar sucursal
@router.delete("/{sucursal_id}")
def eliminar_sucursal(
    sucursal_id: int,
    db: Session = Depends(get_empresa_db)
):
    sucursal = db.query(Sucursal).filter(
        Sucursal.id == sucursal_id
    ).first()

    if not sucursal:
        raise HTTPException(
            status_code=404,
            detail="Sucursal no encontrada"
        )

    db.delete(sucursal)
    db.commit()

    return {"msg": "Sucursal eliminada correctamente"}
