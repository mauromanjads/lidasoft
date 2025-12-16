"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import SelectSearch from "@/components/ui/selectSearch";
import { FacturaForm, FacturaDetalleForm } from "@/app/types/factura";
import { Terceros,obtenerTerceros } from "@/lib/api/terceros";
import { obtenerResolucionesPorTipo } from "@/lib/api/resolucionesdian";
import SelectFormasPago from "@/components/ui/selects/FormasPagoSelect";
import SelectMedioPago from "@/components/ui/selects/MediosPagoSelect";
import { FaIdCard, FaMapMarkerAlt, FaPhone, FaMobileAlt, FaEnvelope } from "react-icons/fa";
import { actualizarFactura, crearFactura } from "@/lib/api/facturas";
import DetalleVentaGrid from "@/components/ui/detalleVentaGrid";
import Swal from "sweetalert2";

interface FacturaFormProps {
  factura?: FacturaForm | null;
  onSubmit?: (data: any) => Promise<void> | void;
  onSaved?: () => void;
  onClose?: () => void;
}

export const formatCOP = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);

const FacturaFormComponent: React.FC<FacturaFormProps> = ({ factura }) => {
  
  const [clientes, setClientes] = useState<Terceros[]>([]);
  const [clienteId, setClienteId] = useState<number | null>(null);

  const [vendedores, setVendedores] = useState<Terceros[]>([]);
  const [vendedorId, setVendedorId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      async function loadData() {
        const cl = await obtenerTerceros("clientes");
        const vend = await obtenerTerceros("vendedores");

        // Buscar el cliente "CONSUMIDOR FINAL"
        const consumidorFinal = cl?.find(c => c.nombre === "CONSUMIDOR FINAL");

        setClientes(cl ?? []); // si cl es null, usamos un array vacío
         
        // Si existe "CONSUMIDOR FINAL", se selecciona; si no, el primero
        const idcliente = consumidorFinal?.id ?? cl?.[0]?.id ?? null
        setClienteId(idcliente);        
        setFormData(prev => ({ ...prev, tercero_id: Number(idcliente) }));

        const idvend = vend?.[0]?.id ?? null
        setVendedores(vend ?? []);  
        setVendedorId(idvend);        
        setFormData(prev => ({ ...prev, vendedor_id: Number(idvend) }));
        
        // ---------------------------------------
        // 🚀 TRAER PREFIJO RESOLUCIÓN SI ES NUEVO REGISTRO
        // ---------------------------------------
        if (!formData.id) {

           if (!formData.fecha) {
              const hoy = new Date().toLocaleDateString("en-CA");
              setFormData(prev => ({ ...prev, fecha: hoy }));
            }

            const res = await obtenerResolucionesPorTipo("FV");

            if (res?.length > 0) {
              const r = res[0];

              const next = (r.rango_actual ?? 0) + 1;

              // 🚨 Validación de rango DIAN
              if (next > r.rango_final) {
                alert("Se agotó la numeración autorizada por la DIAN");
                return; // <-- Detiene el proceso
              }

              // ✔ Actualiza prefijo y consecutivo
              setFormData(prev => ({
                ...prev,
                prefijo: r.prefijo,
                consecutivo: next,
                resolucion_id: r.id
              }));
            }
          }

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
    id:null,
    tercero_id: 0,
    vendedor_id:0,
    resolucion_id: 0,
    prefijo: "",
    consecutivo: 1,
    forma_pago_id: 0,
    medio_pago_id: 0,
    notas: "",
    fecha: "",
    detalles: [
      {
        producto_id: 0,
        presentacion_id: 0,
        variante_id: 0,
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
        name === "forma_pago_id" ||
        name === "medio_pago_id" ||
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
    value: number | string | null
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
          variante_id:0,
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     if (!e.currentTarget.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      e.preventDefault();    

      try {      
        
          const payload = {
            ...formData,
            forma_pago_id: formData.forma_pago_id ?? 0,
            medio_pago_id: formData.medio_pago_id ?? 0,
            subtotal:0,
            descuento_total:0,
            iva_total:0,
            total:0,
            detalles: formData.detalles.map(d => ({
              producto_id: d.producto_id,
              presentacion_id: d.presentacion_id,
              variante_id: d.variante_id || null,
              descripcion: d.descripcion,
              cantidad: d.cantidad,
              precio_unitario: d.precio_unitario,
              descuento: d.descuento,
              iva: d.iva,              
              subtotal : 0,
              total:0
            }))
          };

         if (factura?.id) {
            await actualizarFactura(factura.id, payload); // EDITAR
          } else {
            await crearFactura(payload); // CREAR
          }

          const mensaje =factura
          ? "Factura actualizada"
          : "Factura creada correctamente";
           Swal.fire({
                title: "¡Listo!",
                text: mensaje,
                icon: "success",
                confirmButtonText: "Aceptar",
                timer: 4000,
                timerProgressBar: true,
              });
          
          if (!factura?.id) {
            await resetFormulario();
          }
        
       
      } catch (err:any) {
        console.error(err);
        const mensajeError =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          err.message ||
          "Error desconocido";
    
           Swal.fire({
              title: "Oops...!",
              icon: "error",
              text: err?.response?.data?.detail || err?.message || 'Error desconocido',              
              confirmButtonText: "Entendido",
              timer: 4000,
              timerProgressBar: true,
            });
            
        
         setError(mensajeError);
      } finally {
        setLoading(false);
      }
    };

   const resetFormulario = async () => {

      // 👉 Cliente por defecto (Consumidor Final si existe)
      const consumidorFinal = clientes.find(c => c.nombre === "CONSUMIDOR FINAL");
      const idcliente = consumidorFinal?.id ?? clientes?.[0]?.id ?? null;

      setClienteId(idcliente);
      setVendedorId(vendedores?.[0]?.id ?? null);

      const hoy = new Date().toLocaleDateString("en-CA");

      // 🔁 Volver a pedir resolución para mostrar el próximo consecutivo
      const res = await obtenerResolucionesPorTipo("FV");

      let prefijo = "";
      let consecutivo = 0;
      let resolucion_id = 0;

      if (res?.length > 0) {
        const r = res[0];
        prefijo = r.prefijo;
        consecutivo = (r.rango_actual ?? 0) + 1;
        resolucion_id = r.id;
      }

      setFormData({
        id: null,
        tercero_id: Number(idcliente),
        vendedor_id: vendedores?.[0]?.id ?? 0,
        resolucion_id,
        prefijo,
        consecutivo,
        forma_pago_id: 0,
        medio_pago_id: 0,
        notas: "",
        fecha: hoy,
        detalles: [
          {
            producto_id: null,
            presentacion_id:null,
            variante_id: null,
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

      // Totales en cero
      setTotales({
        subtotal: 0,
        descuento_total: 0,
        iva_total: 0,
        total: 0,
      });
    };



  // ------------------------
  // Render
  // ------------------------
  return (

   <form onSubmit={handleSubmit} className="space-y-4 ">

    <div className="max-w-7xl mx-auto p-1 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Factura de Venta</h2>
  
      {/* Información general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        {/* Columna 1: Cliente */}
        <div className="space-y-2">
          <label className="font-semibold block">Cliente</label>
          <SelectSearch
            items={clientes}
            value={clienteId}
            onChange={(value) => {
              setClienteId(value);
              setFormData(prev => ({ ...prev, tercero_id: Number(value) }));
            }}
            className="w-full border rounded p-2"
          />

          {clienteId && (() => {
            const c = clientes.find(x => x.id === clienteId);
            if (!c) return null;

            return (
              <div className="p-2 border rounded bg-gray-50 text-sm space-y-1">
                <div className="flex items-center gap-2"><FaIdCard className="text-gray-500" /> <span><b>Documento:</b> {c.documento}</span></div>
                <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-500" /> <span><b>Dirección:</b> {c.direccion || "---"}</span></div>
                <div className="flex items-center gap-2"><FaPhone className="text-gray-500" /> <span><b>Teléfono:</b> {c.telefono || "---"}</span></div>
                <div className="flex items-center gap-2"><FaMobileAlt className="text-gray-500" /> <span><b>Celular:</b> {c.celular || "---"}</span></div>
                <div className="flex items-center gap-2"><FaEnvelope className="text-gray-500" /> <span><b>Correo:</b> {c.correo || "---"}</span></div>
              </div>
            );
          })()}
        </div>

        {/* Columna 2: Vendedor / Fecha / Prefijo */}
        <div className="space-y-2">
          <div>
            <label className="font-semibold block">Vendedor</label>
            <SelectSearch
            items={vendedores}
            value={vendedorId}
            onChange={(value) => {
              setVendedorId(value);
              setFormData(prev => ({ ...prev, vendedor_id: value }));
            }}
            className="w-full border rounded p-2"
          />
          </div>

          <div>
            <label className="font-semibold block">Fecha</label>
            <Input
              type="date"
              name="fecha"
              value={formData.fecha || ""}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="font-semibold block">Prefijo</label>
            <Input
              name="prefijo"
              value={formData.prefijo}
              readOnly
              required
              className="w-full border rounded p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Columna 3: Pagos y Consecutivo */}
        <div className="space-y-2">
          <div><SelectFormasPago formData={formData} handleChange={handleChange} /> </div>

          <div> <SelectMedioPago formData ={formData} handleChange={handleChange} /> </div>

          <div>
            <label className="font-semibold block">Consecutivo</label>
            <Input
              type="number"
              name="consecutivo"
              value={formData.consecutivo}
              readOnly
              className="w-full border rounded p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Columna 4: Notas */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1 block">Notas</label>
          <textarea
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            className="w-full border rounded p-2 flex-1 min-h-[140px]"
          />
        </div>

      </div>
      {/* Tabla de detalles */}
        <div className="flex-1 overflow-y-auto max-h-[400px] border rounded-xl">

          <DetalleVentaGrid
            detalles={formData.detalles}
            onChange={(i, field, value) =>
              handleDetalleChange(i, field, value)
            }
            onDelete={(i) => eliminarDetalle(i)}            
          />

       </div>

      <Button
        type="button"
        onClick={agregarDetalle} className="mb-4"
      >
        Agregar Producto
      </Button>

      {/* Totales */}
      <div className="text-right space-y-1 mb-4">
        <div>Subtotal: {formatCOP(totales.subtotal)}</div>
        <div>Descuento: {formatCOP(totales.descuento_total)}</div>
        <div>IVA: {formatCOP(totales.iva_total)}</div>
        <div className="font-bold">Total: {formatCOP(totales.total)}</div>
      </div>

     <Button type="submit" className="w-full">
        Guardar Factura
      </Button>
    </div>
   </form>
  );
};

export default FacturaFormComponent;
