const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

/* ============================================
   INTERFACES
============================================ */
export interface Empresa {
  id: number;
  nombre: string;
  razon_social: string;
  nit: string;
  logo_url?: string | null;
  subdominio: string;
  dominio_personalizado?: string | null;
}

export interface EmpresaData {
  nombre: string;
  razon_social: string;
  nit: string;
  logo_url?: string | null;
  subdominio: string;
  dominio_personalizado?: string | null;
}

/* ============================================
   OBTENER TODAS LAS EMPRESAS
============================================ */
export const obtenerEmpresas = async (): Promise<Empresa[] | null> => {
  try {
    const res = await fetch(`${API_URL}/empresa`, {
      headers: authHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Error al cargar empresas: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo empresas:", error);
    return null;
  }
};

/* ============================================
   OBTENER EMPRESA POR ID
============================================ */
export const obtenerEmpresa = async (id: number): Promise<Empresa | null> => {
  try {
    const res = await fetch(`${API_URL}/empresa/${id}`, {
      headers: authHeaders(),
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Empresa no encontrada: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo empresa:", error);
    return null;
  }
};

/* ============================================
   CREAR EMPRESA
============================================ */
export async function guardarEmpresa(data: EmpresaData) {
  try {
    const response = await fetch(`${API_URL}/empresa`, {
      method: "POST",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al guardar empresa");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en guardarEmpresa:", err);
    throw err;
  }
}

/* ============================================
   ACTUALIZAR EMPRESA
============================================ */
export async function actualizarEmpresa(
  id: number,
  data: Partial<EmpresaData>
) {
  try {
    const response = await fetch(`${API_URL}/empresa/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al actualizar empresa");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en actualizarEmpresa:", err);
    throw err;
  }
}

/* ============================================
   ELIMINAR EMPRESA
============================================ */
export async function eliminarEmpresa(id: number) {
  try {
    const response = await fetch(`${API_URL}/empresa/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: authHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al eliminar empresa");
    }

    return true;

  } catch (err) {
    console.error("Error en eliminarEmpresa:", err);
    throw err;
  }
}
