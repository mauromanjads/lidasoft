"use client";

import { useEffect, useState } from "react";
import UnidadesMedidaTable from "@/components/tables/UnidadesmedidaTable";
import { obtenerUnidades } from "@/lib/api/unidadesmedida";

// Interfaz esperada
interface Unidad {
  id: number;
  codigo: string;
  nombre: string;
}

export default function UnidadesMedidaPage() {
  const [unidades, setUnidades] = useState<Unidad[]>([]);

  // Cargar unidades desde FastAPI
  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const data = await obtenerUnidades();
        setUnidades(data as Unidad[]);
      } catch (error) {
        console.error("Error cargando unidades de medida:", error);
      }
    };

    fetchUnidades();
  }, []);

  // Refrescar tabla después de guardar
  const handleUnidadSaved = async () => {
    try {
      const data = await obtenerUnidades();
      setUnidades(data as Unidad[]);
    } catch (error) {
      console.error("Error refrescando unidades:", error);
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        ⚖️ Unidades de Medida
      </h1>

      <UnidadesMedidaTable
        unidades={unidades}
        onEdit={(id) => console.log("Editar unidad", id)}
        onDelete={(id) => console.log("Eliminar unidad", id)}
        onSaved={handleUnidadSaved}
      />
    </div>
  );
}
