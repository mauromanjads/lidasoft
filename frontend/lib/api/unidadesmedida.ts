const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

export interface Unidad {
  id: number;
  codigo: string;
  nombre: string;
}

export interface UnidadData {
  codigo: string;
  nombre: string;
}

/* ============================================
   OBTENER TODAS LAS UNIDADES
============================================ */
export const obtenerUnidades = async (): Promise<Unidad[] | null> => {
  try {
    const res = await fetch(`${API_URL}/unidades` ,{
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Error al cargar unidades: ${res.status}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error obteniendo unidades:", error);
    return null;
  }
};


/* ============================================
   OBTENER UNA UNIDAD POR ID
============================================ */
export const obtenerUnidad = async (id: number): Promise<Unidad | null> => {
  try {
    const res = await fetch(`${API_URL}/unidades/${id}` ,{
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Unidad no encontrada: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo unidad:", error);
    return null;
  }
};


/* ============================================
   GUARDAR UNIDAD
============================================ */
export async function guardarUnidad(data: UnidadData) {
  try {
    const response = await fetch(`${API_URL}/unidades`, {
      method: "POST",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al guardar unidad");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en guardarUnidad:", err);
    throw err;
  }
}


/* ============================================
   ACTUALIZAR UNIDAD
============================================ */
export async function actualizarUnidad(id: number, data: Partial<UnidadData>) {
  try {
    const response = await fetch(`${API_URL}/unidades/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al actualizar unidad");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en actualizarUnidad:", err);
    throw err;
  }
}


/* ============================================
   ELIMINAR UNIDAD
============================================ */
export async function eliminarUnidad(id: number) {
  try {
    const response = await fetch(`${API_URL}/unidades/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: authHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al eliminar unidad");
    }

    return true;

  } catch (err) {
    console.error("Error en eliminarUnidad:", err);
    throw err;
  }
}
