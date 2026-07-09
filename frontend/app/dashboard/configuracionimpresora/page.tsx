"use client";

import { useEffect, useState } from "react";
import ConfiguracionImpresionForm from "@/components/forms/ConfiguracionImpresionForm";
import { obtenerConfiguracion } from "@/lib/api/configuracionimpresion";

export default function ConfiguracionImpresionPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarConfiguracion = async () => {
      try {
        const data = await obtenerConfiguracion();
        setConfig(data);
      } catch (err) {
        console.error("Error cargando configuración de impresión", err);
      } finally {
        setLoading(false);
      }
    };

    cargarConfiguracion();
  }, []);

  if (loading) return <p>Cargando configuración...</p>;
  if (!config) return <p>No hay configuración de impresión disponible</p>;

  return (
    <ConfiguracionImpresionForm
      config={config}
      onSaved={() => console.log("Configuración actualizada")}
    />
  );
}
