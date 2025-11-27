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
import { Pencil, Trash2} from "lucide-react";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ClienteForm from "@/components/forms/ClienteForm";
import { useTiposDocumento } from "@/components/ui/selects/TipoDocumentoSelect";



interface Cliente {
  id: number;
  documento: string;
  nombre: string;
  telefono: string;
  estado: string;
  tipo_documento_id: number;
}


interface Props {
  clientes: Cliente[];  
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onSaved?: () => void; 
}

export default function ClientesTable({ clientes, onEdit, onDelete,onSaved }: Props) {
  const [filter, setFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
 
   const [clienteEdit, setClienteEdit] = useState<any | null>(null);

   const { tiposDocumentos, loading } = useTiposDocumento();
   

  const columns = useMemo<ColumnDef<Cliente>[]>(() => [
    { accessorKey: "tipo_documento_id", header: "Tipo Documento" ,
       cell: ({ row }) => {
        const tipo = tiposDocumentos.find(
          (t) => t.id === row.original.tipo_documento_id
        );
        return tipo ? tipo.codigo : "—";
      },
    },
    { accessorKey: "documento", header: "Documento" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "celular", header: "Celular" },
    { accessorKey: "estado", header: "Estado" },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg"
            onClick={() => {
            setClienteEdit(row.original);   // cliente viene de la fila de la tabla
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
  ], [onEdit, onDelete]);

  const table = useReactTable({
    data: clientes,
    columns,
    state: { globalFilter: filter, pagination: { pageIndex, pageSize } },
    onGlobalFilterChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: (updater) => {
      const newState = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
  });

  // 📤 Exportar Excel
  const exportToExcel = () => {
    const data = table.getFilteredRowModel().rows.map((row) => row.original);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    XLSX.writeFile(wb, "clientes.xlsx");
  };

  // 📄 Exportar PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = table.getFilteredRowModel().rows.map((row) => Object.values(row.original));

    const headers = table
      .getAllColumns()
      .filter((col) => typeof col.columnDef.header === "string" && col.id !== "acciones")
      .map((col) => String(col.columnDef.header));

    autoTable(doc, { head: [headers], body: data });
    doc.save("clientes.pdf");
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">

      {/* 🔎 BUSCAR + EXPORTAR ARRIBA */}
      <div className="flex justify-between items-center mb-4">

        {/* Buscar */}
        <input
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPageIndex(0); }}
          placeholder="Buscar..."
          className="border px-3 py-2 rounded-lg shadow-sm w-1/3"
        />

         {/* Crear Cliente */}
        <Button
          onClick={() => setIsOpen(true)} // <-- Aquí podrías abrir modal o ir a formulario
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
        >  <div className="flex items-center gap-2">
            <img src="/icons/plus.png" alt="Pdf" className="w-6 h-6" />
            <span>Nuevo Cliente</span>
          </div>
        </Button>

         <Modal 
            isOpen={isOpen} 
            onClose={() => {
              setIsOpen(false);
              setClienteEdit(null);   // 👈 Ahora sí se limpia              
            }}
          >
            <h2 className="text-xl font-semibold mb-4">
              {clienteEdit ? "Editar Cliente" : "Crear Nuevo Cliente"}
            </h2>

            <ClienteForm
              cliente={clienteEdit}
              onSubmit={async (data) => {
                console.log("Datos del cliente:", data);  
                setIsOpen(false);
                setClienteEdit(null);   // 👈 también al guardar
              }}
              onClose={() => {
                setIsOpen(false);
                setClienteEdit(null);
              }}
              onSaved={onSaved}
            />
          </Modal>


        

        {/* Exportar */}
        <div className="flex gap-3">
          <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
             <img src="/icons/excel.png" alt="Excel" className="w- h-6" />
          </Button>
           
          <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md">
             <img src="/icons/pdf.svg" alt="Pdf" className="w- h-6" />
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
                  className="p-3 cursor-pointer hover:bg-blue-700 transition"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" && " ▲"}
                  {header.column.getIsSorted() === "desc" && " ▼"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-100"} text-center hover:bg-blue-50 transition`}>
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
          <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50">◀</Button>

          {Array.from({ length: table.getPageCount() }).map((_, i) => (
            <button key={i} onClick={() => setPageIndex(i)}
              className={`px-3 py-1 rounded-lg transition ${i === pageIndex ? "bg-green-600 text-white font-bold" : "bg-gray-200 hover:bg-gray-300"}`}>
              {i + 1}
            </button>
          ))}

          <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50">▶</Button>
        </div>

        {/* Info */}
        <span className="text-sm text-gray-600">
          Mostrando {table.getRowModel().rows.length} de {table.getFilteredRowModel().rows.length} registros
        </span>

        {/* Registros por página */}
        <div className="flex items-center gap-2">
          <span>Registros por página:</span>
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border rounded-lg px-2 py-1"
          >
            {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

    </div>
  );
}
