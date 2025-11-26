"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;           // 👈 agregamos
  onToggle: () => void;      // 👈 agregamos
}

export default function Collapsible({ title, children, isOpen, onToggle }: CollapsibleProps) {
  return (
    <div className="border rounded-lg p-3 shadow-sm bg-white">
      <button
        type="button"
        onClick={onToggle}           // ⬅️ ahora lo controla el padre
        className="w-full flex justify-between items-center font-semibold text-left"
      >
        {title}
        <span className="text-xl">{isOpen ? "▲" : "▼"}</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden mt-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
