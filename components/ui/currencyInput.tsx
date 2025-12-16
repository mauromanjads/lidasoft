import React, { useState, useEffect, useRef } from "react";
import Input from "./input";

interface CurrencyInputProps {
  value: number | string;
  onChange: (value: number) => void;
  className?: string;
  label?: string;
  placeholder?: string;
  title?: string;
}

const formatCurrency = (value: number) => {
  if (isNaN(value)) return "";
  return value.toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const unformatCurrency = (value: string) => {
  if (!value) return 0;
  return Number(value.replace(/\./g, "").replace(",", "."));
};

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  className,
  label,
  placeholder,
  title,
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const isFocused = useRef(false);

  // Sync con valor externo SOLO cuando no se está escribiendo
  useEffect(() => {
    if (!isFocused.current) {
      const numberValue = Number(value);
      setDisplayValue(
        numberValue || numberValue === 0 ? formatCurrency(numberValue) : ""
      );
    }
  }, [value]);

  const handleFocus = () => {
    isFocused.current = true;

    // Quitar formato al entrar (mostrar número crudo)
    const raw = unformatCurrency(displayValue);
    setDisplayValue(raw ? raw.toString().replace(".", ",") : "");
  };

  const handleBlur = () => {
    isFocused.current = false;

    const raw = unformatCurrency(displayValue);
    setDisplayValue(formatCurrency(raw));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Permitir solo números, comas o puntos (sin formatear)
    val = val.replace(/[^0-9.,]/g, "");

    // Evitar dos comas o puntos
    const parts = val.split(/[,\.]/);
    if (parts.length > 2) return;

    setDisplayValue(val);

    // Convertir a número y enviar al padre
    onChange(unformatCurrency(val));
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="text-sm font-semibold mb-1 text-gray-700">
          {label}
        </label>
      )}

      <Input
        type="text"
        inputMode="decimal"
        className={`border p-1.5 rounded ${className ?? ""}`}
        value={displayValue}
        placeholder={placeholder || "0,00"}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        title={title}
      />
    </div>
  );
};

export default CurrencyInput;
