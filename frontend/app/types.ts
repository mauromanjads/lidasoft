export interface Existencia {
  producto?: string;
  categoria?: string;
  presentacion?: string;
  sku?: string;
  atributos?: string | null;
  existencias?: number;
  sucursal?: string;
  [key: string]: unknown;
}

export interface KardexMovimiento {
  fecha?: string | Date | null;
  producto?: string;
  presentacion?: string;
  sku?: string;
  tipo_movimiento?: "E" | "S" | string;
  cantidad_movimiento?: number;
  saldo_cantidad?: number;
  costo_unitario?: number;
  costo_movimiento?: number;
  saldo_costo?: number;
  sucursal?: string;
  [key: string]: unknown;
}

export interface Producto {
  id?: number;
  codigo?: string;
  nombre?: string;
  descripcion?: string | null;
  activo?: boolean;
  codigo_barra?: string | null;
  control_inventario?: string | null;
  tipo_impuesto?: string | null;
  iva?: number;
  unidad_medida_id?: number | null;
  categoria_id?: number | null;
  sku?: string | null;
  precio?: number;
  costo?: number;
  presentaciones?: ProductoPresentacion[];
  variantes?: ProductoVariante[];
  [key: string]: unknown;
}

export interface ProductoPresentacion {
  id?: number;
  producto_id?: number;
  descripcion?: string;
  tipo_presentacion?: string;
  precio?: number;
  costo?: number;
  unidad_medida_id?: number;
  [key: string]: unknown;
}

export interface ProductoVariante {
  id?: number;
  producto_id?: number;
  nombre?: string;
  sku?: string;
  precio?: number;
  costo?: number;
  [key: string]: unknown;
}

export interface UnidadMedida {
  id?: number;
  codigo?: string;
  descripcion?: string;
  nombre?: string;
  [key: string]: unknown;
}

export interface Categoria {
  id?: number;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  [key: string]: unknown;
}
