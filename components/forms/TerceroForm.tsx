"use client";

import { useState } from "react";
import { useEffect,useRef} from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Collapsible from "@/components/ui/collapsible";
import SelectTipoDocumento from "@/components/ui/selects/TipoDocumentoSelect";
import SelectGeneros from "@/components/ui/selects/GeneroSelect";
import SelectRegimenes from "@/components/ui/selects/RegimenesSelect";
import { guardarTercero,actualizarTercero } from "@/lib/api/terceros";
import { usePathname } from "next/navigation";

interface TerceroFormProps {
  tercero?: {
    id: string;
    tipo_persona: string;
    tipo_documento_id: number;
    documento: string;
    dv: string;
    nombre: string;
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    fecha_nacimiento: string;
    genero_id: number;
    razon_social: string;
    nombre_comercial: string;
    regimen_id: number;
    tipo_responsable_id: number;
    gran_contribuyente: boolean;
    autoretenedor: boolean;
    ciiu_id: number;
    direccion: string;
    municipio_id?: number;
    departamento_id?: number;
    telefono: string;
    celular: string;
    whatsapp: string;
    correo: string;
    pagina_web: string;
    pais_id: number;
    lista_precio_id: number;
    vendedor_id: number;
    tiene_cupo: boolean;
    cupo_credito: number;
    plazo_dias: number;
    acepta_factura_electronica: boolean;
    recibe_correo: boolean;
    estado: string;
    notas: string;
    usuario_creacion: string;
    fecha_creacion: string;
    usuario_modifico: string;
    fecha_modificacion: string;
  };
  onSubmit: (data: { 
    tipo_persona: string;
    tipo_documento_id: number;
    documento: string;  
    dv: string;
    nombre: string;
    primer_nombre: string;
    segundo_nombre: string;
    primer_apellido: string;
    segundo_apellido: string;
    fecha_nacimiento: string;
    genero_id: number;
    razon_social: string;
    nombre_comercial: string;
    regimen_id: number;
    tipo_responsable_id: number;
    gran_contribuyente: boolean;
    autoretenedor: boolean;
    ciiu_id: number;
    direccion: string;
    municipio_id: number;
    telefono: string;
    celular: string;
    whatsapp: string;
    correo: string;
    pagina_web: string;
    pais_id: number;
    lista_precio_id: number;
    vendedor_id: number;
    tiene_cupo: boolean;
    cupo_credito: number;
    plazo_dias: number;
    acepta_factura_electronica: boolean;
    recibe_correo: boolean;
    estado: string;
    notas: string;
    usuario_creacion: string;
    fecha_creacion: string;
    usuario_modifico: string;
    fecha_modificacion: string;
   
  }) => Promise<void>;
  onClose?: () => void;
  onSaved?: () => void;  
}

export default function TerceroForm({tercero, onClose,onSaved }: TerceroFormProps) {  
  
  const pathname = usePathname();           
  const tipoTercero = pathname.split("/").pop();  // 👉 "para saber de que ruta viene /clientes, /proveedores, etc"

  const [formData, setFormData] = useState( tercero || { 
    tipo_persona: "",  
    tipo_documento_id:0, 
    documento: "",
    dv: "",
    nombre: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",     
    fecha_nacimiento: "",         
    razon_social: "",
    nombre_comercial: "",  
    direccion: "",   
    telefono: "",
    celular: "",
    whatsapp: "" ,
    correo : "tucorreo@info.com" ,
    estado: "A",
    tipotercero: tipoTercero || "",
    
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
     
  const disableStyle = (condition: boolean) =>
  condition ? "bg-gray-200 cursor-not-allowed" : "";

  const limpiarCampos = (tipo: string) => {
      if (tipo === "J") {
        return {
          primer_nombre: "",
          segundo_nombre: "",
          primer_apellido: "",
          segundo_apellido: "",
          nombre: ""
        };
      }
      return { dv: "", razon_social: "" };
    };

    useEffect(() => {
      setFormData(prev => ({
        ...prev,
        ...limpiarCampos(formData.tipo_persona)
      }));
    }, [formData.tipo_persona]);

    useEffect(() => {
      const {
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        razon_social,
        tipo_persona
      } = formData;

      const nombreDesdePartes = [
        primer_nombre?.trim(),
        segundo_nombre?.trim(),
        primer_apellido?.trim(),
        segundo_apellido?.trim()
      ]
        .filter(Boolean)
        .join(" ");

      const newData: Partial<typeof formData> = {};

      if (tipo_persona === "J") {
        // Si el usuario escribió algo en razon_social, usarlo como fuente
        if (razon_social && razon_social.trim() !== "") {
          newData.nombre = razon_social.trim();          
        } 
        
      } else {
        // Persona natural: nombre viene de las partes y razon_social se limpia
        newData.nombre = nombreDesdePartes;
        newData.razon_social = "";
      }

      setFormData(prev => {
        // evita setState si no hay cambios (previene loops innecesarios)
        if (
          prev.nombre === (newData.nombre ?? prev.nombre) &&
          prev.razon_social === (newData.razon_social ?? prev.razon_social)
        ) {
          return prev;
        }
        return { ...prev, ...newData };
      });
    }, [
      formData.tipo_persona,
      formData.primer_nombre,
      formData.segundo_nombre,
      formData.primer_apellido,
      formData.segundo_apellido,
      formData.razon_social
    ]);


  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const target = e.target;  // 👈 guardamos la referencia

      let val: any;

      if (target instanceof HTMLInputElement && target.type === "checkbox") {
        val = target.checked;  // 👌 ya no da error
      } 
      else if (target instanceof HTMLInputElement && target.type === "number") {
        val = target.value === "" ? undefined : Number(target.value);
      } 
      else if (target instanceof HTMLInputElement && target.type === "date") {        
        val = target.value === "" ? null : target.value; 
      }
      else {
        val = target.value; 
      }

      setFormData((prev: any) => ({
        ...prev,
        [target.name]: val,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.documento) {
      setError("Nombre y Documento son obligatorios.");
      return;
    }

    setError(null);
    setLoading(true);

    try {        
       if (tercero) {
          await actualizarTercero(tercero.id, formData); // EDITAR
        } else {
          await guardarTercero(formData); // CREAR
        }
      
      if (onClose) onClose();  
      if (onSaved) onSaved();
    } catch (err:any) {
      console.error(err);
      const mensajeError =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        "Error desconocido";
      setError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const handleToggle = (index: number) => {
  setOpenIndex(openIndex === index ? null : index); 
  }

  return (
   
   <form onSubmit={handleSubmit} className="space-y-4 ">
  {/* 🧑 DATOS PERSONALES */}
  <Collapsible title="🧑 Datos Personales"  isOpen={openIndex === 0}  onToggle={() => handleToggle(0)}>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block mb-1 font-medium">Tipo de Persona</label>
        <select
          name="tipo_persona"
          value={formData.tipo_persona || ""}
          className="w-full border rounded-md p-2"
          required
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="N">Natural</option>
          <option value="J">Jurídica</option>
        </select>
      </div>

      <SelectTipoDocumento formData={formData} handleChange={handleChange} />
      
      <div>
        <label className="block mb-1 font-medium">Documento</label>
        <Input
          name="documento"
          value={formData.documento || ""}
          onChange={handleChange}
          placeholder="Documento"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">DV</label>
        <Input
          name="dv"
          value={formData.dv || ""}
          onChange={handleChange}
          maxLength={1}   
          readOnly={formData.tipo_persona !== "J"}  
          className={disableStyle(formData.tipo_persona !== "J")}
        />
      </div>

       <div>
        <label className="block mb-1 font-medium">Primer Nombre</label>
        <Input
          name="primer_nombre"
          value={formData.primer_nombre || ""}
          onChange={handleChange}
          readOnly={formData.tipo_persona !== "N"}  
          className={disableStyle(formData.tipo_persona !== "N")}
        />
      </div>
      
      <div>
        <label className="block mb-1 font-medium">Segundo Nombre</label>
        <Input
          name="segundo_nombre"
          value={formData.segundo_nombre || ""}
          onChange={handleChange}
          readOnly={formData.tipo_persona !== "N"}  
          className={disableStyle(formData.tipo_persona !== "N")}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Primer Apellido</label>
        <Input
          name="primer_apellido"
          value={formData.primer_apellido || ""}
          onChange={handleChange}
          readOnly={formData.tipo_persona !== "N"}  
          className={disableStyle(formData.tipo_persona !== "N")}          
        />
      </div>
     
      <div>
        <label className="block mb-1 font-medium">Segundo Apellido</label>
        <Input
          name="segundo_apellido"
          value={formData.segundo_apellido || ""}
          onChange={handleChange}
          readOnly={formData.tipo_persona !== "N"}  
          className={disableStyle(formData.tipo_persona !== "N")}
        />
      </div>

       <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Razón Social</label>
            <Input
              name="razon_social"
              value={formData.razon_social || ""}
              onChange={handleChange}
              readOnly={formData.tipo_persona !== "J"}  
          className={disableStyle(formData.tipo_persona !== "J")}
            />
       </div>

       <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Nombre</label>
            <Input
              name="nombre"
              value={formData.nombre || ""}
              readOnly={true}  
             className={disableStyle(true)}
              onChange={handleChange}
              required
            />
         </div>     

    </div>
  </Collapsible>

  {/* 🧾 DATOS GENERALES */}
  <Collapsible title="📌 Datos Generales"  isOpen={openIndex === 1}  onToggle={() => handleToggle(1)}>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
     
    <div>
        <label className="block mb-1 font-medium">Fecha Nacimiento</label>
        <Input
          type="date"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento || ""}
          onChange={handleChange}
        />
      </div>      
     
       <SelectGeneros formData={formData} handleChange={handleChange} />
      <SelectRegimenes formData={formData} handleChange={handleChange} />
      
      <div>
        <label className="block mb-1 font-medium">Estado</label>
        <select
          name="estado"
          value={formData.estado || ""}
          className="w-full border rounded-md p-2"
          required
          onChange={handleChange}
        >
          <option value="">Seleccione...</option>
          <option value="A">Activo</option>
          <option value="I">Inactivo</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Celular</label>
        <Input
          name="celular"
          value={formData.celular || ""}
          onChange={handleChange}
        />
      </div>

      <div className="col-span-3">
        <label className="block mb-1 font-medium">Dirección</label>
        <Input
          name="direccion"
          value={formData.direccion || ""}
          onChange={handleChange}
        />
      </div>
      
    </div>
  </Collapsible>

  {/* 📅 CONTACTO */}
  <Collapsible title="📅 Contacto"  isOpen={openIndex === 2}  onToggle={() => handleToggle(2)}>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      <div>
        <label className="block mb-1 font-medium">Teléfono</label>
        <Input
          name="telefono"
          value={formData.telefono || ""}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">WhatsApp</label>
        <Input
          name="whatsapp"
          value={formData.whatsapp || ""}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Correo</label>
        <Input
        type="email"
          name="correo"
          value={formData.correo || ""}
          onChange={handleChange}
          required
        />
      </div>

     
    </div>
  </Collapsible>

  
  {/* ⚠️ ERRORES */}
  {error && <p className="text-red-500">{error}</p>}

  {/* BOTONES */}
  <div className="flex justify-end gap-2">
    <Button type="button" onClick={onClose} disabled={loading}>
      ❌ Cancelar
    </Button>
    <Button type="submit" disabled={loading}>
      {loading ? (tercero ? "Actualizando..." : "Guardando...") : (tercero ? "💾 Actualizar" : "💾 Guardar")}
    </Button>
  </div>
   </form>

  );
}
