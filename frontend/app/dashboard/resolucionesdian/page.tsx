"use client";

import { useEffect, useState } from "react";
import ResolucionesdianTable from "@/components/tables/ResolucionesdianTable";
import { obtenerResolucionesDian} from "@/lib/api/resolucionesdian";
import { useParams } from "next/navigation";

// Interfaz que espera la tabla
interface ResolucionDian {
  id: number;
  numero_resolucion: string;
  prefijo: string;   
  rango_inicial: number;
  rango_final: number;
  rango_actual: number;
  fecha_resolucion: Date;
  fecha_inicio: Date;
  fecha_fin: Date;
  llave_tecnica: string
  tipo_documento: string;
  activo: number ,
  predeterminado: number;  
}

export default function ResolucionesdianPage() {
  const [resoluciondian, setResolucionesdian] = useState<ResolucionDian[]>([]);
  const params = useParams();       // 👈 aquí
  
  // Cargar terceros desde FastAPI
  useEffect(() => {   
    
    const fetchData = async () => {
      try {
        const data = await obtenerResolucionesDian( );
        setResolucionesdian(data as ResolucionDian[]); // <-- casteo directo
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };

    fetchData();
  }, []);

  // Refrescar tabla tras guardar 
  const handleCategoriaSaved = async () => {
    try {
      const data = await obtenerResolucionesDian();
      setResolucionesdian(data as ResolucionDian[]); // <-- casteo directo
    } catch (error) {
      console.error("Error refrescando datos:", error);
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        🧩 Listado de Resoluciones 
      </h1>

      <ResolucionesdianTable
        resoluciondian={resoluciondian}
        onEdit={(id) => console.log("Editar", id)}
        onDelete={(id) => console.log("Eliminar", id)}
        onSaved={handleCategoriaSaved}
      />
    </div>
  );
}

