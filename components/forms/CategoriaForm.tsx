"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Swal from "sweetalert2";
import { guardarCategoria, actualizarCategoria } from "@/lib/api/categorias";

type TipoParametro = "string" | "number" | "boolean";

interface ParametroForm {
  nombre: string;
  tipo: TipoParametro;
}

interface CategoriaFormProps {
  categoria?: {
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;
    parametros?: Record<string, TipoParametro>;
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
          tipo: v,
        }))
      : []
  );

  const [showParametros, setShowParametros] = useState(false);
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convertir array → JSON
      const parametrosJson = parametros.reduce(
        (acc: Record<string, TipoParametro>, p) => {
          if (p.nombre.trim()) {
            acc[p.nombre.trim()] = p.tipo;
          }
          return acc;
        },
        {}
      );

      const payload = {
        ...formData,
        parametros: parametrosJson,
      };

      if (categoria) {
        await actualizarCategoria(categoria.id, payload);
      } else {
        await guardarCategoria(payload);
      }

      Swal.fire("¡Listo!", "Categoría guardada correctamente", "success");
      onSaved?.();
      onClose?.();

    } catch (err: any) {
      Swal.fire("Error", err.message || "Error al guardar", "error");
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
      <div className="bg-gray-50 border rounded-lg p-4">
        <button
          type="button"
          onClick={() => setShowParametros(!showParametros)}
          className="font-semibold text-blue-600"
        >
          ⚙️ Parámetros avanzados {showParametros ? "▲" : "▼"}
        </button>

        {showParametros && (
          <div className="mt-4">

            <div className="
              grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
              gap-4 max-h-64 overflow-y-auto
            ">
              {parametros.map((p, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 bg-white shadow-sm relative flex flex-col gap-2"
                >
                  <button
                    type="button"
                    className="absolute top-1 right-1 text-red-500"
                    onClick={() =>
                      setParametros(parametros.filter((_, i) => i !== index))
                    }
                  >
                    ❌
                  </button>

                  <Input
                    placeholder="Nombre (ej: color)"
                    value={p.nombre}
                    onChange={(e) => {
                      const copy = [...parametros];
                      copy[index].nombre = e.target.value;
                      setParametros(copy);
                    }}
                  />

                  <select
                    value={p.tipo}
                    onChange={(e) => {
                      const copy = [...parametros];
                      copy[index].tipo = e.target.value as TipoParametro;
                      setParametros(copy);
                    }}
                    className="border rounded-lg p-2"
                  >
                    <option value="string">Texto</option>
                    <option value="number">Número</option>
                    <option value="boolean">Booleano</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="text-sm text-green-600"
                onClick={() =>
                  setParametros((prev) => [
                    ...prev,
                    { nombre: "", tipo: "string" },
                  ])
                }
              >
                ➕ Agregar parámetro
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ====== BOTONES ====== */}
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
