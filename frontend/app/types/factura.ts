export interface FacturaDetalleForm {
  producto_id: number | null;
  presentacion_id: number | null;
  variante_id: number | null;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  iva: number;
  subtotal: number;
  total: number;
}

export interface FacturaForm {
  id: number | null;
  tipo_documento: string;
  tercero_id: number;
  vendedor_id: number;
  resolucion_id: number;
  prefijo: string;
  consecutivo: number;
  forma_pago_id: number;
  medio_pago_id: number;
  notas: string;
  fecha: string;
  detalles: FacturaDetalleForm[];
  [key: string]: unknown;
}
