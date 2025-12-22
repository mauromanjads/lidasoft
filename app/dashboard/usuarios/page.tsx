"use client";

import { useEffect, useState } from "react";
import UsuariosTable from "@/components/tables/UsuariosTable";
import { obtenerUsuarios } from "@/lib/api/usuarios";
import { useParams } from "next/navigation";

/* =========================
   Interfaz para la tabla
========================= */
interface Usuario {
  id: number;
  usuario: string;
  nombre?: string;
  activo: boolean;
  rol?: {
    id: number;
    nombre: string;
  };
  sucursales?: {
    id: number;
    nombre: string;
  }[];
}

/* =========================
   Página
========================= */
export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const params = useParams(); // 👈 se mantiene por consistencia

  // Cargar usuarios desde FastAPI
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerUsuarios();
        setUsuarios(data as Usuario[]);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      }
    };

    fetchData();
  }, []);

  // Refrescar tabla tras guardar
  const handleUsuarioSaved = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data as Usuario[]);
    } catch (error) {
      console.error("Error refrescando usuarios:", error);
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        👤 Listado de Usuarios
      </h1>

      <UsuariosTable
        usuarios={usuarios}
        onEdit={(id) => console.log("Editar usuario", id)}
        onDelete={(id) => console.log("Eliminar usuario", id)}
        onSaved={handleUsuarioSaved}
      />
    </div>
  );
}
