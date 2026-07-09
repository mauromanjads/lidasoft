const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

/* ============================================
   INTERFACES
============================================ */
export interface Sucursal {
  id: number;  
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?:string;
   estado: boolean;
}

export interface SucursalData {  
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?:string;
  estado: boolean;
}

/* ============================================
   OBTENER TODAS LAS SUCURSALES
============================================ */
export const obtenerSucursales = async (): Promise<Sucursal[] | null> => {
  try {
    const res = await fetch(`${API_URL}/sucursales`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Error al cargar sucursales: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo sucursales:", error);
    return null;
  }
};

/* ============================================
   OBTENER SOLO SUCURSALES ACTIVAS
============================================ */
export const obtenerSucursalesActivas = async (): Promise<Sucursal[] | null> => {
  try {
    const res = await fetch(`${API_URL}/sucursales?solo_activas=true`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Error al cargar sucursales activas: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo sucursales activas:", error);
    return null;
  }
};

/* ============================================
   BUSCAR SUCURSAL (código o nombre)
============================================ */
export const buscarSucursal = async (query: string): Promise<Sucursal[] | null> => {
  try {
    const res = await fetch(`${API_URL}/sucursales/buscar?query=${query}`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Error en búsqueda de sucursal: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error buscando sucursal:", error);
    return null;
  }
};

/* ============================================
   OBTENER UNA SUCURSAL POR ID
============================================ */
export const obtenerSucursal = async (id: number): Promise<Sucursal | null> => {
  try {
    const res = await fetch(`${API_URL}/sucursales/${id}`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Sucursal no encontrada: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo sucursal:", error);
    return null;
  }
};

/* ============================================
   GUARDAR SUCURSAL
============================================ */
export async function guardarSucursal(data: SucursalData) {
  try {
    const response = await fetch(`${API_URL}/sucursales`, {
      method: "POST",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al guardar sucursal");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en guardarSucursal:", err);
    throw err;
  }
}

/* ============================================
   ACTUALIZAR SUCURSAL
============================================ */
export async function actualizarSucursal(
  id: number,
  data: Partial<SucursalData>
) {
  try {
    const response = await fetch(`${API_URL}/sucursales/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al actualizar sucursal");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en actualizarSucursal:", err);
    throw err;
  }
}

/* ============================================
   ELIMINAR SUCURSAL
============================================ */
export async function eliminarSucursal(id: number) {
  try {
    const response = await fetch(`${API_URL}/sucursales/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: authHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al eliminar sucursal");
    }

    return true;

  } catch (err) {
    console.error("Error en eliminarSucursal:", err);
    throw err;
  }
}
