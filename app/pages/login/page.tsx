"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario || !password) {
      alert("Ingresa usuario y contraseña");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      if (res.ok) router.push("/dashboard");
      else alert("Credenciales incorrectas");
    } catch (error) {
      alert("Error de conexión con el servidor");
      console.error(error);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-600 via-sky-600 to-blue-700">
      <div className="flex w-[90%] max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
        
        {/* 🔹 PANEL IZQUIERDO - FORMULARIO */}
        <div className="w-full md:w-1/2 p-10">
          {/* Logo opcional */}
          <div className="mb-6 text-center">
            <img src="/usuario.png" alt="Logo" className="h-14 mx-auto object-contain"/> 
            <div className="text-3xl font-bold mb-6 text-gray-800">LIDASOFT</div>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-gray-800">INICIO</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm text-gray-600">Usuario</label>
              <input
                type="text"                
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full border-b-2 border-gray-300 py-2 focus:border-indigo-600 outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Clave</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 border-gray-300 py-2 focus:border-indigo-600 outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 cursor-pointer text-gray-600 text-lg"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              ENTRAR
            </button>
          </form>
        </div>

        {/* 🔹 PANEL DERECHO - IMAGEN / LOGO EMPRESA */}
        <div
          className="hidden md:flex w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: "url('/login.avif')", // 👈 Aquí pones tu imagen
          }}
        >
          <div className="w-full h-full flex flex-col justify-center items-center bg-white/30">
            <div className="p-6 bg-white/20 rounded-full backdrop-blur-lg">
              {/* puedes poner un logo png aquí */}
              <div className="text-4xl font-bold text-white">🏢</div>
            </div>
            <h2 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide">
              Somos tus aliados
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
