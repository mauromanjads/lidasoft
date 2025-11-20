"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function ClienteForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    nit: "",
    nombre: "",
    telefono: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Lo envías al backend
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input label="NIT" name="nit" value={formData.nit} onChange={handleChange} />
      <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
      <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} />

      <Button type="submit">Guardar Cliente</Button>
    </form>
  );
}

