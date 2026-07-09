import {
  Users,
  ShoppingCart,
  Package,
  ArrowLeftRight,
} from "lucide-react";

import { DashboardButton } from "@/components/DashboardButton";

export default function Page() {
  return (
    <div
      className="flex items-start justify-center bg-cover bg-center h-[420px] rounded-xl mb-6 pt-4"
      style={{ backgroundImage: `url('fondodb.jpg')` }}
    >
      {/* Card */}
      <div className="text-center p-10 backdrop-blur-md bg-[#12366d]/90 rounded-2xl shadow-xl border border-white/30">
        
        {/* Título */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Bienvenido a tu panel de control
          </h2>

          <p className="text-lg font-medium text-white/60 max-w-md mx-auto">
            Control total de tu operación, en un solo lugar.
          </p>

          {/* Línea */}
          <div className="w-44 h-1 bg-black/30 mx-auto mt-6 rounded-full" />
        </div>

        {/* Botones */}
        <div className="grid grid-cols-2 gap-8 justify-items-center">
          <DashboardButton
            href="/dashboard/terceros/clientes"
            label="Clientes"
            color="bg-blue-600"
            icon={<Users className="w-11 h-11 text-white" />}
          />

          <DashboardButton
            href="/dashboard/facturas"
            label="Ventas"
            color="bg-green-600"
            icon={<ShoppingCart className="w-11 h-11 text-white" />}
          />

          <DashboardButton
            href="/dashboard/productos"
            label="Productos"
            color="bg-purple-600"
            icon={<Package className="w-11 h-11 text-white" />}
          />

          <DashboardButton
            href="/dashboard/movimientos"
            label="Movimientos"
            color="bg-orange-600"
            icon={<ArrowLeftRight className="w-11 h-11 text-white" />}
          />
        </div>
      </div>
    </div>
  );
}
