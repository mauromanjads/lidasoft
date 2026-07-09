const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

export interface Ciiu {
  id: number;
  codigo: string;
  descripcion: string;
}

export const obtenerCiiu = async (): Promise<Ciiu[]> => {
  const res = await fetch(`${API_URL}/ciiu`,{
      headers: authHeaders(),
    });
  if (!res.ok) throw new Error("Error al cargar ciiu");
  return res.json();
};
