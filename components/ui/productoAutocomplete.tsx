"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Input from "./input";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  obtenerProductosActivos,
  listarPresentaciones,
  listarVariantes,
} from "@/lib/api/productos";

const ReactSwal = withReactContent(Swal);

/* =======================
   Interfaces
======================= */

interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  activo: boolean;
  tiene_variantes?: boolean;
}

interface Presentacion {
  id: number;
  tipo_presentacion: string;
  cantidad_equivalente: number;
  precio_venta?: number;
}

interface Variante {
  id: number;
  descripcion: string;
  precio_venta: number;
  stock_actual:number;
  activo:boolean;
}

interface Props {
  valueProductoId: number | null;
  valuePresentacionId: number | null;
  valueVarianteId: number | null;
  onSelect: (detalle: {
    producto_id: number;
    presentacion_id: number;
    variante_id: number | null;
    descripcion: string;
    precio_unitario: number;
    presentacion_nombre: string;
  }) => void;
  placeholder?: string;
  resetKey?: any; // <-- NUEVO
}

/* =======================
   Component
======================= */

const ProductWithPresentation: React.FC<Props> = ({
  valueProductoId,
  onSelect,
  placeholder,
  resetKey
}) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [query, setQuery] = useState("");

    useEffect(() => {
    setProductoSeleccionado(null);
    setQuery("");
  }, [resetKey]);

  // 🔹 Mantener valor si cambia valueProductoId
  useEffect(() => {
    if (valueProductoId) {
      setProductoSeleccionado(productos.find((p) => p.id === valueProductoId) || null);
    }
  }, [valueProductoId, productos]);


  /* ===== refs y posición dropdown ===== */
  const inputRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  /* =======================
     Load productos
  ======================= */
  useEffect(() => {
    async function load() {
      const prodsRaw = await obtenerProductosActivos();
      const prods: Producto[] = prodsRaw.map((p) => ({
        id: p.id!,
        nombre: p.nombre || "",
        codigo: p.codigo || "",
        activo: p.activo ?? true,
        tiene_variantes: p.tiene_variantes ?? false,
      }));

      setProductos(prods);

      if (valueProductoId) {
        setProductoSeleccionado(
          prods.find((p) => p.id === valueProductoId) || null
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
     Modales
  ======================= */
  const abrirModalVariantes = (producto: Producto, variantes: Variante[]) => {
    ReactSwal.fire({
      title: "Selecciona la variante",
      html: (
        <div className="max-h-[60vh] overflow-y-auto">
          {variantes.map((v) => {
            const sinStock = v.stock_actual <= 0;
            const inactiva = v.activo === false;
            const deshabilitada = sinStock || inactiva;

            return (
              <button
                key={v.id}
                disabled={deshabilitada}
                onClick={() => {
                  if (deshabilitada) return;
                  ReactSwal.close();
                  abrirModalPresentaciones(producto, v);
                }}
                className={`
                  w-full p-3 mb-2 rounded border text-left transition
                  ${sinStock ? "bg-red-50 border-red-300 text-red-700 cursor-not-allowed" : ""}
                  ${inactiva ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed" : ""}
                  ${!deshabilitada ? "bg-white hover:bg-blue-50 border-gray-300" : ""}
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{v.descripcion}</span>
                  <strong>${v.precio_venta.toLocaleString()}</strong>
                </div>

                <div className="flex justify-between text-sm mt-1">
                  {sinStock && <span className="text-red-600">Sin stock</span>}
                  {inactiva && <span className="text-gray-500">Variante inactiva</span>}
                  {!deshabilitada && (
                    <span className="text-green-600">
                      Stock disponible: {v.stock_actual}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ),
      showConfirmButton: false,
      width: 900,
    });
  };


  const abrirModalPresentaciones = async (
    producto: Producto,
    variante: Variante | null
  ) => {
    const presRaw = await listarPresentaciones(producto.id);
    const presentaciones: Presentacion[] = presRaw.map((p) => ({
      id: p.id!,
      tipo_presentacion: p.tipo_presentacion || "",
      cantidad_equivalente: p.cantidad_equivalente ?? 1,
      precio_venta: p.precio_venta ?? 0,
    }));

    ReactSwal.fire({
      title: "Selecciona la presentación",
      html: (
        <div>
          {presentaciones.map((p) => {
            const precio = variante
              ? variante.precio_venta * p.cantidad_equivalente
              : p.precio_venta ?? 0;

            return (
              <button
                key={p.id}
                className="w-full p-2 mb-2 border rounded"
                onClick={() => {
                  ReactSwal.close();
                  onSelect({
                    producto_id: producto.id,
                    variante_id: variante ? variante.id : null,
                    presentacion_id: p.id,
                    descripcion: variante
                      ? `${variante.descripcion} - ${p.tipo_presentacion}`
                      : p.tipo_presentacion,
                    precio_unitario: precio,
                    presentacion_nombre: p.tipo_presentacion,
                  });
                }}
              >
                <div className="flex justify-between">
                  <span>{p.tipo_presentacion}</span>
                  <strong>${precio.toLocaleString()}</strong>
                </div>
              </button>
            );
          })}
        </div>
      ),
      showConfirmButton: false,
      width: 900,
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
          className="text-sm font-medium mb-1"
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              width: pos.width*2,
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

                  try {
                    // 1️⃣ VARIANTES
                    const variantesRaw = await listarVariantes(p.id);
                    const variantes: Variante[] = variantesRaw.map((v) => ({
                      id: v.id!,
                      descripcion: v.descripcion,
                      precio_venta: v.precio_venta ?? 0,
                       stock_actual: v.stock_actual ?? 0,
                        activo: v.activo ?? true
                    }));

                    if (variantes.length > 0) {
                      abrirModalVariantes(p, variantes);
                      return;
                    }

                    // 2️⃣ PRESENTACIONES
                    const presRaw = await listarPresentaciones(p.id);
                    const presentaciones: Presentacion[] = presRaw.map((pr) => ({
                      id: pr.id!,
                      tipo_presentacion: pr.tipo_presentacion || "",
                      cantidad_equivalente: pr.cantidad_equivalente ?? 1,
                      precio_venta: pr.precio_venta ?? 0,
                    }));

                    // 👉 UNA sola → auto cargar (ESTO ERA CLAVE)
                    if (presentaciones.length === 1) {
                      const pres = presentaciones[0];
                      onSelect({
                        producto_id: p.id,
                        variante_id: null,
                        presentacion_id: pres.id,
                        descripcion: pres.tipo_presentacion,
                        precio_unitario: pres.precio_venta ?? 0,
                        presentacion_nombre: pres.tipo_presentacion,
                      });
                      return;
                    }

                    // 👉 Varias → modal
                    if (presentaciones.length > 1) {
                      abrirModalPresentaciones(p, null);
                    }
                  } catch (err) {
                    console.error(err);
                  }
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
