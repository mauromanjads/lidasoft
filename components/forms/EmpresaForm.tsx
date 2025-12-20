"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Swal from "sweetalert2";

import { actualizarEmpresa } from "@/lib/api/empresas";

/* ============================================
   INTERFACES
============================================ */
interface EmpresaFormProps {
  empresa?: {
    id: number;
    nombre: string;
    razon_social: string;
    nit: string;
    logo_url?: string | null;
    subdominio: string;
    dominio_personalizado?: string | null;
  };
  onSubmit?: (data: {
    nombre: string;
    razon_social: string;
    nit: string;
    logo_url?: string | null;
    subdominio: string;
    dominio_personalizado?: string | null;
  }) => Promise<void>;
  onClose?: () => void;
  onSaved?: () => void;
}

/* ============================================
   COMPONENTE
============================================ */
export default function EmpresaForm({
  empresa,
  onClose,
  onSaved,
}: EmpresaFormProps) {
  const [formData, setFormData] = useState(
    empresa || {
      nombre: "",
      razon_social: "",
      nit: "",
      logo_url: "",
      subdominio: "",
      dominio_personalizado: "",
    }
  );
  
useEffect(() => {
  if (empresa) {
    setFormData(empresa);
  }
}, [empresa]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ============================================
     MANEJO DE CAMBIOS
  ============================================ */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    let val: any;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      val = target.checked;
    } else if (target instanceof HTMLInputElement && target.type === "number") {
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
      if (empresa) {
        // EDITAR
        await actualizarEmpresa(empresa.id, formData);
      }

      if (onClose) onClose();
      if (onSaved) onSaved();

      const mensaje = empresa
        ? "Empresa actualizada correctamente"
        : "Empresa guardada correctamente";

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
        err?.response?.data?.message ||
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
      {/* 🏢 DATOS EMPRESA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Nombre Comercial
          </label>
          <Input
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            placeholder="Nombre de la empresa"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Razón Social
          </label>
          <Input
            name="razon_social"
            value={formData.razon_social || ""}
            onChange={handleChange}
            placeholder="Razón social"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            NIT
          </label>
          <Input
            name="nit"
            value={formData.nit || ""}
            onChange={handleChange}
            placeholder="NIT de la empresa"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Subdominio
          </label>
          <Input
            name="subdominio"
            value={formData.subdominio || ""}
            onChange={handleChange}
            placeholder="ej: miempresa"
            required
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Dominio Personalizado
          </label>
          <Input
            name="dominio_personalizado"
            value={formData.dominio_personalizado || ""}
            onChange={handleChange}
            placeholder="ej: www.miempresa.com"
          />
        </div>

        <div className="flex flex-col w-full">
          <label className="text-sm font-semibold mb-1 text-gray-700">
            Logo (URL)
          </label>
          <Input
            name="logo_url"
            value={formData.logo_url || ""}
            onChange={handleChange}
            placeholder="URL del logo"
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
          {loading
            ? empresa
              ? "Actualizando..."
              : "Guardando..."
            : empresa
            ? "💾 Actualizar"
            : "💾 Guardar"}
        </Button>
      </div>
    </form>
  );
}
