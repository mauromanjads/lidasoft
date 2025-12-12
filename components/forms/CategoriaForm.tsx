"use client";

import { useState } from "react";
import { useEffect,useRef} from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Swal from "sweetalert2";


import { guardarCategoria,actualizarCategoria} from "@/lib/api/categorias";
import { usePathname } from "next/navigation";

interface CategoriaFormProps {
  categoria?: {
    id: string;
    nombre: string;
    descripcion: string;
    estado: string;
  };
  onSubmit: (data: {    
    nombre: string;
    descripcion: string;
    estado: string;
   
  }) => Promise<void>;
  onClose?: () => void;
  onSaved?: () => void;  
}

export default function CategoriaForm({categoria, onClose,onSaved }: CategoriaFormProps) {  
  
  const [formData, setFormData] = useState( categoria || { 
    
    nombre: "",
    descripcion: "",
    estado: "A",
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
       if (categoria) {
          await actualizarCategoria(categoria.id, formData); // EDITAR
        } else {
          await guardarCategoria(formData); // CREAR
        }
      
      if (onClose) onClose();  
      if (onSaved) onSaved();

      const mensaje = categoria ? "Categoría actualizada" : "Categoría creada correctamente"
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

        Swal.fire({
                title: "Oops...!",
                text: err.message,
                icon: "error",
                confirmButtonText: "Entendido",
                timer: 4000,
                timerProgressBar: true,
        });
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
  
      {/* Nombre */}
      <div className="flex flex-col w-full">
        <label className="text-sm font-semibold mb-1 text-gray-700">
          Nombre
        </label>
        <Input
          name="nombre"
          value={formData.nombre || ""}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full"
          required
        />
      </div>

      {/* Descripción */}
      <div className="flex flex-col w-full">
        <label className="text-sm font-semibold mb-1 text-gray-700">
          Descripción
        </label>
        <Input
          name="descripcion"
          value={formData.descripcion || ""}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full"
          required
        />
      </div>

      {/* Estado */}
      <div className="flex flex-col w-full">
        <label className="text-sm font-semibold mb-1 text-gray-700">
          Estado
        </label>
        <select
          name="estado"
          value={formData.estado || ""}
          className="w-full border rounded-lg p-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleChange}
          required
        >
          <option value="">Seleccione...</option>
          <option value="A">Activo</option>
          <option value="I">Inactivo</option>
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
      {loading ? (categoria ? "Actualizando..." : "Guardando...") : (categoria ? "💾 Actualizar" : "💾 Guardar")}
    </Button>
  </div>
   </form>

  );
}
