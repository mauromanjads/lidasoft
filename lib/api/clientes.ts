const API_URL = process.env.NEXT_PUBLIC_API_URL;
export interface Clientes {
  id: number;       
  documento: string;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface ClienteData {  
  documento: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
}

export const obtenerClientes = async (): Promise<Clientes[] | null> => {
  try {
    const res = await fetch(`${API_URL}/clientes`);

    if (!res.ok) {
      throw new Error(`Error al cargar clientes: ${res.status}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    return null;  // ← importante para que no explote tu app
  }
};


export async function guardarCliente(data: ClienteData) {
  try {
    const response = await fetch(`${API_URL}/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al guardar cliente");
    }

    return await response.json();
  } catch (err) {
    console.error("Error en guardarCliente:", err);
    throw err;
  }
}

export async function actualizarCliente(id: string, data: any) {
  const res = await fetch(`${API_URL}/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error actualizando cliente");
  }

  return res.json();
}
