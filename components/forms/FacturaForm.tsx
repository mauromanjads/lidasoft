"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import SelectSearch from "@/components/ui/selectSearch";
import { FacturaForm, FacturaDetalleForm } from "@/app/types/factura";
import { Terceros,obtenerTerceros } from "@/lib/api/terceros";

const formasPago = ["EFECTIVO", "TARJETA", "TRANSFERENCIA"];


const FacturaFormComponent: React.FC = () => {
  
  const [clientes, setClientes] = useState<Terceros[]>([]);
  const [clienteId, setClienteId] = useState<number | null>(null);

  useEffect(() => {
      async function loadData() {
        const cl = await obtenerTerceros("clientes");

        // Buscar el cliente "CONSUMIDOR FINAL"
        const consumidorFinal = cl?.find(c => c.nombre === "CONSUMIDOR FINAL");

        setClientes(cl ?? []); // si cl es null, usamos un array vacío
         
        // Si existe "CONSUMIDOR FINAL", se selecciona; si no, el primero
        setClienteId(consumidorFinal?.id ?? cl?.[0]?.id ?? null);
  
        //PARA EL DETALLE
        //setPresentaciones((prev) =>
        //  prev.map((p) => ({
          //  ...p,
          //  unidad_medida_id: u[0]?.id || 0,
         // }))
        //);
      }
  
      loadData();
    }, []);


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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "tercero_id" ||
        name === "resolucion_id" ||
        name === "consecutivo"
          ? Number(value)
          : value,
    }));
  };

  // ------------------------
  // Manejar cambios de detalle
  // ------------------------
  const handleDetalleChange = (
    index: number,
    field: keyof FacturaDetalleForm,
    value: number | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles.map((det, i) => {
        if (i !== index) return det;

        // Valores actualizados
        const cantidad = field === "cantidad" ? Number(value) : det.cantidad;
        const precio_unitario =
          field === "precio_unitario" ? Number(value) : det.precio_unitario;
        const descuento = field === "descuento" ? Number(value) : det.descuento;
        const iva = field === "iva" ? Number(value) : det.iva;

        const subtotal = cantidad * precio_unitario;
        const iva_monto = (subtotal - descuento) * iva / 100;
        const total = subtotal - descuento + iva_monto;

        return {
          ...det,
          [field]: value,
          subtotal,
          total,
        };
      }),
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
    }));
  };

  // ------------------------
  // Eliminar fila de producto
  // ------------------------
  const eliminarDetalle = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index),
    }));
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
      iva_total += (d.subtotal - d.descuento) * d.iva / 100;
      total += d.total;
    });

    setTotales({ subtotal, descuento_total, iva_total, total });
  }, [formData.detalles]);

  // ------------------------
  // Submit al backend
  // ------------------------
  const handleSubmit = async () => {
    try {
      const payload = { ...formData, ...totales };
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

  // ------------------------
  // Render
  // ------------------------
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Factura de Venta</h2>

      {/* Información general */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="font-semibold">Cliente</label>
          <SelectSearch            
            items={clientes}
            value={clienteId}
            onChange={setClienteId}
            className="w-full border rounded p-2"
            />
        </div>
       
        <div className="mt-2 p-2 border rounded bg-gray-50">
          {clienteId && (
            (() => {
              const cliente = clientes.find(c => c.id === clienteId);
              if (!cliente) return null;
              return (
                <div className="flex flex-col gap-1">
                  <div><span className="font-semibold">Documento:</span> {cliente.documento}</div>
                  <div><span className="font-semibold">Dirección:</span> {cliente.direccion || "---"}</div>
                  <div><span className="font-semibold">Teléfono:</span> {cliente.telefono || "---"}</div>
                   <div><span className="font-semibold">Celular:</span> {cliente.celular || "---"}</div>
                   <div><span className="font-semibold">Correo:</span> {cliente.correo || "---"}</div>
                </div>
              );
            })()
          )}
        </div>

        <div>
          <label className="font-semibold">Prefijo</label>
          <Input name="prefijo" value={formData.prefijo} onChange={handleChange} />
        </div>
        <div>
          <label className="font-semibold">Consecutivo</label>
          <Input
            type="number"
            name="consecutivo"
            value={formData.consecutivo}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="font-semibold">Forma de Pago</label>
          <select
            name="forma_pago"
            value={formData.forma_pago}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {formasPago.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold">Medio de Pago</label>
          <Input name="medio_pago" value={formData.medio_pago} onChange={handleChange} />
        </div>
        <div className="col-span-3">
          <label className="font-semibold">Notas</label>
          <textarea
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      {/* Tabla de detalles */}
      <table className="w-full table-fixed border border-gray-300 mb-4">
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
              <td className="border p-1">
                <Input
                  type="number"
                  value={det.producto_id}
                  onChange={(e) =>
                    handleDetalleChange(i, "producto_id", Number(e.target.value))
                  }
                />
              </td>
              <td className="border p-1">
                <Input
                  type="number"
                  value={det.presentacion_id}
                  onChange={(e) =>
                    handleDetalleChange(i, "presentacion_id", Number(e.target.value))
                  }
                />
              </td>
              <td className="border p-1">
                <Input
                  value={det.descripcion}
                  onChange={(e) => handleDetalleChange(i, "descripcion", e.target.value)}
                />
              </td>
              <td className="border p-1">
                <Input
                  type="number"
                  value={det.cantidad}
                  onChange={(e) => handleDetalleChange(i, "cantidad", Number(e.target.value))}
                />
              </td>
              <td className="border p-1">
                <Input
                  type="number"
                  value={det.precio_unitario}
                  onChange={(e) =>
                    handleDetalleChange(i, "precio_unitario", Number(e.target.value))
                  }
                />
              </td>
              <td className="border p-1">
                <Input
                  type="number"
                  value={det.descuento}
                  onChange={(e) => handleDetalleChange(i, "descuento", Number(e.target.value))}
                />
              </td>
              <td className="border p-1">
                <Input
                  type="number"
                  value={det.iva}
                  onChange={(e) => handleDetalleChange(i, "iva", Number(e.target.value))}
                />
              </td>
              <td className="border p-1 text-right">{det.subtotal.toFixed(2)}</td>
              <td className="border p-1 text-right">{det.total.toFixed(2)}</td>
              <td className="border p-1">
                <Button onClick={() => eliminarDetalle(i)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button onClick={agregarDetalle} className="mb-4">
        Agregar Producto
      </Button>

      {/* Totales */}
      <div className="text-right space-y-1 mb-4">
        <div>Subtotal: {totales.subtotal.toFixed(2)}</div>
        <div>Descuento: {totales.descuento_total.toFixed(2)}</div>
        <div>IVA: {totales.iva_total.toFixed(2)}</div>
        <div className="font-bold">Total: {totales.total.toFixed(2)}</div>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Guardar Factura
      </Button>
    </div>
  );
};

export default FacturaFormComponent;
