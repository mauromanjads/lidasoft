"use client";
import { useState, useMemo, useEffect } from "react";
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
import { Eye, Trash2,FileCode } from "lucide-react";
import Button from "@/components/ui/button";
import Buttonpag from "@/components/ui/buttonpag";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { generarXMLFactura } from "@/app/services/xmlservice";
import { generarFactura } from "@/app/services/imprimirservice";


interface Factura {
  id: number;
  numero_completo: string;
  subtotal: number;
  descuento_total: number;
  iva_total: number;
  total: number;
  fecha_creacion: string;
  usuario_creacion?: string;
  tercero?: Tercero; // 👈 objeto
}

interface Props {
  facturas: Factura[];
  onView?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export interface Tercero {
  id: number;
  nombre: string;
  documento:string;
  tipo_documento?: TipoDocumento; // 🔹 relación
}

export interface TipoDocumento {
  id: number;
  codigo: string;
  descripcion: string;
}


export default function FacturasTable({ facturas, onView, onDelete }: Props) {
  const [filter, setFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  const columns = useMemo<ColumnDef<Factura>[]>(() => [
    { accessorKey: "numero_completo", header: "Número" },
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ getValue }) => {
        const value = getValue() as string;
        if (!value) return "-";

        return new Date(value).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      header: "T.Doc.",
      accessorFn: (row) => row.tercero?.tipo_documento?.codigo ?? "-",
      id: "tipodoc",      
    },    
    {
      header: "Documento",
      accessorFn: (row) => row.tercero?.documento ?? "-",
      id: "documento",      
    },
    {
      header: "Cliente",
      accessorFn: (row) => row.tercero?.nombre ?? "-",
      id: "cliente",      
    },    
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ getValue }) =>
        `$ ${Number(getValue()).toLocaleString("es-CO")}`,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ getValue }) => (
        <span
          className={`px-2 py-1 rounded text-white text-sm ${
            getValue() === "ACTIVA" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {String(getValue())}
        </span>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        
        
        <div className="flex justify-center gap-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg"
            onClick={() => generarFactura(row.original.id,"a4")}
            title="Imprimir factura carta"
          >
            <Eye size={16} />
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg"
            onClick={() => generarFactura(row.original.id,"pos")}
            title="Imprimir factura POS"
          >
            <Eye size={16} />
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg"
            onClick={() => generarXMLFactura(row.original.id,row.original.numero_completo)}
            title="Generar XML"
          >
            <FileCode  size={16} />
          </Button>
         
        </div>

      ),
    },
  ], [onView, onDelete]);

  useEffect(() => {
  console.log("FACTURAS:", facturas);
}, [facturas]);

  const table = useReactTable({
    data: facturas,
    columns,
    state: {
      globalFilter: filter,columnFilters,
      pagination: { pageIndex, pageSize },
    },
    onGlobalFilterChange: setFilter,
    onColumnFiltersChange: setColumnFilters,
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

  // 📤 Excel
  const exportToExcel = () => {
    const data = table.getFilteredRowModel().rows.map(r => r.original);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Facturas");
    XLSX.writeFile(wb, "facturas.xlsx");
  };

  // 📄 PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const headers = ["Número", "Total"];
    const body = table.getFilteredRowModel().rows.map(r => [
      r.original.numero_completo, 
      r.original.total,
      
    ]);

    autoTable(doc, { head: [headers], body });
    doc.save("facturas.pdf");
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">

      {/* 🔎 BUSCAR + EXPORTAR */}
      <div className="flex justify-between items-center mb-4">
        <input
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPageIndex(0); }}
          placeholder="Buscar factura..."
          className="border px-3 py-2 rounded-lg shadow-sm w-1/3 border-gray-600"
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

        <div className="flex gap-2">
          <Button onClick={exportToExcel} title="Exportar Excel">
           <img src="/icons/excel.png" alt="Excel" className="w- h-6" />
          </Button>
          <Button onClick={exportToPDF}  title="Exportar Pdf">
           <img src="/icons/pdf.svg" alt="Pdf" className="w- h-6" />
          </Button>
        </div>
      </div>

      {/* 📌 TABLA */}
      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-blue-800 text-white">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                
                 <th key={h.id} className="p-2 text-center">
                    <div
                      className="cursor-pointer hover:bg-blue-700 transition"
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === "asc" && " ▲"}
                      {h.column.getIsSorted() === "desc" && " ▼"}
                    </div>

                      {/* 🔎 Filtro por columna */}
                      {showColumnFilters && h.column.getCanFilter() && (
                      <input
                        value={(h.column.getFilterValue() ?? "") as string}
                        onChange={(e) => {
                          h.column.setFilterValue(e.target.value);
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
            <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="p-2 text-center">
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

          {/* Primera página */}
          {startPage > 0 && (
            <>
              <button
                onClick={() => setPageIndex(0)}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                1
              </button>
              {startPage > 1 && <span>...</span>}
            </>
          )}

          {/* Páginas dinámicas */}
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

          {/* Última página */}
          {endPage < table.getPageCount() && (
            <>
              {endPage < table.getPageCount() - 1 && <span>...</span>}
              <button
                onClick={() => setPageIndex(table.getPageCount() - 1)}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
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

        {/* Info */}
        <span className="text-sm text-gray-600">
          Mostrando {table.getRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} registros
        </span>

        {/* Registros por página */}
        <div className="flex items-center gap-2">
          <span>Registros por página:</span>
          <select
            value={pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border rounded-lg px-2 py-1"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
}
