"use client";

import { useEffect, useState } from "react";
import KardexTable from "@/components/tables/KardexTable";
import { obtenerKardex } from "@/lib/api/productos";
import { KardexMovimiento } from "@/app/types";

export default function KardexPage() {
  const [kardex, setKardex] = useState<KardexMovimiento[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-4">

      {/* 🧰 HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          📊 Kardex de productos
        </h1>
      </div>

      {/* CONTENIDO */}
      {loading ? (
        <p className="text-sm text-gray-500">Cargando Kardex...</p>
      ) : (
        <KardexTable movimientos={kardex} />
      )}
    </div>
  );
}
