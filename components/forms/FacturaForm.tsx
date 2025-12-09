"use client"
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { FacturaForm, FacturaDetalleForm } from "@/app/types/factura";

const formasPago = ["EFECTIVO", "TARJETA", "TRANSFERENCIA"];

const FacturaFormComponent: React.FC = () => {
  const [formData, setFormData] = useState<FacturaForm>({
    tercero_id: 0,
    resolucion_id: 0,
    prefijo: "",
    consecutivo: 1,
    forma_pago: "EFECTIVO",
    medio_pago: "",
    notas: "",
    detalles: [
      {
        producto_id: 0,
        presentacion_id: 0,
        descripcion: "",
        cantidad: 1,
        precio_unitario: 0,
        descuento: 0,
        iva: 0,
        subtotal: 0,
        total: 0,
      },
    ],
  });

  const [totales, setTotales] = useState({
    subtotal: 0,
    descuento_total: 0,
    iva_total: 0,
    total: 0,
  });

  // ------------------------
  // Manejar cambios de inputs generales
  // ------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tercero_id" || name === "resolucion_id" ? Number(value) : value,
    }));
  };

  // ------------------------
  // Manejar cambios de detalle
  // ------------------------
 const handleDetalleChange = (index: number, field: keyof FacturaDetalleForm, value: number | string) => {
  setFormData((prev) => ({
    ...prev,
    detalles: prev.detalles.map((det, i) =>
      i === index
        ? {
            ...det,
            [field]: value,
            subtotal: field === "cantidad" || field === "precio_unitario" ? Number(det.cantidad) * Number(det.precio_unitario) : det.subtotal,
            total: field === "cantidad" || field === "precio_unitario" || field === "descuento" || field === "iva"
              ? Number(det.cantidad) * Number(det.precio_unitario) + (Number(det.cantidad) * Number(det.precio_unitario) * Number(det.iva) / 100) - Number(det.descuento)
              : det.total,
          }
        : det
    ),
  }));
};


  // ------------------------
  // Agregar fila de producto
  // ------------------------
  const agregarDetalle = () => {
    setFormData((prev) => ({
      ...prev,
      detalles: [
        ...prev.detalles,
        { producto_id: 0, presentacion_id: 0, descripcion: "", cantidad: 1, precio_unitario: 0, descuento: 0, iva: 0, subtotal: 0, total: 0 },
      ],
    }));
  };

  // ------------------------
  // Eliminar fila de producto
  // ------------------------
  const eliminarDetalle = (index: number) => {
    const nuevosDetalles = formData.detalles.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, detalles: nuevosDetalles }));
  };

  // ------------------------
  // Calcular totales de la factura
  // ------------------------
  useEffect(() => {
    let subtotal = 0;
    let descuento_total = 0;
    let iva_total = 0;
    let total = 0;

    formData.detalles.forEach((d) => {
      subtotal += d.subtotal;
      descuento_total += d.descuento;
      iva_total += (d.subtotal * d.iva) / 100;
      total += d.total;
    });

    setTotales({ subtotal, descuento_total, iva_total, total });
  }, [formData.detalles]);

  // ------------------------
  // Submit al backend
  // ------------------------
  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        subtotal: totales.subtotal,
        descuento_total: totales.descuento_total,
        iva_total: totales.iva_total,
        total: totales.total,
      };

      const res = await fetch("/api/facturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al crear factura");

      const data = await res.json();
      alert(`Factura ${data.numero_completo} creada con éxito`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Crear Factura</h2>

      {/* Información de la factura */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="font-semibold">Cliente</label>
          <select name="tercero_id" value={formData.tercero_id} onChange={handleChange} className="w-full border rounded p-2">
            <option value={0}>Seleccione cliente</option>
            {/* Aquí irían las opciones dinámicas */}
          </select>
        </div>
        <div>
          <label className="font-semibold">Resolución DIAN</label>
          <select name="resolucion_id" value={formData.resolucion_id} onChange={handleChange} className="w-full border rounded p-2">
            <option value={0}>Seleccione resolución</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Prefijo</label>
          <Input name="prefijo" value={formData.prefijo} onChange={handleChange} className="w-full" />
        </div>
        <div>
          <label className="font-semibold">Consecutivo</label>
          <Input type="number" name="consecutivo" value={formData.consecutivo} onChange={handleChange} className="w-full" />
        </div>
        <div>
          <label className="font-semibold">Forma de Pago</label>
          <select name="forma_pago" value={formData.forma_pago} onChange={handleChange} className="w-full border rounded p-2">
            {formasPago.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="font-semibold">Medio de Pago</label>
          <Input name="medio_pago" value={formData.medio_pago} onChange={handleChange} className="w-full" />
        </div>
        <div className="col-span-2">
          <label className="font-semibold">Notas</label>
          <textarea name="notas" value={formData.notas} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
      </div>

      {/* Tabla de detalles */}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Producto</th>
              <th className="border p-2">Presentación</th>
              <th className="border p-2">Descripción</th>
              <th className="border p-2">Cantidad</th>
              <th className="border p-2">Precio Unitario</th>
              <th className="border p-2">Descuento</th>
              <th className="border p-2">IVA (%)</th>
              <th className="border p-2">Subtotal</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {formData.detalles.map((det, i) => (
              <tr key={i}>
                <td><Input type="number" value={det.producto_id} onChange={(e) => handleDetalleChange(i, "producto_id", Number(e.target.value))} /></td>
                <td><Input type="number" value={det.presentacion_id} onChange={(e) => handleDetalleChange(i, "presentacion_id", Number(e.target.value))} /></td>
                <td><Input value={det.descripcion} onChange={(e) => handleDetalleChange(i, "descripcion", e.target.value)} /></td>
                <td><Input type="number" value={det.cantidad} onChange={(e) => handleDetalleChange(i, "cantidad", Number(e.target.value))} /></td>
                <td><Input type="number" value={det.precio_unitario} onChange={(e) => handleDetalleChange(i, "precio_unitario", Number(e.target.value))} /></td>
                <td><Input type="number" value={det.descuento} onChange={(e) => handleDetalleChange(i, "descuento", Number(e.target.value))} /></td>
                <td><Input type="number" value={det.iva} onChange={(e) => handleDetalleChange(i, "iva", Number(e.target.value))} /></td>
                <td className="text-right p-2">{det.subtotal.toFixed(2)}</td>
                <td className="text-right p-2">{det.total.toFixed(2)}</td>
                <td className="p-2"><Button onClick={() => eliminarDetalle(i)}>Eliminar</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button className="mt-2" onClick={agregarDetalle}>Agregar Producto</Button>
      </div>

      {/* Totales */}
      <div className="text-right mb-4 space-y-1">
        <div>Subtotal: {totales.subtotal.toFixed(2)}</div>
        <div>Descuento: {totales.descuento_total.toFixed(2)}</div>
        <div>IVA: {totales.iva_total.toFixed(2)}</div>
        <div className="font-bold">Total: {totales.total.toFixed(2)}</div>
      </div>

      <Button onClick={handleSubmit} className="w-full">Guardar Factura</Button>
    </div>
  );
};

export default FacturaFormComponent;
