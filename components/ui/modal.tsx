"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string; // opcional, para controlar ancho
}

export default function Modal({ isOpen, onClose, children, maxWidth = "max-w-4xl w-full" }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-xl p-6 relative w-full ${maxWidth}`}>
        {/* Botón cerrar */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Contenido del modal */}
        {children}
      </div>
    </div>
  );
}
