"use client"; 

import { useEffect, useState } from "react";
import TercerosTable from "@/components/tables/TercerosTable";
import { Terceros, obtenerTerceros } from "@/lib/api/terceros";


export default function TercerosPage() {
  const [tercero_t, setTerceros] = useState<Terceros[]>([]);

  // 🚀 Cargar desde FastAPI
  useEffect(() => {
    const fetchTerceros = async () => {
      try {
       const data = await obtenerTerceros();
        setTerceros(data || []);
      } catch (error) {
        console.error("Error cargando terceros:", error);
      }
    };

    fetchTerceros();
  }, []);

  const handleTerceroSaved = async () => {
      try {
        const data = await obtenerTerceros(); // Reutilizamos tu función fetch
        setTerceros(data || []);; // Actualizamos la tabla
      } catch (error) {
        console.error("Error refrescando datos:", error);
      }
    };


  return (
    <div >
      <h1 className="flex items-center gap-2 text-lg font-semibold"> {/* altura más baja */}        
        🧑‍💼Listado de Clientes
      </h1>

      <TercerosTable
        terceros = {tercero_t}
        onEdit={(id) => console.log("Editar", id)}
        onDelete={(id) => console.log("Eliminar", id)}
        onSaved={handleTerceroSaved}               
      />
    </div>
  );
}
