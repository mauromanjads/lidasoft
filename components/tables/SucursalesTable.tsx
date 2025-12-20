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
import SucursalForm from "@/components/forms/SucursalForm";

/* ============================================
   INTERFACES
============================================ */
interface Sucursal {
  id: number;  
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  estado: boolean;
}

interface Props {
  sucursales: Sucursal[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onSaved?: () => void;
}

export default function SucursalesTable({
  sucursales,
  onEdit,
  onDelete,
  onSaved,
}: Props) {
  const [filter, setFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [sucursalEdit, setSucursalEdit] = useState<any | null>(null);

  /* ============================================
     COLUMNAS
  ============================================ */
  const columns = useMemo<ColumnDef<Sucursal>[]>(
    () => [      
      { accessorKey: "nombre", header: "Nombre" },
      { accessorKey: "direccion", header: "Dirección" },
      { accessorKey: "telefono", header: "Teléfono" },
      {
        accessorKey: "estado",
        header: "Activo",
        cell: ({ row }) => {
          const value = !!row.original.estado;
          return (
            <input
              type="checkbox"
              checked={value}
              disabled
              className="w-4 h-4 accent-green-600"
            />
          );
        },
      },
      {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg"
                onClick={() => {
                  setSucursalEdit(item);
                  setIsOpen(true);
                }}
              >
                <Pencil size={16} />
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg"
                onClick={() => onDelete?.(item.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          );
        },
      },
    ],
    [onDelete]
  );

  /* ============================================
     TABLA
  ============================================ */
  const table = useReactTable({
    data: sucursales,
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

  /* ============================================
     EXPORTACIONES
  ============================================ */
  const exportToExcel = () => {
    const data = table.getFilteredRowModel().rows.map((r) => r.original);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sucursales");
    XLSX.writeFile(wb, "sucursales.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const body = table
      .getFilteredRowModel()
      .rows.map((row) => Object.values(row.original));

    const headers = table
      .getAllColumns()
      .filter(
        (col) =>
          typeof col.columnDef.header === "string" && col.id !== "acciones"
      )
      .map((col) => String(col.columnDef.header));

    autoTable(doc, { head: [headers], body });
    doc.save("sucursales.pdf");
  };

  /* ============================================
     RENDER
  ============================================ */
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* 🔎 BUSCAR + ACCIONES */}
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

        {/* Crear */}
        <Button
          onClick={() => setIsOpen(true)} // <-- Aquí podrías abrir modal o ir a formulario
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
        >  <div className="flex items-center gap-2">
            <img src="/icons/plus.png" alt="Pdf" className="w-6 h-6" />
            <span>Nuevo</span>
          </div>
        </Button>

        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSucursalEdit(null);
          }}
        >
          <h2 className="text-xl font-semibold mb-4">
            {sucursalEdit ? "Editar Sucursal" : "Crear Nueva Sucursal"}
          </h2>

          <SucursalForm
            sucursal={sucursalEdit}
            onSubmit={async (data) => {
                console.log("Datos de la sucursal:", data);  
                setIsOpen(false);
                setSucursalEdit(null);   // 👈 también al guardar
              }}
              onClose={() => {
                setIsOpen(false);
                setSucursalEdit(null);
              }}
              onSaved={onSaved}           
          />
        </Modal>

        <div className="flex gap-3">
          <Button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <img src="/icons/excel.png" alt="Excel" className="h-6" />
          </Button>

          <Button
            onClick={exportToPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <img src="/icons/pdf.svg" alt="PDF" className="h-6" />
          </Button>
        </div>
      </div>

      {/* 📌 TABLA */}
      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-[#1d4e89] to-blue-800 text-white">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  className="p-3 cursor-pointer hover:bg-blue-700"
                  onClick={h.column.getToggleSortingHandler()}
                >
                  {flexRender(h.column.columnDef.header, h.getContext())}
                  {h.column.getIsSorted() === "asc" && " ▲"}
                  {h.column.getIsSorted() === "desc" && " ▼"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id}
              className={`${
                i % 2 === 0 ? "bg-white" : "bg-gray-100"
              } text-center hover:bg-blue-50`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📄 PAGINACIÓN */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ◀
          </Button>

          {Array.from({ length: endPage - startPage }).map((_, i) => {
            const num = startPage + i;
            return (
              <button
                key={num}
                onClick={() => setPageIndex(num)}
                className={`px-3 py-1 rounded-lg ${
                  num === pageIndex
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {num + 1}
              </button>
            );
          })}

          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ▶
          </Button>
        </div>

        <span className="text-sm text-gray-600">
          Mostrando {table.getRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} registros
        </span>

        <select
          value={pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="border rounded-lg px-2 py-1"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
