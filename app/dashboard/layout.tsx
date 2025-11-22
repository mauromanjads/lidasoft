"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 🔹 Leer sesión desde sessionStorage
    const data = sessionStorage.getItem("usuario");
    if (data) {
      setUsuario(JSON.parse(data));
    } else {
      // 🚨 Si NO hay sesión -> redirigir
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // ❌ ELIMINAR sessionStorage
    sessionStorage.removeItem("usuario");

    // ❌ ELIMINAR cookie (middleware ya no verá al usuario)
    document.cookie = "usuario=; Max-Age=0; path=/;";

    // 🔀 Redireccionar
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-4">
          <span className="font-semibold">
            {usuario ? `Hola, ${usuario.nombre || usuario.usuario} 👋` : "Cargando..."}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        </header>

        {/* CONTENIDO */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {children}
        </div>
      </main>
    </div>
  );
}
