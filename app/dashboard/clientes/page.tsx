"use client"; 

import Image from "next/image";

import { useEffect, useState } from "react";
import ClientesTable from "@/components/tables/ClientesTable";

interface Cliente {
  id: number;
  nit: string;
  nombre: string;
  telefono: string;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // 🚀 Cargar clientes desde FastAPI
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch("http://localhost:8000/clientes"); 
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setClientes(data);
      } catch (error) {
        console.error("Error cargando clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  return (
    <div >
      <h1 className="flex items-center gap-2 text-lg font-semibold"> {/* altura más baja */}        
        🧑‍💼Listado de Clientes
      </h1>

      <ClientesTable
        clientes={clientes}
        onEdit={(id) => console.log("Editar", id)}
        onDelete={(id) => console.log("Eliminar", id)}
      />
    </div>
  );
}





