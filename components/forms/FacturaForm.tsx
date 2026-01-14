"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import Buttonsec from "@/components/ui/buttonsec";
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
import { generarXMLFactura } from "@/app/services/xmlservice";
import { generarFactura } from "@/app/services/imprimirservice";
import { obtenerConfiguracionImpresion } from "@/lib/api/configuracionimpresion";

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
       
      
        if (!formData.id) {

           if (!formData.fecha) {
              const hoy = new Date().toLocaleDateString("en-CA");
              setFormData(prev => ({ ...prev, fecha: hoy }));
            }
           //AQUI VA LA CARGA DE LA RESOLUCION INICIAL 
            cargarResolucionPorTipo (undefined,"1");
          }
      
      }
  
      loadData();
    }, []);

const cargarResolucionPorTipo = async (tipoDocumento?: string,predeterminado?: string) => {
  const res = await obtenerResolucionesPorTipo(tipoDocumento,predeterminado);

  if (res?.length > 0) {
    const r = res[0];

    const next = (r.rango_actual ?? 0) + 1;

    // 🚨 Validación de rango DIAN
    if (next > r.rango_final) {

       Swal.fire({
              title: "Oops...!",
              icon: "error",
              text: "Se agotó la numeración autorizada por la DIAN",        
              confirmButtonText: "Entendido",
              timer: 4000,
              timerProgressBar: true,
            });    
     
      return;
    }

    // ✔ Actualiza prefijo y consecutivo
    setFormData(prev => ({
      ...prev,
      prefijo: r.prefijo,
      consecutivo: next,
      resolucion_id: r.id,
      tipo_documento: r.tipo_documento
    }));
  }else{
      Swal.fire({
            title: "Oops...!",
            icon: "error",
            text: "No existe una resolución DIAN para el tipo de documento seleccionado",        
            confirmButtonText: "Entendido",
            timer: 4000,
            timerProgressBar: true,
          });

  }
};

  const [formData, setFormData] = useState<FacturaForm>({
    id:null,
    tipo_documento: "FE",
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
              
            //CREACION DE FACTURA
              const facturaCreada = await crearFactura(payload);

              const result = await Swal.fire({
              title: "Factura creada",
              text: "¿Desea descargar el XML?",
              icon: "question",
              showCancelButton: true,
              confirmButtonText: "Sí, descargar",
              cancelButtonText: "No",
            });
            
            //XML DE FACTURA
            if (result.isConfirmed) {
              await generarXMLFactura(
                facturaCreada.id,
                facturaCreada.numero_completo
              );
            }             
            
            // 🖨️ IMPRESIÓN SEGÚN CONFIGURACIÓN
            const configImpresion = await obtenerConfiguracionImpresion();
            const imprimirPos = configImpresion?.pos ?? false;
            const imprimirCarta = configImpresion?.carta ?? false;


            if (!imprimirPos && !imprimirCarta) {
              // ❌ No imprimir
            } 
            else if (imprimirPos && imprimirCarta) {

              // 🟡 Preguntar
              const printResult = await Swal.fire({
                title: "Imprimir factura",
                text: "Seleccione el formato de impresión",
                icon: "question",
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: "POS",
                denyButtonText: "Carta (A4)",
                cancelButtonText: "Cancelar",
              });

              if (printResult.isConfirmed) {
                await generarFactura(facturaCreada.id, "pos");
              } 
              else if (printResult.isDenied) {
                await generarFactura(facturaCreada.id, "a4");
              }

            } 
            else if (imprimirPos) {

              // 🟢 Solo POS
              await generarFactura(facturaCreada.id, "pos");

            } 
            else if (imprimirCarta) {

              // 🟢 Solo CARTA
              await generarFactura(facturaCreada.id, "a4");
            }


          }
          
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
      const res = await obtenerResolucionesPorTipo(undefined,"1");

      let prefijo = "";
      let consecutivo = 0;
      let resolucion_id = 0;
      let tipo_documento ="FE";

      if (res?.length > 0) {
        const r = res[0];
        prefijo = r.prefijo;
        consecutivo = (r.rango_actual ?? 0) + 1;
        resolucion_id = r.id;
        tipo_documento = r.tipo_documento;
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
        tipo_documento: tipo_documento,
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

   <form onSubmit={handleSubmit} >

    <h1 className="flex items-center gap-2 text-lg font-semibold pb-2">
      🛍️ Factura de venta
    </h1>
    
   <div>
      {/* Información general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

        {/* Columna 1: Cliente */}
        <div>
          
          <SelectSearch
            label="Cliente"
            items={clientes}
            value={clienteId}
            onChange={(value) => {
              setClienteId(value);
              setFormData(prev => ({ ...prev, tercero_id: Number(value) }));
            }}
           
          />

          {clienteId && (() => {
            const c = clientes.find(x => x.id === clienteId);
            if (!c) return null;

            return (
             <div className="p-3 border border-blue-200 rounded bg-blue-50">
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
        <div>
          <div>            
            <SelectSearch
            label="Vendedor"
            items={vendedores}
            value={vendedorId}
            onChange={(value) => {
              setVendedorId(value);
              setFormData(prev => ({ ...prev, vendedor_id: value }));
            }}
           
          />
          </div>

          <div className="pt-3">            
            <Input
              label="Fecha"
              type="date"
              name="fecha"
              value={formData.fecha || ""}
              onChange={handleChange}              
            />
          </div>
          
          <div>
            
            <select
                value={formData.tipo_documento}
                onChange={(e) => {
                  const tipo = e.target.value;

                  setFormData(prev => ({
                    ...prev,
                    tipo_documento: tipo
                  }));

                  cargarResolucionPorTipo(tipo);
                }}
                className="w-full border rounded-md p-2 border-gray-400"
              >
                <option value="FE">Factura Electrónica</option>
                <option value="DE">Documento Equivalente</option>
              </select>

          </div>
         
        </div>

        {/* Columna 3: Pagos y Consecutivo */}
        <div className="space-y-2">
          <div><SelectFormasPago formData={formData} handleChange={handleChange} /> </div>

          <div> <SelectMedioPago formData ={formData} handleChange={handleChange} /> </div>
          
         <div>            
            <div className="grid grid-cols-2 gap-2">
             
              <Input
                name="prefijo"
                value={formData.prefijo}
                readOnly
                required
                placeholder="Prefijo"
                className="border rounded p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              />

              <Input
                type="number"
                name="consecutivo"
                value={formData.consecutivo}
                readOnly
                placeholder="Consecutivo"
                className="border rounded p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
          </div>


        </div>

       {/* Columna 4: Notas */}
        <div className="flex flex-col max-h-[200px]">
          <label className="block mb-1 font-medium">Observaciones</label>
          <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              placeholder="Escribe observaciones o comentarios..."
              className=" w-full 
                  rounded-md border border-gray-400
                  px-3 py-2
                  text-sm text-gray-800
                  placeholder-gray-400
                  shadow-sm
                  h-full"
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

     <div className="flex justify-between items-center mb-4 pt-6">
        <Buttonsec type="button" onClick={agregarDetalle}>
          <div className="flex items-center gap-2">
            <img src="/icons/plus.png" alt="Agregar" className="w-6 h-6" />
            <span>Agregar Producto</span>
          </div>
        </Buttonsec>

        <Button type="button">
          <div className="flex items-center gap-2">
            <img src="/icons/plus.png" alt="Guardar" className="w-6 h-6" />
            <span>Guardar Factura</span>
          </div>
        </Button>
      </div>


      {/* Totales */}
      <div className="text-right space-y-1 mb-4">
        <div>Subtotal: {formatCOP(totales.subtotal)}</div>
        <div>Descuento: {formatCOP(totales.descuento_total)}</div>
        <div>IVA: {formatCOP(totales.iva_total)}</div>
        <div className="font-bold">Total: {formatCOP(totales.total)}</div>
      </div>

      
    </div>
   </form>
  );
};

export default FacturaFormComponent;
