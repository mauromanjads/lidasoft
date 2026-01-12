from sqlalchemy.orm import Session
from app.models.inventario import Inventario
from app.models.movimientos import MovimientoInventario
from app.models.documentos_inventario import DocumentosInventario
from app.models.consecutivos_documentos import ConsecutivosDocumentos


class InventarioError(Exception):
    pass

def actualizar_inventario_encabezado(
    db: Session,    
    documento_tipo: str, #INV_INI, ENT_INV, SAL_INV
    tipo_movimiento: str,  # "ENTRADA" o "SALIDA"           
    id_sucursal: int,
    id_usuario: int,
    origen_tipo = str,
    origen_id = int,
    costo_total = float

):
    """Función genérica para ingresar o descontar inventario según tipo_movimiento."""

    
    consecutivo = (
        db.query(ConsecutivosDocumentos)
        .filter(
            ConsecutivosDocumentos.tipo_documento == documento_tipo,
            ConsecutivosDocumentos.id_sucursal == id_sucursal
        )
        .with_for_update()  # 🔒 bloqueo de fila
        .first()
    )

    if not consecutivo:
        raise InventarioError(
            status_code=400,
            detail="No existe consecutivo configurado para SAL_INV"
        )

    nuevo_numero = consecutivo.ultimo_numero + 1

# 🧾 Registrar movimiento 
    movimiento = DocumentosInventario(        
        tipo_documento=documento_tipo,
        numero = nuevo_numero,        
        costo_total = costo_total,
        id_sucursal=id_sucursal,
        id_usuario=id_usuario,
        origen_tipo = origen_tipo,
        origen_id = origen_id,        
    )

    db.add(movimiento)

    consecutivo.ultimo_numero = nuevo_numero
    
    db.flush()

    return movimiento

def actualizar_inventario(
    db: Session,
    documento_inventario_id: int,
    producto_id: int,
    presentacion_id: int,
    variante_id: int | None,
    cantidad: int,    
    tipo_movimiento: str,  # "ENTRADA" o "SALIDA"   
    nombre_producto: str,
    controla_inventario: str,
    id_sucursal: int,
    id_usuario: int,   
    precio_unitario = float,

):
    """Función genérica para ingresar o descontar inventario según tipo_movimiento."""
    
    if controla_inventario.upper() != "S":
        return

    # 🔒 Buscar inventario con bloqueo
    query = db.query(Inventario).filter(
        Inventario.producto_id == producto_id,
        Inventario.presentacion_id == presentacion_id,
        Inventario.id_sucursal == id_sucursal
    )
    if variante_id is None:
        query = query.filter(Inventario.variante_id.is_(None))
    else:
        query = query.filter(Inventario.variante_id == variante_id)

    inventario = query.with_for_update().first()

    # ➕ Si no existe inventario y es ENTRADA, creamos
    if not inventario:
        if tipo_movimiento == "SALIDA":
            raise InventarioError(
                f"No existe inventario para el producto {nombre_producto}"
            )
        inventario = Inventario(
            producto_id=producto_id,
            presentacion_id=presentacion_id,
            variante_id=variante_id,
            stock_actual=0,
            id_sucursal=id_sucursal,
        )
        db.add(inventario)
        db.flush()

    # ➖ Validar stock si es SALIDA
    if tipo_movimiento == "SALIDA" and inventario.stock_actual < cantidad:
        raise InventarioError(
            f"Stock insuficiente para el producto {nombre_producto}"
        )

    # 🔄 Actualizar stock
    if tipo_movimiento == "ENTRADA":
        inventario.stock_actual += cantidad
    elif tipo_movimiento == "SALIDA":
        inventario.stock_actual -= cantidad
    else:
        raise InventarioError(f"Tipo de movimiento inválido: {tipo_movimiento}")

    
    # 🧾 Registrar movimiento detalle
    movimiento_detalle = MovimientoInventario(
        producto_id=producto_id,
        presentacion_id=presentacion_id,
        variante_id=variante_id,
        cantidad=cantidad,                  
        id_sucursal=id_sucursal,
        id_usuario=id_usuario,
        documento_id = documento_inventario_id,
        costo_unitario = precio_unitario,
        costo_total = precio_unitario * cantidad
    )
    db.add(movimiento_detalle)
    db.flush()
    return movimiento_detalle
