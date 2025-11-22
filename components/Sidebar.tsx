"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);

  const toggleSubMenu = (menu: string) => {
    setSubMenuOpen(subMenuOpen === menu ? null : menu);
  };

  // 👉 ESCRITORIO -> menú abierto por defecto
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setOpen(true);
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed md:static top-0 left-0 h-screen w-64 bg-indigo-700 text-white p-5 shadow-xl"
          >
            {/* 🔻 TÍTULO -> ABRE / CIERRA */}
            <h2
              className="text-2xl font-bold mb-6 cursor-pointer hover:text-indigo-300 transition"
              onClick={() => setOpen(false)}   // ← Oculta el menú
            >
              📌 Admin Panel
            </h2>

            <nav className="space-y-4">
              <a href="/dashboard" className="block hover:bg-indigo-600 p-2 rounded-lg">🏠 Inicio</a>

              {/* SUBMENÚ CONFIGURACIÓN */}
              <div>
                <div
                  className="flex justify-between hover:bg-indigo-600 p-2 rounded-lg cursor-pointer"
                  onClick={() => toggleSubMenu("configuracion")}
                >
                  👥 Configuración
                  <span>{subMenuOpen === "configuracion" ? "▲" : "▼"}</span>
                </div>

                <AnimatePresence>
                  {subMenuOpen === "configuracion" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                      <a href="/dashboard/clientes" className="block hover:bg-indigo-600 p-2 rounded-lg">📋 Clientes</a>
                      <a href="/dashboard/clientes/nuevo" className="block hover:bg-indigo-600 p-2 rounded-lg">➕ Nuevo</a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SUBMENÚ PRODUCTOS */}
              <div>
                <div
                  className="flex justify-between hover:bg-indigo-600 p-2 rounded-lg cursor-pointer"
                  onClick={() => toggleSubMenu("productos")}
                >
                  📦 Productos
                  <span>{subMenuOpen === "productos" ? "▲" : "▼"}</span>
                </div>

                <AnimatePresence>
                  {subMenuOpen === "productos" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                      <a href="/dashboard/productos" className="block hover:bg-indigo-600 p-2 rounded-lg">📋 Listar</a>
                      <a href="/dashboard/productos/nuevo" className="block hover:bg-indigo-600 p-2 rounded-lg">➕ Nuevo</a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* SOLO SI EL MENÚ ESTÁ CERRADO → MOSTRAR TÍTULO ARRIBA */}
      {!open && (
        <h2
          className="fixed top-4 left-4 text-xl font-bold z-50 cursor-pointer bg-indigo-600 text-white p-2 rounded-lg shadow-lg"
          onClick={() => setOpen(true)}    // ← Muestra el menú
        >
          📌 Admin Panel
        </h2>
      )}
    </>
  );
}
