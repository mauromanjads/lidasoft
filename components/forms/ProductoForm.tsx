"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import CurrencyInput from "@/components/ui/currencyInput";

import SelectSearch from "@/components/ui/selectSearch";

import { useEffect, useState } from "react";
import {
  crearProducto,
  actualizarProducto,
  crearPresentacion,
  obtenerUnidades,
  obtenerCategorias,
  listarPresentaciones,
  actualizarPresentacion,
  eliminarPresentacion
} from "@/lib/api/productos";
import { Producto, UnidadMedida, Categoria } from "@/app/types";

interface PresentacionForm {
  id?: number | null;
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
  const productoId = producto?.id ?? null;

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
      id:null,
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
      
     // cargar presentaciones desde la API
    listarPresentaciones(Number(producto.id))
      .then((lista) => {
        // Convertimos la lista del backend al formato que usa el formulario
        const mapped = lista.map((p) => ({
          id: p.id,
          tipo_presentacion: p.tipo_presentacion ?? "",
          cantidad_equivalente: p.cantidad_equivalente ?? 1,
          unidad_medida_id: p.unidad_medida_id ?? 0,
          precio_venta: p.precio_venta ?? 0,
          precio_compra: p.precio_compra ?? 0,
          activo: p.activo ?? true,
        }));

        setPresentaciones(mapped);
      })
      .catch((err) => {
        console.error("Error cargando presentaciones:", err);
        setPresentaciones([]);
      });

    }
  }, [producto,categorias],);


  
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

  const eliminarPresentacionForm = (index: number) => {
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

    setLoading(true);

    try {
      
      // ==========================================================
      // 🟩 PRIMERO: CREAR si NO hay productoId
      // ==========================================================
      if (!productoId) {
        producto = await crearProducto({
          codigo,
          nombre,
          descripcion,
          codigo_barra: codigoBarra,
          categoria_id: categoriaId,
          iva,
          tipo_impuesto: tipoImpuesto,
          unidad_medida_id: unidadMedidaId,
          control_inventario: controlInventario,
          activo,
        });

        if (!producto?.id) throw new Error("No se pudo crear el producto");

        // Crear presentaciones solo cuando es un producto nuevo
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
      }

      // ==========================================================
      // 🟦 SEGUNDO: ACTUALIZAR si SÍ hay productoId
      // ==========================================================
      else {
        producto = await actualizarProducto(productoId, {
          codigo,
          nombre,
          descripcion,
          codigo_barra: codigoBarra,
          categoria_id: categoriaId,
          iva,
          tipo_impuesto: tipoImpuesto,
          unidad_medida_id: unidadMedidaId,
          control_inventario: controlInventario,
          activo,
        });

        // === cargar presentaciones existentes desde BD ===
       const presentacionesBD = await listarPresentaciones(Number(producto.id));

        // === eliminar presentaciones quitadas en el front ===
        for (const presBD of presentacionesBD) {
          const existe = presentaciones.some((p) => p.id === presBD.id);
          if (!existe) {
            if (!presBD.id) continue;
            await eliminarPresentacion(presBD.id);
          }
        }

        // === crear o actualizar presentaciones ===
        for (const pres of presentaciones) {
          // actualizar si tiene ID
          if (pres.id) {
            await actualizarPresentacion( pres.id, {
              tipo_presentacion: pres.tipo_presentacion,
              cantidad_equivalente: pres.cantidad_equivalente,
              unidad_medida_id: pres.unidad_medida_id,
              precio_venta: pres.precio_venta,
              precio_compra: pres.precio_compra,
              activo: pres.activo,
            });
          }

          // crear si NO tiene ID
          else {
            await crearPresentacion(productoId, {
              tipo_presentacion: pres.tipo_presentacion,
              cantidad_equivalente: pres.cantidad_equivalente,
              unidad_medida_id: pres.unidad_medida_id,
              precio_venta: pres.precio_venta,
              precio_compra: pres.precio_compra,
              activo: pres.activo,
            });
          }
        }
      }

      // ==========================================================
      // Callbacks
      // ==========================================================
      if (onSubmit) await onSubmit(producto);
      if (onSaved) onSaved();
      if (onClose) onClose();

      alert(productoId ? "Producto actualizado" : "Producto creado correctamente");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }


    return (
  <form
    onSubmit={handleSubmit}
    className="p-2 border rounded-md space-y-3 text-sm max-w-5xl mx-auto"
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
          🛒Producto
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
          ⚖️ Presentaciones
        </button>
      </div>

       {/* === TAB PRODUCTO === */}
       {activeTab === "producto" && (
           <div className="space-y-3">
          
              {/* GRID GENERAL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            
                 {/* Código */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-semibold mb-1 text-gray-700">
                    Código:
                  </label>
                  <Input
                    className="border p-1.5 rounded text-sm"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    required
                  />
                </div>

                {/* Nombre */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-semibold mb-1 text-gray-700">
                    Nombre:
                  </label>
                  <Input
                    className="border p-1.5 rounded text-sm"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                {/* Estado */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-semibold mb-1 text-gray-700 text-center">
                    Estado:
                  </label>
                  <div className="flex items-center gap-2 justify-center">
                    <Input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-600 border border-gray-300 rounded-md shadow-sm"
                      checked={activo}
                      onChange={(e) => setActivo(e.target.checked)}
                    />
                    <span
                      className={`font-semibold text-base ${activo ? "text-green-700" : "text-red-600"}`}
                    >
                      {activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                {/* Código de barras */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-semibold mb-1 text-gray-700">
                    Código Barras:
                  </label>
                  <Input
                    className="border p-1.5 rounded text-sm"
                    value={codigoBarra}
                    onChange={(e) => setCodigoBarra(e.target.value)}
                    required
                  />
                </div>

                {/* Categoría */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-semibold mb-1 text-gray-700">
                    Categoría:
                  </label>
                  <SelectSearch
                    items={categorias}
                    value={categoriaId}
                    onChange={setCategoriaId}
                  />
                </div>

                {/* Unidad de medida */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-semibold mb-1 text-gray-700">
                    Unidad de Medida:
                  </label>
                  <SelectSearch
                    items={unidades}
                    value={unidadMedidaId}
                    onChange={setUnidadMedidaId}
                  />
                </div>

                {/* IVA */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-semibold mb-1 text-gray-700">
                    IVA (%):
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    className="border p-1.5 rounded text-sm"
                    value={iva}
                    onChange={(e) => setIva(Number(e.target.value))}
                  />
                </div>

                {/* Tipo impuesto */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-semibold mb-1 text-gray-700">
                    Tipo Impuesto:
                  </label>
                  <select
                    className="border p-1.5 rounded text-sm"
                    value={tipoImpuesto}
                    onChange={(e) => setTipoImpuesto(e.target.value)}
                  >
                    <option value="">Seleccione…</option>
                    <option value="GRAVADO">GRAVADO</option>
                    <option value="NO_GRAVADO">NO GRAVADO</option>
                    <option value="EXENTO">EXENTO</option>
                    <option value="EXCLUIDO">EXCLUIDO</option>
                  </select>
                </div>

                {/* Control inventario */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-semibold mb-1 text-gray-700">
                    Inventario:
                  </label>
                  <select
                    className="border p-1.5 rounded text-sm"
                    value={controlInventario}
                    onChange={(e) => setControlInventario(e.target.value)}
                  >
                    <option value="S">Controla inventario</option>
                    <option value="N">No controla inventario</option>
                  </select>
                </div>

                {/* Descripción */}
               
                    <div className="flex flex-col w-full md:col-span-3">
                      <label className="text-sm font-semibold mb-1 text-gray-700">
                        Descripción:
                      </label>
                      <textarea
                        className="border p-1.5 rounded text-sm"
                        rows={2}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                      />
                    </div>
              
           
              </div>

           
           </div>
        )}

       {/* === TAB PRESENTACIONES === */}
       {activeTab === "presentaciones" && (
        <div>
         
          {presentaciones.map((pres, index) => (
            <div key={index} className="border rounded p-2 space-y-2 bg-gray-50">

              <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-sm"> 

                  <div className="flex flex-col w-full">  
                      <label className="text-sm font-semibold mb-1 text-gray-700">
                        Presentación:
                      </label>
                      <Input
                      required
                        className="border p-1.5 rounded"
                        value={pres.tipo_presentacion}
                        onChange={(e) =>
                          handlePresentacionChange(index, "tipo_presentacion", e.target.value)
                        }
                      />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="text-sm font-semibold mb-1 text-gray-700">
                      Equivalencia:
                    </label>
                    <Input
                      required
                      type="number"
                      className="border p-1.5 rounded"
                      value={pres.cantidad_equivalente}
                      onChange={(e) =>
                        handlePresentacionChange(index, "cantidad_equivalente", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="text-sm font-semibold mb-1 text-gray-700">
                      Unidad de Medida:
                    </label>
                    <SelectSearch
                      items={unidades}
                      value={presentaciones[index].unidad_medida_id}
                      onChange={(newValue) =>
                        handlePresentacionChange(index, "unidad_medida_id", Number(newValue))
                      }
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="text-sm font-semibold mb-1 text-gray-700">
                      Precio Venta:
                    </label>
                    <CurrencyInput                      
                      className="border p-1.5 rounded"
                      value={pres.precio_venta}
                      onChange={(val) =>
                        handlePresentacionChange(index, "precio_venta", val)
                      }
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="text-sm font-semibold mb-1 text-gray-700">
                      Precio Compra:
                    </label>
                    <CurrencyInput
                      className="border p-1.5 rounded"
                      value={pres.precio_compra}
                      onChange={(val) =>
                        handlePresentacionChange(index, "precio_compra", val)
                      }
                    />
                  </div>

                  <div className="flex justify-between items-center mb-2">
                  <button
                    type="button"
                    onClick={() => eliminarPresentacionForm(index)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    ❌
                  </button>
                </div>

              
              </div>
            </div>
          ))}

          <Button
            type="button"
            onClick={agregarPresentacion}
            className="text-green-600 text-sm"
          >
              <div className="flex items-center gap-2">
              <img src="/icons/plus.png" alt="Pdf" className="w-6 h-6" />
              <span>Agregar Presentación</span>
            </div> 
          </Button>
        </div>
       )}

      {/* ⚠️ ERRORES */}
      {error && <p className="text-red-500">{error}</p>}


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
