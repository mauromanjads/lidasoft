# app/dependencias/empresa_db.py
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.database_master import get_db_master
from app.dependencias.auth import get_current_user
from app.database_empresa import get_db  # Función que recibe Empresa y devuelve Session
from app.models.empresa import Empresa

def get_empresa_db(
    current_user = Depends(get_current_user),
    db_master: Session = Depends(get_db_master)
):
    """
    Devuelve la sesión SQLAlchemy de la base de datos de la empresa activa del usuario.
    Cada request recibe su propia sesión aislada.
    """
    # Buscar empresa activa
    empresa: Empresa = (
        db_master.query(Empresa)
        .filter(Empresa.id == current_user["empresa_id"], Empresa.activa == True)
        .first()
    )

    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")

    # Obtener la sesión de la base de datos de la empresa
    # get_db debe ser un generador que hace `yield db`
    # Yield aquí asegura que FastAPI cierre la sesión automáticamente al terminar la request
    yield from get_db(empresa)
