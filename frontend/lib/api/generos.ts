const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

export interface Genero {
  id: number;
  codigo: string;
  descripcion: string;
}

export const obtenerGenero = async (): Promise<Genero[]> => {
  const res = await fetch(`${API_URL}/generos` ,{
      headers: authHeaders(),
    });
  if (!res.ok) throw new Error("Error al cargar generos");
  return res.json();
};
