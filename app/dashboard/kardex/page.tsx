"use client";

import { useEffect, useState } from "react";
import KardexTable from "@/components/tables/KardexTable";
import { obtenerKardex } from "@/lib/api/productos";
import { KardexMovimiento } from "@/app/types";
import { useMemo } from "react";

import DateFilter, { DateFilterValue } from "@/components/ui/DateFilter";

export default function KardexPage() {
  const [kardex, setKardex] = useState<KardexMovimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilterValue | null>(null);

  useEffect(() => {
    const fetchKardex = async () => {
      try {
        const data = await obtenerKardex();
        setKardex((data ?? []) as KardexMovimiento[]);
      } catch (error) {
        console.error("Error cargando Kardex:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKardex();
  }, []);

  const kardexFiltrado = useMemo(() => {
    if (!dateFilter) return kardex;

    return kardex.filter(m => {
      const fecha = m.fecha.slice(0, 10); // YYYY-MM-DD

      switch (dateFilter.mode) {
        case "day":
          return fecha === dateFilter.from;

        case "range":
        case "quick":
          return (
            fecha >= dateFilter.from! &&
            fecha <= dateFilter.to!
          );

        case "month":
          return fecha.startsWith(dateFilter.from!); // YYYY-MM

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
  }, [kardex, dateFilter]);



  return (
      <div className="space-y-4">
        {/* 🧰 TOOLBAR */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            📊 Kardex de productos
          </h1>

          {/* 🔎 FILTRO DE FECHA */}
          <div className="flex items-center gap-2 px-2 rounded-lg">
            <span>
              <h1 className="text-lg font-semibold">Fecha:</h1>
            </span>
            <DateFilter onChange={setDateFilter} />
          </div>
        </div>

        {/* CONTENIDO */}
        {loading ? (
          <p className="text-sm text-gray-500">Cargando Kardex...</p>
        ) : (
          <KardexTable movimientos={kardexFiltrado} />
        )}
      </div>
    );


}
