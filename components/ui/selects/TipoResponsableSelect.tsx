"use client"; // si estás en Next.js (app router)

import { useEffect, useState } from "react";
import { obtenerTiposResponsables, TipoResponsables } from "@/lib/api/tiposresponsables";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function TiposResponsablesSelect({ formData, handleChange }: Props) {
  const [tiposresponsables, setTiposresponsables] = useState<TipoResponsables[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerTiposResponsables();
        setTiposresponsables(data);
      } catch (error) {
        console.error(error);
      }
    };
    cargar();
  }, []);

  return (
    <div>
      <label className="block mb-1 font-medium">Tipos de Responsabilidades</label>
      <select
        name="tipo_responsable_id"
        value={formData.tipo_responsable_id ?? ""}
        onChange={handleChange}
        required
        className="w-full border rounded-md p-2"
      >
        <option value="">Seleccione...</option>
        {tiposresponsables.map((td) => (
          <option key={td.id} value={td.id}>
            {td.descripcion}
          </option>
        ))}
      </select>
    </div>
  );
}
