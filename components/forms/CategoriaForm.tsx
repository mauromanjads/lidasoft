"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Buttonsec from "@/components/ui/buttonsec";
import Input from "@/components/ui/input";
import Swal from "sweetalert2";
import { guardarCategoria, actualizarCategoria } from "@/lib/api/categorias";

type TipoParametro = "string" | "number" | "boolean";

interface ParametroForm {
  nombre: string;
  tipo: TipoParametro;
}

interface CategoriaPayload {
  nombre: string;
  descripcion: string;
  estado: string;
  parametros: Record<string, string>;
}

interface CategoriaFormProps {
  categoria?: {
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;
    parametros?: Record<string, string>;
  };
  onClose?: () => void;
  onSaved?: () => void;
}

export default function CategoriaForm({
  categoria,
  onClose,
  onSaved,
}: CategoriaFormProps) {

  /* ===================== FORM PRINCIPAL ===================== */
  const [formData, setFormData] = useState({
    nombre: categoria?.nombre || "",
    descripcion: categoria?.descripcion || "",
    estado: categoria?.estado || "A",
  });

  /* ===================== PARAMETROS ===================== */
  const [parametros, setParametros] = useState<ParametroForm[]>(
    categoria?.parametros
      ? Object.entries(categoria.parametros).map(([k, v]) => ({
          nombre: k,
          tipo: "string",
        }))
      : []
  );

  const [loading, setLoading] = useState(false);

  /* ===================== HANDLERS ===================== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ===================== SUBMIT ===================== */
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Convertir array → JSON
    const parametrosJson: Record<string, string> = parametros.reduce(
      (acc, p) => {
        if (p.nombre.trim()) {
          acc[p.nombre.trim()] = "";
        }
        return acc;
      },
      {} as Record<string, string>
    );

    const payload: CategoriaPayload = {
      ...formData,
      parametros: parametrosJson,
    };

    if (categoria) {
      await actualizarCategoria(categoria.id, payload);
    } else {
      await guardarCategoria(payload);
    }

    onSaved?.();
    onClose?.();

    const mensaje = categoria
      ? "Categoría actualizada"
      : "Categoría creada correctamente";

    Swal.fire({
      title: "¡Listo!",
      text: mensaje,
      icon: "success",
      confirmButtonText: "Aceptar",
      timer: 4000,
      timerProgressBar: true,
    });
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

      {/* ====== DATOS BASICOS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-semibold">Nombre</label>
          <Input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Descripción</label>
          <Input
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="A">Activo</option>
            <option value="I">Inactivo</option>
          </select>
        </div>
      </div>

      {/* ====== PARAMETROS ====== */}
      <div className="bg-gray-50 border rounded-lg p2">
        
          <div className="mt-4">
          <div
            className="
              grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
              gap-5 max-h-72 overflow-y-auto
            "
          >
            {parametros.map((p, index) => (
          <div
            key={index}
            className="border rounded-xl bg-white shadow-sm flex flex-col"
          >
            {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <span className="text-sm font-medium text-gray-600">
            Parámetro #{index + 1}
          </span>

          <button
            type="button"
            className="text-red-500 hover:text-red-700 text-sm"
            onClick={() =>
              setParametros(parametros.filter((_, i) => i !== index))
            }
            title="Eliminar parámetro"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">
              Nombre del parámetro
            </label>
            <Input
              placeholder="Ej: color"
              value={p.nombre}
              onChange={(e) => {
                const copy = [...parametros];
                copy[index].nombre = e.target.value;
                setParametros(copy);
              }}
            />
          </div>          
        </div>
      </div>
    ))}
  </div>

  {/* Add button */}
  <div className="mt-4">
      <Buttonsec
          type="button"
          onClick={() =>
            setParametros((prev) => [
              ...prev,
              { nombre: "", tipo: "string" },
            ])
          }
         
        >
          <span className="text-base leading-none">+</span>
          Agregar
      </Buttonsec>
  </div>
          </div>

      </div>

      {/* ====== BOTONES ====== */}
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
