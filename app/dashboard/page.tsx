import Link from "next/link";
import {
  Users,
  ShoppingCart,
  Package,
  ArrowLeftRight,
} from "lucide-react";

export default function DashboardHome() {
  return (
    <div
      className="flex items-start justify-center bg-cover bg-center h-[420px] rounded-xl mb-6 pt-12"
      style={{ backgroundImage: `url('fondodb.jpg')` }}
    >
      {/* Card */}
      <div className="text-center p-10 backdrop-blur-md bg-white/40 rounded-2xl shadow-xl border border-white/30">
        
        {/* Título */}
        <h2 className="text-3xl font-bold text-black mb-2">
            Bienvenido a tu espacio de trabajo
          </h2>

          <p className="text-lg font-medium text-black/60 max-w-md mx-auto">
            Control total de tu operación, en un solo lugar.
          </p>
        {/* Línea divisoria */}
        <div className="w-44 h-1 bg-black/30 mx-auto mt-6 rounded-full" />

        {/* Botones */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          <Link href="/clientes" className="flex flex-col items-center group">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
              <Users className="w-11 h-11 text-white" />
            </div>
            <span className="mt-3 text-sm font-semibold text-black">
              Clientes
            </span>
          </Link>

          <Link href="/ventas" className="flex flex-col items-center group">
            <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
              <ShoppingCart className="w-11 h-11 text-white" />
            </div>
            <span className="mt-3 text-sm font-semibold text-black">
              Ventas
            </span>
          </Link>

          <Link href="/productos" className="flex flex-col items-center group">
            <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
              <Package className="w-11 h-11 text-white" />
            </div>
            <span className="mt-3 text-sm font-semibold text-black">
              Productos
            </span>
          </Link>

          <Link href="/movimientos" className="flex flex-col items-center group">
            <div className="w-24 h-24 rounded-full bg-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
              <ArrowLeftRight className="w-11 h-11 text-white" />
            </div>
            <span className="mt-3 text-sm font-semibold text-black">
              Movimientos
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
