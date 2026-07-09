from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencias.empresa import get_empresa_db
from app.models.rol import Rol, RolPermiso
from app.models.permiso import Permiso
from app.schemas.rol_schema import (
    RolCreate,
    RolUpdate,
    RolResponse
)

router = APIRouter(
    prefix="/roles",
    tags=["Roles"]
)

@router.post("/", response_model=RolResponse, status_code=status.HTTP_201_CREATED)
def crear_rol(data: RolCreate, db: Session = Depends(get_empresa_db)):

    # validar código único
    existe = db.query(Rol).filter(Rol.codigo == data.codigo).first()
    if existe:
        raise HTTPException(
            status_code=400,
            detail="Ya existe un rol con ese código"
        )

    rol = Rol(
        codigo=data.codigo,
        nombre=data.nombre,
        descripcion=data.descripcion,
        activo=data.activo
    )

    db.add(rol)
    db.flush()  # 👈 para obtener rol.id

    # asignar permisos
    if data.permisos_ids:
        permisos = (
            db.query(Permiso)
            .filter(Permiso.id.in_(data.permisos_ids))
            .all()
        )

        for permiso in permisos:
            db.add(
                RolPermiso(
                    rol_id=rol.id,
                    permiso_id=permiso.id
                )
            )

    db.commit()
    db.refresh(rol)

    return rol

@router.get("/", response_model=list[RolResponse])
def listar_roles(db: Session = Depends(get_empresa_db)):
    return db.query(Rol).order_by(Rol.nombre).all()


@router.get("/{rol_id}", response_model=RolResponse)
def obtener_rol(rol_id: int, db: Session = Depends(get_empresa_db)):

    rol = db.query(Rol).filter(Rol.id == rol_id).first()
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")

    return rol

@router.put("/{rol_id}", response_model=RolResponse)
def actualizar_rol(
    rol_id: int,
    data: RolUpdate,
    db: Session = Depends(get_empresa_db)
):

    rol = db.query(Rol).filter(Rol.id == rol_id).first()
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")

    if data.nombre is not None:
        rol.nombre = data.nombre

    if data.descripcion is not None:
        rol.descripcion = data.descripcion

    if data.activo is not None:
        rol.activo = data.activo

    # actualizar permisos
    if data.permisos_ids is not None:
        db.query(RolPermiso).filter(
            RolPermiso.rol_id == rol_id
        ).delete()

        permisos = (
            db.query(Permiso)
            .filter(Permiso.id.in_(data.permisos_ids))
            .all()
        )

        for permiso in permisos:
            db.add(
                RolPermiso(
                    rol_id=rol_id,
                    permiso_id=permiso.id
                )
            )

    db.commit()
    db.refresh(rol)

    return rol


@router.delete("/{rol_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_rol(rol_id: int, db: Session = Depends(get_empresa_db)):

    rol = db.query(Rol).filter(Rol.id == rol_id).first()
    if not rol:
        raise HTTPException(status_code=404, detail="Rol no encontrado")

    db.delete(rol)
    db.commit()

