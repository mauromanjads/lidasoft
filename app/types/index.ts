export interface UnidadMedida {
  id: number;
  codigo: string;
  nombre: string;
}

export interface ProductoPrecio {
  id: number;
  lista_precio: string;
  precio: number;
  iva_porcentaje: number;
  fecha_desde: string;
  fecha_hasta?: string | null;
  activo: boolean;
}

export interface ProductoPresentacion {
  id: number;
  tipo_presentacion: string;
  cantidad_equivalente: number;
  unidad_medida_id: number;
  precios: ProductoPrecio[];
  activo: boolean;
}

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  codigo_barra?: string;
  presentaciones: ProductoPresentacion[];
}
