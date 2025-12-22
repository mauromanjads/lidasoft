"use client";
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
//import RolForm from "@/components/forms/RolForm";

/* =========================
   Interfaces
========================= */

export interface Rol {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

interface Props {
  roles: Rol[];
   onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onSaved?: () => void;
}

/* =========================
   Componente
========================= */

export default function RolesTable({ roles, onDelete, onSaved }: Props) {
  const [filter, setFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [rolEdit, setRolEdit] = useState<Rol | null>(null);

  /* =========================
     Columnas
  ========================= */
  const columns = useMemo<ColumnDef<Rol>[]>(() => [
    { accessorKey: "codigo", header: "Código" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "descripcion", header: "Descripción" },
    {
      accessorKey: "activo",
      header: "Activo",
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.original.activo}
          disabled
          className="w-4 h-4 accent-green-600"
        />
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg"
            onClick={() => {
              setRolEdit(row.original);
              setIsOpen(true);
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg"
            onClick={() => onDelete?.(row.original.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ], [onDelete]);

  /* =========================
     Tabla
  ========================= */
  const table = useReactTable({
    data: roles,
    columns,
    state: {
      globalFilter: filter,
      pagination: { pageIndex, pageSize },
    },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
  });

  const maxButtons = 5;
  const totalPages = table.getPageOptions().length;
  const startPage = Math.max(0, pageIndex - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons);

  /* =========================
     Exportar
  ========================= */

  const exportToExcel = () => {
    const data = table.getFilteredRowModel().rows.map((r) => r.original);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Roles");
    XLSX.writeFile(wb, "roles.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = table.getFilteredRowModel().rows.map((r) => [
      r.original.codigo,
      r.original.nombre,
      r.original.descripcion ?? "",
      r.original.activo ? "Sí" : "No",
    ]);

    autoTable(doc, {
      head: [["Código", "Nombre", "Descripción", "Activo"]],
      body: data,
    });

    doc.save("roles.pdf");
  };

  /* =========================
     Render
  ========================= */
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* Buscar + Nuevo + Exportar */}
      <div className="flex justify-between items-center mb-4">
        <input
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPageIndex(0);
          }}
          placeholder="Buscar..."
          className="border px-3 py-2 rounded-lg shadow-sm w-1/3"
        />

        <Button onClick={() => setIsOpen(true)}>
          <div className="flex items-center gap-2">
            <img src="/icons/plus.png" className="w-6 h-6" />
            <span>Nuevo</span>
          </div>
        </Button>

        <div className="flex gap-3">
          <Button onClick={exportToExcel} className="bg-green-600 text-white">
            <img src="/icons/excel.png" className="h-6" />
          </Button>
          <Button onClick={exportToPDF} className="bg-red-600 text-white">
            <img src="/icons/pdf.svg" className="h-6" />
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-[#1d4e89] to-blue-800 text-white">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-3 cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>◀</Button>

          {Array.from({ length: endPage - startPage }).map((_, i) => {
            const num = startPage + i;
            return (
              <button
                key={num}
                onClick={() => setPageIndex(num)}
                className={`px-3 py-1 rounded ${
                  num === pageIndex ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
              >
                {num + 1}
              </button>
            );
          })}

          <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>▶</Button>
        </div>

        <select
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* AQUI VA EL MODAL */}
      
    </div>
  );
}
