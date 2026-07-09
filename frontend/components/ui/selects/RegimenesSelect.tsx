"use client"; // si estás en Next.js (app router)

import { useEffect, useState } from "react";
import { obtenerRegimen, Regimen } from "@/lib/api/regimen";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function RegimenesSelect({ formData, handleChange }: Props) {
  const [regimenes, setRegimen] = useState<Regimen[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerRegimen();
        setRegimen(data);
      } catch (error) {
        console.error(error);
      }
    };
    cargar();
  }, []);

  return (
    <div>
      <label className="block mb-1 font-medium">Régimen Tributario</label>
      <select
        name="regimen_id"
        value={formData.regimen_id ?? ""}
        onChange={handleChange}
        required
        className="w-full border rounded-md p-2 border-gray-400"
      >
        <option value="">Seleccione...</option>
        {regimenes.map((td) => (
          <option key={td.id} value={td.id}>
            {td.descripcion}
          </option>
        ))}
      </select>
    </div>
  );
}
