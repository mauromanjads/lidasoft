import Swal from "sweetalert2";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { authHeaders } from "@/lib/utils";
import { getEmpresaFromStorage } from "@/app/dependencias/autenticacion";

export  const generarFactura = async (facturaId: number,formato:string) => {
  try {

        const id_empresa = getEmpresaFromStorage();

        const response = await fetch(
          `${API_URL}/facturas/${facturaId}/pdf?formato=${formato}&id_empresa=${id_empresa}`,
          {
            method: "GET",
            headers: authHeaders(),
          }
        );
   
    if (!response.ok) {
      
       const mierror ="Error imprimiendo archivo"
       Swal.fire({
            title: "Oops...!",
            text: mierror,
            icon: "error",
            confirmButtonText: "Entendido",
            timer: 4000,
            timerProgressBar: true,
          });
      
      throw new Error(mierror);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // 👉 abrir en nueva pestaña
    window.open(url, "_blank");

  } catch (error) {
        
    let mierror = "No se pudo imprimir factura";
    if (error instanceof Error) {
      mierror += `: ${error.message}`;
    }
    Swal.fire({
        title: "Oops...!",
        text: mierror,
        icon: "error",
        confirmButtonText: "Entendido",
        timer: 4000,
        timerProgressBar: true,
      });
  }
};
