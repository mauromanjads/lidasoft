# app/main.py
from fastapi import FastAPI
from app.routers import clientes_router
from app.routers import usuarios_router
from app.routers import tipo_documentos
from app.routers import generos_router
from app.routers import regimen_router
from app.routers import tipos_responsables_router

from fastapi.middleware.cors import CORSMiddleware
from app.routers import login_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Luego lo cambiamos a tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Registrar los routers
app.include_router(clientes_router.router)
app.include_router(usuarios_router.router)
app.include_router(login_router.router)
app.include_router(tipo_documentos.router)
app.include_router(generos_router.router)
app.include_router(regimen_router.router)
app.include_router(tipos_responsables_router.router)


@app.get("/")
def home():
    return {"msg": "Backend listo para facturar 🚀"}
