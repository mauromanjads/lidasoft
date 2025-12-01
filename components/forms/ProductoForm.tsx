"use client";

import { useEffect, useState } from "react";
import { 
    crearProducto,
    crearPresentacion, 
    crearPrecio, 
    obtenerUnidades,
    actualizarProducto,
    actualizarPresentacion,
    actualizarPrecio ,
    listarPresentaciones,
    listarPrecios

  } from "@/lib/api/productos";
import { UnidadMedida } from "@/app/types";

interface PrecioForm {
  lista_precio: string;
  precio: number;
  iva_porcentaje: number;
  fecha_desde: string;
}

interface PresentacionForm {
  tipo_presentacion: string;
  cantidad_equivalente: number;
  unidad_medida_id: number;
  precios: PrecioForm[];
}

interface ProductoFormProps {
  onCreate?: () => Promise<void>; // función opcional que devuelve una promesa
  producto?: {
    id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  };
   onSubmit: (data: { 
    codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
   
  }) => Promise<void>;
  onClose?: () => void;
  onSaved?: () => void;

}

export default function ProductoForm({ onCreate }: ProductoFormProps) {
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [unidades, setUnidades] = useState<UnidadMedida[]>([]);
  const [presentaciones, setPresentaciones] = useState<PresentacionForm[]>([
    { tipo_presentacion: "", cantidad_equivalente: 1, unidad_medida_id: 0, precios: [] }
  ]);

  useEffect(() => {
    async function fetchUnidades() {
      const data = await obtenerUnidades();
      setUnidades(data);
      // inicializar unidad_medida_id con la primera disponible
      setPresentaciones(prev => prev.map(p => ({ ...p, unidad_medida_id: data[0]?.id || 0 })));
    }
    fetchUnidades();
  }, []);

  function agregarPresentacion() {
    setPresentaciones([...presentaciones, { tipo_presentacion: "", cantidad_equivalente: 1, unidad_medida_id: unidades[0]?.id || 0, precios: [] }]);
  }

  function eliminarPresentacion(index: number) {
    setPresentaciones(presentaciones.filter((_, i) => i !== index));
  }

  function agregarPrecio(pIndex: number) {
    const newPresentaciones = [...presentaciones];
    newPresentaciones[pIndex].precios.push({ lista_precio: "GENERAL", precio: 0, iva_porcentaje: 0, fecha_desde: new Date().toISOString().slice(0,10) });
    setPresentaciones(newPresentaciones);
  }

  function eliminarPrecio(pIndex: number, prIndex: number) {
    const newPresentaciones = [...presentaciones];
    newPresentaciones[pIndex].precios.splice(prIndex, 1);
    setPresentaciones(newPresentaciones);
  }

  function handlePresentacionChange<K extends keyof PresentacionForm>(
  index: number,
  field: K,
  value: PresentacionForm[K]
  ) {
    setPresentaciones(prev =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }

  function handlePrecioChange<K extends keyof PrecioForm>(
  pIndex: number,
  prIndex: number,
  field: K,
  value: PrecioForm[K]
  ) {
    setPresentaciones(prev =>
      prev.map((p, i) =>
        i === pIndex
          ? {
              ...p,
              precios: p.precios.map((pr, j) =>
                j === prIndex ? { ...pr, [field]: value } : pr
              ),
            }
          : p
      )
    );
  }

    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      // ===================== 1️⃣ Crear producto =====================
      const producto = await crearProducto({ codigo, nombre, descripcion });
      if (!producto?.id) throw new Error("No se pudo crear el producto");

      // ===================== 2️⃣ Crear presentaciones =====================
      for (const pres of presentaciones) {
        const presentacion = await crearPresentacion(producto.id, {
         tipo_presentacion: pres.tipo_presentacion,
          cantidad_equivalente: pres.cantidad_equivalente,
          unidad_medida_id: pres.unidad_medida_id,
          activo: true,          
      });

        if (!presentacion?.id) throw new Error("No se pudo crear la presentación");

        // ===================== 3️⃣ Crear precios =====================
        for (const pr of pres.precios) {
          await crearPrecio(presentacion.id, pr);
        }
      }

      // ===================== 4️⃣ Reset del formulario =====================
      setCodigo("");
      setNombre("");
      setDescripcion("");
      setPresentaciones([
        { tipo_presentacion: "", cantidad_equivalente: 1, unidad_medida_id: unidades[0]?.id || 0, precios: [] }
      ]);

      // ===================== 5️⃣ Callback opcional =====================
      if (onCreate) await onCreate();

      alert("Producto creado correctamente ✅");

    } catch (err: any) {
      console.error(err);
      alert("Error al crear producto: " + (err.message || err));
    }
  }


  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded space-y-4">
      <h2 className="text-xl font-bold">Crear Producto Completo</h2>

      <div className="flex gap-2">
        <input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Código" className="border p-1 flex-1"/>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" className="border p-1 flex-2"/>
        <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" className="border p-1 flex-3"/>
      </div>

      {presentaciones.map((pres, pIndex) => (
        <div key={pIndex} className="border p-2 rounded space-y-2">
          <div className="flex gap-2 items-center">
            <input value={pres.tipo_presentacion} onChange={e => handlePresentacionChange(pIndex, "tipo_presentacion", e.target.value)} placeholder="Tipo Presentación" className="border p-1 flex-1"/>
            <input type="number" value={pres.cantidad_equivalente} onChange={e => handlePresentacionChange(pIndex, "cantidad_equivalente", Number(e.target.value))} placeholder="Cantidad" className="border p-1 w-24"/>
            <select value={pres.unidad_medida_id} onChange={e => handlePresentacionChange(pIndex, "unidad_medida_id", Number(e.target.value))} className="border p-1">
              {unidades.map(u => <option key={u.id} value={u.id}>{u.codigo}</option>)}
            </select>
            <button type="button" onClick={() => eliminarPresentacion(pIndex)} className="text-red-500">Eliminar</button>
          </div>

          <div className="ml-4 space-y-1">
            <h4 className="font-semibold">Precios</h4>
            {pres.precios.map((pr, prIndex) => (
              <div key={prIndex} className="flex gap-2 items-center">
                <input value={pr.lista_precio} onChange={e => handlePrecioChange(pIndex, prIndex, "lista_precio", e.target.value)} placeholder="Lista" className="border p-1 w-32"/>
                <input type="number" value={pr.precio} onChange={e => handlePrecioChange(pIndex, prIndex, "precio", Number(e.target.value))} placeholder="Precio" className="border p-1 w-24"/>
                <input type="number" value={pr.iva_porcentaje} onChange={e => handlePrecioChange(pIndex, prIndex, "iva_porcentaje", Number(e.target.value))} placeholder="IVA %" className="border p-1 w-24"/>
                <input type="date" value={pr.fecha_desde} onChange={e => handlePrecioChange(pIndex, prIndex, "fecha_desde", e.target.value)} className="border p-1 w-36"/>
                <button type="button" onClick={() => eliminarPrecio(pIndex, prIndex)} className="text-red-500">Eliminar</button>
              </div>
            ))}
            <button type="button" onClick={() => agregarPrecio(pIndex)} className="text-blue-500 mt-1">+ Agregar Precio</button>
          </div>
        </div>
      ))}

      <button type="button" onClick={agregarPresentacion} className="text-green-600">+ Agregar Presentación</button>

      <div className="mt-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar Producto Completo</button>
      </div>
    </form>
  );
}
