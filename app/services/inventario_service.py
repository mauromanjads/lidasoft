from sqlalchemy.orm import Session
from app.models.inventario import Inventario
from app.models.movimientos import MovimientoInventario


class InventarioError(Exception):
    def __init__(self, mensaje: str):
        super().__init__(mensaje)


def descontar_inventario(
    db: Session,
    producto_id: int,
    presentacion_id: int,
    variante_id: int | None,
    cantidad: int,
    documento_tipo: str,
    tipo_movimiento: str,
    documento_id: int
):
    inventario = (
        db.query(Inventario)
        .filter(
            Inventario.producto_id == producto_id,
            Inventario.presentacion_id == presentacion_id,
            Inventario.variante_id == variante_id
        )
        .with_for_update()
        .first()
    )

    if not inventario:
        raise InventarioError(
            f"No existe inventario para el producto {producto_id}"
        )

    if inventario.stock_actual < cantidad:
        raise InventarioError(
            f"Stock insuficiente para el producto {producto_id}"
        )

    inventario.stock_actual -= cantidad

    movimiento = MovimientoInventario(
        producto_id=producto_id,
        presentacion_id=presentacion_id,
        variante_id=variante_id,
        cantidad=cantidad,
        tipo_movimiento=tipo_movimiento,
        documento_tipo=documento_tipo,
        documento_id=documento_id
    )

    db.add(movimiento)
