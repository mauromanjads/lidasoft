"use client";

import Button from "@/components/ui/button";
import Buttonsec from "@/components/ui/buttonsec";
import Input from "@/components/ui/input";
import CurrencyInput from "@/components/ui/currencyInput";
import Swal from "sweetalert2";
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
  eliminarPresentacion,
  crearVariante,
  actualizarVariante,
  listarVariantes,
  eliminarVariante
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

interface VarianteForm {
    id?: number | null;
    sku: string;
    parametros: Record<string, any>; // campo: valor
    precio_venta: number;
    precio_compra: number;
    activo: boolean;
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
  const [variantes, setVariantes] = useState<VarianteForm[]>([
    { id: null, sku: "", parametros: {}, precio_venta: 0, precio_compra: 0, activo: true }
  ]);

   const [activeTab, setActiveTab] = useState("producto");

   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
  
   const mergeParametrosCategoria = (
      categoriaId: number | null,
      categorias: Categoria[],
      parametrosActuales: Record<string, string> = {}
    ): Record<string, string> => {
      if (!categoriaId) return parametrosActuales;

      const categoria = categorias.find(c => c.id === categoriaId);
      if (!categoria || !categoria.parametros) return parametrosActuales;

      return {
        ...categoria.parametros,      // estructura base
        ...parametrosActuales,        // valores guardados pisan la base
      };
    };


  useEffect(() => {
  async function loadData() {
    // 🔹 Cargar catálogos
    const [u, c] = await Promise.all([
      obtenerUnidades(),
      obtenerCategorias(),
    ]);

    setUnidades(u);
    setCategorias(c);

    const unidadDefault = u[0]?.id ?? null;
    setUnidadMedidaId(unidadDefault);

   
    // 🔹 Presentaciones
    setPresentaciones(prev =>
      prev.map(p => ({
        ...p,
        unidad_medida_id: unidadDefault || 0,
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

  useEffect(() => {
    if (!productoId) return;

    listarVariantes(productoId)
      .then((data) => {
        setVariantes(
          data.map(v => ({
            id: v.id,
            sku: v.sku,
            parametros: v.parametros ?? {},
            precio_venta: v.precio_venta ?? 0,
            precio_compra: v.precio_compra ?? 0,
            activo: v.activo ?? true,
          }))
        );
      })
      .catch(console.error);
  }, [productoId]);

  useEffect(() => {
  if (!categoriaId || categorias.length === 0) return;

  setVariantes(prev =>
    prev.map(v => ({
      ...v,
      parametros: mergeParametrosCategoria(
        categoriaId,
        categorias,
        v.parametros ?? {}
      ),
    }))
  );
}, [categoriaId, categorias]);


  
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

      // Validar presentaciones antes de crear producto
      if (!presentaciones || presentaciones.length === 0) {
        throw new Error("El producto debe tener al menos una presentación.");
      }

      for (const pres of presentaciones) {
        if (!pres.tipo_presentacion || pres.tipo_presentacion.trim() === "") {
          throw new Error("Cada presentación debe tener un nombre.");
        }
        //if (!pres.precio_venta || pres.precio_venta <= 0) {
        //  throw new Error(`La presentación "${pres.tipo_presentacion}" debe tener un precio de venta válido.`);
       // }
      }

      for (const variante of variantes) {
        if (!variante.sku || variante.sku.trim() === "") {
          throw new Error("La variante debe tener SKU.");
        }
        if (!variante.precio_venta || variante.precio_venta <= 0) {
          throw new Error(`La variante "${variante.sku}" debe tener un precio de venta válido.`);
        }
      }

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

        // ===================== PRESENTACIONES =====================
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

        // ===================== VARIANTES =====================
        for (const v of variantes) {
          if (!v.sku || v.sku.trim() === "") continue;

          await crearVariante(producto.id, {
            sku: v.sku.trim(),
            parametros: v.parametros ?? {},
            precio_venta: v.precio_venta ?? 0,
            precio_compra: v.precio_compra ?? 0,
            activo: v.activo ?? true,
          });
        }
      }

      // ==========================================================
      // 🟦 SEGUNDO: ACTUALIZAR si SÍ hay productoId
      // ==========================================================
      else {
  // ===================== ACTUALIZAR PRODUCTO =====================
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

        // ===================== PRESENTACIONES =====================
        const presentacionesBD = await listarPresentaciones(Number(producto.id));

        // eliminar presentaciones quitadas
        for (const presBD of presentacionesBD) {
          const existe = presentaciones.some(p => p.id === presBD.id);
          if (!existe && presBD.id) {
            await eliminarPresentacion(presBD.id);
          }
        }

        // crear o actualizar presentaciones
        for (const pres of presentaciones) {
          if (pres.id) {
            await actualizarPresentacion(pres.id, {
              tipo_presentacion: pres.tipo_presentacion,
              cantidad_equivalente: pres.cantidad_equivalente,
              unidad_medida_id: pres.unidad_medida_id,
              precio_venta: pres.precio_venta,
              precio_compra: pres.precio_compra,
              activo: pres.activo,
            });
          } else {
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

        // ===================== VARIANTES =====================
        const variantesBD = await listarVariantes(Number(producto.id));

        // eliminar variantes quitadas
        for (const vBD of variantesBD) {
          const existe = variantes.some(v => v.id === vBD.id);
          if (!existe && vBD.id) {
            await eliminarVariante(productoId,vBD.id);
          }
        }

        // crear o actualizar variantes
        for (const v of variantes) {
          if (!v.sku || v.sku.trim() === "") continue;

          if (v.id) {
            await actualizarVariante( productoId,v.id, {
              sku: v.sku.trim(),
              parametros: v.parametros ?? {},
              precio_venta: v.precio_venta,
              precio_compra: v.precio_compra,
              activo: v.activo,
            });
          } else {
            await crearVariante(productoId, {
              sku: v.sku.trim(),
              parametros: v.parametros ?? {},
              precio_venta: v.precio_venta,
              precio_compra: v.precio_compra,
              activo: v.activo,
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

      const mensaje = productoId ? "Producto actualizado" : "Producto creado correctamente"

      Swal.fire({
        title: "¡Listo!",
        text: mensaje,
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 4000,
        timerProgressBar: true,
      });



    } catch (error: any) {
        Swal.fire({
        title: "Oops...!",
        text: error.message,
        icon: "error",
        confirmButtonText: "Entendido",
        timer: 4000,
        timerProgressBar: true,
      });


    } finally {
      setLoading(false);
    }
  }

  
  // Agregar variante
  const agregarVariante = () => {
    const parametrosBase = mergeParametrosCategoria(categoriaId,
    categorias,
    {});

    setVariantes(prev => [
      ...prev,
      {
        sku: "",
        parametros: mergeParametrosCategoria(categoriaId, categorias, {}),
        precio_venta: 0,
        precio_compra: 0,
        activo: true,
      },
    ]);
  };

  // Eliminar variante
  const eliminarVarianteForm = (index: number) => {
    setVariantes(prev => prev.filter((_, i) => i !== index));
  };

  // Manejar cambio
  const handleVarianteChange = <K extends keyof VarianteForm>(
    index: number,
    field: K,
    value: VarianteForm[K]
  ) => {
    setVariantes((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  return (
  <form 
    onSubmit={handleSubmit}           
  >
    <div className="flex space-x-3 border-b mb-3 text-sm">

      {/* Código */}
      <div className="flex flex-col w-full">
        <label className="text-sm font-semibold mb-1 text-gray-700">
          Código:
        </label>
        <Input
          className="border p-1.5 rounded text-sm font-bold"
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
          className="border p-1.5 rounded text-sm font-bold" 
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
    
    </div>
    
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
          🛒Datos básicos
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

        <button
              type="button"
              onClick={() => setActiveTab("variantes")}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium
                transition-colors relative
                ${activeTab === "variantes"
                  ? "text-[#1d4e89] border-b-2 border-[#1d4e89] font-semibold"
                  : "text-gray-600 hover:text-[#1d4e89]"}
              `}
            >
          🎨 Variantes
        </button>

      </div>

       {/* === TAB PRODUCTO === */}
       {activeTab === "producto" && (
           <div className="space-y-3">
          
              {/* GRID GENERAL */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 
                border border-gray-300 rounded-lg 
                bg-gray-50 p-3 shadow-sm">
            
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
       <div className="flex flex-col max-h-[350px]"> 
        
          {/* Contenedor principal con flex-col */}        

          {/* Contenedor con scroll */}
          <div className="flex-1 overflow-y-auto max-h-[400px] border rounded-xl">

              <table className="w-full border-collapse">
                
                <thead className="bg-gradient-to-r from-[#1d4e89] to-blue-800 text-white">
                  <tr>
                    <th className="border p-2 w-[250px] sticky top-0 z-20 bg-[#1d4e89]">
                      Presentación
                    </th>
                    <th className="border p-2 w-[80px] sticky top-0 z-20 bg-[#1d4e89]">
                      Equivalencia
                    </th>
                    <th className="border p-2 w-[120px] sticky top-0 z-20 bg-[#1d4e89]">
                      Unidad
                    </th>
                    <th className="border p-2 w-[150px] sticky top-0 z-20 bg-[#1d4e89]">
                      Precio Venta
                    </th>
                    <th className="border p-2 w-[150px] sticky top-0 z-20 bg-[#1d4e89]">
                      Precio Compra
                    </th>
                    <th className="border p-2 w-[120px] sticky top-0 z-20 bg-[#1d4e89]">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {presentaciones.map((pres, index) => (
                    <tr key={index} className="hover:bg-gray-50">

                      <td className="p-2">
                        <Input
                          required
                          className="w-full"
                          value={pres.tipo_presentacion}
                          onChange={(e) =>
                            handlePresentacionChange(index, "tipo_presentacion", e.target.value)
                          }
                        />
                      </td>

                      <td className="p-2">
                        <Input
                        title="Factor de equivalencia (Cantidad de unidades base que incluye esta presentación)"
                          required
                          type="number"
                          className="w-full"
                          value={pres.cantidad_equivalente}
                          onChange={(e) =>
                            handlePresentacionChange(
                              index,
                              "cantidad_equivalente",
                              Number(e.target.value)
                            )
                          }
                        />
                      </td>

                      <td className="p-2">
                        <SelectSearch
                          items={unidades}
                          value={pres.unidad_medida_id}
                          onChange={(newValue) =>
                            handlePresentacionChange(index, "unidad_medida_id", Number(newValue))
                          }
                        />
                      </td>

                      <td className="p-2">
                        <CurrencyInput
                          title="Precio de Venta, colocar valor solo si no maneja precios en VARIANTES"
                          className="w-full"
                          value={pres.precio_venta}
                          onChange={(val) =>
                            handlePresentacionChange(index, "precio_venta", val)
                          }
                        />
                      </td>

                      <td className="p-2">
                        <CurrencyInput
                          title="Costo de Compra, colocar valor solo si no maneja precios en VARIANTES"
                          className="w-full"
                          value={pres.precio_compra}
                          onChange={(val) =>
                            handlePresentacionChange(index, "precio_compra", val)
                          }
                        />
                      </td>

                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => eliminarPresentacionForm(index)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          ❌
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
          </div>

          {/* Botón fijo debajo */}
          <div className="border-t bg-white p-3 sticky bottom-0">
            <Buttonsec type="button" onClick={agregarPresentacion}>
              <img src="/icons/plus.png" alt="Agregar" className="w-6 h-6" />
              <span>Agregar Presentación</span>
            </Buttonsec>
          </div>
       </div>

       )}

      {/* === TAB VARIANTES === */}
        {activeTab === "variantes" && (
          <div className="flex flex-col max-h-[350px]">
            
            {/* Contenedor principal con flex-col */}
          
            <div className="flex-1 overflow-y-auto max-h-[400px] border rounded-xl">

              <table className="w-full border-collapse">

                <thead className="bg-gradient-to-r from-[#1d4e89] to-blue-800 text-white">
                  <tr>
                    <th className="border p-2 w-[250px] sticky top-0 z-20 bg-[#1d4e89]">
                      SKU
                    </th>

                    {Object.keys(variantes[0]?.parametros || {}).map((campo) => (
                      <th
                        key={campo}
                        className="border p-2 sticky top-0 z-20 bg-[#1d4e89]"
                      >
                        {campo}
                      </th>
                    ))}

                    <th className="border p-2 w-[120px] sticky top-0 z-20 bg-[#1d4e89]">
                      Activo
                    </th>
                    <th className="border p-2 w-[150px] sticky top-0 z-20 bg-[#1d4e89]">
                      Precio Venta
                    </th>
                    <th className="border p-2 w-[150px] sticky top-0 z-20 bg-[#1d4e89]">
                      Costo Compra
                    </th>
                    <th className="border p-2 w-[120px] sticky top-0 z-20 bg-[#1d4e89]">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {variantes.map((v, index) => (
                    <tr key={index} className="hover:bg-gray-50">

                      {/* SKU */}
                      <td className="p-2">
                        <Input                        
                          value={v.sku}
                          onChange={(e) =>
                            handleVarianteChange(index, "sku", e.target.value)
                          }
                          required
                        />
                      </td>

                      {/* Parámetros dinámicos */}
                      {Object.keys(v.parametros).map((campo) => (
                        <td key={campo} className="p-2">
                          <Input                          
                            value={v.parametros[campo]}
                            onChange={(e) =>
                              handleVarianteChange(index, "parametros", {
                                ...v.parametros,
                                [campo]: e.target.value,
                              })
                            }
                          />
                        </td>
                      ))}

                      {/* Activo */}
                      <td className="p-2 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={v.activo}
                          onChange={(e) =>
                            handleVarianteChange(index, "activo", e.target.checked)
                          }
                        />
                      </td>

                      {/* Precio Venta */}
                      <td className="p-2">
                        <CurrencyInput
                          title="Precio por unidad mínima de inventario"
                          value={v.precio_venta}
                          onChange={(val) =>
                            handleVarianteChange(index, "precio_venta", val)
                          }
                        />
                      </td>

                      {/* Precio Compra */}
                      <td className="p-2">
                        <CurrencyInput
                        title ="Costo por unidad mínima de inventario"
                          value={v.precio_compra}
                          onChange={(val) =>
                            handleVarianteChange(index, "precio_compra", val)
                          }
                        />
                      </td>

                      {/* Acción */}
                      <td className="p-2 text-center align-middle">
                        <button
                          type="button"
                          onClick={() => eliminarVarianteForm(index)}
                          className="text-red-600 hover:underline"
                        >
                          ❌
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* ⬇️ BOTÓN FIJO */}
            <div className="border-t bg-white p-3 sticky bottom-0">
              <Buttonsec type="button" onClick={agregarVariante}>
                <img src="/icons/plus.png" alt="Agregar" className="w-6 h-6" />
                <span>Agregar Variante</span>
              </Buttonsec>
            </div>
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
