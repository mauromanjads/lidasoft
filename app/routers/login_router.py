from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.usuario import Usuario
import bcrypt   # 👈 PARA VERIFICAR HASH DE PASSWORD

router = APIRouter(prefix="/login", tags=["Login"])

# ---------------------------
# DEPENDENCIA DE BD
# ---------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------------------
# MODELO REQUEST
# ---------------------------
class LoginRequest(BaseModel):
    usuario: str
    password: str

# ---------------------------
# LOGIN REAL
# ---------------------------
@router.post("/")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    # 1) Buscar usuario
    user = db.query(Usuario).filter(Usuario.usuario == data.usuario).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 2) Verificar contraseña (HASH)
    password_ok = bcrypt.checkpw(data.password.encode('utf-8'), user.password.encode('utf-8'))
    if not password_ok:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    # 3) LOGIN CORRECTO
    return {
        "msg": "Login correcto 🚀",
        "usuario": user.usuario,
        "nombre": user.nombre
    }
