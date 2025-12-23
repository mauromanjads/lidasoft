import { authHeaders } from "@/lib/utils";

/* ===================== TIPOS ===================== */

export interface Usuario {
  id: number;
  usuario: string;
  nombre?: string;
  activo: boolean;
  creado_en: string;
  rol?: {
    id: number;
    nombre: string;
  };
  sucursales?: {
    id: number;
    nombre: string;
  }[];
}

export interface UsuarioCreate {
  usuario: string;
  nombre?: string;
  id_rol?: number;
  activo?: boolean;
  rol?: {
    id: number;
    nombre: string;
  };
  sucursales_ids?: number[];
}

export interface UsuarioUpdate {
  nombre?: string;
  id_rol?: number;
  activo?: boolean;
  rol?: {
    id: number;
    nombre: string;
  };
  sucursales_ids?: number[];
}

export interface UsuarioPasswordUpdate {
  password: string;
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

/* ===================== USUARIOS ===================== */

// Obtener todos los usuarios
export const obtenerUsuarios = (): Promise<Usuario[]> => {
  return fetchAPI<Usuario[]>(`${API_URL}/usuarios`, {
    headers: authHeaders(),
  });
};

// Obtener un usuario por ID
export const obtenerUsuario = (usuario_id: number): Promise<Usuario> => {
  return fetchAPI<Usuario>(`${API_URL}/usuarios/${usuario_id}`, {
    headers: authHeaders(),
  });
};

// Crear usuario (sin password)
export const crearUsuario = (
  data: UsuarioCreate
): Promise<UsuarioCreateResponse> => {

  return fetchAPI<UsuarioCreateResponse>(`${API_URL}/usuarios/crear`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      ...data,
      sucursales_ids: data.sucursales_ids ?? [], // 👈 CLAVE
    }),
  });
};

// Actualizar usuario (sin password)
export const actualizarUsuario = (
  usuario_id: number,
  data: UsuarioUpdate
): Promise<Usuario> => {
  return fetchAPI<Usuario>(`${API_URL}/usuarios/${usuario_id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({
      ...data,
      sucursales_ids: data.sucursales_ids ?? [], // 👈 CLAVE
    }),
  });
};

// Actualizar contraseña
export const actualizarPassword = (
  usuario_id: number,
  data: UsuarioPasswordUpdate
): Promise<{ message: string }> => {
  return fetchAPI<{ message: string }>(
    `${API_URL}/usuarios/${usuario_id}/password`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }
  );
};

// Eliminar usuario
export const eliminarUsuario = (
  usuario_id: number
): Promise<{ message: string }> => {
  return fetchAPI<{ message: string }>(`${API_URL}/usuarios/${usuario_id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
};

export interface UsuarioCreateResponse extends Usuario {
  password_temporal: string;
}
