"use client";

import React, { useState, useEffect } from "react";
import Input from "./input";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { obtenerProductosActivos, listarPresentaciones } from "@/lib/api/productos";

const ReactSwal = withReactContent(Swal);

interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  activo: boolean;
}

interface Presentacion {
  id: number;
  tipo_presentacion: string;
  cantidad_equivalente: number;
  precio_venta: number;
}

interface Props {
  valueProductoId?: number;
  valuePresentacionId?: number;
  onSelect: (detalle: {
    producto_id: number;
    presentacion_id: number;
    descripcion: string;
    precio_unitario: number;
    presentacion_nombre: string;
  }) => void;
  placeholder?: string;
}

const ProductWithPresentation: React.FC<Props> = ({
  valueProductoId,
  valuePresentacionId,
  onSelect,
  placeholder,
}) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function loadProductos() {
      try {
        const prodsRaw = await obtenerProductosActivos();
        const prods: Producto[] = prodsRaw
          .filter(p => p.id != null)
          .map(p => ({
            id: p.id!,
            nombre: p.nombre || "",
            codigo: p.codigo || "",
            activo: p.activo ?? true,
          }));
        setProductos(prods);

        if (valueProductoId) {
          const prod = prods.find(p => p.id === valueProductoId) || null;
          setProductoSeleccionado(prod);
        }
      } catch (err) {
        console.error("Error cargando productos:", err);
      }
    }
    loadProductos();
  }, [valueProductoId]);

  // Función para abrir modal de presentaciones
  const abrirModalPresentaciones = async (producto: Producto) => {
    try {
      const presRaw = await listarPresentaciones(producto.id);
      const presentaciones: Presentacion[] = presRaw
        .filter(p => p.id != null)
        .map(p => ({
          id: p.id!,
          tipo_presentacion: p.tipo_presentacion || "",
          cantidad_equivalente: p.cantidad_equivalente ?? 1,
          precio_venta: p.precio_venta ?? 0,
        }));

      if (presentaciones.length === 0) return;

      // Modal SweetAlert2
      ReactSwal.fire({
        title: <p>Selecciona la presentación</p>,
        html: (
          <div>
            {presentaciones.map((p) => (
              <button
                key={p.id}
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                }}
                onClick={() => {
                  ReactSwal.close();
                  onSelect({
                    producto_id: producto.id,
                    presentacion_id: p.id,
                    descripcion: `${producto.nombre} - ${p.tipo_presentacion}`,
                    precio_unitario: p.precio_venta,
                    presentacion_nombre: p.tipo_presentacion,
                  });
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{p.tipo_presentacion}</span>
                  <strong>${p.precio_venta.toLocaleString()}</strong>
                </div>
              </button>
            ))}
          </div>
        ),
        showConfirmButton: false,
        width: 400,
      });
    } catch (err) {
      console.error("Error cargando presentaciones:", err);
    }
  };

  // Filtrar productos por búsqueda
  const filteredProducts = query
    ? productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(query.toLowerCase()) ||
          p.codigo.toLowerCase().includes(query.toLowerCase())
      )
    : productos;

  return (
    <div className="space-y-2 relative">
      {/* Autocomplete producto */}
      <Input
        placeholder={placeholder || "Buscar producto"}
        value={productoSeleccionado?.nombre || query}
        onChange={(e) => {
          setQuery(e.target.value);
          setProductoSeleccionado(null);
        }}
        onFocus={() => setQuery(query)}
        className="w-full border rounded p-2"
      />
      {query && !productoSeleccionado && (
        <ul className="border max-h-60 overflow-y-auto bg-white shadow absolute z-50 w-full">
          {filteredProducts.map((p) => (
            <li
              key={p.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setProductoSeleccionado(p);
                setQuery(""); // limpia búsqueda
                abrirModalPresentaciones(p); // abrir modal automáticamente
              }}
            >
              {p.nombre} ({p.codigo})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductWithPresentation;
