const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: string;
  creado: string;
}

export interface CategoriaData {
  nombre: string;
  descripcion?: string;
  estado?: string;
}

/* ============================================
   OBTENER TODAS LAS CATEGORIAS
============================================ */
export const obtenerCategorias = async (): Promise<Categoria[] | null> => {
  try {
    const res = await fetch(`${API_URL}/categorias`);

    if (!res.ok) {
      throw new Error(`Error al cargar categorías: ${res.status}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error obteniendo categorías:", error);
    return null;
  }
};


/* ============================================
   OBTENER UNA CATEGORIA POR ID
============================================ */
export const obtenerCategoria = async (id: number): Promise<Categoria | null> => {
  try {
    const res = await fetch(`${API_URL}/categorias/${id}`);

    if (!res.ok) {
      throw new Error(`Categoría no encontrada: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo categoría:", error);
    return null;
  }
};


/* ============================================
   GUARDAR CATEGORIA
============================================ */
export async function guardarCategoria(data: CategoriaData) {
  try {
    const response = await fetch(`${API_URL}/categorias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al guardar categoría");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en guardarCategoria:", err);
    throw err;
  }
}


/* ============================================
   ACTUALIZAR CATEGORIA
============================================ */
export async function actualizarCategoria(id: string, data: Partial<CategoriaData>) {
  try {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al actualizar categoría");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en actualizarCategoria:", err);
    throw err;
  }
}


/* ============================================
   ELIMINAR CATEGORIA
============================================ */
export async function eliminarCategoria(id: number) {
  try {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al eliminar categoría");
    }

    return true;

  } catch (err) {
    console.error("Error en eliminarCategoria:", err);
    throw err;
  }
}
