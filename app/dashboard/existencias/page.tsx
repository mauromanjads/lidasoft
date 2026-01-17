"use client";

import { useEffect, useState } from "react";
import ExistenciasTable from "@/components/tables/ExistenciasTable";
import { obtenerExistencias } from "@/lib/api/productos";
import { Existencia } from "@/app/types";

export default function ExistenciasPage() {
  const [existencias, setExistencias] = useState<Existencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExistencias = async () => {
      try {
        const data = await obtenerExistencias();
        setExistencias((data ?? []) as Existencia[]);
      } catch (error) {
        console.error("Error cargando existencias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistencias();
  }, []);

  return (
    <div className="space-y-4">

      {/* 🧰 HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          📦 Inventario de productos
        </h1>
      </div>

      {/* CONTENIDO */}
      {loading ? (
        <p className="text-sm text-gray-500">Cargando existencias...</p>
      ) : (
        <ExistenciasTable existencias={existencias} />
      )}
    </div>
  );
}
