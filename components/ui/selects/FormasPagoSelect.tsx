"use client"; // si estás en Next.js (app router)

import { useEffect, useState } from "react";
import { obtenerFormasPago, FormasPago } from "@/lib/api/formaspago";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function FormasPagoSelect({ formData, handleChange }: Props) {
  const [formaspago, setFormaPago] = useState<FormasPago[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerFormasPago();
         setFormaPago(data);
      } catch (error) {
        console.error(error);
      }
    };
    cargar();
  }, []);

  return (
    <div>
      <label className="block mb-1 font-medium">Formas de Pago</label>
      <select       
        name="forma_pago_id"
        value={formData.forma_pago_id ?? ""}
        onChange={handleChange}
        required
        className="w-full border rounded-md p-2 border-gray-400 "
      >
        <option value="">Seleccione...</option>
        {formaspago.map((td) => (
          <option key={td.id} value={td.id}>
            {td.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}