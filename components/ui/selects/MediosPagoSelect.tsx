"use client"; // si estás en Next.js (app router)

import { useEffect, useState } from "react";
import { obteneMediosPago, MediosPago } from "@/lib/api/mediospago";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function MediosPagoSelect({ formData, handleChange }: Props) {
  const [mediospago, setData] = useState<MediosPago[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obteneMediosPago();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };
    cargar();
  }, []);

  return (
    <div>
      <label className="block mb-1 font-medium">Medios de Pago</label>
      <select
        name="medio_pago_id"
       value={formData.medio_pago_id ?? ""}
        onChange={handleChange}
        required
        className="w-full border rounded-md p-2 border-gray-400"
      >
        <option value="">Seleccione...</option>
        {mediospago.map((td) => (
          <option key={td.id} value={td.id}>
            {td.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}