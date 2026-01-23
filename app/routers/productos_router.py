from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencias.empresa import get_empresa_db

from app.schemas.productos_schema import ProductoCreate, ProductoUpdate, ProductoOut
from app.models.productos import Producto
from sqlalchemy.orm import joinedload

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/", response_model=list[ProductoOut])

def listar_productos(db: Session = Depends(get_empresa_db)):
    return (
        db.query(Producto)
        .options(joinedload(Producto.categoria))
        .order_by(Producto.nombre.asc())
        .all()
    )


@router.post("/", response_model=ProductoOut)
def crear_producto(data: ProductoCreate, db: Session = Depends(get_empresa_db)):
    nuevo = Producto(**data.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@router.get("/{id}", response_model=ProductoOut)
def obtener_producto(id: int, db: Session = Depends(get_empresa_db)):
    producto = db.query(Producto).filter(Producto.id == id).first()
    if not producto:
        raise HTTPException(404, "Producto no encontrado")
    return producto


@router.put("/{id}", response_model=ProductoOut)
def actualizar_producto(id: int, data: ProductoUpdate, db: Session = Depends(get_empresa_db)):
    producto = db.query(Producto).filter(Producto.id == id).first()
    if not producto:
        raise HTTPException(404, "Producto no encontrado")

    for k, v in data.model_dump().items():
        setattr(producto, k, v)

    db.commit()
    db.refresh(producto)
    return producto


@router.delete("/{id}")
def eliminar_producto(id: int, db: Session = Depends(get_empresa_db)):
    producto = db.query(Producto).filter(Producto.id == id).first()
    if not producto:
        raise HTTPException(404, "Producto no encontrado")

    db.delete(producto)
    db.commit()
    return {"mensaje": "Producto eliminado"}


from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text


@router.get("/inventario/existencias")
def listar_existencias(db: Session = Depends(get_empresa_db)):

    sql = text("""
        SELECT 
            inv.id,
            pr.nombre AS producto,
            categ.nombre AS categoria,
            u.nombre AS presentacion,
            prvar.sku AS sku,
            attrs.atributos,
            inv.stock_actual AS existencias,
            suc.nombre AS sucursal

        FROM inventario inv
        INNER JOIN productos pr ON inv.producto_id = pr.id 
        INNER JOIN productos_presentaciones prpre ON inv.presentacion_id = prpre.id 
        LEFT JOIN productos_variantes prvar ON inv.variante_id = prvar.id 
        INNER JOIN sucursales suc ON inv.id_sucursal = suc.id 
        INNER JOIN categorias categ ON pr.categoria_id = categ.id
        INNER JOIN unidades_medida u ON pr.unidad_medida_id = u.id

        LEFT JOIN LATERAL (
            SELECT string_agg(key || ': ' || value, ' | ' ORDER BY key) AS atributos
            FROM jsonb_each_text(prvar.parametros)
        ) attrs ON true
        ORDER BY pr.nombre
    """)

    result = db.execute(sql).mappings().all()
    return result

@router.get("/inventario/kardex")
def listar_kardex(db: Session = Depends(get_empresa_db)):

    sql = text("""
      SELECT 
        inv.id,
        inv.fecha,
        doc_inv.tipo_documento,
        tipo.descripcion AS tipo_doc_desc,
        tipo.tipo_movimiento,
        pr.nombre AS producto,
        categ.nombre AS categoria,
        u.nombre AS presentacion,
        prvar.sku,
        attrs.atributos,
        suc.nombre AS sucursal,

        -- Movimiento
        CASE 
            WHEN tipo.tipo_movimiento = 'E' THEN inv.unidades_base
            WHEN tipo.tipo_movimiento = 'S' THEN -inv.unidades_base
        END AS cantidad_movimiento,

        inv.costo_unitario,

        CASE 
            WHEN tipo.tipo_movimiento = 'E' 
                THEN inv.unidades_base * inv.costo_unitario
            WHEN tipo.tipo_movimiento = 'S'
                THEN -(inv.unidades_base * inv.costo_unitario)
        END AS costo_movimiento,

        -- ✅ SALDO DE CANTIDAD (CORREGIDO)
        SUM(
            CASE 
                WHEN tipo.tipo_movimiento = 'E' THEN inv.unidades_base
                WHEN tipo.tipo_movimiento = 'S' THEN -inv.unidades_base
            END
        ) OVER (
            PARTITION BY 
                inv.producto_id,                
                COALESCE(inv.variante_id, 0),
                inv.id_sucursal
            ORDER BY inv.fecha, inv.id
        ) AS saldo_cantidad,

        -- ✅ SALDO DE COSTO (CORREGIDO)
        SUM(
            CASE 
                WHEN tipo.tipo_movimiento = 'E'
                    THEN inv.unidades_base * inv.costo_unitario
                WHEN tipo.tipo_movimiento = 'S'
                    THEN -(inv.unidades_base * inv.costo_unitario)
            END
        ) OVER (
            PARTITION BY 
                inv.producto_id,                
                COALESCE(inv.variante_id, 0),
                inv.id_sucursal
            ORDER BY inv.fecha, inv.id
        ) AS saldo_costo

    FROM movimientos_inventario inv
    INNER JOIN documentos_inventario doc_inv ON inv.documento_id = doc_inv.id
    INNER JOIN documentos_tipo tipo ON doc_inv.tipo_documento = tipo.codigo
    INNER JOIN productos pr ON inv.producto_id = pr.id 
    INNER JOIN productos_presentaciones prpre ON inv.presentacion_id = prpre.id 
    INNER JOIN unidades_medida u ON pr.unidad_medida_id = u.id
    LEFT JOIN productos_variantes prvar ON inv.variante_id = prvar.id 
    INNER JOIN sucursales suc ON inv.id_sucursal = suc.id 
    INNER JOIN categorias categ ON pr.categoria_id = categ.id
    LEFT JOIN LATERAL (
        SELECT string_agg(key || ': ' || value, ' | ' ORDER BY key) AS atributos
        FROM jsonb_each_text(prvar.parametros)
    ) attrs ON true
    ORDER BY inv.fecha, inv.id;


    """)

    result = db.execute(sql).mappings().all()
    return result
