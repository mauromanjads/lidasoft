"use client";

import { useEffect, useState } from "react";
import CategoriasTable from "@/components/tables/CategoriasTable";
import { obtenerCategorias} from "@/lib/api/categorias";
import { useParams } from "next/navigation";

// Interfaz que espera la tabla
interface Categoria {
   id: number;  
  nombre: string;
  descripcion: string;
  estado: string;}

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const params = useParams();       // 👈 aquí
  
  // Cargar terceros desde FastAPI
  useEffect(() => {   
    
    const fetchCategorias = async () => {
      try {
        const data = await obtenerCategorias( );
        setCategorias(data as Categoria[]); // <-- casteo directo
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  // Refrescar tabla tras guardar 
  const handleCategoriaSaved = async () => {
    try {
      const data = await obtenerCategorias();
      setCategorias(data as Categoria[]); // <-- casteo directo
    } catch (error) {
      console.error("Error refrescando datos:", error);
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        🧑‍💼 Listado de Categorías 
      </h1>

      <CategoriasTable
        categorias={categorias}
        onEdit={(id) => console.log("Editar", id)}
        onDelete={(id) => console.log("Eliminar", id)}
        onSaved={handleCategoriaSaved}
      />
    </div>
  );
}

