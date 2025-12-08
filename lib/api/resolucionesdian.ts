const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ============================================
   INTERFACES
============================================ */
export interface ResolucionDian {
  id: number;
  nit_emisor: string;
  tipo_documento: string;
  prefijo: string;
  numero_resolucion: string;
  fecha_inicio: string;
  fecha_fin: string;
  rango_desde: number;
  rango_hasta: number;
  usuario_creacion?: string;
  fecha_creacion?: string;
  usuario_modifico?: string;
  fecha_modificacion?: string;
}

export interface ResolucionDianData {
  nit_emisor: string;
  tipo_documento: string;
  prefijo: string;
  numero_resolucion: string;
  fecha_inicio: string;
  fecha_fin: string;
  rango_desde: number;
  rango_hasta: number;
}

/* ============================================
   OBTENER TODAS LAS RESOLUCIONES
============================================ */
export const obtenerResolucionesDian = async (): Promise<ResolucionDian[] | null> => {
  try {
    const res = await fetch(`${API_URL}/resolucionesdian`);

    if (!res.ok) {
      throw new Error(`Error al cargar resoluciones DIAN: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo resoluciones DIAN:", error);
    return null;
  }
};

/* ============================================
   OBTENER RESOLUCIONES FILTRADAS POR TIPO
============================================ */
export const obtenerResolucionesPorTipo = async (tipodoc: string) => {
  try {
    const res = await fetch(`${API_URL}/resolucionesdian?tipodoc=${tipodoc}`);

    if (!res.ok) {
      throw new Error(`Error al listar resoluciones por tipo: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error filtreando resoluciones:", error);
    return null;
  }
};

/* ============================================
   BUSCAR (prefijo o resolución)
============================================ */
export const buscarResolucionDian = async (query: string) => {
  try {
    const res = await fetch(`${API_URL}/resolucionesdian/buscar?query=${query}`);

    if (!res.ok) {
      throw new Error(`Error en búsqueda: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error buscando resolución:", error);
    return null;
  }
};

/* ============================================
   OBTENER UNA RESOLUCIÓN POR ID
============================================ */
export const obtenerResolucionDian = async (id: number): Promise<ResolucionDian | null> => {
  try {
    const res = await fetch(`${API_URL}/resolucionesdian/${id}`);

    if (!res.ok) {
      throw new Error(`Resolución DIAN no encontrada: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo resolución DIAN:", error);
    return null;
  }
};

/* ============================================
   GUARDAR RESOLUCIÓN DIAN
============================================ */
export async function guardarResolucionDian(data: ResolucionDianData) {
  try {
    const response = await fetch(`${API_URL}/resolucionesdian`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al guardar resolución DIAN");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en guardarResolucionDian:", err);
    throw err;
  }
}

/* ============================================
   ACTUALIZAR RESOLUCIÓN DIAN
============================================ */
export async function actualizarResolucionDian(id: number, data: Partial<ResolucionDianData>) {
  try {
    const response = await fetch(`${API_URL}/resolucionesdian/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al actualizar resolución DIAN");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en actualizarResolucionDian:", err);
    throw err;
  }
}

/* ============================================
   ELIMINAR RESOLUCIÓN DIAN
============================================ */
export async function eliminarResolucionDian(id: number) {
  try {
    const response = await fetch(`${API_URL}/resolucionesdian/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al eliminar resolución DIAN");
    }

    return true;

  } catch (err) {
    console.error("Error en eliminarResolucionDian:", err);
    throw err;
  }
}
