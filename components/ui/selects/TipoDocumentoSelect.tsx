"use client"; // si estás en Next.js (app router)

import { useEffect, useState } from "react";
import { obtenerTiposDocumento, TipoDocumento } from "@/lib/api/tiposDocumento";

interface Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function TipoDocumentoSelect({ formData, handleChange }: Props) {
  const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerTiposDocumento();
        setTiposDocumento(data);
      } catch (error) {
        console.error(error);
      }
    };
    cargar();
  }, []);

  return (
    <div>
      <label className="block mb-1 font-medium">Tipo de Documento</label>
      <select
        name="tipo_documento_id"
        value={formData.tipo_documento_id ?? ""}
        onChange={handleChange}
        required
        className="w-full border rounded-md p-2"
      >
        <option value="">Seleccione...</option>
        {tiposDocumento.map((td) => (
          <option key={td.id} value={td.id}>
            {td.descripcion}
          </option>
        ))}
      </select>
    </div>
  );
}
