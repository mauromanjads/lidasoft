"use client";

import { useEffect, useState } from "react";
import ConfiguracionesDianTable from "@/components/tables/ConfiguracionesdianTable";
import { obtenerConfiguracionesDian } from "@/lib/api/configuracionesdian";
import { useParams } from "next/navigation";

// Interfaz esperada por la tabla
interface ConfiguracionDian {
   id: number;
  nit_emisor: string;
  software_id: string;
  pin_software: string;
  ambiente: string;
  certificado_firma: string
  clave_certificado: string
  activo: number
}

export default function ConfiguracionesDianPage() {
  const [configuracionesdian, setConfigs] = useState<ConfiguracionDian[]>([]);
  const params = useParams(); // por si luego quieres usar /configuracionesdian/[id]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerConfiguracionesDian();
        setConfigs(data as ConfiguracionDian[]);
      } catch (error) {
        console.error("Error cargando configuraciones DIAN:", error);
      }
    };

    fetchData();
  }, []);

  // Refrescar tabla después de crear/editar/eliminar
  const handleSaved = async () => {
    try {
      const data = await obtenerConfiguracionesDian();
      setConfigs(data as ConfiguracionDian[]);
    } catch (error) {
      console.error("Error refrescando configuraciones DIAN:", error);
    }
  };

  return (
    <div>
      <h1 className="flex items-center gap-2 text-lg font-semibold">
        ⚙️ Configuración DIAN
      </h1>

      <ConfiguracionesDianTable
        configuraciondian={configuracionesdian}
        onEdit={(id) => console.log("Editar configuración", id)}
        onDelete={(id) => console.log("Eliminar configuración", id)}
        onSaved={handleSaved}
      />
    </div>
  );
}
