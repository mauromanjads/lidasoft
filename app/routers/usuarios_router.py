from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from app.dependencias.empresa import get_empresa_db
from app.models.usuario import Usuario, usuarios_sucursales
from app.schemas.usuario_schema import (
    UsuarioCreate,
    UsuarioUpdate,
    UsuarioResponse,
    UsuarioPasswordUpdate,
    UsuarioCreateResponse
)
from app.schemas.sucursales_schema import SucursalResponse
from app.schemas.rol_schema import RolResponse
import bcrypt
import secrets
import string


router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

# ----------------------
# Helper para construir UsuarioResponse
# ----------------------

def usuario_a_response(usuario: Usuario) -> UsuarioResponse:
    sucursales_resp = [
        SucursalResponse(
            id=s.id,
            nombre=s.nombre,
            direccion=s.direccion,
            telefono=s.telefono,
            email=s.email,
            estado=s.estado
        )
        for s in usuario.sucursales
    ]

    return UsuarioResponse(
        id=usuario.id,
        usuario=usuario.usuario,
        nombre=usuario.nombre,
        activo=usuario.activo,
        creado_en=usuario.creado_en,
        rol=RolResponse(
            id=usuario.rol.id,
            codigo=usuario.rol.codigo,
            nombre=usuario.rol.nombre,
            descripcion=usuario.rol.descripcion,
            activo=usuario.rol.activo
        ) if usuario.rol else None,
        sucursales=sucursales_resp
    )


# ===============================
# Listar todos los usuarios
# ===============================
@router.get("/", response_model=list[UsuarioResponse])
def listar_usuarios(db: Session = Depends(get_empresa_db)):
    usuarios = (
        db.query(Usuario)
        .options(
            joinedload(Usuario.sucursales),
            joinedload(Usuario.rol)
        )
        .order_by(Usuario.nombre.asc())
        .all()
    )
    return [usuario_a_response(u) for u in usuarios]

# ===============================
# Obtener usuario por ID
# ===============================
@router.get("/{usuario_id}", response_model=UsuarioResponse)
def obtener_usuario(usuario_id: int, db: Session = Depends(get_empresa_db)):
    usuario = db.query(Usuario).options(
        joinedload(Usuario.sucursales),
        joinedload(Usuario.rol)
    ).filter(Usuario.id == usuario_id).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario_a_response(usuario)

# ===============================
# Crear usuario
# ===============================
@router.post("/crear", response_model=UsuarioCreateResponse)
def crear_usuario(data: UsuarioCreate, db: Session = Depends(get_empresa_db)):
    existe = db.query(Usuario).filter(Usuario.usuario == data.usuario).first()
    if existe:
        raise HTTPException(status_code=400, detail="Usuario ya existe")

    password_tecnico = generar_password_tecnico()

    nuevo = Usuario(
        usuario=data.usuario,
        nombre=data.nombre,
        id_rol=data.id_rol,
        password=hash_password(password_tecnico),
        cambia_clave=True,
        activo=data.activo if data.activo is not None else True
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    # Asociar sucursales si se envían
    if data.sucursales_ids:
        for sucursal_id in data.sucursales_ids:
            stmt = usuarios_sucursales.insert().values(
                usuario_id=nuevo.id,
                sucursal_id=sucursal_id
            )
            db.execute(stmt)
        db.commit()
        db.refresh(nuevo)

    base_response = usuario_a_response(nuevo)

    return UsuarioCreateResponse(
        **base_response.model_dump(),
        password_temporal=password_tecnico
    )

# ===============================
# Actualizar usuario
# ===============================
@router.put("/{usuario_id}", response_model=UsuarioResponse)
def actualizar_usuario(usuario_id: int, data: UsuarioUpdate, db: Session = Depends(get_empresa_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if data.nombre is not None:
        usuario.nombre = data.nombre
    if data.id_rol is not None:
        usuario.id_rol = data.id_rol
    if data.activo is not None:
        usuario.activo = data.activo

    db.commit()

    # Actualizar sucursales si se envían
    if data.sucursales_ids is not None:
        db.execute(usuarios_sucursales.delete().where(usuarios_sucursales.c.usuario_id == usuario.id))
        for sucursal_id in data.sucursales_ids:
            stmt = usuarios_sucursales.insert().values(
                usuario_id=usuario.id,
                sucursal_id=sucursal_id
            )
            db.execute(stmt)
        db.commit()

    db.refresh(usuario)
    return usuario_a_response(usuario)

# ===============================
# Cambiar contraseña
# ===============================
@router.put("/{usuario_id}/password")
def actualizar_password(usuario_id: int, data: UsuarioPasswordUpdate, db: Session = Depends(get_empresa_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    usuario.password = hashed_password
    db.commit()
    return {"msg": "Contraseña actualizada"}

# ===============================
# Eliminar usuario
# ===============================
@router.delete("/{usuario_id}")
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_empresa_db)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db.execute(usuarios_sucursales.delete().where(usuarios_sucursales.c.usuario_id == usuario.id))
    db.delete(usuario)
    db.commit()
    return {"msg": "Usuario eliminado"}


def generar_password_tecnico():
    return secrets.token_urlsafe(8)[:10]  # fuerte y simple

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
