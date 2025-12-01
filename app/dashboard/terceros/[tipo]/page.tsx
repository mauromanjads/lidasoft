"use client";

import { useEffect, useState } from "react";
import TercerosTable from "@/components/tables/TercerosTable";
import { obtenerTerceros } from "@/lib/api/terceros";
import { useParams } from "next/navigation";

// Interfaz que espera la tabla
interface Tercero {
  id: number;
  documento: string;
  nombre: string;
  celular: string;
  estado: string;
  tipo_documento_id: number;
  tipo_persona: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  fecha_nacimiento: string;
  genero_id: number;
  razon_social: string;
  regimen_id: number;
  ciiu_id: number;
  direccion: string;
  telefono: string;   
  whatsapp: string;
  correo: string;
}

export default function TercerosPage() {
  const [terceros, setTerceros] = useState<Tercero[]>([]);
  const params = useParams();       // 👈 aquí
  const tipo = params.tipo as string; // ← dinámico desde URL

  // Cargar terceros desde FastAPI
  useEffect(() => {   
    if (!tipo) return;

    const fetchTerceros = async () => {
      try {
        const data = await obtenerTerceros(tipo as string );
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
      const data = await obtenerTerceros(tipo as string);
      setTerceros(data as Tercero[]); // <-- casteo directo
    } catch (error) {
      console.error("Error refrescando datos:", error);
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        🧑‍💼 Listado de {tipo} 
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
