"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import "@/styles/detalle-grid.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem("usuario") || "{}");
  const sucursal = JSON.parse(localStorage.getItem("sucursal") || "{}");

  if (user.cambia_clave) {
    router.replace("/cambiar-password");
  }

  useEffect(() => {
    const existingTab = localStorage.getItem("app_active");
    if (existingTab) {
      alert("❌ La aplicación ya está abierta en otra pestaña.");
      router.push("/login");
      return;
    }

    localStorage.setItem("app_active", "true");

    const handleTabClose = () => localStorage.removeItem("app_active");
    window.addEventListener("beforeunload", handleTabClose);

    const data = sessionStorage.getItem("usuario");
    if (data) setUsuario(JSON.parse(data));
    else router.push("/login");

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
      localStorage.removeItem("app_active");
    };
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    document.cookie = "usuario=; Max-Age=0; path=/;";
    router.push("/login");
  };

  // cerrar al hacer click fuera
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200">
      <Sidebar />

      <main className="flex-1 p-1 flex flex-col">
        {/* HEADER */}
        <header
          className="rounded-lg px-2 py-1 mb-1 flex items-center
                     bg-gradient-to-r from-[#0B2B55] via-[#12366D] to-[#1D4E89]
                     shadow-lg border border-white/10"
        >
          {/* IZQUIERDA */}
          <span className="text-white/90 font-medium text-lg tracking-wide">
           🏢 {usuario?.empresa || "—"}
          </span>

          {/* DERECHA */}
          <div className="ml-auto relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-white/10 text-white text-lg
                         hover:bg-white/20 transition-all"
            >
              🧑 {usuario?.nombre || usuario?.usuario || "Cargando..."}
              <span className="text-sm">{open ? "▲" : "▼"}</span>
            </button>

            {open && (
              <div
               className="absolute right-0 mt-2 w-60 rounded-lg
                          bg-[#1d4e89]/95
                          border border-white/30 shadow-xl z-20"
              >
                {/* Sucursal */}
                <div className="px-4 py-2 text-lg text-white border-b border-white/20">
                  <div className="font-medium">🏠 {sucursal?.nombre || "—"}</div>
                  
                </div>

                {/* Rol */}
                <div className="px-4 py-2 text-lg text-white border-b border-white/20">
                  <div className="font-medium">🏷️Rol: {usuario?.nombre_rol || "—"}</div>                
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-lg
                             text-white hover:bg-white/20 transition-colors"
                >
                  🔒 Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* CONTENIDO */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
