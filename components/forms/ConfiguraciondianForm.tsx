"use client";

import { useState } from "react";
import { useEffect,useRef} from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Swal from "sweetalert2";


import { actualizarConfiguracionDian} from "@/lib/api/configuracionesdian";
import { usePathname } from "next/navigation";

interface ConfiguraciondianFormProps {
  configuraciondian?: {
    id: number;
    nit_emisor: string;
    nombre_emisor: string;
    software_id: string;
    pin_software: string;
    ambiente: string;
    certificado_firma: string
    clave_certificado: string
    activo: number
    regimen: string
    token: string
  };
  onSubmit: (data: {    
    nit_emisor: string;
    nombre_emisor: string;
    software_id: string;
    pin_software: string;
    ambiente: string;
    certificado_firma: string
    clave_certificado: string
    activo: number
    regimen: string
    token: string
   
  }) => Promise<void>;
  onClose?: () => void;
  onSaved?: () => void;  
}

export default function ConfiguraciondianaForm({configuraciondian, onClose,onSaved }: ConfiguraciondianFormProps) {  
  
  const [formData, setFormData] = useState( configuraciondian || { 
  
    nit_emisor: "",
    nombre_emisor: "",
    software_id: "",
    pin_software:"",
    ambiente:"",
    certificado_firma:"",
    clave_certificado:"",
    activo: 1 ,
    regimen: "" ,
    token: "" ,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  
  const REGIMENES = [
  "Régimen común",
  "Régimen simplificado",
  "Gran contribuyente",
  "Responsable de IVA",
  "Otros",
  ];
 
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
       if (configuraciondian) {
          await actualizarConfiguracionDian(configuraciondian.id, formData); // EDITAR
        }
      
      if (onClose) onClose();  
      if (onSaved) onSaved();
      
      const mensaje = configuraciondian ? "Configuración actualizada" : "NA"

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

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const handleToggle = (index: number) => {
  setOpenIndex(openIndex === index ? null : index); 
  }

  return (
   
   <form onSubmit={handleSubmit} className="space-y-4 ">
  {/* 🧑 DATOS PERSONALES */}
  
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
  
         <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Nombre Emisor
          </label>
          <Input
            name="nombre_emisor"
            value={formData.nombre_emisor || ""}
            onChange={handleChange}
            placeholder="Nombre del Emisor"
            className="w-full"
            required
          />
        </div>

       <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Régimen
          </label>
          <select
            name="regimen"
            value={formData.regimen}
            onChange={e =>
              setFormData(prev => ({ ...prev, regimen: e.target.value }))
            }
            className="w-full border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Seleccione un régimen</option>
            {REGIMENES.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>


       <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            NIT Emisor
          </label>
          <Input
            name="nit_emisor"
            value={formData.nit_emisor || ""}
            onChange={handleChange}
            placeholder="NIT del Emisor"
            className="w-full"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Software ID
          </label>
          <Input
            name="software_id"
            value={formData.software_id || ""}
            onChange={handleChange}
            placeholder="Software ID"
            className="w-full"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            PIN del Software
          </label>
          <Input
            name="pin_software"
            value={formData.pin_software || ""}
            onChange={handleChange}
            placeholder="PIN del Software"
            className="w-full"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Ambiente
          </label>
          <Input
            name="ambiente"
            value={formData.ambiente || ""}
            onChange={handleChange}
            placeholder="Producción / Pruebas"
            className="w-full"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Certificado de Firma
          </label>
          <Input
            name="certificado_firma"
            value={formData.certificado_firma || ""}
            onChange={handleChange}
            placeholder="Ruta o nombre del certificado"
            className="w-full"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Clave del Certificado
          </label>
          <Input
            name="clave_certificado"
            value={formData.clave_certificado || ""}
            onChange={handleChange}
            placeholder="Clave del Certificado"
            className="w-full"
            required
          />
        </div>
        
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Token
          </label>
          <Input
            name="token"
            value={formData.token || ""}
            onChange={handleChange}
            placeholder="token de autenticación"
            className="w-full"
            required
          />
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
      {loading ? (configuraciondian ? "Actualizando..." : "Guardando...") : (configuraciondian ? "💾 Actualizar" : "💾 Guardar")}
    </Button>
  </div>
   </form>

  );
}
