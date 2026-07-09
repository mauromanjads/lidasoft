const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

/* ============================================
   INTERFACES
============================================ */
export interface Permiso {
  id: number;
  codigo: string;
  descripcion?: string;
  activo: boolean;
  creado_en: string;
}

export interface PermisoData {
  codigo: string;
  descripcion?: string;
  activo: boolean;
}

/* ============================================
   OBTENER TODOS LOS PERMISOS
============================================ */
export const obtenerPermisos = async (
  soloActivos: boolean = false
): Promise<Permiso[] | null> => {
  try {
    const res = await fetch(`${API_URL}/permisos`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Error al cargar permisos: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo permisos:", error);
    return null;
  }
};

/* ============================================
   OBTENER PERMISO POR ID
============================================ */
export const obtenerPermiso = async (
  id: number
): Promise<Permiso | null> => {
  try {
    const res = await fetch(`${API_URL}/permisos/${id}`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Permiso no encontrado: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo permiso:", error);
    return null;
  }
};

/* ============================================
   BUSCAR PERMISOS
============================================ */
export const buscarPermisos = async (
  query: string
): Promise<Permiso[] | null> => {
  try {
    const res = await fetch(
      `${API_URL}/permisos/buscar?query=${encodeURIComponent(query)}`,
      {
        headers: authHeaders(),
      }
    );

    if (!res.ok) {
      throw new Error(`Error al buscar permisos: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error buscando permisos:", error);
    return null;
  }
};

/* ============================================
   CREAR PERMISO
============================================ */
export async function guardarPermiso(data: PermisoData) {
  try {
    const response = await fetch(`${API_URL}/permisos`, {
      method: "POST",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al guardar permiso");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en guardarPermiso:", err);
    throw err;
  }
}

/* ============================================
   ACTUALIZAR PERMISO
============================================ */
export async function actualizarPermiso(
  id: number,
  data: Partial<Omit<PermisoData, "codigo">>
) {
  try {
    const response = await fetch(`${API_URL}/permisos/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al actualizar permiso");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en actualizarPermiso:", err);
    throw err;
  }
}

/* ============================================
   ELIMINAR PERMISO
============================================ */
export async function eliminarPermiso(id: number) {
  try {
    const response = await fetch(`${API_URL}/permisos/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: authHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al eliminar permiso");
    }

    return true;

  } catch (err) {
    console.error("Error en eliminarPermiso:", err);
    throw err;
  }
}
