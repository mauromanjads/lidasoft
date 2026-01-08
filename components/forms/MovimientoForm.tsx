"use client";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import {
  MovimientoaData,
  actualizarInventario,
} from "@/lib/api/movimientos";

import {
  obtenerProductosActivos,
  listarPresentaciones,
  listarVariantes,
} from "@/lib/api/productos";

import {
  Producto,
  ProductoPresentacion,
  ProductoVariante,
} from "@/app/types";

import SelectSearch from "@/components/ui/selectSearch";
import Button from "@/components/ui/button";

/* ===========================
   Tipado fila con ID interno
=========================== */
type MovimientoFila = MovimientoaData & {
  row_id: number;
};

/* ===========================
   Componente
=========================== */
export default function MovimientoInventarioForm() {
  /* ===========================
     Fila base
  =========================== */
  const nuevaFila = (): MovimientoFila => ({
    row_id: Date.now() + Math.random(),
    producto_id: 0,
    presentacion_id: 0,
    variante_id: null,
    cantidad: 1,
    tipo_movimiento: "",
    documento_tipo: "",
    documento_id: 0,
  });

  /* ===========================
     Estados
  =========================== */
  const [movimientos, setMovimientos] = useState<MovimientoFila[]>([
    nuevaFila(),
  ]);

  const [productos, setProductos] = useState<Producto[]>([]);  
  

  const [presentacionesPorFila, setPresentacionesPorFila] = useState<
    Record<number, ProductoPresentacion[]>
  >({});

  const [variantesPorFila, setVariantesPorFila] = useState<
    Record<number, ProductoVariante[]>
  >({});

  /* ===========================
     Cargar productos
  =========================== */
  useEffect(() => {
    obtenerProductosActivos()
      .then(setProductos)
      .catch(console.error);
  }, []);

  /* ===========================
     Helpers
  =========================== */
  const handleChange = (
    rowId: number,
    field: keyof MovimientoaData,
    value: any
  ) => {
    setMovimientos((prev) =>
      prev.map((m) =>
        m.row_id === rowId ? { ...m, [field]: value } : m
      )
    );
  };

  const agregarFila = () => {
    setMovimientos((prev) => [...prev, nuevaFila()]);
  };

  const eliminarFila = (rowId: number) => {
    setMovimientos((prev) => prev.filter((m) => m.row_id !== rowId));

    setPresentacionesPorFila((p) => {
      const copia = { ...p };
      delete copia[rowId];
      return copia;
    });

    setVariantesPorFila((p) => {
      const copia = { ...p };
      delete copia[rowId];
      return copia;
    });
  };

  /* ===========================
     Selects dependientes
  =========================== */
  const onProductoChange = async (rowId: number, productoId: number) => {
    setMovimientos((prev) =>
      prev.map((m) =>
        m.row_id === rowId
          ? {
              ...m,
              producto_id: productoId,
              presentacion_id: 0,
              variante_id: null,
            }
          : m
      )
    );

    setPresentacionesPorFila((p) => ({ ...p, [rowId]: [] }));
    setVariantesPorFila((p) => ({ ...p, [rowId]: [] }));

    if (!productoId) return;

    const [presentaciones, variantes] = await Promise.all([
      listarPresentaciones(productoId),
      listarVariantes(productoId),
    ]);

    setPresentacionesPorFila((p) => ({
      ...p,
      [rowId]: presentaciones,
    }));

    setVariantesPorFila((p) => ({
      ...p,
      [rowId]: variantes,
    }));
  };

  const onPresentacionChange = (rowId: number, presentacionId: number) => {
    handleChange(rowId, "presentacion_id", presentacionId);
  };

  /* ===========================
     Guardar
  =========================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      movimientos.some(
        (m) =>
          !m.producto_id ||
          !m.presentacion_id ||
          m.cantidad <= 0
      )
    ) {      

       Swal.fire({
          title: "Oops...!",
          text: "Hay filas con datos incompletos",
          icon: "error",
          confirmButtonText: "Entendido",
          timer: 4000,
          timerProgressBar: true,
        });


      return;
    }
    const { tipo_movimiento, documento_tipo, documento_id } = movimientos[0];

    const payload = movimientos.map(({ row_id, ...rest }) => ({
      ...rest,
       tipo_movimiento: tipo_movimiento,
       documento_tipo: documento_tipo,
       documento_id: documento_id
    }));


    try {
     const inv = await actualizarInventario(payload);
      
      if (inv === undefined) return;

      setMovimientos([nuevaFila()]);
      setPresentacionesPorFila({});
      setVariantesPorFila({});
    } catch (error: any) {
      console.error(error);
      
      const mensaje = (error.message || "Error al guardar");

      Swal.fire({
          title: "Oops...!",
          text: mensaje,
          icon: "error",
          confirmButtonText: "Entendido",
          timer: 4000,
          timerProgressBar: true,
        });

      

    }

  };

  /* ===========================
     Render
  =========================== */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-3 gap-4 max-w-3xl">
        <select
          value={movimientos[0].tipo_movimiento}
          onChange={(e) =>
            setMovimientos(
              movimientos.map((m) => ({
                ...m,
                tipo_movimiento: e.target.value,
              }))
            )
          }
          className="border p-2"
          required
        >
          <option value="">Tipo movimiento</option>
          <option value="ENTRADA">Entrada</option>
          <option value="SALIDA">Salida</option>
        </select>

        <select
          value={movimientos[0].documento_tipo}
          onChange={(e) =>
            setMovimientos(
              movimientos.map((m) => ({
                ...m,
                documento_tipo: e.target.value,
              }))
            )
          }
          className="border p-2"
          required
        >
          <option value="">Tipo documento</option>
          <option value="COMPRA">Compra</option>
          <option value="AJUSTE">Ajuste</option>
        </select>

        <input
          type="number"
          placeholder="Documento ID"
          value={movimientos[0].documento_id}
          onChange={(e) =>
            setMovimientos(
              movimientos.map((m) => ({
                ...m,
                documento_id: Number(e.target.value),
              }))
            )
          }
          className="border p-2"
        />
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-y-auto max-h-[400px] border rounded-xl">
        <table className="w-full border-collapse">
        <thead className="bg-gradient-to-r from-[#1d4e89] to-blue-800 text-white">
            <tr>
              <th className="border p-2 sticky top-0  bg-[#1d4e89] min-w-[350px]">Producto</th>
              <th className="border p-2 sticky top-0  bg-[#1d4e89]">Presentación</th>
              <th className="border p-2 sticky top-0  bg-[#1d4e89]">Variante</th>
              <th className="border p-2 sticky top-0  bg-[#1d4e89]">Cantidad</th>
              <th className="border p-2 sticky top-0  bg-[#1d4e89]"></th>
            </tr>
          </thead>

          <tbody>
            {movimientos.map((mov) => (
              <tr key={mov.row_id} className="border-t">
                {/* Producto */}
                <td className="p-1">
                  
                  <SelectSearch
                    items={productos
                      .filter((p): p is Producto & { id: number } => p.id !== undefined)
                      .map(p => ({
                        id: p.id,
                        nombre: p.nombre,
                      }))
                    }
                    value={mov.producto_id || null}
                    onChange={(value) => {
                      onProductoChange(mov.row_id, Number(value));
                    }}
                    className="w-full border rounded p-2"
                  />

                  </td>

                {/* Presentación */}
                <td className="p-1">
                  <select
                    value={mov.presentacion_id}
                    onChange={(e) =>
                      onPresentacionChange(
                        mov.row_id,
                        Number(e.target.value)
                      )
                    }
                    className="border p-1 w-full"
                    disabled={!presentacionesPorFila[mov.row_id]}
                  >
                    <option value={0}>Seleccione</option>
                    {(presentacionesPorFila[mov.row_id] || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.tipo_presentacion}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Variante */}
                <td className="p-1">
                  <select
                    value={mov.variante_id ?? ""}
                    onChange={(e) =>
                      handleChange(
                        mov.row_id,
                        "variante_id",
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="border p-1 w-full"
                    disabled={!variantesPorFila[mov.row_id]}
                  >
                    <option value="">Sin variante</option>
                    {(variantesPorFila[mov.row_id] || []).map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.sku}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Cantidad */}
                <td className="p-1">
                  <input
                    type="number"
                    min={1}
                    value={mov.cantidad}
                    onChange={(e) =>
                      handleChange(
                        mov.row_id,
                        "cantidad",
                        Number(e.target.value)
                      )
                    }
                    className="border p-1 w-full"
                  />
                </td>

                <td className="text-center">
                  {movimientos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarFila(mov.row_id)}
                      className="text-red-600 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Acciones */}
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={agregarFila}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          <div className="flex items-center gap-2">
            <img src="/icons/plus.png" alt="Pdf" className="w-6 h-6" />
            <span>Agregar Producto</span>
          </div>
        </Button>

        <Button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          💾 Guardar
        </Button>
      </div>
    </form>
  );
}
