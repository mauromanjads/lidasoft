const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

export interface Terceros {
  id: number;       
  documento: string;
  nombre: string;
  telefono: string;
  direccion: string;
  celular:string;
  correo:string;
}

export interface TercerosData {  
  documento: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
}

export const obtenerTerceros = async (tipotercero:string): Promise<Terceros[] > => {
  try {
    const res = await fetch(`${API_URL}/terceros/${tipotercero}` ,{
      headers: authHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Error al cargar datos: ${res.status}`);
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error obteniendo datos:", error);
    return [];  // ← importante para que no explote tu app
  }
};


export async function guardarTercero(data: TercerosData) {
  try {
    const response = await fetch(`${API_URL}/terceros`, {
      method: "POST",
      headers: authHeaders(),
      credentials: "include", 
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
    headers: authHeaders(),
    credentials: "include", 
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error actualizando");
  }

  return res.json();
}
