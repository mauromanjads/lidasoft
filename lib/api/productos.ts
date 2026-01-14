import { Producto, ProductoPresentacion, UnidadMedida, Categoria, ProductoVariante } from "@/app/types";
import { authHeaders } from "@/lib/utils";

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
  return fetchAPI<Producto[]>(`${API_URL}/productos`  ,{
      headers: authHeaders(),
    });
};

// ===================== PRODUCTOS ACTIVOS =====================
export const obtenerProductosActivos = async (): Promise<Producto[]> => {
  const productos = await fetchAPI<Producto[]>(`${API_URL}/productos`  ,{
      headers: authHeaders(),
    });
  return productos.filter(producto => producto.activo);
};

// ===================== PRODUCTOS ACTIVOS =====================
export const obtenerProductosActivosMov = async (): Promise<Producto[]> => {
  const productos = await fetchAPI<Producto[]>(`${API_URL}/productos`  ,{
      headers: authHeaders(),
    });
  return productos.filter(producto => producto.activo && producto.control_inventario ==="S");
};


export const crearProducto = (data: Partial<Producto>): Promise<Producto> => {
  
  return fetchAPI<Producto>(`${API_URL}/productos`, {
    method: "POST",
    headers: authHeaders(),  
    body: JSON.stringify(data),
  });
};

export const actualizarProducto = (producto_id: number, data: Partial<Producto>): Promise<Producto> => {
  return fetchAPI<Producto>(`${API_URL}/productos/${producto_id}`, {
    method: "PUT",
    headers: authHeaders(),  
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
    headers: authHeaders(),  
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
    headers: authHeaders(),  
    body: JSON.stringify(data),
  });
};

export const listarPresentaciones = (
  producto_id: number,
  options?: { con_stock?: boolean; id_sucursal?: number }
): Promise<ProductoPresentacion[]> => {
  const params = new URLSearchParams();

  if (options?.con_stock) params.append("con_stock", "true");
  if (options?.id_sucursal) params.append("id_sucursal", options.id_sucursal.toString());

  const url = `${API_URL}/productos/${producto_id}/presentaciones?${params.toString()}`;

  return fetchAPI<ProductoPresentacion[]>(url, {
    headers: authHeaders(),
  });
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
      headers: authHeaders(),  
      body: JSON.stringify(data),
    }
  );
};

export const listarVariantes = (
  producto_id: number,
  options?: { con_stock?: boolean; id_sucursal?: number }
): Promise<ProductoVariante[]> => {
  const params = new URLSearchParams();

  if (options?.con_stock) params.append("con_stock", "true");
  if (options?.id_sucursal)
    params.append("id_sucursal", options.id_sucursal.toString());

  const url = `${API_URL}/productos/${producto_id}/variantes?${params.toString()}`;

   return fetchAPI<ProductoVariante[]>(url, {
    headers: authHeaders(),
  }).then((data) => {
    
    return data;
  });
};



export const obtenerVariante = (
  producto_id: number,
  variante_id: number
): Promise<ProductoVariante> => {
  return fetchAPI<ProductoVariante>(
    `${API_URL}/productos/${producto_id}/variantes/${variante_id}`,{
      headers: authHeaders(),
    }
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
      headers: authHeaders(),  
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
    { 
      method: "DELETE" ,
      headers: authHeaders(),
    }
  );
};


// ===================== UNIDADES DE MEDIDA =====================
export const obtenerUnidades = (): Promise<UnidadMedida[]> => {
  return fetchAPI<UnidadMedida[]>(`${API_URL}/unidades`,{
      headers: authHeaders(),
    });
};

// ===================== CATEGORIAS =====================
export const obtenerCategorias = (): Promise<Categoria[]> => {
  return fetchAPI<Categoria[]>(`${API_URL}/categorias`,{
      headers: authHeaders(),
    });
};

export const eliminarPresentacion = (  
  presentacion_id: number
): Promise<{ message: string }> => {
  return fetchAPI<{ message: string }>(
    `${API_URL}/productos/presentaciones/${presentacion_id}`,
    {
      method: "DELETE",
      headers: authHeaders(),  
    }
  );
};
