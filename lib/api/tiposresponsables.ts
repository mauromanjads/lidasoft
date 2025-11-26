const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface TipoResponsables {
  id: number;
  codigo: string;
  descripcion: string;
}

export const obtenerTiposResponsables = async (): Promise<TipoResponsables[]> => {
  const res = await fetch(`${API_URL}/tiposresponsables`);
  if (!res.ok) throw new Error("Error al cargar tipos de responsables");
  return res.json();
};
