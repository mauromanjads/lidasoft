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
  ColumnFiltersState,
} from "@tanstack/react-table";

import Button from "@/components/ui/button";
import Buttonpag from "@/components/ui/buttonpag";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { KardexMovimiento } from "@/app/types"; // 👈 nuevo tipo

interface Props {
  movimientos: KardexMovimiento[];
}

export default function KardexTable({ movimientos }: Props) {
  const [filter, setFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showColumnFilters, setShowColumnFilters] = useState(false);

  /* =========================
     COLUMNAS
  ========================= */
  const columns = useMemo<ColumnDef<KardexMovimiento>[]>(() => [
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
    { accessorKey: "producto", header: "Producto" },
    { accessorKey: "presentacion", header: "Presentación" },
    { accessorKey: "sku", header: "SKU" },
    {
      accessorKey: "tipo_movimiento",
      header: "Mov",
      cell: ({ getValue }) => {
        const v = getValue<"E" | "S">();
        return (
          <span
            className={`font-bold ${
              v === "E" ? "text-green-700" : "text-red-600"
            }`}
          >
            {v}
          </span>
        );
      },
    },
    {
      accessorKey: "cantidad_movimiento",
      header: "Cantidad",
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return (
          <span className={value < 0 ? "text-red-600" : "text-green-700"}>
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "saldo_cantidad",
      header: "Saldo",
      cell: ({ getValue }) => (
        <span className="font-bold">{getValue<number>()}</span>
      ),
    },
    {
      accessorKey: "costo_unitario",
      header: "Costo U.",
      cell: ({ getValue }) => `$${getValue<number>().toLocaleString()}`,
    },
    {
      accessorKey: "costo_movimiento",
      header: "Costo Mov.",
      cell: ({ getValue }) => {
        const v = getValue<number>();
        return (
          <span className={v < 0 ? "text-red-600" : "text-green-700"}>
            ${Math.abs(v).toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: "saldo_costo",
      header: "Saldo $",
      cell: ({ getValue }) => (
        <span className="font-bold">
          ${getValue<number>().toLocaleString()}
        </span>
      ),
    },
    { accessorKey: "sucursal", header: "Sucursal" },
  ], []);

  const table = useReactTable({
    data: movimientos,
    columns,
    state: {
      globalFilter: filter,
      columnFilters,
      pagination: { pageIndex, pageSize },
    },
    onGlobalFilterChange: setFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: updater => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
  });

  const maxButtons = 5;
  const totalPages = table.getPageOptions().length;

  const startPage = Math.max(0, pageIndex - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons);

  /* =========================
     EXPORTAR
  ========================= */
  const exportToExcel = () => {
    const data = table.getFilteredRowModel().rows.map(r => r.original);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kardex");
    XLSX.writeFile(wb, "kardex.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Fecha", "Producto", "Mov", "Cant", "Saldo"]],
      body: table.getFilteredRowModel().rows.map(r => [
        r.original.fecha,
        r.original.producto,
        r.original.tipo_movimiento,
        r.original.cantidad_movimiento,
        r.original.saldo_cantidad,
      ]),
    });
    doc.save("kardex.pdf");
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">

      {/* BUSCAR + EXPORTAR */}
      <div className="flex justify-between items-center mb-4">
        <input
          value={filter}
          onChange={e => {
            setFilter(e.target.value);
            setPageIndex(0);
          }}
          placeholder="Buscar producto, SKU, sucursal..."
          className="border px-3 py-2 rounded-lg w-1/3 border-gray-600"
        />

        <Button
          onClick={() => {
            setShowColumnFilters(prev => {
              if (prev) setColumnFilters([]);
              return !prev;
            });
          }}
          className={`${
            showColumnFilters
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {showColumnFilters ? "🟢 Ocultar filtros" : "🔴 Activar filtros"}
        </Button>

        <div className="flex gap-2">
          <Button onClick={exportToExcel}>
            <img src="/icons/excel.png" className="h-6" />
          </Button>
          <Button onClick={exportToPDF}>
            <img src="/icons/pdf.svg" className="h-6" />
          </Button>
        </div>
      </div>

      {/* TABLA */}
      <table className="w-full border rounded-xl overflow-hidden">
        <thead className="bg-blue-800 text-white">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} className="p-2 text-center">
                  <div
                    onClick={h.column.getToggleSortingHandler()}
                    className="cursor-pointer"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {h.column.getIsSorted() === "asc" && " ▲"}
                    {h.column.getIsSorted() === "desc" && " ▼"}
                  </div>

                  {showColumnFilters && h.column.getCanFilter() && (
                    <input
                      value={(h.column.getFilterValue() ?? "") as string}
                      onChange={e => h.column.setFilterValue(e.target.value)}
                      className="mt-1 w-full rounded border px-2 py-1 text-sm text-white"
                      onClick={e => e.stopPropagation()}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id} className={i % 2 ? "bg-gray-100" : "bg-white"}>
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
