"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Input from "./input";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Button from "@/components/ui/button";

import {
  obtenerProductosActivos,
  listarPresentaciones,
  listarVariantes,
} from "@/lib/api/productos";

const ReactSwal = withReactContent(Swal);

/* =======================
   Types
======================= */

type ControlInventario = "S" | "N";

interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  activo: boolean;
  tiene_variantes?: boolean;
   iva?: number;
}

interface Presentacion {
  id: number;
  tipo_presentacion: string;
  cantidad_equivalente: number;
  precio_venta?: number;
  stock_actual: number;
  activo: boolean;
  control_inventario: ControlInventario;
}

interface Variante {
  id: number;
  descripcion: string;
  descripcion_variante?: string;
  precio_venta: number;
  stock_actual: number;
  activo: boolean;
  control_inventario: ControlInventario;
  presentacion_id_inv?: number;
}

interface Props {
  valueProductoId: number | null;
  valuePresentacionId : number | null;
  valueVarianteId :number | null;
  onSelect: (detalle: {
    producto_id: number;
    presentacion_id: number;
    variante_id: number | null;
    descripcion: string;
    precio_unitario: number;
    presentacion_nombre: string;
    iva:number | null;
  }) => void;
  placeholder?: string;
  resetKey?: any;
}

/* =======================
   Opción vendible
======================= */

type OpcionVenta = {
  producto_id: number;
  producto_nombre: string;

  variante_id: number | null;
  variante_nombre: string | null;

  presentacion_id: number;
  presentacion_nombre: string;
  iva:number | null;

  stock: number;
  control_inventario: ControlInventario;

  precio_unitario: number;
};

/* =======================
   Component
======================= */

const ProductWithPresentation: React.FC<Props> = ({
  valueProductoId,
  onSelect,
  placeholder,
  resetKey,
}) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  /* =======================
     Effects
  ======================= */

  useEffect(() => {
    setProductoSeleccionado(null);
    setQuery("");
  }, [resetKey]);

  useEffect(() => {
    async function load() {
      const raw = await obtenerProductosActivos();
      const mapped: Producto[] = raw.map((p) => ({
        id: p.id!,
        nombre: p.nombre || "",
        codigo: p.codigo || "",
        activo: p.activo ?? true,
        iva: typeof p.iva === "number" ? p.iva : 0,
        tiene_variantes: p.tiene_variantes ?? false,
      }));

      setProductos(mapped);

      if (valueProductoId) {
        setProductoSeleccionado(
          mapped.find((p) => p.id === valueProductoId) || null
        );
      }
    }
    load();
  }, [valueProductoId]);

  /* =======================
     Helpers
  ======================= */

  const calcularPosicion = () => {
    if (!inputRef.current) return;
    const r = inputRef.current.getBoundingClientRect();
    setPos({
      top: r.bottom + window.scrollY,
      left: r.left + window.scrollX,
      width: r.width,
    });
  };

  const filteredProducts = query
    ? productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(query.toLowerCase()) ||
          p.codigo.toLowerCase().includes(query.toLowerCase())
      )
    : productos;

  /* =======================
     Construir opciones
  ======================= */

 function construirOpciones(
  producto: Producto,
  variantes: Variante[],
  presentaciones: Presentacion[]
): OpcionVenta[] {
  const opciones: OpcionVenta[] = [];

  /* =========================
     Producto SIN variantes
  ========================== */
  if (variantes.length === 0) {
    presentaciones.forEach((p) => {
      opciones.push({
        producto_id: producto.id,
        producto_nombre: producto.nombre,
        variante_id: null,
        variante_nombre: null,
        presentacion_id: p.id,
        presentacion_nombre: p.tipo_presentacion,
        stock: p.stock_actual,
        control_inventario: p.control_inventario,
        precio_unitario: p.precio_venta ?? 0,
        iva:producto.iva ?? 0
      });
    });

    return opciones;
  }

  /* =========================
     Producto CON variantes
  ========================== */

  variantes.forEach((v) => {
    // 🔑 Presentaciones válidas para esta variante
    const presentacionesValidas =
      v.control_inventario === "S"
        ? presentaciones.filter(
            (p) => p.id > 0 
          )
        : presentaciones;

    presentacionesValidas.forEach((p) => {
      opciones.push({
        producto_id: producto.id,
        producto_nombre: producto.nombre,

        variante_id: v.id,
        variante_nombre: v.descripcion,

        presentacion_id: p.id,
        presentacion_nombre: p.tipo_presentacion + " X " + p.cantidad_equivalente,

        stock:
          v.control_inventario === "S"
            ? Math.floor(v.stock_actual / p.cantidad_equivalente)
            : p.stock_actual,

        control_inventario: v.control_inventario,

        precio_unitario:
          (v.precio_venta ?? 0) * (p.cantidad_equivalente ?? 1),
          iva: producto.iva ?? 0 
      });
    });
  });

  return opciones;
}


  /* =======================
     Modal opciones
  ======================= */

const abrirModalOpciones = (
  producto: Producto,
  opciones: OpcionVenta[]
) => {
  ReactSwal.fire({
    title: producto.nombre,
    width: 1000,
    html: (
      <div className="max-h-[65vh] overflow-y-auto rounded-lg">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="text-gray-600 uppercase text-xs">
              <th className="px-3 py-2 text-left">Producto</th>
              <th className="px-3 py-2 text-left">Variante</th>
              <th className="px-3 py-2 text-left">Presentación</th>
              <th className="px-3 py-2 text-center">Stock</th>
              <th className="px-3 py-2 text-right">Precio</th>
              <th className="px-3 py-2 text-center"></th>
            </tr>
          </thead>

          <tbody>
            {opciones.map((o, i) => {
              const sinStock =
                o.control_inventario === "S" && o.stock <= 0;

              return (
                <tr
                  key={i}
                  className={`
                    border-t
                    ${sinStock ? "opacity-40 bg-gray-50" : "hover:bg-blue-50"}
                  `}
                >
                  <td className="px-3 py-2 font-medium">
                    {o.producto_nombre}
                  </td>

                  <td className="px-3 py-2">
                    {o.variante_nombre ?? (
                      <span className="text-gray-400 italic">Sin variante</span>
                    )}
                  </td>

                  <td className="px-3 py-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-gray-100">
                      {o.presentacion_nombre}
                    </span>
                  </td>

                  <td className="px-3 py-2 text-center font-semibold">
                    {o.control_inventario === "N" ? (
                      <span className="text-green-600">∞</span>
                    ) : (
                      <span
                        className={
                          o.stock <= 5 ? "text-red-600" : "text-gray-800"
                        }
                      >
                        {o.stock}
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-2 text-right font-bold text-blue-700">
                    ${o.precio_unitario.toLocaleString()}
                  </td>

                  <td className="px-3 py-2 text-center">
                    <Button
                      disabled={sinStock}
                      className="
                        px-3 py-1.5
                        text-xs font-semibold
                        rounded-md
                        bg-blue-600 text-white
                        hover:bg-blue-700
                        disabled:bg-gray-300
                        disabled:cursor-not-allowed
                      "
                      onClick={() => {
                        ReactSwal.close();
                        onSelect({
                          producto_id: o.producto_id,
                          variante_id: o.variante_id,
                          presentacion_id: o.presentacion_id,
                          descripcion: o.variante_nombre
                            ? `${o.variante_nombre} - ${o.presentacion_nombre}`
                            : o.presentacion_nombre,
                          precio_unitario: o.precio_unitario,
                          presentacion_nombre: o.presentacion_nombre,
                          iva:o.iva
                        });
                      }}
                    >
                     <div className="flex items-center gap-2">
                        <img src="/icons/plus.png" alt="Pdf" className="w-6 h-6" />
                        <span> Agregar</span>
                      </div>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    ),
    showConfirmButton: false,
  });
};

  /* =======================
     Render
  ======================= */

  return (
    <>
      <Input
        ref={inputRef}
        placeholder={placeholder || "Buscar producto"}
        value={productoSeleccionado?.nombre || query}
        onFocus={calcularPosicion}
        onChange={(e) => {
          setQuery(e.target.value);
          setProductoSeleccionado(null);
          calcularPosicion();
        }}
      />

      {query &&
        !productoSeleccionado &&
        createPortal(
          <ul
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              width: pos.width * 2,
              maxHeight: 260,
              overflowY: "auto",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              boxShadow: "0 10px 25px rgba(0,0,0,.15)",
              zIndex: 9999,
            }}
          >
            {filteredProducts.map((p) => (
              <li
                key={p.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={async () => {
                  setProductoSeleccionado(p);
                  setQuery("");

                  const sucursal = JSON.parse(
                    localStorage.getItem("sucursal") || "{}"
                  );

                  const variantesRaw = await listarVariantes(p.id, {
                    con_stock: true,
                    id_sucursal: Number(sucursal.id || 0),
                  });

                  
                  const presRaw = await listarPresentaciones(p.id, {
                    con_stock: true,
                    id_sucursal: Number(sucursal.id || 0),
                  });

                  const variantes: Variante[] = variantesRaw.map((v) => ({
                    id: v.id!,
                    descripcion: v.sku,
                    precio_venta: v.precio_venta ?? 0,
                    stock_actual: v.stock_actual ?? 0,
                    presentacion_id_inv: v.presentacion_id_inv ?? 0,
                    activo: v.activo ?? true,
                    control_inventario:
                      v.control_inventario === "S" ? "S" : "N",
                  }));
                 // console.table(variantes);
                  const presentaciones: Presentacion[] = presRaw.map(
                    (p) => ({
                      id: p.id!,
                      tipo_presentacion: p.tipo_presentacion || "",
                      cantidad_equivalente:
                      p.cantidad_equivalente ?? 1,
                      precio_venta: p.precio_venta ?? 0,
                      stock_actual: p.stock_actual ?? 0,
                      activo: p.activo ?? true,
                      control_inventario:
                        p.control_inventario === "S" ? "S" : "N",
                    })
                  );
                 // console.table(presentaciones);
                  const opciones = construirOpciones(
                    p,
                    variantes,
                    presentaciones
                  );

                  if (opciones.length === 1) {
                    const o = opciones[0];
                    
                     // 🔐 VALIDACIÓN CRÍTICA
                    if (o.control_inventario === "S" && o.stock <= 0) {
                      Swal.fire({
                        icon: "warning",
                        title: "Sin inventario",
                        text: "Este producto no tiene stock disponible",
                      });
                      return;
                    }


                    onSelect({
                      producto_id: o.producto_id,
                      variante_id: o.variante_id,
                      presentacion_id: o.presentacion_id,
                      descripcion: o.variante_nombre
                        ? `${o.variante_nombre} - ${o.presentacion_nombre}`
                        : o.presentacion_nombre,
                      precio_unitario: o.precio_unitario,
                      presentacion_nombre: o.presentacion_nombre,
                      iva: o.iva
                    });
                    return;
                  }

                  abrirModalOpciones(p, opciones);
                }}
              >
                {p.nombre} ({p.codigo})
              </li>
            ))}
          </ul>,
          document.body
        )}
    </>
  );
};

export default ProductWithPresentation;
