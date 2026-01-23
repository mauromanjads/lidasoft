"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className="
            inline-flex items-center gap-2
            px-4 py-2
            text-md font-medium
            text-white
            bg-green-600
            rounded-lg
            shadow-sm
            hover:bg-green-700
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            transition-colors
          "
    >
      {children}
    </button>
  );
}
