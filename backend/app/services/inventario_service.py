from sqlalchemy.orm import Session
from app.models.inventario import Inventario
from app.models.movimientos import MovimientoInventario
from app.models.documentos_inventario import DocumentosInventario
from app.models.consecutivos_documentos import ConsecutivosDocumentos

from app.models.producto_variantes import ProductoVariante
from app.models.producto_presentacion import ProductoPresentacion

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

  # 🔢 Conversión a unidad base
    factor_presentacion = obtener_factor(
        db=db,
        model=ProductoPresentacion,
        registro_id=presentacion_id,
        campo_factor="cantidad_equivalente",
        nombre="la presentación",
        obligatorio=True
    )

    factor_variante = obtener_factor(
        db=db,
        model=ProductoVariante,
        registro_id=variante_id,
        campo_factor="cantidad_equivalente",
        nombre="la variante",
        obligatorio=False,
        default=1
    ) if variante_id else 1


    unidades_base = cantidad * factor_presentacion * factor_variante
    


    # 🔒 Buscar inventario con bloqueo
    query = db.query(Inventario).filter(
        Inventario.producto_id == producto_id,        
        Inventario.id_sucursal == id_sucursal,        
    )
    
    if variante_id is not None:
        query = query.filter(Inventario.variante_id == variante_id)
    else:
        query = query.filter(Inventario.variante_id.is_(None))
        

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
    if tipo_movimiento == "SALIDA" and inventario.stock_actual < unidades_base:
        raise InventarioError(
            f"Stock insuficiente para el producto {nombre_producto}"
        )

    # 🔄 Actualizar stock
    if tipo_movimiento == "ENTRADA":
        inventario.stock_actual += unidades_base
    elif tipo_movimiento == "SALIDA":
        inventario.stock_actual -= unidades_base
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
        costo_total = precio_unitario * cantidad,
        unidades_base = unidades_base,
    )
    db.add(movimiento_detalle)
    db.flush()
    return movimiento_detalle



def obtener_factor(
    db: Session,
    model,
    registro_id: int,
    campo_factor: str = "cantidad_equivalente",
    nombre: str = "registro",
    obligatorio: bool = True,
    default: float = 1
) -> float:
    """
    Obtiene un factor de conversión genérico desde cualquier modelo.
    """

    print(f"Registro obtenido para MODELO {registro_id} ")

    registro = (
        db.query(model)
        .filter(model.id == int(registro_id))
        .first()
    )

    print(f"Registro obtenido para {nombre} {registro_id}: {registro}")

    if not registro:
        if obligatorio:
            raise InventarioError(
                f"No existe {nombre} con id {registro_id}"
            )
        return default

    factor = getattr(registro, campo_factor, None)

    if not factor or factor <= 0:
        if obligatorio:
            raise InventarioError(
                f"Factor inválido para {nombre} {registro_id}"
            )
        return default

    return factor
