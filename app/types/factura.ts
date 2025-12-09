export interface FacturaDetalleForm {
  producto_id: number;
  presentacion_id: number;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  iva: number; // porcentaje, ej: 19
  subtotal: number;
  total: number;
}

export interface FacturaForm {
  id:null,
  tercero_id: number;
  vendedor_id:number;
  fecha:string;
  resolucion_id: number;
  prefijo: string;
  consecutivo: number;
  forma_pago: string;
  medio_pago?: string;
  notas?: string;
  detalles: FacturaDetalleForm[];
}

export interface TotalesFactura {
  subtotal: number;
  descuento_total: number;
  iva_total: number;
  total: number;
}
