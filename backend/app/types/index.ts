// types.ts

// ===================== UNIDADES DE MEDIDA =====================
export interface UnidadMedida {
  id: number;
  nombre: string;
  codigo: string;
}

// ===================== CATEGORIAS =====================
export interface Categoria {
  id: number;
  nombre: string;
  parametros?: { [campo: string]: string };
}

// ===================== PRODUCTOS =====================
export interface Producto {
  id?: number; // opcional en creación
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
  codigo_barra?: string;
  categoria_id?: number;
  iva?: number;
  tipo_impuesto?: string;
  unidad_medida_id?: number;
  control_inventario?: string;
  stock_actual?: number;
  tiene_variantes?: boolean;
}

// ===================== PRESENTACIONES =====================
export interface ProductoPresentacion {
  id?: number; // opcional en creación
  producto_id: number;
  tipo_presentacion: string;
  cantidad_equivalente: number;
  unidad_medida_id: number;
  activo?: boolean;
  precio_venta?: number;
  precio_compra?: number;
  stock_actual?:number;
  control_inventario?:string;
}

// ===================== PRODUCTO + PRESENTACIONES =====================
export interface ProductoConPresentaciones extends Producto {
  presentaciones: ProductoPresentacion[];
}

// ===================== VARIANTES =====================
export interface ProductoVariante {
  id?: number; // opcional en creación
  producto_id: number;
  sku: string; // SKU único
  parametros?: Record<string, string>; // campo: valor
  descripcion:string;
  precio_venta?: number;
  precio_compra?: number;
  activo?: boolean;
  stock_actual?:number;
  presentacion_id_inv?:number;
  control_inventario?:string;
}

// ===================== PRODUCTO + VARIANTES =====================
export interface ProductoConVariantes extends Producto {
  variantes: ProductoVariante[];
}

// =====================EXISTENCIAS DE PRODUCTOS=====================
export interface Existencia {
  id: number;
  producto: string;
  categoria: string;
  presentacion: string;
  sku: string;
  atributos?: string;
  existencias: number;
  sucursal: string;
}

// ===================== KARDEX DE INVENTARIO =====================
export interface KardexMovimiento {
  id: number;
  fecha: string; // ISO date (YYYY-MM-DD o datetime)

  // Documento
  tipo_documento: string;
  tipo_doc_desc: string;
  tipo_movimiento: 'E' | 'S';

  // Producto
  producto: string;
  categoria: string;
  presentacion: string;
  sku?: string;
  atributos?: string;

  // Ubicación
  sucursal: string;

  // Movimiento
  cantidad_movimiento: number;
  costo_unitario: number;
  costo_movimiento: number;

  // Saldos
  saldo_cantidad: number;
  saldo_costo: number;
}
