"use client";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [mostrarSelectSucursal, setMostrarSelectSucursal] = useState(false);
  const [sucursales, setSucursales] = useState<any[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario || !password) {
      alert("Ingresa usuario y contraseña");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("usuario", JSON.stringify(data));
        document.cookie = `usuario=${data.usuario}; path=/;`;

        // 🔑 GUARDAR TOKEN JWT
        localStorage.setItem("access_token", data.access_token);

        // INFORMACION DEL USUARIO
        localStorage.setItem("usuario", JSON.stringify({
          usuario: data.usuario,
          id_usuario:data.idusuario,
          nombre: data.nombre,
          empresa: data.empresa,
          id_empresa:data.idempresa ,
          cambia_clave:data.cambia_clave,
          id_rol:data.id_rol,  
          nombre_rol:data.nombre_rol
        }));

        if (data.cambia_clave) {
          router.push("/cambiar-password");
        } else {

           {/*LOGICA DE SUCURSALES */}
          // Si tiene 1 sucursal, la seleccionamos automáticamente
         if (data.usuario_sucursales.length === 1) {
          const sucursal = data.usuario_sucursales[0];
          localStorage.setItem("sucursal", JSON.stringify(sucursal));
          router.push("/dashboard");  
        } else if (data.usuario_sucursales.length > 1) {
          setSucursales(data.usuario_sucursales);

          const sucursalGuardada = localStorage.getItem("sucursal");
          if (!sucursalGuardada) {
            setMostrarSelectSucursal(true); // Mostrar para elegir
          } else {
            // Si ya existe, redirigir automáticamente
            router.push("/dashboard");
          }
        }
     
        }
      } else {
        const data = await res.json();
        alert("Credenciales incorrectas❌ : "  + data.detail);
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  const sucursalGuardada = localStorage.getItem("sucursal");
  if (sucursalGuardada) {
    // Si ya existe, mostramos el selector solo si hay más de una sucursal
    setMostrarSelectSucursal(false); // opcional, no mostrar si ya hay seleccionada
  }
}, []);


  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0B2B55] via-[#12366D] to-[#1D4E89]">
      <div className="flex w-[90%] max-w-5xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/20">

        {/* PANEL IZQUIERDO */}
        <div className="w-full md:w-1/2 p-10">
          <div className="mb-6 text-center">
            <img src="/usuario.png" alt="Logo" className="h-14 mx-auto object-contain" />
            <div className="text-3xl font-bold mb-6 text-white tracking-wide">
              LIDASOFT
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mb-6 uppercase tracking-wide">
            Acceso al sistema
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Usuario */}
            <div>
              <label className="text-sm text-white/90">Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full bg-white/10 p-2 rounded-lg text-white 
                  border border-white/20 focus:border-white outline-none"
              />
            </div>

            {/* Clave */}
            <div>
              <label className="text-sm text-white/90">Clave</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 p-2 rounded-lg text-white 
                    border border-white/20 focus:border-white outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 cursor-pointer text-white/70 text-lg"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

             {/* Selector de sucursales */}
            {mostrarSelectSucursal && (
              <div className="relative w-full">
                <label className="text-sm text-white/90">Selecciona sucursal</label>
                  
                  <div className="bg-[#1D4E89] text-white rounded-lg p-2 cursor-pointer">
                    <select
                      className="w-full bg-[#1D4E89] p-2 rounded-lg text-white border border-white/20 focus:border-white outline-none"
                      onChange={(e) => {
                        const sucursalSeleccionada = sucursales.find(
                          (s) => s.id.toString() === e.target.value
                        );
                        if (sucursalSeleccionada) {
                          localStorage.setItem("sucursal", JSON.stringify(sucursalSeleccionada));
                          router.push("/dashboard");
                        }
                      }}
                    >
                      <option value="">-- Elige una sucursal --</option>
                      {sucursales.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/20 backdrop-blur-md text-white py-3 rounded-lg 
                font-semibold hover:bg-white/30 hover:scale-105 transition-all shadow-md
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Ingresando..." : "Entrar"}
            </button>
          </form>
        </div>

        {/* PANEL DERECHO */}
        <div
          className="hidden md:flex w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/login.avif')" }}
        >
          <div className="w-full h-full flex flex-col justify-center items-center bg-black/30">
            <div className="p-6 bg-white/20 rounded-full backdrop-blur-lg shadow-xl">
              <div className="text-4xl font-bold text-white">🏢</div>
            </div>
            <h2 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-wide mt-4">
              Somos tus aliados
            </h2>
            <p className="text-white/80 mt-2 text-sm">
              Tecnología a tu servicio 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  

}
