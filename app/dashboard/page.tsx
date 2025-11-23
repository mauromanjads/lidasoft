export default function DashboardHome() {
  return (
    <div
      className="flex flex-col items-center justify-center bg-cover bg-center h-80 rounded-xl mb-6"
      style={{
        backgroundImage: `url('fondodb.jpg')`,
      }}
    >
      <div className="text-center p-6 backdrop-blur-sm bg-white/40 rounded-2xl shadow-xl max-w-xl border border-white/30">
        <h2 className="text-2xl font-bold tracking-wide mb-3 text-black">
          “Liderar es transformar visión en realidad.”
        </h2>
        <p className="text-sm opacity-80 text-black">
          Estrategia, innovación y resultados.
        </p>
      </div>
    </div>
  );
}
