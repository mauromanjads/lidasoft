const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";


/* ============================================
   INTERFACES
============================================ */

export interface MovimientoaData {
   producto_id: number
    presentacion_id: number
    variante_id: number | null
    cantidad: number
    tipo_movimiento: string
    documento_tipo: string
    documento_id: number
}

export type MovimientoLoteData = MovimientoaData[];


export async function actualizarInventario(movimientos: MovimientoLoteData) {
  try {
    // Mostramos lo que vamos a enviar para depuración
    console.log("Enviando al servidor:", JSON.stringify(movimientos, null, 2));
    
      // Capturar usuario y sucursal del localStorage
    const user = JSON.parse(localStorage.getItem("usuario") || "{}");
    const sucursal = JSON.parse(localStorage.getItem("sucursal") || "{}");

    const bodyData = {
      movimientos: movimientos.map(m => ({
        ...m,
        id_usuario: user.id_usuario,
        id_sucursal: sucursal.id,
      })),
    };


    const response = await fetch(`${API_URL}/movimientos`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const respuesta = await response.json();
    console.log("Respuesta del servidor:", respuesta);

     alert("SUPER, LO LOGRASTE:" + respuesta);

    return respuesta; // opcional, si quieres usar el resultado
  } catch (error: any) {
    console.error("Error registrando movimientos:", error.message);
    alert("Ocurrió un error: " + error.message);
  }
}
