const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

/* ============================================
   INTERFACES
============================================ */
export interface FacturaDetalleData {
  producto_id: number | null;
  presentacion_id?: number | null;
  variante_id?: number | null;
  descripcion: string;

  cantidad: number;
  precio_unitario: number;
  descuento: number;
  iva: number; // porcentaje enviado al backend
}

export interface FacturaData {
  tercero_id: number;
  vendedor_id: number;
  resolucion_id: number;

  prefijo: string;
  consecutivo: number;

  forma_pago_id: number;
  medio_pago_id: number;

  notas?: string;

  detalles: FacturaDetalleData[];
}

export interface Factura extends FacturaData {
  id: number;
  numero_completo: string;
  subtotal: number;
  descuento_total: number;
  iva_total: number;
  total: number;
  fecha_creacion: string;
  usuario_creacion?: string;
}

/* ============================================
   OBTENER TODAS LAS FACTURAS
============================================ */
export const obtenerFacturas = async (): Promise<Factura[] | null> => {
  try {
    const res = await fetch(`${API_URL}/facturas` ,{
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Error al cargar facturas: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo facturas:", error);
    return null;
  }
};

/* ============================================
   OBTENER UNA FACTURA POR ID
============================================ */
export const obtenerFactura = async (id: number): Promise<Factura | null> => {
  try {
    const res = await fetch(`${API_URL}/facturas/${id}` ,{
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Factura no encontrada: ${res.status}`);
    }

    return await res.json();

  } catch (error) {
    console.error("Error obteniendo factura:", error);
    return null;
  }
};

/* ============================================
   CREAR FACTURA
============================================ */
export async function crearFactura(data: FacturaData) {
  try {
    
    console.log("➡️ DATA QUE LLEGA A crearFactura:", data)
    
    const response = await fetch(`${API_URL}/facturas`, {
      method: "POST",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al crear factura");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en crearFactura:", err);
    throw err;
  }
}

/* ============================================
   ACTUALIZAR FACTURA
============================================ */
export async function actualizarFactura(id: number, data: FacturaData) {
  try {
    const response = await fetch(`${API_URL}/facturas/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al actualizar factura");
    }

    return await response.json();

  } catch (err) {
    console.error("Error en actualizarFactura:", err);
    throw err;
  }
}

/* ============================================
   ELIMINAR FACTURA
============================================ */
export async function eliminarFactura(id: number) {
  try {
    const response = await fetch(`${API_URL}/facturas/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: authHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || "Error al eliminar factura");
    }

    return true;

  } catch (err) {
    console.error("Error en eliminarFactura:", err);
    throw err;
  }
}
