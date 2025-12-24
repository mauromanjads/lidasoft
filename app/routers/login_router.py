from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session,joinedload
from app.database_master import get_db_master
from app.database_empresa import get_db
from app.models.usuario import Usuario
from app.models.empresa import Empresa  # Modelo en DB master
from app.utils.security import create_access_token,verify_password
router = APIRouter(prefix="/login", tags=["Login"])

# ---------------------------
# MODELO REQUEST
# ---------------------------
class LoginRequest(BaseModel):
    usuario: EmailStr
    password: str

# ---------------------------
# LOGIN MULTIEMPRESA POR SUBDOMINIO
# ---------------------------
@router.post("/")
def login(data: LoginRequest, db_master: Session = Depends(get_db_master)):

    # 1️⃣ Extraer subdominio del email
    try:
        subdominio = data.usuario.split("@")[1].split(".")[0]  # usuario@subdominio.dominio.com
    except IndexError:
        raise HTTPException(status_code=400, detail="Email inválido")

    # 2️⃣ Buscar empresa en DB master por subdominio
    empresa = db_master.query(Empresa).filter(Empresa.subdominio == subdominio, Empresa.activa == True).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")

    # 3️⃣ Abrir sesión dinámica en la DB de la empresa
    db_empresa = next(get_db(empresa))

    try:
        # 4️⃣ Buscar usuario en la empresa con sucursales cargadas       
        user = db_empresa.query(Usuario).options(joinedload(Usuario.sucursales)).filter(Usuario.usuario == data.usuario).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        if not user.activo:
            raise HTTPException(status_code=403, detail="Usuario inactivo")
        
        if len(user.sucursales) == 0:
            raise HTTPException(status_code=403, detail="Usuario no tiene sucursales asignadas")

        # 5️⃣ Verificar contraseña       
        password_ok = verify_password(data.password,user.password)
            
        if not password_ok:
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")

        payload = {
            "sub": str(user.id),
            "empresa_id": empresa.id,
            "empresa": empresa.subdominio
        }
        access_token = create_access_token(payload)
        
        # 6️⃣ Login correcto
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "msg": "Login correcto 🚀",
            "usuario": user.usuario,
            "idusuario": user.id,
            "nombre": user.nombre,
            "empresa": empresa.nombre,
            "idempresa": empresa.id,
            "cambia_clave": user.cambia_clave,
            "usuario_sucursales": [
                {"id": s.id, "nombre": s.nombre} for s in user.sucursales
            ]
        }    

    finally:
        db_empresa.close()
