"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Swal from "sweetalert2";
import { actualizarConfiguracion } from "@/lib/api/configuracionimpresion";

interface ConfiguracionImpresionFormProps {
  config: {
    id: number;
    habilitar_pos: boolean;
    habilitar_a4: boolean;
  };
  onGuardar?: () => void;
}

export default function ConfiguracionImpresionForm({
  config,
  onGuardar,
}: ConfiguracionImpresionFormProps) {
  const [formData, setFormData] = useState({
    habilitar_pos: config.habilitar_pos,
    habilitar_a4: config.habilitar_a4,
  });

  const [loading, setLoading] = useState(false);

  /* ===================== HANDLER ===================== */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked, // ojo con los booleanos
    }));
  };

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        habilitar_pos: formData.habilitar_pos,
        habilitar_a4: formData.habilitar_a4,
      };

      await actualizarConfiguracion(payload);

      Swal.fire({
        title: "¡Listo!",
        text: "Configuración de impresión actualizada",
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 4000,
        timerProgressBar: true,
      });

      onGuardar?.();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado";

      Swal.fire({
        title: "Oops...!",
        text: message,
        icon: "error",
        confirmButtonText: "Entendido",
        timer: 4000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ===================== RENDER ===================== */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ====== CHECKBOXES ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="habilitar_pos"
            checked={formData.habilitar_pos}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label className="text-sm font-semibold">Habilitar POS (térmica)</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="habilitar_a4"
            checked={formData.habilitar_a4}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label className="text-sm font-semibold">Habilitar A4</label>
        </div>
      </div>

      {/* ====== BOTONES ====== */}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Actualizando..." : "💾 Guardar"}
        </Button>
      </div>
    </form>
  );
}
