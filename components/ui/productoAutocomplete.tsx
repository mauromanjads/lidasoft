"use client";

import React, { useState, useEffect } from "react";
import Input from "./input";
import SelectSearch from "./selectSearch";
import { obtenerProductosActivos, listarPresentaciones } from "@/lib/api/productos";

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
  const [presentaciones, setPresentaciones] = useState<Presentacion[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [presentacionSeleccionada, setPresentacionSeleccionada] = useState<Presentacion | null>(null);
  const [query, setQuery] = useState("");

  // Cargar productos activos
  useEffect(() => {
    async function loadProductos() {
      try {
        const prodsRaw = await obtenerProductosActivos();
        const prods: Producto[] = prodsRaw
          .filter(p => p.id != null) // eliminar productos sin id
          .map(p => ({
            id: p.id!,
            nombre: p.nombre || "",
            codigo: p.codigo || "",
            activo: p.activo ?? true,
          }));
        setProductos(prods);

        // Preseleccionar producto si valueProductoId existe
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

  // Cargar presentaciones solo si hay producto seleccionado
  useEffect(() => {
    async function loadPresentaciones() {
      if (!productoSeleccionado?.id) {
        setPresentaciones([]);
        setPresentacionSeleccionada(null);
        return;
      }

      try {
        const presRaw = await listarPresentaciones(productoSeleccionado.id);
        const pres: Presentacion[] = presRaw
          .filter(p => p.id != null)
          .map(p => ({
            id: p.id!,            
            cantidad_equivalente: p.cantidad_equivalente ?? 1,
            precio_venta: p.precio_venta ?? 0,
             tipo_presentacion: p.tipo_presentacion || "",
          }));
        setPresentaciones(pres);

        // Preseleccionar presentación si valuePresentacionId existe
        if (valuePresentacionId) {
          const presSel = pres.find(p => p.id === valuePresentacionId) || null;
          setPresentacionSeleccionada(presSel);
        } else {
          setPresentacionSeleccionada(null);
        }
      } catch (err) {
        console.error("Error cargando presentaciones:", err);
      }
    }
    loadPresentaciones();
  }, [productoSeleccionado, valuePresentacionId]);

  // Llamar onSelect cuando haya producto y presentación seleccionados
  useEffect(() => {
    if (productoSeleccionado && presentacionSeleccionada) {
      onSelect({
        producto_id: productoSeleccionado.id,
        presentacion_id: presentacionSeleccionada.id,
        descripcion: `${productoSeleccionado.nombre} - ${presentacionSeleccionada.tipo_presentacion}`,
        precio_unitario: presentacionSeleccionada.precio_venta,
      });
    }
  }, [productoSeleccionado, presentacionSeleccionada]);

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
          setPresentacionSeleccionada(null);
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
              onClick={() => setProductoSeleccionado(p)}
            >
              {p.nombre} ({p.codigo})
            </li>
          ))}
        </ul>
      )}

      {/* Select de presentaciones */}
      {productoSeleccionado && presentaciones.length > 0 && (
        <SelectSearch
          items={presentaciones.map((pres) => ({
            id: pres.id,
            nombre: `${pres.tipo_presentacion} - ${pres.precio_venta.toFixed(2)}`,
          }))}
          value={presentacionSeleccionada?.id || 0}
          onChange={(id) => {
            const pres = presentaciones.find((p) => p.id === id);
            if (pres) setPresentacionSeleccionada(pres);
          }}
        />
      )}
    </div>
  );
};

export default ProductWithPresentation;
