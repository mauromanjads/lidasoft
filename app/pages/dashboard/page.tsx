import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
            
      <Sidebar/>

      {/* CONTENIDO */}
      <main className="flex-1 p-6">
        <header className="flex justify-end items-center mb-4">
          <span className="font-semibold">Hola, Mauricio 👋</span>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md">{children}</div>
      </main>
    </div>
  );
}
