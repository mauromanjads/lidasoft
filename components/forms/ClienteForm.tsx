"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface ClienteFormProps {
  onSubmit: (data: { nombre: string; nit: string; telefono: string }) => Promise<void>;
  onClose?: () => void;
}

export default function ClienteForm({ onSubmit, onClose }: ClienteFormProps) {
  const [formData, setFormData] = useState({ nombre: "", nit: "", telefono: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple
    if (!formData.nombre || !formData.nit) {
      setError("Nombre y NIT son obligatorios.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData); // Envía los datos al endpoint
      if (onClose) onClose();   // Cierra el modal
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar el cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label className="block mb-1 font-medium">Teléfono</label>
        <Input
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
