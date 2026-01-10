const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { authHeaders } from "@/lib/utils";

export interface DocumentosTipo {
  id: number;
  codigo: string;
  descripcion: string;
}

export const obtenerDocumentosTipo = async (): Promise<DocumentosTipo[]> => {
  try {
    const res = await fetch(`${API_URL}/documentos_tipo`, {
      headers: authHeaders(),
    });

    if (!res.ok) throw new Error(`Error: ${res.status}`);

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error obteniendo documentos tipo:", error);
    return [];
  }
};
