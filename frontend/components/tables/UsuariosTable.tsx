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
import { Pencil, Trash2,KeyRound } from "lucide-react";
import Button from "@/components/ui/button";
import Buttonpag from "@/components/ui/buttonpag";
import Modal from "@/components/ui/modal";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import UsuarioForm from "@/components/forms/UsuarioForm";

import Swal from "sweetalert2";
import { resetPasswordUsuario } from "@/lib/api/usuarios";

interface Usuario {
  id: number;
  usuario: string;
  nombre?: string;
  activo: boolean;
  id_rol?: number;
  rol?: {
    id: number;
    nombre: string;
  };
  sucursales?: {
    id: number;
    nombre: string;
  }[];
}

interface Props {
  usuarios: Usuario[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onSaved?: () => void;
}

const handleResetPassword = async (usuario: Usuario) => {
  const result = await Swal.fire({
    title: "¿Restaurar contraseña?",
    text: `Se generará una nueva clave para ${usuario.usuario}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, restaurar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  const data = await resetPasswordUsuario(usuario.id);

  await Swal.fire({
    title: "Contraseña restablecida",
    html: `
      <p><b>Usuario:</b> ${usuario.usuario}</p>
      <p><b>Clave temporal:</b></p>
      <code style="font-size:16px">${data.password_temporal}</code>
    `,
    icon: "success",
  });
};


export default function UsuariosTable({ usuarios, onEdit, onDelete, onSaved }: Props) {
  const [filter, setFilter] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [pageIndex, setPageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState<Usuario | null>(null);

  const columns = useMemo<ColumnDef<Usuario>[]>(
    () => [
      { accessorKey: "usuario", header: "Usuario" },
      { accessorKey: "nombre", header: "Nombre" },
      {
        accessorKey: "rol",
        header: "Rol",
        cell: ({ row }) => row.original.rol?.nombre || "-",
      },
      {
        accessorKey: "sucursales",
        header: "Sucursales",
        cell: ({ row }) =>
          row.original.sucursales?.map((s) => s.nombre).join(", ") || "-",
      },
      {
        accessorKey: "activo",
        header: "Activo",
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={!!row.original.activo}
            disabled
            className="w-4 h-4 accent-green-600"
          />
        ),
      },
      {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex justify-center gap-2">
              <Button
                onClick={() => {
                  setUsuarioEdit(item);
                  setIsOpen(true);
                  onEdit?.(item.id);
                }}
              >
                <Pencil size={16} />
              </Button>


              {/* Reset password */}
              <Button                
                onClick={() => handleResetPassword(item)}
                title="Restaurar contraseña"
              >
                <KeyRound size={16} />
              </Button>

             
            </div>
          );
        },
      },
    ],
    [onDelete, onEdit]
  );

  const table = useReactTable({
    data: usuarios,
    columns,
    state: { globalFilter: filter, pagination: { pageIndex, pageSize } },
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

  // Exportar Excel
  const exportToExcel = () => {
    const data = table.getFilteredRowModel().rows.map((row) => row.original);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "Usuarios.xlsx");
  };

  // Exportar PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const data = table.getFilteredRowModel().rows.map((row) =>
      Object.values(row.original).map((v) =>
        Array.isArray(v) ? v.map((s) => s.nombre).join(", ") : v
      )
    );

    const headers = table
      .getAllColumns()
      .filter((col) => typeof col.columnDef.header === "string" && col.id !== "acciones")
      .map((col) => String(col.columnDef.header));

    autoTable(doc, { head: [headers], body: data });
    doc.save("Usuarios.pdf");
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      {/* Buscador y acciones */}
      <div className="flex justify-between items-center mb-4">
        <input
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPageIndex(0);
          }}
          placeholder="Buscar..."
          className="border px-3 py-2 rounded-lg shadow-sm w-1/3 border border-gray-600"
        />

        <Button
          onClick={() => setIsOpen(true)}          
        >
          <div className="flex items-center gap-2">
            <img src="/icons/plus.png" alt="Nuevo" className="w-6 h-6" />
            <span>Nuevo Usuario</span>
          </div>
        </Button>

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

      {/* Modal para crear/editar */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setUsuarioEdit(null);
        }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {usuarioEdit ? "Editar Usuario" : "Crear Usuario"}
        </h2>
        <UsuarioForm
          usuario={usuarioEdit ?? undefined}
          onSubmit={async (data) => {
            setIsOpen(false);
            setUsuarioEdit(null);
            onSaved?.();
          }}
          onClose={() => {
            setIsOpen(false);
            setUsuarioEdit(null);
          }}
          onSaved={onSaved}
        />
      </Modal>

      {/* Tabla */}
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

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <Buttonpag
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}          
          >
            ❮
          </Buttonpag>

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
