"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import "@/styles/detalle-grid.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const existingTab = localStorage.getItem("app_active");
    if (existingTab) {
      alert("❌ La aplicación ya está abierta en otra pestaña.");
      router.push("/login");
      return;
    }

    localStorage.setItem("app_active", "true");

    const handleTabClose = () => {
      localStorage.removeItem("app_active");
    };
    window.addEventListener("beforeunload", handleTabClose);

    const data = sessionStorage.getItem("usuario");
    if (data) {
      setUsuario(JSON.parse(data));
    } else {
      router.push("/login");
    }

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
      localStorage.removeItem("app_active");
    };
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("usuario");
    document.cookie = "usuario=; Max-Age=0; path=/;";
    localStorage.removeItem("app_active");
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200">
      {/* 📌 Sidebar */}
      <Sidebar />

      {/* 📌 CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 flex flex-col">

        {/* 📌 HEADER SUPERIOR */}
        <header className="rounded-lg px-6 py-4 mb-4 flex justify-between items-center 
          bg-gradient-to-r from-[#0B2B55] via-[#12366D] to-[#1D4E89] 
          shadow-lg border border-white/10">

            <span className="text-white/90 font-medium text-lg tracking-wide">
              {usuario ? `Bienvenido, ${usuario.nombre || usuario.usuario} 👋` : "Cargando..."}
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm
                        text-white font-medium shadow-md
                        hover:bg-white/20 hover:scale-105 transition-all"
            >
              🔒 Cerrar sesión
            </button>
          </header>


        {/* 📌 CONTENIDO DE LAS PÁGINAS */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
