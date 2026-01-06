const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

/* ============================
   INTERFACES
============================= */
export interface ConfiguracionImpresion {
  id: number;
  habilitar_pos: boolean;
  habilitar_a4: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface ConfiguracionImpresionData {
  habilitar_pos?: boolean;
  habilitar_a4?: boolean;
}

/* ============================
   OBTENER CONFIGURACION
============================= */
export const obtenerConfiguracion = async (): Promise<ConfiguracionImpresion | null> => {
  try {
    const res = await fetch(`${API_URL}/configuracion-impresion`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Error al cargar configuración: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error obteniendo configuración:", error);
    return null;
  }
};

/* ============================
   GUARDAR CONFIGURACION
============================= */
export async function guardarConfiguracion(data: ConfiguracionImpresionData) {
  try {
    const response = await fetch(`${API_URL}/configuracion-impresion`, {
      method: "POST",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || "Error al guardar configuración");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en guardarConfiguracion:", err);
    throw err;
  }
}

/* ============================
   ACTUALIZAR CONFIGURACION
============================= */
export async function actualizarConfiguracion(data: ConfiguracionImpresionData) {
  try {
    const response = await fetch(`${API_URL}/configuracion-impresion`, {
      method: "PUT",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.detail || "Error al actualizar configuración");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en actualizarConfiguracion:", err);
    throw err;
  }
}
