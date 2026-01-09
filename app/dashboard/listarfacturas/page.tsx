"use client";

import { useEffect, useState,useMemo  } from "react";
import FacturasTable from "@/components/tables/FacturasTable";

import { obtenerFacturas } from "@/lib/api/facturas";
import DateFilter, { DateFilterValue } from "@/components/ui/DateFilter";



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
  tercero_id: number;
}
export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilterValue | null>(null);

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

  const facturasFiltradas = useMemo(() => {
  if (!dateFilter) return facturas;

  return facturas.filter(f => {
    const fecha = f.fecha_creacion.slice(0, 10);

    switch (dateFilter.mode) {
      case "day":
        return fecha === dateFilter.from;

      case "range":
      case "quick":
        return fecha >= dateFilter.from! && fecha <= dateFilter.to!;

      case "month":
        return fecha.startsWith(dateFilter.from!);

      case "week": {
        const start = new Date(dateFilter.from!);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        const fDate = new Date(fecha);
        return fDate >= start && fDate <= end;
      }

      default:
        return true;
    }
  });
}, [facturas, dateFilter]);


 return (
  <div className="space-y-4">
    <h1 className="flex items-center gap-2 text-lg font-semibold">
      🧾 Listado de Facturas
    </h1>

    {/* 🔎 FILTRO DE FECHA */}
    <DateFilter onChange={setDateFilter} />

    {loading ? (
      <p className="text-sm text-gray-500">Cargando facturas...</p>
    ) : (
      <FacturasTable facturas={facturasFiltradas} />
    )}
  </div>
);
}
