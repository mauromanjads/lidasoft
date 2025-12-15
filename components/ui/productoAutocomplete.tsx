"use client";

import React, { useState, useEffect } from "react";
import Input from "./input";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  obtenerProductosActivos,
  listarPresentaciones,
  listarVariantes,
} from "@/lib/api/productos";

const ReactSwal = withReactContent(Swal);

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
}

interface Props {
  valueProductoId: number | null;
  valuePresentacionId: number  | null;
  valueVarianteId: number  | null;
  onSelect: (detalle: {
    producto_id: number;
    presentacion_id: number;
    variante_id: number | null;
    descripcion: string;
    precio_unitario: number;
    presentacion_nombre: string;
  }) => void;
  placeholder?: string;
}

const ProductWithPresentation: React.FC<Props> = ({
  valueProductoId,
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
        const prods: Producto[] = prodsRaw.map((p) => ({
          id: p.id!,
          nombre: p.nombre || "",
          codigo: p.codigo || "",
          activo: p.activo ?? true,
          tiene_variantes: p.tiene_variantes ?? false,
        }));
        setProductos(prods);

        if (valueProductoId) {
          const prod = prods.find((p) => p.id === valueProductoId) || null;
          setProductoSeleccionado(prod);
        }
      } catch (err) {
        console.error("Error cargando productos:", err);
      }
    }
    loadProductos();
  }, [valueProductoId]);

  const abrirModalVariantes = (producto: Producto, variantes: Variante[]) => {
    ReactSwal.fire({
      title: <p>Selecciona la variante</p>,
      html: (
        <div>
          {variantes.map((v) => (
            <button
              key={v.id}
              className="w-full p-2 mb-2 border rounded"
              onClick={() => {
                ReactSwal.close();
                abrirModalPresentaciones(producto, v);
              }}
            >
              <div className="flex justify-between">
                <span>{v.descripcion}</span>
                <strong>${v.precio_venta.toLocaleString()}</strong>
              </div>
            </button>
          ))}
        </div>
      ),
      showConfirmButton: false,
      width: 800,
    });
  };

  const abrirModalPresentaciones = async (producto: Producto, variante: Variante | null) => {
    const presRaw = await listarPresentaciones(producto.id);
    const presentaciones: Presentacion[] = presRaw.map((p) => ({
      id: p.id!,
      tipo_presentacion: p.tipo_presentacion || "",
      cantidad_equivalente: p.cantidad_equivalente ?? 1,
      precio_venta: p.precio_venta ?? 0,
    }));

    if (presentaciones.length === 0) return;

    ReactSwal.fire({
      title: <p>Selecciona la presentación</p>,
      html: (
        <div>
          {presentaciones.map((p) => {
            const precioFinal = variante ? variante.precio_venta * p.cantidad_equivalente : p.precio_venta ?? 0;

            return (
              <button
                key={p.id}
                className="w-full p-2 mb-2 border rounded cursor-pointer"
                onClick={() => {
                  ReactSwal.close();
                  onSelect({
                    producto_id: producto.id,
                    variante_id: variante ? variante.id : null,
                    presentacion_id: p.id,
                    descripcion: variante
                      ? `${variante.descripcion} - ${p.tipo_presentacion}`
                      : `${p.tipo_presentacion}`,
                    precio_unitario: precioFinal,
                    presentacion_nombre: p.tipo_presentacion,
                  });
                }}
              >
                <div className="flex justify-between">
                  <span>{p.tipo_presentacion}</span>
                  <strong>${precioFinal.toLocaleString()}</strong>
                </div>
              </button>
            );
          })}
        </div>
      ),
      showConfirmButton: false,
      width: 800,
    });
  };

  const filteredProducts = query
    ? productos.filter(
        (p) =>
          p.nombre.toLowerCase().includes(query.toLowerCase()) ||
          p.codigo.toLowerCase().includes(query.toLowerCase())
      )
    : productos;

  return (
    <div className="space-y-2 relative">
      <Input
        placeholder={placeholder || "Buscar producto"}
        value={productoSeleccionado?.nombre || query}
        onChange={(e) => {
          setQuery(e.target.value);
          setProductoSeleccionado(null);
        }}
        className="w-full border rounded p-2"
      />

      {query && !productoSeleccionado && (
        <ul className="border max-h-60 overflow-y-auto bg-white shadow absolute z-50 w-full">
          {filteredProducts.map((p, i) => (
            <li
              key={p.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={async () => {
                setProductoSeleccionado(p);
                setQuery("");

                try {
                  const variantesRaw = await listarVariantes(p.id);
                  const variantes: Variante[] = variantesRaw.map((v) => ({
                    id: v.id!,
                    descripcion: v.descripcion,
                    precio_venta: v.precio_venta ?? 0,
                  }));

                  if (variantes.length > 0) {
                    abrirModalVariantes(p, variantes);
                  } else {
                    const presRaw = await listarPresentaciones(p.id);
                    const presentaciones: Presentacion[] = presRaw.map((pr) => ({
                      id: pr.id!,
                      tipo_presentacion: pr.tipo_presentacion || "",
                      cantidad_equivalente: pr.cantidad_equivalente ?? 1,
                      precio_venta: pr.precio_venta ?? 0,
                    }));

                    if (presentaciones.length === 1) {
                      const pres = presentaciones[0];
                      onSelect({
                        producto_id: p.id,
                        variante_id: null,
                        presentacion_id: pres.id,
                        descripcion: `${pres.tipo_presentacion}`, // solo presentación
                        precio_unitario: pres.precio_venta ?? 0,
                        presentacion_nombre: pres.tipo_presentacion,
                      });
                    } else if (presentaciones.length > 1) {
                      abrirModalPresentaciones(p, null);
                    }
                  }
                } catch (error) {
                  console.error("Error consultando variantes o presentaciones:", error);
                  abrirModalPresentaciones(p, null);
                }
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
