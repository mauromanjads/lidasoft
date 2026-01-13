
from fastapi import APIRouter, HTTPException, Depends,Response
import requests
from sqlalchemy.orm import Session
from typing import List
from decimal import Decimal
from datetime import datetime,timezone
from fastapi import Request
from sqlalchemy import desc


from app.models.productos import Producto
from app.schemas.movimientos_schema import MovimientoInventarioLote, MovimientoInventarioRead

from app.dependencias.empresa import get_empresa_db

from app.services.inventario_service import (
    actualizar_inventario,
    actualizar_inventario_encabezado,
)

router = APIRouter(
    prefix="/movimientos",
    tags=["Movimientos"]
)



# -----------------------
# Crear movimientos
# -----------------------
@router.post("/", response_model=List[MovimientoInventarioRead])
def crear_movimientos_lote(
    request: Request,
    data: MovimientoInventarioLote,
    db: Session = Depends(get_empresa_db)
):
    try:
        movimientos_creados = []

        with db.begin():  # 🔐 TRANSACCIÓN ATÓMICA
            valortotal = 0
            for mov in data.movimientos:
               valortotal = valortotal + (mov.cantidad * mov.costo_unitario)


            movimiento_enc = actualizar_inventario_encabezado(
                db=db,                                 
                documento_tipo=data.movimientos[0].documento_tipo,     
                tipo_movimiento = data.movimientos[0].tipo_movimiento,                                                    
                id_sucursal = data.movimientos[0].id_sucursal,
                id_usuario=data.movimientos[0].id_usuario,
                origen_tipo = "",
                origen_id = 0,
                costo_total = valortotal
            )         

            for mov in data.movimientos:

                # 🔍 Buscar producto
                producto = (
                    db.query(Producto)
                    .filter(Producto.id == mov.producto_id)
                    .first()
                )

                if not producto:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Producto {mov.producto_id} no existe"
                    )

                controla_inventario = producto.control_inventario

                movimiento = actualizar_inventario(
                    db=db,
                    documento_inventario_id = movimiento_enc.id,
                    producto_id=mov.producto_id,
                    presentacion_id=mov.presentacion_id,
                    variante_id=mov.variante_id,
                    cantidad=mov.cantidad,                    
                    tipo_movimiento=mov.tipo_movimiento,
                    nombre_producto="",
                    controla_inventario=controla_inventario,
                    id_sucursal=mov.id_sucursal,
                    id_usuario=mov.id_usuario,
                    precio_unitario=mov.costo_unitario
                )

                movimientos_creados.append(movimiento)


        return movimientos_creados

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
