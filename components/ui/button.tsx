"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1d4e89] to-blue-700 text-white 
            shadow-md hover:shadow-lg hover:scale-105 transition"
    >
      {children}
    </button>
  );
}
