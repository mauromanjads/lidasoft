const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

export interface TipoDocumento {
  id: number;
  codigo: string;
  descripcion: string;
}

export const obtenerTiposDocumento = async (): Promise<TipoDocumento[]> => {
  const res = await fetch(`${API_URL}/tiposdocumento` ,{
      headers: authHeaders(),
    });
  if (!res.ok) throw new Error("Error al cargar tipos de documento");
  return res.json();
};
