"use client";

import { useEffect, useState } from "react";
import RolesTable from "@/components/tables/RolesTable";
import { obtenerRoles } from "@/lib/api/roles";
import { useParams } from "next/navigation";

/* =========================
   Interfaz para la tabla
========================= */
interface Rol {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

/* =========================
   Página
========================= */
export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const params = useParams(); // 👈 se mantiene por consistencia

  // Cargar roles desde FastAPI
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerRoles();
        setRoles(data as Rol[]);
      } catch (error) {
        console.error("Error cargando roles:", error);
      }
    };

    fetchData();
  }, []);

  // Refrescar tabla tras guardar
  const handleRolSaved = async () => {
    try {
      const data = await obtenerRoles();
      setRoles(data as Rol[]);
    } catch (error) {
      console.error("Error refrescando roles:", error);
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        🔐 Listado de Roles
      </h1>

      <RolesTable
        roles={roles}
        onEdit={(id) => console.log("Editar rol", id)}
        onDelete={(id) => console.log("Eliminar rol", id)}
        onSaved={handleRolSaved}
      />
    </div>
  );
}
