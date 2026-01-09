"use client";
import { useState } from "react";

export type DateFilterValue = {
  mode: "day" | "range" | "month" | "week" | "quick";
  from?: string;
  to?: string;
};

interface Props {
  onChange: (value: DateFilterValue | null) => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function DateFilter({ onChange }: Props) {
  const [mode, setMode] = useState<DateFilterValue["mode"]>("day");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const apply = (v: DateFilterValue) => onChange(v);

  return (
    <div className="flex flex-wrap gap-2 items-end bg-gray-100 p-3 rounded-lg">

      <select
        value={mode}
        onChange={(e) => {
          setMode(e.target.value as any);
          setFrom("");
          setTo("");
          onChange(null);
        }}
        className="border rounded px-2 py-1"
      >
        <option value="day">Día</option>
        <option value="range">Rango</option>
        <option value="week">Semana</option>
        <option value="month">Mes</option>
      </select>

      {mode === "day" && (
        <input
          type="date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            apply({ mode, from: e.target.value });
          }}
          className="border rounded px-2 py-1"
        />
      )}

      {mode === "range" && (
        <>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              apply({ mode, from, to: e.target.value });
            }}
            className="border rounded px-2 py-1"
          />
        </>
      )}

      {mode === "week" && (
        <input
          type="date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            apply({ mode, from: e.target.value });
          }}
          className="border rounded px-2 py-1"
        />
      )}

      {mode === "month" && (
        <input
          type="month"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            apply({ mode, from: e.target.value });
          }}
          className="border rounded px-2 py-1"
        />
      )}

      {/* Accesos rápidos */}
      <button
        onClick={() => apply({ mode: "day", from: today() })}
        className="px-3 py-1 bg-blue-600 text-white rounded"
      >
        Hoy
      </button>

      <button
        onClick={() => {
          const d = new Date();
          const from = new Date(d.setDate(d.getDate() - 7))
            .toISOString()
            .slice(0, 10);
          apply({ mode: "quick", from, to: today() });
        }}
        className="px-3 py-1 bg-green-600 text-white rounded"
      >
        7 días
      </button>

      <button
        onClick={() => {
          const d = new Date();
          const from = new Date(d.setDate(d.getDate() - 30))
            .toISOString()
            .slice(0, 10);
          apply({ mode: "quick", from, to: today() });
        }}
        className="px-3 py-1 bg-gray-700 text-white rounded"
      >
        30 días
      </button>
    </div>
  );
}
