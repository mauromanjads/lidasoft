import { Producto, ProductoPresentacion, UnidadMedida, Categoria, ProductoVariante } from "@/app/types";

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

// ===================== PRODUCTOS ACTIVOS =====================
export const obtenerProductosActivos = async (): Promise<Producto[]> => {
  const productos = await fetchAPI<Producto[]>(`${API_URL}/productos`);
  return productos.filter(producto => producto.activo);
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
    body: JSON.stringify({     
      ...data,
    }),
  });
};

export const actualizarPresentacion = (
  presentacion_id: number,
  data: Partial<ProductoPresentacion>
): Promise<ProductoPresentacion> => {
  return fetchAPI<ProductoPresentacion>(`${API_URL}/productos/presentaciones/${presentacion_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const listarPresentaciones = (producto_id: number): Promise<ProductoPresentacion[]> => {
  return fetchAPI<ProductoPresentacion[]>(`${API_URL}/productos/${producto_id}/presentaciones`);
};


// ===================== VARIANTES =====================

export const crearVariante = (
  producto_id: number,
  data: Partial<ProductoVariante>
): Promise<ProductoVariante> => {
  return fetchAPI<ProductoVariante>(
    `${API_URL}/productos/${producto_id}/variantes`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
};

export const listarVariantes = (
  producto_id: number
): Promise<ProductoVariante[]> => {
  return fetchAPI<ProductoVariante[]>(
    `${API_URL}/productos/${producto_id}/variantes`
  );
};

export const obtenerVariante = (
  producto_id: number,
  variante_id: number
): Promise<ProductoVariante> => {
  return fetchAPI<ProductoVariante>(
    `${API_URL}/productos/${producto_id}/variantes/${variante_id}`
  );
};

export const actualizarVariante = (
  producto_id: number,
  variante_id: number,
  data: Partial<ProductoVariante>
): Promise<ProductoVariante> => {
  return fetchAPI<ProductoVariante>(
    `${API_URL}/productos/${producto_id}/variantes/${variante_id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
};

export const eliminarVariante = (
  producto_id: number,
  variante_id: number
): Promise<{ message: string }> => {
  return fetchAPI<{ message: string }>(
    `${API_URL}/productos/${producto_id}/variantes/${variante_id}`,
    { method: "DELETE" }
  );
};


// ===================== UNIDADES DE MEDIDA =====================
export const obtenerUnidades = (): Promise<UnidadMedida[]> => {
  return fetchAPI<UnidadMedida[]>(`${API_URL}/unidades`);
};

// ===================== CATEGORIAS =====================
export const obtenerCategorias = (): Promise<Categoria[]> => {
  return fetchAPI<Categoria[]>(`${API_URL}/categorias`);
};

export const eliminarPresentacion = (  
  presentacion_id: number
): Promise<{ message: string }> => {
  return fetchAPI<{ message: string }>(
    `${API_URL}/productos/presentaciones/${presentacion_id}`,
    {
      method: "DELETE",
    }
  );
};
