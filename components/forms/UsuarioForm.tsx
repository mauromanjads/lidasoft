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
    id_rol?: number;
    rol?: {
    id: number;
    nombre: string;
  };
    sucursales?: { id: number }[]; 
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
    id_rol: usuario?.id_rol ?? usuario?.rol?.id ?? undefined,
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
        const [rolesData, sucursalesData] = await Promise.all([
          obtenerRoles(),
          obtenerSucursales(),
        ]);
        setRoles(rolesData);
        setSucursales(sucursalesData?? []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (usuario) {
      setFormData({
        usuario: usuario.usuario,
        nombre: usuario.nombre || "",
        activo: usuario.activo,
       id_rol: usuario?.id_rol ?? usuario?.rol?.id ?? undefined,
        sucursales_ids: 
         usuario.sucursales_ids ??
        usuario.sucursales?.map((s) => s.id) ?? [],
      });
    }
  }, [usuario]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    let val: any;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      val = target.checked;
    } else if (target instanceof HTMLSelectElement && target.multiple) {
      val = Array.from(target.selectedOptions).map((opt) => Number(opt.value));    
    } 
    else if (target.name === "activo") {
      val = target.value === "1";
    }  else if (target.name === "id_rol") {
      val = target.value ? Number(target.value) : undefined;
    }
    else {
      val = target.value;
    }   

    setFormData((prev) => ({
      ...prev,
      [target.name]: val,
    }));
  };

  const toggleSucursal = (id: number) => {
    setFormData((prev) => {
      const actuales = prev.sucursales_ids ?? [];

      return {
        ...prev,
        sucursales_ids: actuales.includes(id)
          ? actuales.filter((s) => s !== id)
          : [...actuales, id],
      };
    });
  };

  const todasSeleccionadas =
  sucursales.length > 0 &&
  (formData.sucursales_ids?.length ?? 0) === sucursales.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (usuario) {
        await actualizarUsuario(usuario.id, formData as UsuarioUpdate);

          Swal.fire({
            title: "¡Listo!",
            text: "Usuario actualizado",
            icon: "success",
            confirmButtonText: "Aceptar",
            timer: 3000,
            timerProgressBar: true,
          });

      } else {
       const resp = await crearUsuario(formData as UsuarioCreate);
        
        Swal.fire({
            title: "Usuario creado",
            html: `
              <p><b>Usuario:</b> ${resp.usuario}</p>
              <p><b>Password temporal:</b></p>
              <pre>${resp.password_temporal}</pre>
              <p style="color:red;font-size:12px">
                ⚠️ Copiar ahora. No se mostrará nuevamente.
              </p>
              `,
              icon: "warning",
           });
      }


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
            name="id_rol"
            value={formData.id_rol ?? ""}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Seleccione un rol</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
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

       
       {/* Sucursales */}
        <div className="flex flex-col md:col-span-2">         
          <button
            type="button"
            className="mb-2 inline-flex items-center gap-2
                  rounded-full border border-blue-200
                  bg-blue-50 px-3 py-1
                  text-xs font-medium text-blue-700
                  hover:bg-blue-100 hover:border-blue-300
                  transition-colors
                "
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                sucursales_ids: todasSeleccionadas
                  ? []
                  : sucursales.map((s) => s.id),
              }))
            }
          >
            {todasSeleccionadas ? "✖ Deseleccionar todas las sucursales" : "✔ Seleccionar todas las sucursales"}
          </button>

          <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sucursales.map((s) => (
                <label
                  key={s.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={(formData.sucursales_ids ?? []).includes(s.id)}
                    onChange={() => toggleSucursal(s.id)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm">{s.nombre}</span>
                </label>
              ))}
            </div>
          </div>
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
