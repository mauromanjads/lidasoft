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

    const normalizeDate = (value: string | Date) => {
      const d = new Date(value);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };


    const facturasFiltradas = useMemo(() => {
      if (!dateFilter) return facturas;

      return facturas.filter(f => {
        const fechaFactura = normalizeDate(f.fecha_creacion);

        switch (dateFilter.mode) {
          case "day":
            return fechaFactura === normalizeDate(dateFilter.from!);

          case "quick":
          case "range": {
            const from = normalizeDate(dateFilter.from!);
            const to = normalizeDate(dateFilter.to!);
            return fechaFactura >= from && fechaFactura <= to;
          }

          case "month":
            return fechaFactura.startsWith(dateFilter.from!);

          case "week": {
            const start = new Date(dateFilter.from!);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            const fDate = new Date(fechaFactura);
            return fDate >= start && fDate <= end;
          }

          default:
            return true;
        }
      });
    }, [facturas, dateFilter]);



 return (
  <div className="space-y-4">
    {/* 🧰 TOOLBAR */}
    <div className="flex items-center justify-between  ">
      <h1 className="text-lg font-semibold">
        🧾 Listado de Facturas
      </h1>

      {/* 🔎 FILTRO DE FECHA */}
      <div className="flex items-center gap-2 px-2  rounded-lg">
        <span>
        <h1 className="text-lg font-semibold">Fecha:</h1> 
        </span>
        <DateFilter onChange={setDateFilter} />
      </div>
    </div>

    {/* CONTENIDO */}
    {loading ? (
      <p className="text-sm text-gray-500">Cargando facturas...</p>
    ) : (
      <FacturasTable facturas={facturasFiltradas} />
    )}
  </div>
);


}
