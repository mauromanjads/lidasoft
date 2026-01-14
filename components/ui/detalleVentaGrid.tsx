"use client";

import React, { useState } from "react";
import Input from "./input";
import ProductoConPresentacion from "@/components/ui/productoAutocomplete";
import CurrencyInput from "./currencyInput";

/* =====================
   Interfaces
===================== */

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

/* =====================
   Component
===================== */

export const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);

export default function DetalleVentaGrid({
  detalles,
  onChange,
  onDelete,
}: Props) {

  /* 👉 UN SOLO ESTADO */
  const [cols, setCols] = useState([
    250, null, 90, 100, 120, 80, 120, 120, 60,
  ]);

  const gridTemplate = cols
  .map((w) => (w ? `${w}px` : "minmax(200px, 1fr)"))
  .join(" ");

  const startResize = (index: number, startX: number) => {
    if (cols[index] === null) return;

    const startWidth = cols[index]!;

    const onMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      setCols((c) => {
        const copy = [...c];
        copy[index] = Math.max(60, startWidth + delta);
        return copy;
      });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", onMove);
    });
  };


  return (
    <div className="detalle-grid-wrapper">

      {/* ===== HEADER ===== */}
      <div
        className="detalle-grid header"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {[
          "Producto",
          "Descripción",
          "Cant",
          "Precio",
          "Desc",
          "IVA(%)",
          "Subtotal",
          "Total",
          "Acc",
        ].map((t, i) => (
          <div key={i} className="header-cell">
            {t}
            {i < cols.length - 1 && cols[i] && (
            <span
              className="resizer"
              onMouseDown={(e) => startResize(i, e.clientX)}
            />
          )}
          </div>
        ))}
      </div>

      {/* ===== BODY ===== */}
      <div className="detalle-grid-body">
        {detalles.map((det, i) => (
          <div
            key={i}
            className="detalle-grid row"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div className="pl-1">
              <ProductoConPresentacion
                valueProductoId={det.producto_id ?? null}
                valuePresentacionId={det.presentacion_id ?? null}
                valueVarianteId={det.variante_id ?? null}
                onSelect={(d) => {
                  onChange(i, "producto_id", d.producto_id);
                  onChange(i, "presentacion_id", d.presentacion_id);
                  onChange(i, "variante_id", d.variante_id ?? null);
                  onChange(i, "precio_unitario", d.precio_unitario);
                  onChange(i, "descripcion", d.descripcion);

                  const cantidad = det.cantidad || 1;
                  onChange(i, "subtotal", cantidad * d.precio_unitario);
                }}
                resetKey={det.producto_id} 
              />
            </div>

            <div className="text-sm  mb-1  pl-2">{det.descripcion || "-"}</div>

            <div className="pl-1">
              <Input
                type="number"
                value={det.cantidad}
                onChange={(e) =>
                  onChange(i, "cantidad", Number(e.target.value))
                }
                className="center"
              />
            </div>

           <div className="pl-1">
              <CurrencyInput                    
                value={det.precio_unitario}
                readOnly            
                onChange={(e) =>
                  onChange(i, "precio_unitario", Number(e))                  
                }                
                className="right"
              />
            </div>

           <div className="pl-1">
              <CurrencyInput              
                value={det.descuento}
                onChange={(val) =>                  
                  onChange(i, "descuento", val)
                }
                className="right "
              />
            </div>

            <div className="pl-1">
              <Input
                type="number"
                readOnly
                value={det.iva}
                onChange={(e) =>
                  onChange(i, "iva", Number(e.target.value))
                }
                className="right"
              />
            </div>

            <div className="right">{formatCOP(det.subtotal)}</div>
            <div className="right">{formatCOP(det.total)}</div>

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
