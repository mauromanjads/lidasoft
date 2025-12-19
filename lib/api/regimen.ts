const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

export interface Regimen {
  id: number;
  codigo: string;
  descripcion: string;
}

export const obtenerRegimen = async (): Promise<Regimen[]> => {
  const res = await fetch(`${API_URL}/regimen` ,{
      headers: authHeaders(),
    });
  if (!res.ok) throw new Error("Error al cargar regimenes");
  return res.json();
};
