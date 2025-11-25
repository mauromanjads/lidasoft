"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import SelectTipoDocumento from "@/components/ui/selects/TipoDocumentoSelect";
import { guardarCliente,actualizarCliente } from "@/lib/api/clientes";

interface ClienteFormProps {
  cliente?: {
    id: string;
    tipo_persona: string;
    tipo_documento_id: number;
    nit: string;
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
    nit: string;  
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

export default function ClienteForm({cliente, onClose,onSaved }: ClienteFormProps) {  
  
  const [formData, setFormData] = useState( cliente || { 
    tipo_persona: "",  
    tipo_documento_id:0, 
    nit: "",
    dv: "",
    nombre: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",              
    razon_social: "",
    nombre_comercial: "",  
    direccion: "",   
    telefono: "",
    celular: "",
    whatsapp: ""    
    
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      else {
        val = target.value; // Para select y text
      }

      setFormData((prev: any) => ({
        ...prev,
        [target.name]: val,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.nit) {
      setError("Nombre y NIT son obligatorios.");
      return;
    }

    setError(null);
    setLoading(true);

    try {        
       if (cliente) {
          await actualizarCliente(cliente.id, formData); // EDITAR
        } else {
          await guardarCliente(formData); // CREAR
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

  return (
   
   <form onSubmit={handleSubmit} className="space-y-4">

  {/* Bloque 1: Tipo Documento, Tipo Persona, NIT */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    
    <div>
      <label className="block mb-1 font-medium">Tipo de Persona</label>
      <select
        name="tipo_persona"
        value={formData.tipo_persona || ""}        
        required
        className="w-full border rounded-md p-2"
        onChange={handleChange}
      >
        <option value="">Seleccione...</option>
        <option value="N">Natural</option>
        <option value="J">Jurídica</option>
      </select>
    </div>
    
   <SelectTipoDocumento formData={formData} handleChange={handleChange} />
       
    <div>
      <label className="block mb-1 font-medium">NIT</label>
      <Input
        name="nit"
        value={formData.nit || ""}
        onChange={handleChange}
        placeholder="NIT"        
        required
      />
    </div>
  </div>

  {/* Bloque 2: DV, Nombre, Primer Nombre */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block mb-1 font-medium">DV</label>
      <Input
        name="dv"
        value={formData.dv || ""}
        onChange={handleChange}
        placeholder="DV"
        maxLength={1}
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Nombre</label>
      <Input
        name="nombre"
        value={formData.nombre || ""}
        onChange={handleChange}
        placeholder="Nombre"
        required
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Primer Nombre</label>
      <Input
        name="primer_nombre"
        value={formData.primer_nombre || ""}
        onChange={handleChange}
        placeholder="Primer Nombre"
      />
    </div>
  </div>

  {/* Bloque 3: Segundo Nombre, Primer Apellido, Segundo Apellido */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block mb-1 font-medium">Segundo Nombre</label>
      <Input
        name="segundo_nombre"
        value={formData.segundo_nombre || ""}
        onChange={handleChange}
        placeholder="Segundo Nombre"
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Primer Apellido</label>
      <Input
        name="primer_apellido"
        value={formData.primer_apellido || ""}
        onChange={handleChange}
        placeholder="Primer Apellido"
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Segundo Apellido</label>
      <Input
        name="segundo_apellido"
        value={formData.segundo_apellido || ""}
        onChange={handleChange}
        placeholder="Segundo Apellido"
      />
    </div>
  </div>

  {/* Bloque 4: Fecha Nacimiento, Teléfono, Celular */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    
    
    <div>
      <label className="block mb-1 font-medium">Teléfono</label>
      <Input
        name="telefono"
        value={formData.telefono || ""}
        onChange={handleChange}
        placeholder="Teléfono"
      />
    </div>
    <div>
      <label className="block mb-1 font-medium">Celular</label>
      <Input
        name="celular"
        value={formData.celular || ""}
        onChange={handleChange}
        placeholder="Celular"
      />
    </div>
  </div>

  {/* Bloque 5: WhatsApp, Correo, Dirección */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label className="block mb-1 font-medium">WhatsApp</label>
      <Input
        name="whatsapp"
        value={formData.whatsapp || ""}
        onChange={handleChange}
        placeholder="WhatsApp"
      />
    </div>
   
    <div>
      <label className="block mb-1 font-medium">Dirección</label>
      <Input
        name="direccion"
        value={formData.direccion || ""}
        onChange={handleChange}
        placeholder="Dirección"
      />
    </div>
  </div>

  {/* Bloque 6: Página Web, Gran Contribuyente, Autoretenedor */}
  

 

  {error && <p className="text-red-500">{error}</p>}

  <div className="flex justify-end gap-2">
    <Button type="button" onClick={onClose} disabled={loading}>
      ❌Cancelar
    </Button>
    <Button type="submit" disabled={loading}>
      {loading ? (cliente ? "Actualizando..." : "Guardando...") : (cliente ? "💾Actualizar" : "💾Guardar")}
    </Button>
  </div>
</form>



  );
}
