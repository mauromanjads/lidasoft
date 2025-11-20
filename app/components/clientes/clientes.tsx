"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FormClientes() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [mensaje, setMensaje] = useState("");

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post("http://localhost:8000/clientes", data);
      setMensaje("Cliente guardado con éxito");
      reset();
    } catch (error: any) {
      if (error.response?.data?.detail === "Cliente duplicado") {
        setMensaje("⚠️ El NIT ya está registrado");
      } else {
        setMensaje("Error al guardar el cliente");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Registrar Cliente</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* NIT */}
            <div>
              <label className="font-semibold">NIT</label>
              <Input
                {...register("nit", { required: "El NIT es obligatorio" })}
                placeholder="900123456"
              />
              {errors.nit && <p className="text-red-500 text-sm">{errors.nit.message}</p>}
            </div>

            {/* Nombre */}
            <div>
              <label className="font-semibold">Nombre</label>
              <Input
                {...register("nombre", { required: "El nombre es obligatorio" })}
                placeholder="Cliente XYZ"
              />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
            </div>

            {/* Dirección */}
            <div>
              <label className="font-semibold">Dirección</label>
              <Input {...register("direccion")} placeholder="Calle 10 #45" />
            </div>

            {/* Teléfono */}
            <div>
              <label className="font-semibold">Teléfono</label>
              <Input {...register("telefono")} placeholder="3001234567" />
            </div>

            <Button type="submit" className="w-full">Guardar</Button>
          </form>

          {mensaje && (
            <p className="text-center mt-4 text-sm font-medium">
              {mensaje}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
