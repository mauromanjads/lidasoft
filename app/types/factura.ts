export interface FacturaDetalleForm {
  producto_id: number;
  presentacion_id: number;
   variante_id: number | null; 
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  iva: number; // porcentaje, ej: 19
  subtotal: number;
  total: number;
  presentacion_nombre?: string;
}

export interface FacturaForm {
  id:null,
  tercero_id: number;
  vendedor_id:number;
  fecha:string;
  resolucion_id: number;
  prefijo: string;
  consecutivo: number;
  forma_pago_id?: number;
  medio_pago_id?: number;
  notas?: string;
  detalles: FacturaDetalleForm[];
}

export interface TotalesFactura {
  subtotal: number;
  descuento_total: number;
  iva_total: number;
  total: number;
}
