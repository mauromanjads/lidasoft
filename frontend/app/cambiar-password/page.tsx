"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { actualizarPassword } from "@/lib/api/usuarios";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function CambiarPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("usuario");
    localStorage.removeItem("usuario");
    localStorage.removeItem("sucursal");
    document.cookie = "usuario=; Max-Age=0; path=/;";
    localStorage.removeItem("app_active");
    router.push("/login");
  };

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("usuario") || "{}"
    );

    setUser(storedUser);

    if (!storedUser?.id_usuario) {
      handleLogout();
      return;
    }

    if (storedUser.cambia_clave === false) {
      handleLogout();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      await actualizarPassword(user.id_usuario, { password });

      localStorage.setItem(
        "usuario",
        JSON.stringify({ ...user, cambia_clave: false })
      );

      alert("Contraseña actualizada correctamente");
      handleLogout();
    } catch {
      alert("Error al actualizar la contraseña");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 w-96 rounded-xl shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          🔐 Cambiar contraseña
        </h2>

        {/* Nueva contraseña */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nueva contraseña"
            className="w-full border p-2 pr-10 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Confirmar contraseña */}
        <div className="relative mb-4">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmar contraseña"
            className="w-full border p-2 pr-10 rounded"
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            💾 Guardar
          </Button>

          <Button
            type="button"
            onClick={handleLogout}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            ❌ Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}