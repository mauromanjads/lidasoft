"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { guardarCliente,actualizarCliente } from "@/lib/api/clientes";

interface ClienteFormProps {
  cliente?: {id:string; nit: string; nombre: string; telefono: string; direccion: string };
  onSubmit: (data: { nit: string; nombre: string; telefono: string; direccion: string }) => Promise<void>;
  onClose?: () => void;
  onSaved?: () => void;  
}

export default function ClienteForm({cliente, onClose,onSaved }: ClienteFormProps) {  
  
  const [formData, setFormData] = useState( cliente || { nit: "", nombre: "", telefono: "", direccion: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.nit) {
      setError("Nombre y NIT son obligatorios.");
      return;
    }

    setError(null);
    setLoading(true);

    try {        
       if (cliente) {
          await actualizarCliente(cliente.id, formData); // EDITAR
        } else {
          await guardarCliente(formData); // CREAR
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
     
      <div>
        <label className="block mb-1 font-medium">NIT</label>
        <Input
          name="nit"
          value={formData.nit}
          onChange={handleChange}
          placeholder="NIT"
          required
        />
      </div>     
     
      <div>
        <label className="block mb-1 font-medium">Nombre</label>
        <Input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre del cliente"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Teléfono</label>
        <Input
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Dirección</label>
        <Input
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Dirección"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
           {loading ? (cliente ? "Actualizando..." : "Guardando...") : (cliente ? "Actualizar" : "Guardar")}
        </Button>
      </div>
    </form>
  );
}
