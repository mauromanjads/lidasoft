
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";

export interface MediosPago {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export const obteneMediosPago = async (): Promise<MediosPago[]> => {
  const res = await fetch(`${API_URL}/mediospago` ,{
      headers: authHeaders(),
    });
  if (!res.ok) throw new Error("Error al cargar medios de pago");
  return res.json();
};