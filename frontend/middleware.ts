// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const usuario = req.cookies.get("usuario")?.value;

  // 🚀 Si entra a "/" => mandarlo directo a /login
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔒 Si NO hay usuario y quiere entrar a /dashboard => redirige al login
  if (!usuario && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 😎 Si YA está logueado y trata de entrar al /login => mandarlo al dashboard
  if (usuario && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// 🔍 Rutas protegidas
export const config = {
  matcher: [
    "/",            // protege la raíz
    "/dashboard/:path*", // protege todo el dashboard
    "/login"        // evita que entren al login si ya hay sesión
  ]
};
