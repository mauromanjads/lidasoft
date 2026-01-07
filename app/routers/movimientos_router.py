
from fastapi import APIRouter, HTTPException, Depends,Response
import requests
from sqlalchemy.orm import Session
from typing import List
from decimal import Decimal
from datetime import datetime,timezone
from fastapi import Request
from sqlalchemy import desc

from app.models.movimientos import MovimientoInventario
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
    #try:
       # with db.begin():  # 🔐 TRANSACCIÓN ATÓMICA
         
            # 5️⃣ Crear factura
           # factura = Factura(
            #    tercero_id=factura_data.tercero_id,
             #   vendedor_id=factura_data.vendedor_id,
             #   resolucion_id=resolucion.id,
             #   prefijo=resolucion.prefijo,
             #   consecutivo=nuevo_consecutivo,
             #   numero_completo=numero_completo,
             #   forma_pago_id=factura_data.forma_pago_id,
             #   medio_pago_id=factura_data.medio_pago_id,
             #   subtotal=subtotal_total,
             #   descuento_total=descuento_total,
             #   iva_total=iva_total,
             #   total=total_total,
             #   notas=factura_data.notas,
             #   usuario_creacion=request.cookies.get("usuario"),
             #   fecha_creacion=datetime.now(timezone.utc),
             #   id_sucursal=factura_data.id_sucursal,
             #   id_usuario=factura_data.id_usuario,
             #   detalles=detalles_model
            #)

            #db.add(factura)

            #db.flush()
            #for det in factura.detalles:
            #    descontar_inventario( 
            #        db=db,                 
            #        producto_id=det.producto_id,
            #        presentacion_id=det.presentacion_id,
            #        variante_id=det.variante_id,
            #        cantidad=det.cantidad,
            #        documento_tipo="FACTURA",
            #        tipo_movimiento="SALIDA",
            #        documento_id=factura.id,
            #        nombre_producto=det.descripcion,
            #        controla_inventario=det.producto.control_inventario,
            #        id_sucursal=factura.id_sucursal,
            #        id_usuario=factura.id_usuario,
            #    )


        # 🔁 commit automático si todo salió bien
        #db.refresh(factura)
        #return factura

    #except Exception as e:        
     #   raise HTTPException(status_code=500, detail=str(e))
    print