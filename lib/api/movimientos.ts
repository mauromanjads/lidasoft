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




export async function actualizarInventario(movimiento: MovimientoaData) {
  try {
    // Mostramos lo que vamos a enviar para depuración
    console.log("Enviando al servidor:", JSON.stringify(movimiento, null, 2));
    
      // Capturar usuario y sucursal del localStorage
    const user = JSON.parse(localStorage.getItem("usuario") || "{}");
    const sucursal = JSON.parse(localStorage.getItem("sucursal") || "{}");

      // Agregar id_usuario e id_sucursal al body
    const bodyData = {
      ...movimiento,
      id_usuario: user.id_usuario,
      id_sucursal: sucursal.id,
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

    alert("Movimiento registrado");
    return respuesta; // opcional, si quieres usar el resultado
  } catch (error: any) {
    console.error("Error registrando movimiento:", error.message);
    alert("Ocurrió un error: " + error.message);
  }
}
