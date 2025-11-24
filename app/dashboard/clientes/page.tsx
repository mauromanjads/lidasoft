"use client"; 

import { useEffect, useState } from "react";
import ClientesTable from "@/components/tables/ClientesTable";
import { Clientes, obtenerClientes } from "@/lib/api/clientes";


export default function ClientesPage() {
  const [clientes, setClientes] = useState<Clientes[]>([]);

  // 🚀 Cargar clientes desde FastAPI
  useEffect(() => {
    const fetchClientes = async () => {
      try {
       const data = await obtenerClientes();
        setClientes(data);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const handleClienteSaved = async () => {
      try {
        const data = await obtenerClientes(); // Reutilizamos tu función fetch
        setClientes(data); // Actualizamos la tabla
      } catch (error) {
        console.error("Error refrescando clientes:", error);
      }
    };


  return (
    <div >
      <h1 className="flex items-center gap-2 text-lg font-semibold"> {/* altura más baja */}        
        🧑‍💼Listado de Clientes
      </h1>

      <ClientesTable
        clientes={clientes}
        onEdit={(id) => console.log("Editar", id)}
        onDelete={(id) => console.log("Eliminar", id)}
        onSaved={handleClienteSaved}       
        
      />
    </div>
  );
}





