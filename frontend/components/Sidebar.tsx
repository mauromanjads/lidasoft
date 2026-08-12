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
            <h4
              className="text-2xl font-bold mb-2 cursor-pointer 
              hover:text-indigo-400 transition-all tracking-wide
              text-center w-full "
              onClick={() => setOpen(false)}
            >
              🖥️ Lidasoft
            </h4>

            <nav className="space-y-2">
              {/* ITEM INICIO */}
              <a
                href="/dashboard"
                className="sidebar-item-flex"
              >
                🏠 Inicio
              </a>
              
               {/* SUBMENÚ DE LA ORGANIZACIÓN */}
              <div>
                <div
                  className="sidebar-item-flex"
                  onClick={() => toggleSubMenu("organizacion")}
                >
                  🏛️ Organización
                  <span className="text-sm">
                    {subMenuOpen === "organizacion" ? "▲" : "▼"}
                  </span>
                </div>

                <AnimatePresence>
                  {subMenuOpen === "organizacion" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                      <a
                        href="/dashboard/empresas"
                        className="sidebar-item"
                      >
                        🏢 Empresa
                      </a>
                      <a
                        href="/dashboard/sucursales"
                        className="sidebar-item"
                      >
                        🏬 Sucursales
                      </a>
                      <a
                        href="/dashboard/configuracionimpresora"
                        className="sidebar-item"
                      >
                        🖨️ Impresión
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


               {/* SUBMENÚ VENTAS */}
              <div>
                <div
                  className="sidebar-item-flex"
                  onClick={() => toggleSubMenu("ventas")}
                >
                  🛍️ Ventas
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
                        className="sidebar-item"
                      >
                        🛒 Facturar Ventas
                      </a>
                      <a
                        href="/dashboard/listarfacturas"
                        className="sidebar-item"
                      >
                        📋 Listar facturas
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

                {/* SUBMENÚ INVENTARIO */}
              <div>
                <div
                  className="sidebar-item-flex"
                  onClick={() => toggleSubMenu("inventario")}
                >
                  📦 Inventario
                  <span className="text-sm">
                    {subMenuOpen === "inventario" ? "▲" : "▼"}
                  </span>
                </div>

                <AnimatePresence>
                  {subMenuOpen === "inventario" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                     
                      <a
                        href="/dashboard/existencias"
                        className="sidebar-item"
                      >
                        🧮 Existencias
                      </a>

                       <a
                        href="/dashboard/movimientos"
                        className="sidebar-item"
                      >
                        📤 Entradas/Salidas
                      </a>

                      <a
                        href="/dashboard/kardex"
                        className="sidebar-item"
                      >
                        📊 Kardex
                      </a>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SUBMENÚ TERCEROS */}
              <div>
                <div
                  className="sidebar-item-flex"
                  onClick={() => toggleSubMenu("terceros")}
                >
                  🧑‍🤝‍🧑 Terceros
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
                        className="sidebar-item"
                      >
                        🧑‍💼 Clientes
                      </a>
                      <a
                        href="/dashboard/terceros/proveedores"
                        className="sidebar-item"
                      >
                        🏪 Proveedores
                      </a>

                       <a
                        href="/dashboard/terceros/vendedores"
                        className="sidebar-item"
                      >
                        🧑‍💼 Vendedores
                      </a>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SUBMENÚ CATALOGOS */}
              <div>
                <div
                  className="sidebar-item-flex"
                  onClick={() => toggleSubMenu("catalogos")}
                >
                  📚 Catálogos
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
                        className="sidebar-item"
                      >
                        🛒 Productos
                      </a>

                      <a
                        href="/dashboard/categorias"
                        className="sidebar-item"
                      >
                        🧩 Categorías
                      </a>

                      <a
                        href="/dashboard/unidades"
                        className="sidebar-item"
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
                  className="sidebar-item-flex"
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
                        className="sidebar-item"
                      >
                        ⚙️ Configuración
                      </a>

                      <a
                        href="/dashboard/resolucionesdian"
                        className="sidebar-item"
                      >
                        🔤 Resoluciones
                      </a>
                     
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

               {/* SUBMENÚ ACCESOS */}
              <div>
                <div
                  className="sidebar-item-flex"
                  onClick={() => toggleSubMenu("accesos")}
                >
                  🔑 Accesos
                  <span className="text-sm">
                    {subMenuOpen === "accesos" ? "▲" : "▼"}
                  </span>
                </div>

                <AnimatePresence>
                  {subMenuOpen === "accesos" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 mt-2 space-y-2"
                    >
                      <a
                        href="/dashboard/usuarios"
                        className="sidebar-item"
                      >
                        🧑‍🤝‍🧑 Usuarios
                      </a>

                      <a
                        href="/dashboard/roles"
                        className="sidebar-item"
                      >
                        🏷️ Roles
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
