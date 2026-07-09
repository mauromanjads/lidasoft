import Swal from "sweetalert2";
import { authHeaders } from "@/lib/utils";
import { getEmpresaFromStorage } from "@/app/dependencias/autenticacion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const generarXMLFactura = async (
  facturaId: number,
  facturaNumeroCompleto: string
) => {
  try {
    const id_empresa = getEmpresaFromStorage();

    const response = await fetch(
      `${API_URL}/facturas/${facturaId}/xml?id_empresa=${id_empresa}`,
      {
        method: "POST",
        headers: authHeaders(),
      }
    );

    const xml = await response.text();

    if (!response.ok) {
      const mierror = "Error generando XML";
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

    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${facturaNumeroCompleto}.xml`;
    a.click();

    URL.revokeObjectURL(url);
    Swal.fire({
      title: "¡Listo!",
      text: `El XML de la factura ${facturaNumeroCompleto} ha sido generado correctamente.`,
      icon: "success",
      confirmButtonText: "Aceptar",
      timer: 4000,
      timerProgressBar: true,
    });
  } catch (error) {
    let mierror = "No se pudo generar el XML de la factura";
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
