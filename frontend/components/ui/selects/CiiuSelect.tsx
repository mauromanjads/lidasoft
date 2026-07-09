"use client"; // si estás en Next.js (app router)

import { useEffect, useState } from "react";
import { obtenerCiiu, Ciiu } from "@/lib/api/ciiu";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function CiiuSelect({ formData, handleChange }: Props) {
  const [ciiu, setCiiu] = useState<Ciiu[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerCiiu();
        setCiiu(data);
      } catch (error) {
        console.error(error);
      }
    };
    cargar();
  }, []);

  return (
    <div>
      <label className="block mb-1 font-medium">Ciiu</label>
      <select
        name="ciiu_id"
        value={formData.ciiu_id ?? ""}
        onChange={handleChange}
        required
        className="w-full border rounded-md p-2 border-gray-400"
      >
        <option value="">Seleccione...</option>
        {ciiu.map((td) => (
          <option key={td.id} value={td.id}>
            {td.descripcion}
          </option>
        ))}
      </select>
    </div>
  );
}
