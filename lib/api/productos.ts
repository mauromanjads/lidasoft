
import { Producto, ProductoPresentacion, ProductoPrecio, UnidadMedida } from "@/app/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Función genérica para fetch
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ===================== PRODUCTOS =====================
export const obtenerProductos = (): Promise<Producto[]> => {
  return fetchAPI<Producto[]>(`${API_URL}/productos`);
};

export const crearProducto = (data: Partial<Producto>): Promise<Producto> => {
  return fetchAPI<Producto>(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

// ===================== PRESENTACIONES =====================
export const crearPresentacion = (producto_id: number, data: Partial<ProductoPresentacion>): Promise<ProductoPresentacion> => {
  return fetchAPI<ProductoPresentacion>(`${API_URL}/productos/${producto_id}/presentaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

// ===================== PRECIOS =====================
export const crearPrecio = (presentacion_id: number, data: Partial<ProductoPrecio>): Promise<ProductoPrecio> => {
  return fetchAPI<ProductoPrecio>(`${API_URL}/productos/presentaciones/${presentacion_id}/precios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

// ===================== UNIDADES DE MEDIDA =====================
export const obtenerUnidades = (): Promise<UnidadMedida[]> => {
  return fetchAPI<UnidadMedida[]>(`${API_URL}/unidades`);
};
