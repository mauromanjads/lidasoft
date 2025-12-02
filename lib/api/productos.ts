import { Producto, ProductoPresentacion, UnidadMedida, Categoria } from "@/app/types";

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

export const actualizarProducto = (producto_id: number, data: Partial<Producto>): Promise<Producto> => {
  return fetchAPI<Producto>(`${API_URL}/productos/${producto_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

// ===================== PRESENTACIONES =====================
export const crearPresentacion = (
  producto_id: number,
  data: Partial<ProductoPresentacion>
): Promise<ProductoPresentacion> => {
  return fetchAPI<ProductoPresentacion>(`${API_URL}/productos/${producto_id}/presentaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, producto_id }),
  });
};

export const actualizarPresentacion = (
  presentacion_id: number,
  data: Partial<ProductoPresentacion>
): Promise<ProductoPresentacion> => {
  return fetchAPI<ProductoPresentacion>(`${API_URL}/presentaciones/${presentacion_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const listarPresentaciones = (producto_id: number): Promise<ProductoPresentacion[]> => {
  return fetchAPI<ProductoPresentacion[]>(`${API_URL}/productos/${producto_id}/presentaciones`);
};

// ===================== UNIDADES DE MEDIDA =====================
export const obtenerUnidades = (): Promise<UnidadMedida[]> => {
  return fetchAPI<UnidadMedida[]>(`${API_URL}/unidades`);
};

// ===================== CATEGORIAS =====================
export const obtenerCategorias = (): Promise<Categoria[]> => {
  return fetchAPI<Categoria[]>(`${API_URL}/categorias`);
};
