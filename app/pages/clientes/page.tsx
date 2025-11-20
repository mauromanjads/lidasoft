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
    <div className="p-6">
      <h1 className="text-xl font-bold">Listado de Clientes</h1>

      {/* 👇 Le pasas los clientes al componente */}
      <ClientesTable
        clientes={clientes}
        onEdit={(id) => console.log("Editar", id)}
        onDelete={(id) => console.log("Eliminar", id)}
      />
    </div>
  );
}





