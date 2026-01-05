from fastapi import HTTPException
from app.models.facturas import Factura
from app.models.resoluciones import ResolucionDian
from app.models.mediosdepago import MediosDePago
from app.models.formasdepago import FormasDePago
from app.models.terceros import Terceros
from app.models.configuracionesdian import ConfiguracionDian


def construir_factura_json(db, factura_id: int) -> dict:
    resultado = (
        db.query(
            Factura,
            ResolucionDian.tipo_documento,
            MediosDePago,
            FormasDePago,
            Terceros
        )
        .join(ResolucionDian, Factura.resolucion_id == ResolucionDian.id)
        .join(MediosDePago, Factura.medio_pago_id == MediosDePago.id)
        .join(FormasDePago, Factura.forma_pago_id == FormasDePago.id)
        .join(Terceros, Factura.tercero_id == Terceros.id)
        .filter(Factura.id == factura_id)
        .first()
    )

    configdian = db.query(ConfiguracionDian).first()

    if not resultado:
        raise HTTPException(status_code=404, detail="Factura no encontrada")

    factura, tipo_documento, mediopago, formapago, tercero = resultado

    if not factura.detalles:
        raise HTTPException(status_code=400, detail="Factura sin detalle")

    items = [
        {
            "codigo": str(det.producto.codigo),
            "descripcion":( f"{det.producto.nombre} - {det.descripcion}"),
            "cantidad": float(det.cantidad),
            "unidad": det.producto.unidad_medida.codigo,
            "precio_unitario": float(det.precio_unitario),
            "subtotal": float(det.subtotal),
            "impuesto": float(det.iva),
            "descuento": float(det.descuento)
        }
        for det in factura.detalles
    ]

    # ---------------- FACTURA ELECTRÓNICA ----------------
    if tipo_documento == "FE":
        return {
            "tipo_documento": tipo_documento,
            "regimen": configdian.regimen,
            "metodo_pago": mediopago.codigo,
            "forma_pago": formapago.nombre,
            "observaciones": factura.notas or "",

            "emisor_nombre": configdian.nombre_emisor,
            "emisor_nit": str(configdian.nit_emisor),
            "pin_dian": str(configdian.pin_software),

            "numero": factura.numero_completo,
            "fecha": factura.fecha.date().isoformat(),

            "cliente_nombre": tercero.nombre,
            "cliente_nit": str(tercero.documento),

            "items": items,

            "total_sin_impuesto": float(factura.subtotal),
            "total_impuesto": float(factura.iva_total),
            "total_con_impuesto": float(factura.total),
            "moneda": "COP"
        }

    # ---------------- DOCUMENTO EQUIVALENTE ----------------
    return {
        "tipo_documento": tipo_documento,
        "numero": factura.numero_completo,
        "fecha": factura.fecha.date().isoformat(),
        "moneda": "COP",

        "emisor_nombre": configdian.nombre_emisor,
        "emisor_nit": str(configdian.nit_emisor),

        "cliente_nombre": tercero.nombre,
        "cliente_nit": str(tercero.documento),

        "motivo": factura.notas or "",
        "regimen": configdian.regimen,

        "total_sin_impuesto": float(factura.subtotal),
        "total_impuesto": float(factura.iva_total),
        "total_con_impuesto": float(factura.total),

        "items": items
    }
