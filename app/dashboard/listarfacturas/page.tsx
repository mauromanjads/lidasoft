"use client";

import { useEffect, useState } from "react";
import FacturasTable from "@/components/tables/FacturasTable";
import { obtenerFacturas } from "@/lib/api/facturas";

// 👉 Interfaz que consume la tabla
interface Factura {
  id: number;
  numero_completo: string;
  subtotal: number;
  descuento_total: number;
  iva_total: number;
  total: number;
  fecha_creacion: string;
  usuario_creacion?: string;
}
export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const data = await obtenerFacturas();
        setFacturas(data as Factura[]);
      } catch (error) {
        console.error("Error cargando facturas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        🧾 Listado de Facturas
      </h1>

      {loading ? (
        <p className="text-sm text-gray-500">Cargando facturas...</p>
      ) : (
        <FacturasTable facturas={facturas} />
      )}
    </div>
  );
}
