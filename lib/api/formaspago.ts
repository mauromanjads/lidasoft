const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface FormasPago {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export const obtenerFormasPago = async (): Promise<FormasPago[]> => {
  const res = await fetch(`${API_URL}/formaspago`);
  if (!res.ok) throw new Error("Error al cargar formas de pago");
  return res.json();
};