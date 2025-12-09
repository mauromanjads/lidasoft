"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);

  const toggleSubMenu = (menu: string) => {
    setSubMenuOpen(subMenuOpen === menu ? null : menu);
  };

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
            className="fixed md:static top-0 left-0 h-screen w-64 
            bg-gradient-to-b from-[#0B2B55] via-[#12366D] to-[#1D4E89]
            text-white p-5 shadow-2xl border-r border-gray-700/30"
          >
            {/* 🔻 HEADER */}
            <h3
              className="text-2xl font-bold mb-8 cursor-pointer 
              hover:text-indigo-400 transition-all tracking-wide
              text-center w-full uppercase"
              onClick={() => setOpen(false)}
            >
              📌 Lidasoft
            </h3>

            <nav className="space-y-4">
              {/* ITEM INICIO */}
              <a
                href="/dashboard"
                className="block bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                p-2 rounded-lg transition-all shadow-md"
              >
                🏠 Inicio
              </a>

               {/* SUBMENÚ VENTAS */}
              <div>
                <div
                  className="flex justify-between items-center bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                  p-2 rounded-lg cursor-pointer transition-all shadow-md"
                  onClick={() => toggleSubMenu("ventas")}
                >
                  👥 Ventas
                  <span className="text-sm">
                    {subMenuOpen === "ventas" ? "▲" : "▼"}
                  </span>
                </div>

                <AnimatePresence>
                  {subMenuOpen === "ventas" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                      <a
                        href="/dashboard/facturas"
                        className="block bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                        p-2 rounded-lg transition-all shadow-md"
                      >
                        🧑‍🤝‍🧑 Facturar Ventas
                      </a>
                      <a
                        href="/dashboard/facturas"
                        className="block bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                        p-2 rounded-lg transition-all shadow-md"
                      >
                        🏪 Listar facturas
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>



              {/* SUBMENÚ TERCEROS */}
              <div>
                <div
                  className="flex justify-between items-center bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                  p-2 rounded-lg cursor-pointer transition-all shadow-md"
                  onClick={() => toggleSubMenu("terceros")}
                >
                  👥 Terceros
                  <span className="text-sm">
                    {subMenuOpen === "terceros" ? "▲" : "▼"}
                  </span>
                </div>

                <AnimatePresence>
                  {subMenuOpen === "terceros" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                      <a
                        href="/dashboard/terceros/clientes"
                        className="block bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                        p-2 rounded-lg transition-all shadow-md"
                      >
                        🧑‍🤝‍🧑 Clientes
                      </a>
                      <a
                        href="/dashboard/terceros/proveedores"
                        className="block bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                        p-2 rounded-lg transition-all shadow-md"
                      >
                        🏪 Proveedores
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SUBMENÚ CATALOGOS */}
              <div>
                <div
                  className="flex justify-between items-center bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                  p-2 rounded-lg cursor-pointer transition-all shadow-md"
                  onClick={() => toggleSubMenu("catalogos")}
                >
                  📦 Catálogos
                  <span className="text-sm">
                    {subMenuOpen === "catalogos" ? "▲" : "▼"}
                  </span>
                </div>

                <AnimatePresence>
                  {subMenuOpen === "catalogos" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                      <a
                        href="/dashboard/productos"
                        className="block bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                        p-2 rounded-lg transition-all shadow-md"
                      >
                        🛒 Productos
                      </a>

                      <a
                        href="/dashboard/categorias"
                        className="block bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                        p-2 rounded-lg transition-all shadow-md"
                      >
                        🧩 Categorías
                      </a>

                      <a
                        href="/dashboard/unidades"
                        className="block bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                        p-2 rounded-lg transition-all shadow-md"
                      >
                        ⚖️ Unidades de Medida
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

               {/* SUBMENÚ DIAN */}
              <div>
                <div
                  className="flex justify-between items-center bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                  p-2 rounded-lg cursor-pointer transition-all shadow-md"
                  onClick={() => toggleSubMenu("configdian")}
                >
                  📘 Dian
                  <span className="text-sm">
                    {subMenuOpen === "configdian" ? "▲" : "▼"}
                  </span>
                </div>

                <AnimatePresence>
                  {subMenuOpen === "configdian" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                      <a
                        href="/dashboard/configuracionesdian"
                        className="block bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                        p-2 rounded-lg transition-all shadow-md"
                      >
                        ⚙️ Configuración
                      </a>

                      <a
                        href="/dashboard/resolucionesdian"
                        className="block bg-[#0d2f5a]/70 hover:bg-[#103766]/90 
                        p-2 rounded-lg transition-all shadow-md"
                      >
                        🔤 Resoluciones
                      </a>
                     
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {!open && (
        <h2
          className="fixed top-4 left-4 text-xl font-bold z-50 cursor-pointer 
          bg-indigo-600 text-white p-2 rounded-lg shadow-lg hover:bg-indigo-700 transition"
          onClick={() => setOpen(true)}
        >
          📌 Menú
        </h2>
      )}
    </>
  );
}
