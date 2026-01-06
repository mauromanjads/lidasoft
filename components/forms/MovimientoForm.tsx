"use client";

import { useState } from "react";

export default function MovimientoInventarioForm() {
  const [form, setForm] = useState({
    tipo_movimiento: "ENTRADA",
    producto_id: "",
    presentacion_id: "",
    variante_id: "",
    cantidad: 1,
    observacion: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (form.cantidad <= 0) {
      alert("La cantidad debe ser mayor a cero");
      return;
    }

    await fetch("/api/inventario/movimiento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        variante_id: form.variante_id || null,
      }),
    });

    alert("Movimiento registrado");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

      {/* Tipo */}
      <select
        name="tipo_movimiento"
        value={form.tipo_movimiento}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="ENTRADA">Entrada</option>
        <option value="SALIDA">Salida</option>
      </select>

      {/* Producto */}
      <input
        name="producto_id"
        placeholder="Producto ID"
        value={form.producto_id}
        onChange={handleChange}
        className="w-full border p-2"
      />

      {/* Presentación */}
      <input
        name="presentacion_id"
        placeholder="Presentación ID"
        value={form.presentacion_id}
        onChange={handleChange}
        className="w-full border p-2"
      />

      {/* Variante */}
      <input
        name="variante_id"
        placeholder="Variante (opcional)"
        value={form.variante_id}
        onChange={handleChange}
        className="w-full border p-2"
      />

      {/* Cantidad */}
      <input
        type="number"
        name="cantidad"
        min={1}
        value={form.cantidad}
        onChange={handleChange}
        className="w-full border p-2"
      />

      {/* Observación */}
      <textarea
        name="observacion"
        placeholder="Observación"
        value={form.observacion}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar movimiento
      </button>
    </form>
  );
}
