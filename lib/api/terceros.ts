const API_URL = process.env.NEXT_PUBLIC_API_URL;
export interface Terceros {
  id: number;       
  documento: string;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface TercerosData {  
  documento: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
}

export const obtenerTerceros = async (): Promise<Terceros[] | null> => {
  try {
    const res = await fetch(`${API_URL}/terceros`);

    if (!res.ok) {
      throw new Error(`Error al cargar datos: ${res.status}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error obteniendo datos:", error);
    return null;  // ← importante para que no explote tu app
  }
};


export async function guardarTercero(data: TercerosData) {
  try {
    const response = await fetch(`${API_URL}/terceros`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Error al guardar");
    }

    return await response.json();
  } catch (err) {
    console.error("Error en guardar:", err);
    throw err;
  }
}

export async function actualizarTercero(id: string, data: any) {
  const res = await fetch(`${API_URL}/terceros/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error actualizando");
  }

  return res.json();
}
