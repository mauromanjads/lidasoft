"use client";

import React from "react";
import Input from "./input";
import ProductoConPresentacion from "@/components/ui/productoAutocomplete";

interface Detalle {
  producto_id: number | null;
  presentacion_id: number | null;
  variante_id: number | null;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  iva: number;
  subtotal: number;
  total: number;
}

interface Props {
  detalles: Detalle[];
  onChange: (index: number, field: keyof Detalle, value: any) => void;
  onDelete: (index: number) => void;
}

export default function DetalleVentaGrid({
  detalles,
  onChange,
  onDelete,
}: Props) {
  return (
    <div className="detalle-grid-wrapper">
      
      {/* ===== HEADER ===== */}
      <div className="detalle-grid header">
        <div>Producto</div>
        <div>Descripción</div>
        <div className="center">Cant</div>
        <div className="right">Precio</div>
        <div className="right">Desc</div>
        <div className="right">IVA</div>
        <div className="right">Subtotal</div>
        <div className="right">Total</div>
        <div className="center">Acc</div>
      </div>

      {/* ===== BODY ===== */}
      <div className="detalle-grid-body">
        {detalles.map((det, i) => (
          <div key={i} className="detalle-grid row">

            {/* PRODUCTO */}
            <div>
              <ProductoConPresentacion
                valueProductoId={det.producto_id}
                valuePresentacionId={det.presentacion_id}
                valueVarianteId={det.variante_id}
                onSelect={(d) => {
                  onChange(i, "producto_id", d.producto_id);
                  onChange(i, "presentacion_id", d.presentacion_id);
                  onChange(i, "variante_id", d.variante_id ?? null);
                  onChange(i, "precio_unitario", d.precio_unitario);
                  onChange(i, "descripcion", d.descripcion);

                  const cantidad = det.cantidad || 1;
                  onChange(i, "subtotal", cantidad * d.precio_unitario);
                }}
              />
            </div>

            {/* DESCRIPCIÓN */}
            <div className="truncate">
              {det.descripcion || "-"}
            </div>

            {/* CANTIDAD */}
            <div>
              <Input
                type="number"
                value={det.cantidad}
                onChange={(e) =>
                  onChange(i, "cantidad", Number(e.target.value))
                }
                className="center"
              />
            </div>

            {/* PRECIO */}
            <div>
              <Input
                type="number"
                value={det.precio_unitario}
                onChange={(e) =>
                  onChange(i, "precio_unitario", Number(e.target.value))
                }
                className="right"
              />
            </div>

            {/* DESCUENTO */}
            <div>
              <Input
                type="number"
                value={det.descuento}
                onChange={(e) =>
                  onChange(i, "descuento", Number(e.target.value))
                }
                className="right"
              />
            </div>

            {/* IVA */}
            <div>
              <Input
                type="number"
                value={det.iva}
                onChange={(e) =>
                  onChange(i, "iva", Number(e.target.value))
                }
                className="right"
              />
            </div>

            {/* SUBTOTAL */}
            <div className="right">
              {det.subtotal.toFixed(2)}
            </div>

            {/* TOTAL */}
            <div className="right">
              {det.total.toFixed(2)}
            </div>

            {/* ACCIÓN */}
            <div className="center">
              <button
                type="button"
                onClick={() => onDelete(i)}
                className="btn-delete"
              >
                ❌
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
