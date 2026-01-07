from sqlalchemy.orm import Session
from app.models.inventario import Inventario
from app.models.movimientos import MovimientoInventario


class InventarioError(Exception):
    pass


def actualizar_inventario(
    db: Session,
    producto_id: int,
    presentacion_id: int,
    variante_id: int | None,
    cantidad: int,
    documento_tipo: str,
    tipo_movimiento: str,  # "ENTRADA" o "SALIDA"
    documento_id: int,
    nombre_producto: str,
    controla_inventario: str,
    id_sucursal: int,
    id_usuario: int,
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

    # 🧾 Registrar movimiento
    movimiento = MovimientoInventario(
        producto_id=producto_id,
        presentacion_id=presentacion_id,
        variante_id=variante_id,
        cantidad=cantidad,
        tipo_movimiento=tipo_movimiento,
        documento_tipo=documento_tipo,
        documento_id=documento_id,
        id_sucursal=id_sucursal,
        id_usuario=id_usuario,
    )
    db.add(movimiento)
