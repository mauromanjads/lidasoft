

"use client";
import Button from "@/components/ui/button";

interface Props {
  clientes: Array<{ id: number; nit: string; nombre: string; telefono: string }>;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function ClientesTable({ clientes, onEdit, onDelete }: Props) {
  return (
    <table className="w-full border mt-6">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2">NIT</th>
          <th className="p-2">Nombre</th>
          <th className="p-2">Teléfono</th>
          <th className="p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes?.map((c) => (
          <tr key={c.id} className="border text-center">
            <td className="p-2">{c.nit}</td>
            <td className="p-2">{c.nombre}</td>
            <td className="p-2">{c.telefono}</td>
            <td className="p-2 space-x-2">
              <Button onClick={() => onEdit?.(c.id)}>Editar</Button>
              <Button onClick={() => onDelete?.(c.id)} className="bg-red-600">
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
