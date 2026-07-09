"use client"; // si estás en Next.js (app router)

import { useEffect, useState } from "react";
import { obtenerGenero, Genero } from "@/lib/api/generos";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function GeneroSelect({ formData, handleChange }: Props) {
  const [generos, setGenero] = useState<Genero[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerGenero();
        setGenero(data);
      } catch (error) {
        console.error(error);
      }
    };
    cargar();
  }, []);

  return (
    <div>
      <label className="block mb-1 font-medium">Genero</label>
      <select
        name="genero_id"
        value={formData.genero_id ?? ""}
        onChange={handleChange}
        required
        className="w-full border rounded-md p-2 border-gray-400"
      >
        <option value="">Seleccione...</option>
        {generos.map((td) => (
          <option key={td.id} value={td.id}>
            {td.descripcion}
          </option>
        ))}
      </select>
    </div>
  );
}
