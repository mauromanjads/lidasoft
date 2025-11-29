"use client";

import { useEffect, useState } from "react";
import ProductosTable from "@/components/tables/ProductosTable";
import { obtenerProductos } from "@/lib/api/productos";
import { useParams } from "next/navigation";

// Interfaz que espera la tabla
interface Producto {
   id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const params = useParams();       // 👈 aquí
  
  // Cargar terceros desde FastAPI
  useEffect(() => {   
    
    const fetchProductos = async () => {
      try {
        const data = await obtenerProductos( );
        setProductos(data as Producto[]); // <-- casteo directo
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // Refrescar tabla tras guardar un tercero
  const handleTerceroSaved = async () => {
    try {
      const data = await obtenerProductos();
      setProductos(data as Producto[]); // <-- casteo directo
    } catch (error) {
      console.error("Error refrescando datos:", error);
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        🧑‍💼 Listado de productos 
      </h1>

      <ProductosTable
        productos={productos}
        onEdit={(id) => console.log("Editar", id)}
        onDelete={(id) => console.log("Eliminar", id)}
        onSaved={handleTerceroSaved}
      />
    </div>
  );
}

