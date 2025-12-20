"use client";

import { useEffect, useState } from "react";
import EmpresaFormComponent from "@/components/forms/EmpresaForm";
import { obtenerEmpresa } from "@/lib/api/empresas";
import { getEmpresaFromStorage } from "@/app/dependencias/autenticacion";

export default function EmpresasPage() {
  const [empresa, setEmpresa] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEmpresa = async () => {
      const id_empresa = getEmpresaFromStorage();

      if (!id_empresa) {
        console.error("Usuario sin empresa asignada");
        return;
      }

      try {
        const data = await obtenerEmpresa(id_empresa);
        setEmpresa(data);
      } catch (err) {
        console.error("Error cargando empresa", err);
      } finally {
        setLoading(false);
      }
    };

    cargarEmpresa();
  }, []);

  if (loading) return <p>Cargando empresa...</p>;

  return <EmpresaFormComponent empresa={empresa} />;
}

