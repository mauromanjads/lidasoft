export interface Clientes {
  id: number;       
  nit: string;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface ClienteData {  
  nit: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
}

export const obtenerClientes = async (): Promise<Clientes[] | null> => {
  try {
    const res = await fetch("http://localhost:8000/clientes");

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
    const response = await fetch("http://localhost:8000/clientes", {
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
  const res = await fetch(`http://localhost:8000/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error actualizando cliente");
  }

  return res.json();
}
