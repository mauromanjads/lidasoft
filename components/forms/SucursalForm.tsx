"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Swal from "sweetalert2";

import {
  guardarSucursal,
  actualizarSucursal,
  SucursalData,
} from "@/lib/api/sucursales";

/* ============================================
   PROPS
============================================ */
interface SucursalFormProps {
  sucursal?: {
    id: number;    
    nombre: string;
    direccion?: string;
    telefono?: string;
    estado: boolean;
  };
  onSubmit: (data: {    
    nombre: string;
    direccion?: string;
    telefono?: string;
     estado: boolean;
   
  }) => Promise<void>;
  onClose?: () => void;
  onSaved?: () => void;
}

/* ============================================
   COMPONENTE
============================================ */
export default function SucursalForm({
  sucursal,
  onClose,
  onSaved,
}: SucursalFormProps) {
  const [formData, setFormData] = useState<any>(
    sucursal || {      
      nombre: "",
      direccion: "",
      telefono: "",
       estado: true,
    }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ============================================
     HANDLE CHANGE
  ============================================ */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    let val: any;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      val = target.checked ? 1 : 0;
    } else if (
      target instanceof HTMLInputElement &&
      target.type === "number"
    ) {
      val = target.value === "" ? undefined : Number(target.value);
    } else {
      val = target.value;
    }

    setFormData((prev: any) => ({
      ...prev,
      [target.name]: val,
    }));
  };

  /* ============================================
     SUBMIT
  ============================================ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: SucursalData = {
        ...formData,
      };

      if (sucursal) {
        await actualizarSucursal(sucursal.id, payload); // EDITAR
      } else {
        await guardarSucursal(payload); // CREAR
      }

      if (onClose) onClose();
      if (onSaved) onSaved();

      const mensaje = sucursal
        ? "Sucursal actualizada correctamente"
        : "Sucursal creada correctamente";

      Swal.fire({
        title: "¡Listo!",
        text: mensaje,
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 4000,
        timerProgressBar: true,
      });
    } catch (err: any) {
      console.error(err);

      const mensajeError =
        err?.response?.data?.detail ||
        err?.message ||
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

  /* ============================================
     RENDER
  ============================================ */
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
       
        {/* Nombre */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Nombre
          </label>
          <Input
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            placeholder="Nombre de la sucursal"
            required
          />
        </div>

        {/* Dirección */}
        <div className="flex flex-col w-full md:col-span-2">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Dirección
          </label>
          <Input
            name="direccion"
            value={formData.direccion || ""}
            onChange={handleChange}
            placeholder="Dirección"
          />
        </div>

        {/* Dirección */}
        <div className="flex flex-col w-full md:col-span-2">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Correo
          </label>
          <Input
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="Correo"
          />
        </div>


        {/* Teléfono */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Teléfono
          </label>
          <Input
            name="telefono"
            value={formData.telefono || ""}
            onChange={handleChange}
            placeholder="Teléfono"
          />
        </div>

        {/* Activo */}
        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Estado
          </label>
          <select
            name="estado"
            value={formData.estado ?? false}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
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
          {loading
            ? sucursal
              ? "Actualizando..."
              : "Guardando..."
            : sucursal
            ? "💾 Actualizar"
            : "💾 Guardar"}
        </Button>
      </div>
    </form>
  );
}
