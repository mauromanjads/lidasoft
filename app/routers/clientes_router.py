# app/routers/clientes_router.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import SessionLocal
from app.models.clientes import Cliente
from app.schemas.clientes_schema import ClienteCreate, ClienteResponse

router = APIRouter(prefix="/clientes", tags=["Clientes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 👉 Crear cliente (con validación de NIT duplicado)
@router.post("/", response_model=ClienteResponse)
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    existe = db.query(Cliente).filter(Cliente.nit == cliente.nit).first()
    if existe:
        raise HTTPException(status_code=409, detail="Cliente duplicado")

    db_cliente = Cliente(**cliente.model_dump())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente


# 👉 Listar todos
@router.get("/", response_model=list[ClienteResponse])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(Cliente).all()

#👉  Buscar por NIT o Nombre (nuevo filtro)
@router.get("/buscar", response_model=list[ClienteResponse])
def buscar_cliente(query: str = Query(..., description="NIT o nombre del cliente a buscar"),
                   db: Session = Depends(get_db)):
    clientes = db.query(Cliente).filter(
        or_(
            Cliente.nit.ilike(f"%{query}%"),
            Cliente.nombre.ilike(f"%{query}%")
        )
    ).all()

    if not clientes:
        raise HTTPException(status_code=404, detail="No se encontraron clientes con ese criterio")

    return clientes


# 👉 Buscar por ID
@router.get("/{cliente_id}", response_model=ClienteResponse)
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente


# 👉 Actualizar
@router.put("/{cliente_id}", response_model=ClienteResponse)
def actualizar_cliente(cliente_id: int, cliente_data: ClienteCreate, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no existe")

    for key, value in cliente_data.dict().items():
        setattr(cliente, key, value)

    db.commit()
    db.refresh(cliente)
    return cliente


# 👉 Eliminar
@router.delete("/{cliente_id}")
def eliminar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    db.delete(cliente)
    db.commit()
    return {"msg": "Cliente eliminado correctamente"}
