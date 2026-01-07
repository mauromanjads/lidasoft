
from fastapi import APIRouter, HTTPException, Depends,Response
import requests
from sqlalchemy.orm import Session
from typing import List
from decimal import Decimal
from datetime import datetime,timezone
from fastapi import Request
from sqlalchemy import desc

from app.models.productos import Producto
from app.schemas.movimientos_schema import MovimientoInventarioBase, MovimientoInventarioRead

from app.dependencias.empresa import get_empresa_db

from app.services.inventario_service import (
    actualizar_inventario,    
)

router = APIRouter(
    prefix="/movimientos",
    tags=["Movimientos"]
)



# -----------------------
# Crear movimiento 
# -----------------------
@router.post("/", response_model=MovimientoInventarioRead)
def crear_movimiento(
    request: Request,
    movimiento_data: MovimientoInventarioBase,
    db: Session = Depends(get_empresa_db)
):
    try:
        with db.begin():  # 🔐 TRANSACCIÓN ATÓMICA
         

        # 🔍 Buscar producto
            producto = (
                db.query(Producto)
                .filter(Producto.id == movimiento_data.producto_id)
                .first()
            )

            if not producto:
                raise HTTPException(status_code=404, detail="Producto no existe")

            controla_inventario = producto.control_inventario
            
        
            movimiento = actualizar_inventario( 
                    db=db,                 
                    producto_id=movimiento_data.producto_id,
                    presentacion_id=movimiento_data.presentacion_id,
                    variante_id=movimiento_data.variante_id,
                    cantidad=movimiento_data.cantidad,
                    documento_tipo=movimiento_data.documento_tipo,
                    tipo_movimiento=movimiento_data.tipo_movimiento,
                    documento_id=0,
                    nombre_producto="",
                    controla_inventario=controla_inventario,
                    id_sucursal=movimiento_data.id_sucursal,
                    id_usuario=movimiento_data.id_usuario,
             )

           


        # 🔁 commit automático si todo salió bien
        db.refresh(movimiento)
        return movimiento

    except Exception as e:        
        raise HTTPException(status_code=500, detail=str(e))
    