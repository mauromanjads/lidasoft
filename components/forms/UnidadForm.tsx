"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

import { guardarUnidad, actualizarUnidad } from "@/lib/api/unidadesmedida";

interface UnidadFormProps {
  unidad?: {
    id: number;
    codigo: string;
    nombre: string;
  } | null;
  onSubmit?: (data: { codigo: string; nombre: string }) => Promise<void>;
  onClose?: () => void;
  onSaved?: () => void;
}

export default function UnidadForm({ unidad, onClose, onSaved }: UnidadFormProps) {
  const [formData, setFormData] = useState(
    unidad || {
      codigo: "",
      nombre: "",
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (unidad) {
        await actualizarUnidad(unidad.id, formData);
      } else {
        await guardarUnidad(formData);
      }

      onSaved?.();
      onClose?.();
    } catch (err: any) {
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
    <form onSubmit={handleSubmit} className="space-y-6 w-full p-1">
        

      {/* FORM FULL WIDTH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Código */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Código
          </label>
          <Input
            name="codigo"
            value={formData.codigo || ""}
            onChange={handleChange}
            placeholder="Código"
            className="w-full"
            required
          />
        </div>

        {/* Nombre */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Nombre
          </label>
          <Input
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            placeholder="Nombre de la unidad"
            className="w-full"
            required
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 bg-red-50 p-2 rounded-md border border-red-200 text-sm">
          {error}
        </p>
      )}

      {/* BOTONES */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
         ❌  Cancelar
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? (unidad ? "Actualizando..." : "Guardando...") : (unidad ? "💾 Actualizar" : "💾 Guardar")}
        </Button>
      </div>
    </form>
  );
}
