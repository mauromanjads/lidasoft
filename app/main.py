# app/main.py
from fastapi import FastAPI
from app.routers import terceros_router
from app.routers import usuarios_router
from app.routers import tipo_documentos
from app.routers import generos_router
from app.routers import regimen_router
from app.routers import tipos_responsables_router
from app.routers import ciiu_router
from app.routers import productos_router
from app.routers import unidades_medida_router
from app.routers import categorias_router
from app.routers import producto_presentacion_router
from app.routers import configuracionesdian_router
from app.routers import resolucionesdian_router
from app.routers import facturas_router
from app.routers import formasdepago_router
from app.routers import mediosdepago_router
from app.routers import producto_variantes_router


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
app.include_router(terceros_router.router)
app.include_router(usuarios_router.router)
app.include_router(login_router.router)
app.include_router(tipo_documentos.router)
app.include_router(generos_router.router)
app.include_router(regimen_router.router)
app.include_router(tipos_responsables_router.router)
app.include_router(ciiu_router.router)
app.include_router(productos_router.router)
app.include_router(unidades_medida_router.router)
app.include_router(categorias_router.router)
app.include_router(producto_presentacion_router.router)
app.include_router(configuracionesdian_router.router)
app.include_router(resolucionesdian_router.router)
app.include_router(facturas_router.router)
app.include_router(formasdepago_router.router)
app.include_router(mediosdepago_router.router)
app.include_router(producto_variantes_router.router)


@app.get("/")
def home():
    return {"msg": "Backend listo para facturar 🚀"}
