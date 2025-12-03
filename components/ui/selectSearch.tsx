"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface Option {
  id: number;
  nombre: string;
}

interface SelectSearchProps {
  label?: string;
  items: Option[];
  value: number | null;
  onChange: (id: number) => void;
  placeholder?: string;
  className?: string;
}

export default function SelectSearch({
  label,
  items,
  value,
  onChange,
  placeholder = "Seleccione…",
  className,
}: SelectSearchProps) {
  const [open, setOpen] = useState(false);

  return (
    <label className={cn("flex flex-col text-xs w-full", className)}>
      {label && (
        <span className="mb-1 font-semibold text-gray-700">
          {label}
        </span>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "border rounded px-2 py-1.5 text-xs w-full flex justify-between items-center",
              "bg-white hover:bg-gray-50 transition"
            )}
          >
            <span className="truncate text-left">
              {items.find((i) => i.id === value)?.nombre || placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-full min-w-[200px]">
          <Command>
            <CommandInput placeholder="Buscar…" />
            <CommandList>
              <CommandEmpty>No hay resultados.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.nombre}
                    onSelect={() => {
                      onChange(item.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.nombre}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </label>
  );
}
