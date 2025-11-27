"use client";

import { useEffect, useState } from "react";
import TercerosTable from "@/components/tables/TercerosTable";
import { obtenerTerceros } from "@/lib/api/terceros";

// Interfaz que espera la tabla
interface Tercero {
  id: number;
  documento: string;
  nombre: string;
  celular: string;
  estado: string;
  tipo_documento_id: number;
  tipo_persona?: string;
}

export default function TercerosPage() {
  const [terceros, setTerceros] = useState<Tercero[]>([]);

  // Cargar terceros desde FastAPI
  useEffect(() => {
    const fetchTerceros = async () => {
      try {
        const data = await obtenerTerceros();
        setTerceros(data as Tercero[]); // <-- casteo directo
      } catch (error) {
        console.error("Error cargando terceros:", error);
      }
    };

    fetchTerceros();
  }, []);

  // Refrescar tabla tras guardar un tercero
  const handleTerceroSaved = async () => {
    try {
      const data = await obtenerTerceros();
      setTerceros(data as Tercero[]); // <-- casteo directo
    } catch (error) {
      console.error("Error refrescando datos:", error);
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        🧑‍💼 Listado de Clientes
      </h1>

      <TercerosTable
        terceros={terceros}
        onEdit={(id) => console.log("Editar", id)}
        onDelete={(id) => console.log("Eliminar", id)}
        onSaved={handleTerceroSaved}
      />
    </div>
  );
}
