# app/main.py
from fastapi import FastAPI
from app.routers import clientes_router
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/")
def home():
    return {"msg": "Backend listo para facturar 🚀"}
