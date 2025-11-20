# app/main.py
from fastapi import FastAPI
from app.routers import clientes_router

app = FastAPI(title="Facturación Electrónica MVP")

# Registrar los routers
app.include_router(clientes_router.router)

@app.get("/")
def home():
    return {"msg": "Backend listo para facturar 🚀"}
