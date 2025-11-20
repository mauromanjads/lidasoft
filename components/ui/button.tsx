"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      {children}
    </button>
  );
}
