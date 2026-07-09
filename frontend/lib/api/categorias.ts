const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";
/* ============================
   INTERFACES
============================= */
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: string;
  parametros: any | null;
  creado: string;
}

export interface CategoriaData {
  nombre: string;
  descripcion?: string;
  estado?: string; 
  parametros?: any | null;
}

/* ============================
   OBTENER TODAS LAS CATEGORIAS
============================= */
export const obtenerCategorias = async (): Promise<Categoria[] | null> => {
  try {
    const res = await fetch(`${API_URL}/categorias`,{
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Error al cargar categorías: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    return null;
  }
};

/* ============================
   OBTENER CATEGORIA POR ID
============================= */
export const obtenerCategoria = async (id: number): Promise<Categoria | null> => {
  try {
    const res = await fetch(`${API_URL}/categorias/${id}`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Categoría no encontrada: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo categoría:", error);
    return null;
  }
};

/* ============================
   GUARDAR CATEGORIA
============================= */
export async function guardarCategoria(data: CategoriaData) {
  try {
    const response = await fetch(`${API_URL}/categorias`, {
      method: "POST",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || "Error al guardar categoría");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en guardarCategoria:", err);
    throw err;
  }
}

/* ============================
   ACTUALIZAR CATEGORIA
============================= */
export async function actualizarCategoria(id: number, data: Partial<CategoriaData>) {
  console.log("➡️ DATA QUE LLEGA A ACTUALIZAR CATEGORIA:", data)
    
  try {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || "Error al actualizar categoría");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en actualizarCategoria:", err);
    throw err;
  }
}

/* ============================
   ELIMINAR CATEGORIA
============================= */
export async function eliminarCategoria(id: number) {
  try {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: authHeaders(),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || "Error al eliminar categoría");
    }

    return true;

  } catch (err) {
    console.error("Error en eliminarCategoria:", err);
    throw err;
  }
}
