"use client";

import { useEffect, useState } from "react";
import SucursalesTable from "@/components/tables/SucursalesTable";
import { obtenerSucursales } from "@/lib/api/sucursales";
import { useParams } from "next/navigation";

// Interfaz que espera la tabla
interface Sucursal {
  id: number;
  codigo: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  estado: boolean;
}

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const params = useParams(); // 👈 se mantiene por consistencia
  
  // Cargar sucursales desde FastAPI
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerSucursales();
        setSucursales(data as Sucursal[]); // <-- casteo directo
      } catch (error) {
        console.error("Error cargando sucursales:", error);
      }
    };

    fetchData();
  }, []);

  // Refrescar tabla tras guardar
  const handleSucursalSaved = async () => {
    try {
      const data = await obtenerSucursales();
      setSucursales(data as Sucursal[]);
    } catch (error) {
      console.error("Error refrescando sucursales:", error);
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        🏢 Listado de Sucursales
      </h1>

      <SucursalesTable
        sucursales={sucursales}
        onEdit={(id) => console.log("Editar", id)}
        onDelete={(id) => console.log("Eliminar", id)}
        onSaved={handleSucursalSaved}
      />
    </div>
  );
}
