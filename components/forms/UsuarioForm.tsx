"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Swal from "sweetalert2";
import { Rol, obtenerRoles } from "@/lib/api/roles";
import { Sucursal, obtenerSucursales } from "@/lib/api/sucursales";
import {
  crearUsuario,
  actualizarUsuario,
  UsuarioCreate,
  UsuarioUpdate,
} from "@/lib/api/usuarios";

interface UsuarioFormProps {
  usuario?: {
    id: number;
    usuario: string;
    nombre?: string;
    activo: boolean;
    rol_id?: number;
    sucursales_ids?: number[];
  };
  onSubmit?: (data: UsuarioCreate | UsuarioUpdate) => Promise<void>;
  onClose?: () => void;
  onSaved?: () => void;
}

export default function UsuarioForm({ usuario, onClose, onSaved }: UsuarioFormProps) {
  const [formData, setFormData] = useState<UsuarioCreate | UsuarioUpdate>({
    usuario: usuario?.usuario || "",
    nombre: usuario?.nombre || "",
    activo: usuario?.activo ?? true,
    id_rol: usuario?.rol_id || undefined,
    sucursales_ids: usuario?.sucursales_ids || [],
  });

  const [roles, setRoles] = useState<Rol[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar roles y sucursales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesData = await obtenerRoles();
        setRoles(rolesData);
       // const sucursalesData = await obtenerSucursales();
       // setSucursales(sucursalesData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    let val: any;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      val = target.checked;
    } else if (target instanceof HTMLSelectElement && target.multiple) {
      val = Array.from(target.selectedOptions).map((opt) => Number(opt.value));
    } else {
      val = target.value;
    }

    setFormData((prev) => ({
      ...prev,
      [target.name]: val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (usuario) {
        await actualizarUsuario(usuario.id, formData as UsuarioUpdate);
      } else {
        await crearUsuario(formData as UsuarioCreate);
      }

      Swal.fire({
        title: "¡Listo!",
        text: usuario ? "Usuario actualizado" : "Usuario creado",
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 3000,
        timerProgressBar: true,
      });

      if (onClose) onClose();
      if (onSaved) onSaved();
    } catch (err: any) {
      console.error(err);
      const mensajeError = err.message || "Error desconocido";
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Usuario */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Usuario</label>
          <Input
            name="usuario"
           value={("usuario" in formData ? formData.usuario : "") || ""}
            onChange={handleChange}
            placeholder="Usuario"
            required
            disabled={!!usuario} // No se puede cambiar el usuario al editar
          />
        </div>

        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Nombre</label>
          <Input
            name="nombre"
            value={formData.nombre || ""}
            onChange={handleChange}
            placeholder="Nombre completo"
          />
        </div>

        {/* Rol */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Rol</label>
          <select
            name="rol_id"
            value={formData.id_rol || ""}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un rol</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Sucursales */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Sucursales</label>
          <select
            name="sucursales_ids"
            multiple
           // value={formData.sucursales_ids || []}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Activo */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">Activo</label>
          <select
            name="activo"
            value={formData.activo ? 1 : 0}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" onClick={onClose} disabled={loading}>
          ❌ Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (usuario ? "Actualizando..." : "Guardando...") : usuario ? "💾 Actualizar" : "💾 Guardar"}
        </Button>
      </div>
    </form>
  );
}
