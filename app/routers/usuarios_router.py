from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.dependencias.empresa import get_empresa_db
from app.models.usuario import Usuario
from app.schemas.usuario_schema import UsuarioCreate,UsuarioResponse
import bcrypt 



router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.post("/crear",response_model=UsuarioResponse)
def crear_usuario(data: UsuarioCreate, db: Session = Depends(get_empresa_db)):
    # Verificar duplicado
    existe = db.query(Usuario).filter(Usuario.usuario == data.usuario).first()
    if existe:
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    
    hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    nuevo = Usuario(
        usuario=data.usuario,
        password=hashed_password,
        nombre=data.nombre
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return {"msg": "Usuario creado", "id": nuevo.id}
