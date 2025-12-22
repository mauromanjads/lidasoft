from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.dependencias.empresa import get_empresa_db
from app.models.permiso import Permiso
from app.schemas.permisos_schema import (
    PermisoCreate,
    PermisoUpdate,
    PermisoResponse
)

router = APIRouter(prefix="/permisos", tags=["permisos"])


# 👉 Crear permiso
@router.post("/", response_model=PermisoResponse)
def crear_permiso(
    request: Request,
    data: PermisoCreate,
    db: Session = Depends(get_empresa_db)
):
    usuario_logueado = request.cookies.get("usuario")

    # Validar duplicado por código
    existe = db.query(Permiso).filter(
        Permiso.codigo == data.codigo
    ).first()

    if existe:
        raise HTTPException(
            status_code=409,
            detail="El permiso ya existe"
        )

    permiso = Permiso(
        **data.model_dump()
    )

    db.add(permiso)
    db.commit()
    db.refresh(permiso)
    return permiso


# 👉 Listar todos los permisos
@router.get("/", response_model=list[PermisoResponse])
def listar_permisos(
    solo_activos: bool | None = None,
    db: Session = Depends(get_empresa_db)
):
    query = db.query(Permiso)

    if solo_activos is True:
        query = query.filter(Permiso.activo == True)

    return query.order_by(Permiso.codigo.asc()).all()


# 👉 Buscar por código o descripción
@router.get("/buscar", response_model=list[PermisoResponse])
def buscar_permiso(
    query: str = Query(..., description="Código o descripción del permiso"),
    db: Session = Depends(get_empresa_db)
):
    permisos = db.query(Permiso).filter(
        or_(
            Permiso.codigo.ilike(f"%{query}%"),
            Permiso.descripcion.ilike(f"%{query}%")
        )
    ).all()

    if not permisos:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron permisos"
        )

    return permisos


# 👉 Obtener permiso por ID
@router.get("/{permiso_id}", response_model=PermisoResponse)
def obtener_permiso(
    permiso_id: int,
    db: Session = Depends(get_empresa_db)
):
    permiso = db.query(Permiso).filter(
        Permiso.id == permiso_id
    ).first()

    if not permiso:
        raise HTTPException(
            status_code=404,
            detail="Permiso no encontrado"
        )

    return permiso


# 👉 Actualizar permiso
@router.put("/{permiso_id}", response_model=PermisoResponse)
def actualizar_permiso(
    request: Request,
    permiso_id: int,
    data: PermisoUpdate,
    db: Session = Depends(get_empresa_db)
):
    try:
        usuario_logueado = request.cookies.get("usuario")

        permiso = db.query(Permiso).filter(
            Permiso.id == permiso_id
        ).first()

        if not permiso:
            raise HTTPException(
                status_code=404,
                detail="Permiso no existe"
            )

        # Actualizar solo campos permitidos
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(permiso, key, value)

        db.commit()
        db.refresh(permiso)
        return permiso

    except Exception as e:
        print("❌ ERROR EN ENDPOINT PERMISOS:", e)
        raise HTTPException(status_code=500, detail=str(e))


# 👉 Eliminar permiso
@router.delete("/{permiso_id}")
def eliminar_permiso(
    permiso_id: int,
    db: Session = Depends(get_empresa_db)
):
    permiso = db.query(Permiso).filter(
        Permiso.id == permiso_id
    ).first()

    if not permiso:
        raise HTTPException(
            status_code=404,
            detail="Permiso no encontrado"
        )

    db.delete(permiso)
    db.commit()

    return {"msg": "Permiso eliminado correctamente"}
