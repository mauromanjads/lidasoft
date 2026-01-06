"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Swal from "sweetalert2";
import { actualizarConfiguracion } from "@/lib/api/configuracionimpresion";

interface ConfiguracionImpresionFormProps {
  config: {
    id: number;
    habilitar_pos: boolean;
    habilitar_a4: boolean;
  };
  onSaved?: () => void;
}

export default function ConfiguracionImpresionForm({ config, onSaved }: ConfiguracionImpresionFormProps) {
  const [formData, setFormData] = useState({
    habilitar_pos: config.habilitar_pos,
    habilitar_a4: config.habilitar_a4,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await actualizarConfiguracion(formData);

      Swal.fire({
        title: "¡Listo!",
        text: "Configuración actualizada correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 3000,
        timerProgressBar: true,
      });

      onSaved?.();
    } catch (err: unknown) {
      Swal.fire({
        title: "Error",
        text: err instanceof Error ? err.message : "Ocurrió un error inesperado",
        icon: "error",
        confirmButtonText: "Entendido",
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
   <form
      onSubmit={handleSubmit}
      className="space-y-4 border border-gray-300 rounded-lg p-4 bg-white max-w-md mx-auto"
    >
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          name="habilitar_pos"
          checked={formData.habilitar_pos}
          onChange={handleChange}
          className="w-5 h-5"
        />
        <label className="text-sm font-medium">Habilitar POS (térmica)</label>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          name="habilitar_a4"
          checked={formData.habilitar_a4}
          onChange={handleChange}
          className="w-5 h-5"
        />
        <label className="text-sm font-medium">Habilitar A4</label>
      </div>

      <div className="flex justify-center mt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "💾 Guardar"}
        </Button>
      </div>
    </form>

  );
}
