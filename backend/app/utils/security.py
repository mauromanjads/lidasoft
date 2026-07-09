# app/utils/security.py
from datetime import datetime, timedelta,timezone
from typing import Dict, Any
from jose import jwt
from passlib.context import CryptContext
import os

from dotenv import load_dotenv

load_dotenv()  # 👈 carga .env

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

# -------------------------------------------------
# JWT config
# -------------------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)
)

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY no está definido en el .env")

# -------------------------------------------------
# JWT creation
# -------------------------------------------------
def create_access_token(payload: Dict[str, Any]) -> str:
    """
    Crea un JWT de acceso con expiración.
    """

    to_encode = payload.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt



