const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

/* ============================================
   INTERFACES
============================================ */
export interface ConfiguracionDian {
  id: number;
  nit_emisor: string;
  nombre_emisor: string;
  software_id: string;
  pin_software: string;
  ambiente: string;
  certificado_firma: string
  clave_certificado: string
  activo: number
  regimen: string

}

export interface ConfiguracionDianData {
  nit_emisor: string;
  nombre_emisor: string;
  software_id: string;
  pin_software: string;
  ambiente: string;
  certificado_firma: string
  clave_certificado: string
  activo: number
  regimen: string
}

/* ============================================
   OBTENER TODAS LAS CONFIGURACIONES DIAN
============================================ */
export const obtenerConfiguracionesDian = async (): Promise<ConfiguracionDian[] | null> => {
  try {
    const res = await fetch(`${API_URL}/configuraciondian`,{
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Error al cargar configuraciones DIAN: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo configuraciones DIAN:", error);
    return null;
  }
};

/* ============================================
   OBTENER UNA CONFIGURACIÓN POR ID
============================================ */
export const obtenerConfiguracionDian = async (id: number): Promise<ConfiguracionDian | null> => {
  try {
    const res = await fetch(`${API_URL}/configuraciondian/${id}`,{
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Configuración DIAN no encontrada: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo configuración DIAN:", error);
    return null;
  }
};

/* ============================================
   GUARDAR CONFIGURACIÓN DIAN
============================================ */
export async function guardarConfiguracionDian(data: ConfiguracionDianData) {
  try {
    const response = await fetch(`${API_URL}/configuraciondian`, {
      method: "POST",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al guardar configuración DIAN");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en guardarConfiguracionDian:", err);
    throw err;
  }
}

/* ============================================
   ACTUALIZAR CONFIGURACIÓN DIAN
============================================ */
export async function actualizarConfiguracionDian(id: number, data: Partial<ConfiguracionDianData>) {
  try {
    const response = await fetch(`${API_URL}/configuraciondian/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al actualizar configuración DIAN");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en actualizarConfiguracionDian:", err);
    throw err;
  }
}

/* ============================================
   ELIMINAR CONFIGURACIÓN DIAN
============================================ */
export async function eliminarConfiguracionDian(id: number) {
  try {
    const response = await fetch(`${API_URL}/configuraciondian/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: authHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al eliminar configuración DIAN");
    }

    return true;

  } catch (err) {
    console.error("Error en eliminarConfiguracionDian:", err);
    throw err;
  }
}
