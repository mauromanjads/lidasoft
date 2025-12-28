"use client";

import { useState } from "react";
import { useEffect,useRef} from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Swal from "sweetalert2";
import { obtenerSucursalesActivas } from "@/lib/api/sucursales";

import { guardarResolucionDian,actualizarResolucionDian,ResolucionDianData} from "@/lib/api/resolucionesdian";
import { usePathname } from "next/navigation";

interface Sucursal {
  id: number;
  nombre: string;
}

interface ResoluciondianFormProps {
  resoluciondian?: {
  id: number;
  numero_resolucion: string;
  prefijo: string;   
  rango_inicial: number;
  rango_final: number;
  rango_actual: number;
  fecha_resolucion: Date;
  fecha_inicio: Date;
  fecha_fin: Date;
  llave_tecnica: string
  tipo_documento: string;
  activo: number;
  id_sucursal: number;
  predeterminado: number;
  };
  onSubmit: (data: {    
    numero_resolucion: string;
    prefijo: string;   
    rango_inicial: number;
    rango_final: number;
    rango_actual: number;
    fecha_resolucion: Date;
    fecha_inicio: Date;
    fecha_fin: Date;
    llave_tecnica: string
    tipo_documento: string;
    activo: number;
    id_sucursal: number;
    predeterminado: number;
   
  }) => Promise<void>;
  onClose?: () => void;
  onSaved?: () => void;  
}

export default function ResoluciondianForm({resoluciondian, onClose,onSaved }: ResoluciondianFormProps) {  
  
  const [formData, setFormData] = useState( resoluciondian || { 
    
    numero_resolucion: "",
    prefijo: "",   
    rango_inicial: 1,
    rango_final: 1,
    rango_actual: 1,
    fecha_resolucion: "",
    fecha_inicio: "",
    fecha_fin: "",
    llave_tecnica: "",
    tipo_documento: "",
    activo: 1,
    id_sucursal: 1,
    predeterminado:1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
     
  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const target = e.target;  // 👈 guardamos la referencia

      let val: any;

      if (target instanceof HTMLInputElement && target.type === "checkbox") {
        val = target.checked;  // 👌 ya no da error
      } 
      else if (target instanceof HTMLInputElement && target.type === "number") {
        val = target.value === "" ? undefined : Number(target.value);
      } 
      else if (target instanceof HTMLInputElement && target.type === "date") {        
        val = target.value === "" ? null : target.value; 
      }
      else {
        val = target.value; 
      }

      setFormData((prev: any) => ({
        ...prev,
        [target.name]: val,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
       setError(null);
      setLoading(true);     

    try {        

          // Convertir strings a Date
        const payload: ResolucionDianData = {
          ...formData,
          fecha_resolucion: new Date(formData.fecha_resolucion),
          fecha_inicio: new Date(formData.fecha_inicio),
          fecha_fin: new Date(formData.fecha_fin),
        };

       if (resoluciondian) {
          await actualizarResolucionDian(resoluciondian.id, payload); // EDITAR
        } else {
          await guardarResolucionDian(payload); // CREAR
        }
      
      if (onClose) onClose();  
      if (onSaved) onSaved();

      const mensaje = resoluciondian ? "Resolución actualizada" : "Resolución creada correctamente"
      
      Swal.fire({
        title: "¡Listo!",
        text: mensaje,
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 4000,
        timerProgressBar: true,
      });

    } catch (err:any) {
      console.error(err);
      const mensajeError =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Error desconocido";
      setError(mensajeError);

      Swal.fire({
              title: "Oops...!",
              text: mensajeError,
              icon: "error",
              confirmButtonText: "Entendido",
              timer: 4000,
              timerProgressBar: true,
            });
      

    } finally {
      setLoading(false);
    }
  };
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const handleToggle = (index: number) => {
  setOpenIndex(openIndex === index ? null : index); 
  }

  useEffect(() => {
  const cargarSucursales = async () => {
    try {
      const data = await obtenerSucursalesActivas();
      setSucursales(data?? []);
    } catch (error) {
      console.error("Error cargando sucursales", error);
    }
  };

  cargarSucursales();
}, []);

  return (
   
   <form onSubmit={handleSubmit} className="space-y-4 ">
  
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
  
         {/* Número de Resolución */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Número de Resolución
          </label>
          <Input
            name="numero_resolucion"
            value={formData.numero_resolucion || ""}
            onChange={handleChange}
            placeholder="Número de Resolución"
            className="w-full"
            required
          />
        </div>

        {/* Prefijo */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Prefijo
          </label>
          <Input
            name="prefijo"
            value={formData.prefijo || ""}
            onChange={handleChange}
            placeholder="Prefijo"
            className="w-full"
            required
          />
        </div>

        {/* Rango Inicial */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Rango Inicial
          </label>
          <Input
            type="number"
            name="rango_inicial"
            value={formData.rango_inicial || ""}
            onChange={handleChange}
            placeholder="Rango Inicial"
            className="w-full"
            required
          />
        </div>

        {/* Rango Final */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Rango Final
          </label>
          <Input
            type="number"
            name="rango_final"
            value={formData.rango_final || ""}
            onChange={handleChange}
            placeholder="Rango Final"
            className="w-full"
            required
          />
        </div>

        {/* Rango Actual */}
         <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Rango Actual
          </label>
          <Input
            type="number"
            name="rango_actual"
            value={formData.rango_actual || ""}
            onChange={handleChange}
            placeholder="rango_actual Final"
            className="w-full"
            required
            disabled={!!resoluciondian}
          />
        </div>


        {/* Fecha Resolución */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Fecha de Resolución
          </label>
          <Input
            type="date"
            name="fecha_resolucion"
           value={
              formData.fecha_resolucion
                ? (formData.fecha_resolucion instanceof Date
                    ? formData.fecha_resolucion.toISOString().split("T")[0]
                    : formData.fecha_resolucion)
                : ""  }
            onChange={handleChange}
            className="w-full"
            required
          />
        </div>
       
        {/* Fecha Inicio */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Fecha Inicio
          </label>
          <Input
            type="date"
            name="fecha_inicio"
           value={
              formData.fecha_inicio
                ? (formData.fecha_inicio instanceof Date
                    ? formData.fecha_inicio.toISOString().split("T")[0]
                    : formData.fecha_inicio)
                : ""  }
            onChange={handleChange}
            className="w-full"
            required
          />
        </div>

        {/* Fecha Fin */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Fecha Fin
          </label>
          <Input
            type="date"
            name="fecha_fin"
             value={
              formData.fecha_inicio
                ? (formData.fecha_fin instanceof Date
                    ? formData.fecha_fin.toISOString().split("T")[0]
                    : formData.fecha_fin)
                : ""  }
            onChange={handleChange}
            className="w-full"
            required
          />
        </div>

        {/* Llave Técnica */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Llave Técnica
          </label>
          <Input
            name="llave_tecnica"
            value={formData.llave_tecnica || ""}
            onChange={handleChange}
            placeholder="Llave Técnica"
            className="w-full"
            required
          />
        </div>

       
       {/* TipoDocumento */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Tipo de Documento
          </label>

          <select
            name="tipo_documento"
            value={formData.tipo_documento || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccione...</option>
            <option value="FE">Factura Electronica</option>
            <option value="DE">Documento Equivalente</option>           
          </select>
        </div>

        {/* Predeterminado */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Predeterminado
          </label>

          <select
            name="predeterminado"
            value={formData.predeterminado ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccione...</option>
            <option value="1">SI</option>
            <option value="0">NO</option>
          </select>
        </div>


        {/* Sucursal */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Sucursal
          </label>

         <select
            name="id_sucursal"
            value={formData.id_sucursal ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccione...</option>

            {sucursales.map((sucursal) => (
              <option key={sucursal.id} value={sucursal.id}>
                {sucursal.nombre}
              </option>
            ))}
          </select>

        </div>


        {/* Activo */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Activo
          </label>

          <select
            name="activo"
            value={formData.activo ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccione...</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </div>


    </div>

 
  
  {/* ⚠️ ERRORES */}
  {error && <p className="text-red-500">{error}</p>}

  {/* BOTONES */}
  <div className="flex justify-end gap-2">
    <Button type="button" onClick={onClose} disabled={loading}>
      ❌ Cancelar
    </Button>
    <Button type="submit" disabled={loading}>
      {loading ? (resoluciondian ? "Actualizando..." : "Guardando...") : (resoluciondian ? "💾 Actualizar" : "💾 Guardar")}
    </Button>
  </div>
   </form>

  );
}
