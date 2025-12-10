
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface MediosPago {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export const obteneMediosPago = async (): Promise<MediosPago[]> => {
  const res = await fetch(`${API_URL}/mediospago`);
  if (!res.ok) throw new Error("Error al cargar medios de pago");
  return res.json();
};