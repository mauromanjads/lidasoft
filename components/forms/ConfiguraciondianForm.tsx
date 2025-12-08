"use client";

import { useState } from "react";
import { useEffect,useRef} from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";



import { actualizarConfiguracionDian} from "@/lib/api/configuracionesdian";
import { usePathname } from "next/navigation";

interface ConfiguraciondianFormProps {
  configuraciondian?: {
    id: number;
    nit_emisor: string;
    software_id: string;
    pin_software: string;
    ambiente: string;
    certificado_firma: string
    clave_certificado: string
    activo: number
  };
  onSubmit: (data: {    
    nit_emisor: string;
    software_id: string;
    pin_software: string;
    ambiente: string;
    certificado_firma: string
    clave_certificado: string
    activo: number
   
  }) => Promise<void>;
  onClose?: () => void;
  onSaved?: () => void;  
}

export default function ConfiguraciondianaForm({configuraciondian, onClose,onSaved }: ConfiguraciondianFormProps) {  
  
  const [formData, setFormData] = useState( configuraciondian || { 
  
    nit_emisor: "",
    software_id: "",
    pin_software:"",
    ambiente:"",
    certificado_firma:"",
    clave_certificado:"",
    activo: 1  
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
       if (configuraciondian) {
          await actualizarConfiguracionDian(configuraciondian.id, formData); // EDITAR
        }
      
      if (onClose) onClose();  
      if (onSaved) onSaved();
    } catch (err:any) {
      console.error(err);
      const mensajeError =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Error desconocido";
      setError(mensajeError);
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
