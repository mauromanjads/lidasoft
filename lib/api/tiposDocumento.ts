export interface TipoDocumento {
  id: number;
  codigo: string;
  descripcion: string;
}

export const obtenerTiposDocumento = async (): Promise<TipoDocumento[]> => {
  const res = await fetch("http://localhost:8000/tiposdocumento");
  if (!res.ok) throw new Error("Error al cargar tipos de documento");
  return res.json();
};
