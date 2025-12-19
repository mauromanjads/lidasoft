# app/routers/terceros_router.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.dependencias.empresa import get_empresa_db
from app.models.terceros import Terceros
from app.schemas.terceros_schema import TerceroCreate, TerceroResponse
from datetime import datetime,timezone
from fastapi import Request

router = APIRouter(prefix="/terceros", tags=["terceros"])

# 👉 Crear tercero (con validación de DOCUMENTO duplicado)
@router.post("/", response_model=TerceroResponse)
def crear_tercero(
    request: Request,  
    tercero: TerceroCreate,
    db: Session = Depends(get_empresa_db),     
):
    usuario_logueado = request.cookies.get("usuario") 
    existe = db.query(Terceros).filter(Terceros.documento == tercero.documento).first()
    if existe:
        raise HTTPException(status_code=409, detail="tercero duplicado")

    db_tercero = Terceros(**tercero.model_dump(),
        usuario_creacion=usuario_logueado,
        fecha_creacion=datetime.now(timezone.utc)
       )
    db.add(db_tercero)
    db.commit()
    db.refresh(db_tercero)
    return db_tercero


# 👉 Listar todos
@router.get("/{tipotercero}", response_model=list[TerceroResponse])
def listar_terceros(tipotercero: str,db: Session = Depends(get_empresa_db)):
    return db.query(Terceros).filter(
            Terceros.tipotercero.ilike(f"%{tipotercero}%")
        ).order_by(Terceros.nombre.asc()).all()


#👉  Buscar por documento o Nombre (nuevo filtro)
@router.get("/buscar", response_model=list[TerceroResponse])
def buscar_tercero(query: str = Query(..., description="documento o nombre a buscar"),
                   db: Session = Depends(get_empresa_db)):
    terceros = db.query(Terceros).filter(
        or_(
            Terceros.documento.ilike(f"%{query}%"),
            Terceros.nombre.ilike(f"%{query}%")
        )
    ).all()

    if not terceros:
        raise HTTPException(status_code=404, detail="No se encontraron datos con ese criterio")

    return terceros


# 👉 Buscar por ID
@router.get("/{tercero_id}", response_model=TerceroResponse)
def obtener_tercero(tercero_id: int, db: Session = Depends(get_empresa_db)):
    tercero = db.query(Terceros).filter(Terceros.id == tercero_id).first()
    if not tercero:
        raise HTTPException(status_code=404, detail="tercero no encontrado")
    return tercero


# 👉 Actualizar
@router.put("/{tercero_id}", response_model=TerceroResponse)
def actualizar_tercero(
    request:Request,
    tercero_id: int,
    tercero_data: TerceroCreate,
    db: Session = Depends(get_empresa_db)    
):
    try:
        usuario_logueado = request.cookies.get("usuario")         
        tercero = db.query(Terceros).filter(Terceros.id == tercero_id).first()
        if not tercero:
            raise HTTPException(status_code=404, detail="tercero no existe")

        for key, value in tercero_data.model_dump().items():
            setattr(tercero, key, value)

# 👉    Guardar quién modificó
        tercero.usuario_modifico = usuario_logueado
        tercero.fecha_modificacion = datetime.now(timezone.utc)

        db.commit()
        db.refresh(tercero)
        return tercero
    except Exception as e:
        print("❌ ERROR EN ENDPOINT:", e)  # 👈 muy importante
        raise HTTPException(status_code=500, detail=str(e))

# 👉 Eliminar
@router.delete("/{tercero_id}")
def eliminar_tercero(tercero_id: int, db: Session = Depends(get_empresa_db)):
    tercero = db.query(Terceros).filter(Terceros.id == tercero_id).first()
    if not tercero:
        raise HTTPException(status_code=404, detail="tercero no encontrado")

    db.delete(tercero)
    db.commit()
    return {"msg": "tercero eliminado correctamente"}
