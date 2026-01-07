"use client";

import { useState } from "react";
 
import { MovimientoaData,actualizarInventario } from "@/lib/api/movimientos";

export default function MovimientoInventarioForm() {
  const [form, setForm] = useState({   
    producto_id: 0,
    presentacion_id: 0,
    variante_id: null,
    cantidad: 1,
    tipo_movimiento:"",
    documento_tipo: "",
    documento_id: 0,  
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

    try{
        const movimiento: MovimientoaData = {
          producto_id: form.producto_id,
          presentacion_id: form.presentacion_id,
          variante_id: form.variante_id ,
          cantidad: form.cantidad,
          tipo_movimiento: form.tipo_movimiento, // ej: "ENTRADA" o "SALIDA"
          documento_tipo: form.documento_tipo,   // ej: "FACTURA"
          documento_id: form.documento_id,          
        };
      
      
        // Llamamos a la API
        const respuesta = await actualizarInventario(movimiento);      
        return respuesta

      } catch (error: any) {
        console.error("Error creando movimiento:", error.message);
        alert("Ocurrió un error al crear el movimiento: " + error.message);
      }
  

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

      {/* Tipo Movimiento*/}
      <select
        name="tipo_movimiento"
        value={form.tipo_movimiento}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="">Seleccione tipo de movimiento</option>
        <option value="ENTRADA">Entrada</option>
        <option value="SALIDA">Salida</option>
      </select>


       {/* Documento tipoo*/}
      <select
        name="documento_tipo"
        value={form.documento_tipo}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="">Seleccione tipo de documento</option>
        <option value="COMPRA">Compra</option>
        <option value="AJUSTE">Ajuste</option>
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
        value={form.variante_id ??"" }
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

     
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar movimiento
      </button>
    </form>
  );
}
