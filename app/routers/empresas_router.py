from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime, timezone

from app.database_master import get_db_master
from app.models.empresa import Empresa
from app.schemas.empresa_schema import (
    EmpresaCreate,
    EmpresaUpdate,
    EmpresaResponse
)

router = APIRouter(prefix="/empresa", tags=["empresa"])


# --------------------------------------------------
# Crear empresa
# --------------------------------------------------
@router.post("/", response_model=EmpresaResponse)
def crear_empresa(
    request: Request,
    empresa: EmpresaCreate,
    db: Session = Depends(get_db_master)
):
    usuario = request.cookies.get("usuario")

    # Subdominio duplicado
    if db.query(Empresa).filter(Empresa.subdominio == empresa.subdominio).first():
        raise HTTPException(409, "El subdominio ya existe")

    # Dominio personalizado duplicado
    if empresa.dominio_personalizado:
        if db.query(Empresa).filter(
            Empresa.dominio_personalizado == empresa.dominio_personalizado
        ).first():
            raise HTTPException(409, "El dominio personalizado ya está en uso")

    db_empresa = Empresa(
        **empresa.model_dump(),
        usuario_creo=usuario,
        fecha_creacion=datetime.now(timezone.utc)
    )

    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa


# --------------------------------------------------
# Listar empresas
# --------------------------------------------------
@router.get("/", response_model=list[EmpresaResponse])
def listar_empresas(db: Session = Depends(get_db_master)):
    return db.query(Empresa).order_by(Empresa.id.asc()).all()


# --------------------------------------------------
# Buscar empresa
# --------------------------------------------------
@router.get("/buscar", response_model=list[EmpresaResponse])
def buscar_empresa(
    query: str = Query(...),
    db: Session = Depends(get_db_master)
):
    empresas = db.query(Empresa).filter(
        or_(
            Empresa.nombre.ilike(f"%{query}%"),
            Empresa.nit.ilike(f"%{query}%"),
            Empresa.subdominio.ilike(f"%{query}%")
        )
    ).all()

    if not empresas:
        raise HTTPException(404, "No se encontraron empresas")

    return empresas


# --------------------------------------------------
# Obtener empresa por ID
# --------------------------------------------------
@router.get("/{empresa_id}", response_model=EmpresaResponse)
def obtener_empresa(
    empresa_id: int,
    db: Session = Depends(get_db_master)
):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(404, "Empresa no encontrada")
    return empresa


# --------------------------------------------------
# Actualizar empresa
# --------------------------------------------------
@router.put("/{empresa_id}", response_model=EmpresaResponse)
def actualizar_empresa(
    request: Request,
    empresa_id: int,
    empresa_data: EmpresaUpdate,
    db: Session = Depends(get_db_master)
):
    usuario = request.cookies.get("usuario")

    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(404, "Empresa no existe")

    data = empresa_data.model_dump(exclude_unset=True)

    # Subdominio duplicado
    if "subdominio" in data:
        if db.query(Empresa).filter(
            Empresa.subdominio == data["subdominio"],
            Empresa.id != empresa_id
        ).first():
            raise HTTPException(409, "El subdominio ya existe")

    # Dominio personalizado duplicado
    if data.get("dominio_personalizado"):
        if db.query(Empresa).filter(
            Empresa.dominio_personalizado == data["dominio_personalizado"],
            Empresa.id != empresa_id
        ).first():
            raise HTTPException(409, "El dominio personalizado ya está en uso")

    for key, value in data.items():
        setattr(empresa, key, value)

    empresa.usuario_modifico = usuario
    empresa.fecha_modificacion = datetime.now(timezone.utc)

    db.commit()
    db.refresh(empresa)
    return empresa


# --------------------------------------------------
# Eliminar empresa
# --------------------------------------------------
@router.delete("/{empresa_id}")
def eliminar_empresa(
    empresa_id: int,
    db: Session = Depends(get_db_master)
):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(404, "Empresa no encontrada")

    db.delete(empresa)
    db.commit()
    return {"msg": "Empresa eliminada correctamente"}
