"use client";

import Button from "@/components/ui/button";
import SelectSearch from "@/components/ui/selectSearch";

import { useEffect, useState } from "react";
import {
  crearProducto,
  crearPresentacion,
  obtenerUnidades,
  obtenerCategorias
} from "@/lib/api/productos";
import { Producto, UnidadMedida, Categoria } from "@/app/types";

interface PresentacionForm {
  tipo_presentacion: string;
  cantidad_equivalente: number;
  unidad_medida_id: number;
  precio_venta: number;
  precio_compra: number;
  activo: boolean;
}

interface ProductoFormProps {
  producto?: Producto | null;
  onSubmit?: (data: any) => Promise<void> | void;
  onSaved?: () => void;
  onClose?: () => void;
}

export default function ProductoForm({
  producto,
  onSubmit,
  onSaved,
  onClose,
}: ProductoFormProps) {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [codigoBarra, setCodigoBarra] = useState("");

  const [iva, setIva] = useState<number>(0);
  const [tipoImpuesto, setTipoImpuesto] = useState("");
  const [controlInventario, setControlInventario] = useState("S");

  const [activo, setActivo] = useState(true);

  const [unidadMedidaId, setUnidadMedidaId] = useState<number | null>(null);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [unidades, setUnidades] = useState<UnidadMedida[]>([]);

  const [presentaciones, setPresentaciones] = useState<PresentacionForm[]>([
    {
      tipo_presentacion: "",
      cantidad_equivalente: 1,
      unidad_medida_id: 0,
      precio_venta: 0,
      precio_compra: 0,
      activo: true,
    },
  ]);

   const [activeTab, setActiveTab] = useState("producto");

   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    async function loadData() {
      const u = await obtenerUnidades();
      setUnidades(u);
      setUnidadMedidaId(u[0]?.id ?? null);

      const c = await obtenerCategorias();
      setCategorias(c);
      setCategoriaId(c[0]?.id ?? null);

      setPresentaciones((prev) =>
        prev.map((p) => ({
          ...p,
          unidad_medida_id: u[0]?.id || 0,
        }))
      );
    }

    loadData();
  }, []);

  useEffect(() => {
    if (producto) {
      setCodigo(producto.codigo);
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion || "");
      setCodigoBarra(producto.codigo_barra || "");
      setUnidadMedidaId(producto.unidad_medida_id || null);
      setCategoriaId(producto.categoria_id || null);
      setIva(producto.iva || 0);
      setTipoImpuesto(producto.tipo_impuesto || "");
      setControlInventario(producto.control_inventario || "S");
      setActivo(producto.activo ||false);
    }
  }, [producto]);

  const agregarPresentacion = () => {
    setPresentaciones([
      ...presentaciones,
      {
        tipo_presentacion: "",
        cantidad_equivalente: 1,
        unidad_medida_id: unidades[0]?.id || 0,
        precio_venta: 0,
        precio_compra: 0,
        activo: true,
      },
    ]);
  };

  const eliminarPresentacion = (index: number) => {
    setPresentaciones(presentaciones.filter((_, i) => i !== index));
  };

  const handlePresentacionChange = <K extends keyof PresentacionForm>(
    index: number,
    field: K,
    value: PresentacionForm[K]
  ) => {
    setPresentaciones((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!unidadMedidaId) return alert("Seleccione la unidad del producto");
    if (!categoriaId) return alert("Seleccione la categoría");

    try {
      const producto = await crearProducto({
        codigo,
        nombre,
        descripcion,
        codigo_barra: codigoBarra,
        categoria_id: categoriaId,
        iva,
        tipo_impuesto: tipoImpuesto,
        unidad_medida_id: unidadMedidaId,
        control_inventario: controlInventario,
        activo: true,
      });

      if (!producto?.id) throw new Error("No se pudo crear el producto");

      for (const pres of presentaciones) {
        await crearPresentacion(producto.id, {
          tipo_presentacion: pres.tipo_presentacion,
          cantidad_equivalente: pres.cantidad_equivalente,
          unidad_medida_id: pres.unidad_medida_id,
          precio_venta: pres.precio_venta,
          precio_compra: pres.precio_compra,
          activo: pres.activo,
        });
      }

      if (onSubmit) await onSubmit(producto);
      if (onSaved) onSaved();
      if (onClose) onClose();

      alert("Producto creado correctamente");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  }

    return (
  <form
    onSubmit={handleSubmit}
    className="p-2 border rounded-md space-y-3 text-xs max-w-5xl mx-auto"
  >
    <div className="max-w-5xl mx-auto p-2">
      
      {/* === NAV TABS === */}
      <div className="flex space-x-3 border-b mb-3 text-sm">
        <button
            type="button"
            onClick={() => setActiveTab("producto")}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium
              transition-colors relative
              ${activeTab === "producto"
                ? "text-[#1d4e89] border-b-2 border-[#1d4e89] font-semibold"
                : "text-gray-600 hover:text-[#1d4e89]"}
            `}
          >
          Producto
        </button>

        <button
              type="button"
              onClick={() => setActiveTab("presentaciones")}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium
                transition-colors relative
                ${activeTab === "presentaciones"
                  ? "text-[#1d4e89] border-b-2 border-[#1d4e89] font-semibold"
                  : "text-gray-600 hover:text-[#1d4e89]"}
              `}
            >
          Presentaciones
        </button>
      </div>

      {/* === TAB PRODUCTO === */}
      {activeTab === "producto" && (
        <div className="space-y-3">
          
          {/* GRID GENERAL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

            <label className="flex flex-col">
              <span className="mb-1">Código:</span>
              <input
                className="border p-1.5 rounded text-xs"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1">Nombre:</span>
              <input
                className="border p-1.5 rounded text-xs"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </label>

            <label className="flex flex-col text-xs">
              <span className="mb-1 font-semibold text-gray-800 tracking-wide text-center">
                Estado:
              </span>

              <div className="flex items-center gap-2 justify-center">
                <input
                  type="checkbox"
                  className="
                    w-4 h-4
                    accent-blue-600
                    border border-gray-300
                    rounded-md
                    shadow-sm
                  "
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                />

                <span
                  className={`
                    font-semibold
                    ${activo ? "text-green-700" : "text-red-600"}
                    tracking-wide
                  `}
                >
                  {activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </label>


            <label className="flex flex-col">
              <span className="mb-1">Código Barras:</span>
              <input
                className="border p-1.5 rounded text-xs"
                value={codigoBarra}
                onChange={(e) => setCodigoBarra(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1">Categoría:</span>
              <SelectSearch
                items={categorias}
                value={categoriaId}
                onChange={setCategoriaId}
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1">Unidad de Medida:</span>
              <SelectSearch
                items={unidades}
                value={unidadMedidaId}
                onChange={setUnidadMedidaId}
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1">IVA (%):</span>
              <input
                type="number"
                step="0.01"
                className="border p-1.5 rounded text-xs"
                value={iva}
                onChange={(e) => setIva(Number(e.target.value))}
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1">Tipo Impuesto:</span>
              <select
                className="border p-1.5 rounded text-xs"
                value={tipoImpuesto}
                onChange={(e) => setTipoImpuesto(e.target.value)}
              >
                <option value="">Seleccione…</option>
                <option value="GRAVADO">GRAVADO</option>
                <option value="NO_GRAVADO">NO GRAVADO</option>
                <option value="EXENTO">EXENTO</option>
                <option value="EXCLUIDO">EXCLUIDO</option>
              </select>
            </label>

            <label className="flex flex-col">
              <span className="mb-1">Inventario:</span>
              <select
                className="border p-1.5 rounded text-xs"
                value={controlInventario}
                onChange={(e) => setControlInventario(e.target.value)}
              >
                <option value="S">Controla inventario</option>
                <option value="N">No controla inventario</option>
              </select>
            </label>
          </div>

          <label className="flex flex-col">
            <span className="mb-1">Descripción:</span>
            <textarea
              className="border p-1.5 rounded text-xs"
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </label>
        </div>
      )}

      {/* === TAB PRESENTACIONES === */}
      {activeTab === "presentaciones" && (
        <div>
         
          {presentaciones.map((pres, index) => (
            <div key={index} className="border rounded p-2 space-y-2 bg-gray-50">

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">

                <label className="flex flex-col">
                  <span>Presentación:</span>
                  <input
                    className="border p-1.5 rounded"
                    value={pres.tipo_presentacion}
                    onChange={(e) =>
                      handlePresentacionChange(index, "tipo_presentacion", e.target.value)
                    }
                  />
                </label>

                <label className="flex flex-col">
                  <span>Equiv.:</span>
                  <input
                    type="number"
                    className="border p-1.5 rounded"
                    value={pres.cantidad_equivalente}
                    onChange={(e) =>
                      handlePresentacionChange(index, "cantidad_equivalente", Number(e.target.value))
                    }
                  />
                </label>
                
                <label className="flex flex-col">
                  <span className="mb-1">Unidad de Medida:</span>
                   <SelectSearch
                      items={unidades}
                      value={presentaciones[index].unidad_medida_id}
                      onChange={(newValue) =>
                        handlePresentacionChange(index, "unidad_medida_id", Number(newValue))
                      }
                    />
                </label>

                
                <label className="flex flex-col">
                  <span>Precio Venta:</span>
                  <input
                    type="number"
                    step="0.01"
                    className="border p-1.5 rounded"
                    value={pres.precio_venta}
                    onChange={(e) =>
                      handlePresentacionChange(index, "precio_venta", Number(e.target.value))
                    }
                  />
                </label>

                <label className="flex flex-col">
                  <span>Precio Compra:</span>
                  <input
                    type="number"
                    step="0.01"
                    className="border p-1.5 rounded"
                    value={pres.precio_compra}
                    onChange={(e) =>
                      handlePresentacionChange(index, "precio_compra", Number(e.target.value))
                    }
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => eliminarPresentacion(index)}
                className="text-red-600 text-xs"
              >
                Eliminar
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={agregarPresentacion}
            className="text-green-600 text-xs"
          >
            + Agregar Presentación
          </button>
        </div>
      )}

      {/* BOTONES */}
      <div className="flex justify-end gap-2 mt-3">
        <Button type="button" onClick={onClose} disabled={loading}>
          ❌ Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (producto ? "Actualizando..." : "Guardando...") : (producto ? "💾 Actualizar" : "💾 Guardar")}
        </Button>
      </div>
    </div>
  </form>
);


}
