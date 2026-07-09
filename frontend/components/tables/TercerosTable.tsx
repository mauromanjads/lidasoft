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
  ColumnFiltersState
} from "@tanstack/react-table";
import { Pencil, Trash2} from "lucide-react";
import Button from "@/components/ui/button";
import Buttonpag from "@/components/ui/buttonpag";
import Modal from "@/components/ui/modal";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import TerceroForm from "@/components/forms/TerceroForm";
import { useTiposDocumento } from "@/components/ui/selects/TipoDocumentoSelect";
import { useParams } from "next/navigation";

interface Tercero {
  id: number;
  documento: string;
  nombre: string;
  celular: string;
  estado: string;
  tipo_documento_id: number;
  tipo_persona: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  fecha_nacimiento: string;
  genero_id: number;
  razon_social: string;
  regimen_id: number;
  ciiu_id: number;
  direccion: string;
  telefono: string;   
  whatsapp: string;
  correo: string;
}


interface Props {
  terceros: Tercero[];  
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onSaved?: () => void; 
}

export default function TercerosTable({ terceros, onEdit, onDelete,onSaved }: Props) {
  const [filter, setFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
 
  const [terceroEdit, setTerceroEdit] = useState<any | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showColumnFilters, setShowColumnFilters] = useState(false);

   const { tiposDocumentos } = useTiposDocumento();
   

  const columns = useMemo<ColumnDef<Tercero>[]>(() => [
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
            setTerceroEdit(row.original);   // viene de la fila de la tabla
            setIsOpen(true);  
        }}
          >
            <Pencil size={16} />
          </Button>
         
        </div>
      ),
    },
  ], [onEdit, onDelete,tiposDocumentos]);

  const table = useReactTable({
    data: terceros,
    columns,
    state: { globalFilter: filter,columnFilters, pagination: { pageIndex, pageSize } },
    onGlobalFilterChange: setFilter,
    onColumnFiltersChange: setColumnFilters,
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

  const maxButtons = 5;
  const totalPages = table.getPageOptions().length;
  const startPage = Math.max(0, pageIndex - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons);

  

  // 📤 Exportar Excel
  const exportToExcel = () => {
    const data = table.getFilteredRowModel().rows.map((row) => row.original);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Terceros");
    XLSX.writeFile(wb, "terceros.xlsx");
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
    doc.save("terceros.pdf");
  };

  const params = useParams();       // 👈 aquí  
  const tipoTerceroRaw = params?.tipo;

  // Garantizamos que sea string
  const tipoTercero = Array.isArray(tipoTerceroRaw)
    ? tipoTerceroRaw[0]
    : tipoTerceroRaw || "";

const labels: Record<string, string> = {
  clientes: "Cliente",
  proveedores: "Proveedor",
  vendedores: "Vendedor",
};
  const label = labels[tipoTercero] || "Tercero";
  const titulo = terceroEdit
  ? `Editar ${label}`
  : `Crear Nuevo ${label}`;

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">

      {/* 🔎 BUSCAR + EXPORTAR ARRIBA */}
      <div className="flex justify-between items-center mb-4">

        {/* Buscar */}
        <input
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPageIndex(0); }}
          placeholder="Buscar..."
          className="border px-3 py-2 rounded-lg shadow-sm w-1/3 border border-gray-600"
        />

        <Button
          onClick={() => {
            setShowColumnFilters(prev => {
              if (prev) setColumnFilters([]); // 👈 limpia filtros al ocultar
              return !prev;
            });
          }}
          className={`${
            showColumnFilters ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {showColumnFilters ? "🟢 Ocultar filtros" : "🔴Activar filtros"}
        </Button>

         {/* Crear Cliente */}
        <Button
          onClick={() => setIsOpen(true)} // <-- Aquí podrías abrir modal o ir a formulario
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
        >  <div className="flex items-center gap-2">
            <img src="/icons/plus.png" alt="Pdf" className="w-6 h-6" />
            <span> Nuevo {label}</span>
          </div>
        </Button>

         <Modal 
            isOpen={isOpen} 
            onClose={() => {
              setIsOpen(false);
              setTerceroEdit(null);   // 👈 Ahora sí se limpia              
            }}
          >
            <h2 className="text-xl font-semibold mb-4">
              {titulo}
            </h2>

            <TerceroForm
              tercero={terceroEdit}
              onSubmit={async (data) => {
                console.log("Datos del tercero:", data);  
                setIsOpen(false);
                setTerceroEdit(null);   // 👈 también al guardar
              }}
              onClose={() => {
                setIsOpen(false);
                setTerceroEdit(null);
              }}
              onSaved={onSaved}
            />
          </Modal>


        

        {/* Exportar */}
        <div className="flex gap-3">
          <Button onClick={exportToExcel}  title="Exportar Excel">
             <img src="/icons/excel.png" alt="Excel" className="w- h-6" />
          </Button>
           
          <Button onClick={exportToPDF} title="Exportar Pdf">
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
                
                 <th key={header.id} className="p-2 text-center">
                    <div
                      className="cursor-pointer hover:bg-blue-700 transition"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" && " ▲"}
                      {header.column.getIsSorted() === "desc" && " ▼"}
                    </div>

                      {/* 🔎 Filtro por columna */}
                      {showColumnFilters && header.column.getCanFilter() && (
                      <input
                        value={(header.column.getFilterValue() ?? "") as string}
                        onChange={(e) => {
                          header.column.setFilterValue(e.target.value);
                          setPageIndex(0);
                        }}
                        placeholder="Filtrar..."
                        className="mt-1 w-full rounded border px-2 py-1 text-sm text-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
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
          <Buttonpag onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}> ❮ </Buttonpag>

            {/* Mostrar primero */}
              {startPage > 0 && (
                <>
                  <button onClick={() => setPageIndex(0)}>1</button>
                  {startPage > 1 && <span>...</span>}
                </>
              )}

           {/* Páginas visibles dinámicas */}
            {Array.from({ length: endPage - startPage }).map((_, i) => {
              const num = startPage + i;
              return (
                <button key={num} onClick={() => setPageIndex(num)}
                  className={`px-3 py-1 rounded-lg transition ${num === pageIndex ? "bg-green-600 text-white font-bold" : "bg-gray-200 hover:bg-gray-300"}`}>
                  {num + 1}
                </button>
              );
            })}

            {/* Mostrar última */}
            {endPage < table.getPageCount() && (
              <>
                {endPage < table.getPageCount() - 1 && <span>...</span>}
                <button onClick={() => setPageIndex(table.getPageCount() - 1)}>
                  {table.getPageCount()}
                </button>
              </>
            )}

          <Buttonpag onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}> ❯ </Buttonpag>
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
