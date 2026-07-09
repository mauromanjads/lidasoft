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
import Buttonpag from "@/components/ui/buttonpag";
import Modal from "@/components/ui/modal";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import UnidadForm from "@/components/forms/UnidadForm";

interface Unidad {
  id: number;
  codigo: string;
  nombre: string;
}

interface Props {
  unidades: Unidad[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onSaved?: () => void;
}

export default function UnidadesTable({ unidades, onEdit, onDelete, onSaved }: Props) {
  const [filter, setFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [unidadEdit, setUnidadEdit] = useState<Unidad | null>(null);

  const columns = useMemo<ColumnDef<Unidad>[]>(
    () => [
      { accessorKey: "codigo", header: "Código" },
      { accessorKey: "nombre", header: "Nombre" },

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
                  setUnidadEdit(item);
                  setIsOpen(true);
                }}
              >
                <Pencil size={16} />
              </Button>

             
            </div>
          );
        },
      },
    ],
    [onDelete]
  );

  const table = useReactTable({
    data: unidades,
    columns,
    state: { globalFilter: filter, pagination: { pageIndex, pageSize } },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
  });

  const maxButtons = 5;
  const totalPages = table.getPageOptions().length;
  const startPage = Math.max(0, pageIndex - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons);

  // 📤 Exportar Excel
  const exportToExcel = () => {
    const data = table.getFilteredRowModel().rows.map((row) => row.original);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Unidades");
    XLSX.writeFile(wb, "Unidades.xlsx");
  };

  // 📄 Exportar PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = table.getFilteredRowModel().rows.map((row) =>
      Object.values(row.original)
    );

    const headers = table
      .getAllColumns()
      .filter(
        (col) =>
          typeof col.columnDef.header === "string" &&
          col.id !== "acciones"
      )
      .map((col) => String(col.columnDef.header));

    autoTable(doc, { head: [headers], body: data });
    doc.save("unidades.pdf");
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* 🔎 BUSCAR + EXPORTAR ARRIBA */}
      <div className="flex justify-between items-center mb-4">
        {/* Buscar */}
        <input
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPageIndex(0);
          }}
          placeholder="Buscar..."
          className="border px-3 py-2 rounded-lg shadow-sm w-1/3 border border-gray-600"
        />

        {/* Crear */}
        <Button
          onClick={() => setIsOpen(true)}         
        >
          <div className="flex items-center gap-2">
            <img src="/icons/plus.png" alt="Nuevo" className="w-6 h-6" />
            <span>Nueva Unidad de Medida</span>
          </div>
        </Button>

        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setUnidadEdit(null);
          }}
        >
          <h2 className="text-xl font-semibold mb-4">
            {unidadEdit ? "Editar Unidad" : "Crear Unidad"}
          </h2>

          <UnidadForm
            unidad={unidadEdit}
            onSubmit={async (data) => {
                  console.log("Datos de la unidad:", data);  
                  setIsOpen(false);
                  setUnidadEdit(null);   // 👈 también al guardar
                }}
            onClose={() => {
              setIsOpen(false);
              setUnidadEdit(null);
            }}
            onSaved={onSaved}
          />
        </Modal>

        {/* Exportar */}
        <div className="flex gap-3">
          <Button
            onClick={exportToExcel}
            title="Exportar Excel"
          >
            <img src="/icons/excel.png" alt="Excel" className="w-6 h-6" />
          </Button>

          <Button
            onClick={exportToPDF}
            title="Exportar Pdf"
          >
            <img src="/icons/pdf.svg" alt="Pdf" className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* 📌 TABLA */}
      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-[#1d4e89] to-blue-800 text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-2 cursor-pointer hover:bg-blue-700 transition"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "asc" && " ▲"}
                  {header.column.getIsSorted() === "desc" && " ▼"}
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
              } text-center hover:bg-blue-50 transition`}
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
        {/* Botones paginación */}
        <div className="flex items-center gap-2">
          <Buttonpag
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}           
          >
            ❮
          </Buttonpag>

          {startPage > 0 && (
            <>
              <button onClick={() => setPageIndex(0)}>1</button>
              {startPage > 1 && <span>...</span>}
            </>
          )}

          {Array.from({ length: endPage - startPage }).map((_, i) => {
            const num = startPage + i;
            return (
              <button
                key={num}
                onClick={() => setPageIndex(num)}
                className={`px-3 py-1 rounded-lg transition ${
                  num === pageIndex
                    ? "bg-green-600 text-white font-bold"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {num + 1}
              </button>
            );
          })}

          {endPage < table.getPageCount() && (
            <>
              {endPage < table.getPageCount() - 1 && <span>...</span>}
              <button onClick={() => setPageIndex(table.getPageCount() - 1)}>
                {table.getPageCount()}
              </button>
            </>
          )}

          <Buttonpag
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}            
          >
            ❯
          </Buttonpag>
        </div>

        <span className="text-sm text-gray-600">
          Mostrando {table.getRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} registros
        </span>

        <div className="flex items-center gap-2">
          <span>Registros por página:</span>
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
    </div>
  );
}
