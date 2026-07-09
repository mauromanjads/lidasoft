import { authHeaders } from "@/lib/utils";

/* ===================== TIPOS ===================== */

export interface Permiso {
  id: number;
  codigo: string;
  descripcion?: string;
}

export interface Rol {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  creado_en: string;
  permisos: Permiso[];
}

export interface RolCreate {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
  permisos_ids: number[];
}

export interface RolUpdate {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
  permisos_ids?: number[];
}

/* ===================== CONFIG ===================== */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ===================== FETCH GENÉRICO ===================== */

async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

/* ===================== ROLES ===================== */

// Obtener todos los roles
export const obtenerRoles = (): Promise<Rol[]> => {
  return fetchAPI<Rol[]>(`${API_URL}/roles`, {
    headers: authHeaders(),
  });
};

// Obtener un rol por ID
export const obtenerRol = (rol_id: number): Promise<Rol> => {
  return fetchAPI<Rol>(`${API_URL}/roles/${rol_id}`, {
    headers: authHeaders(),
  });
};

// Crear rol
export const crearRol = (data: RolCreate): Promise<Rol> => {
  return fetchAPI<Rol>(`${API_URL}/roles`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
};

// Actualizar rol
export const actualizarRol = (
  rol_id: number,
  data: RolUpdate
): Promise<Rol> => {
  return fetchAPI<Rol>(`${API_URL}/roles/${rol_id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
};

// Eliminar rol
export const eliminarRol = (
  rol_id: number
): Promise<{ message: string }> => {
  return fetchAPI<{ message: string }>(`${API_URL}/roles/${rol_id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
};
