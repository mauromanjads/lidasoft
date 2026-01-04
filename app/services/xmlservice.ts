export  const generarXMLFactura = async (facturaId: number) => {
  try {
    // 👉 Aquí normalmente obtendrías la factura desde tu estado o API
    
    const facturaJson = {
      tipo_documento: "FE",
      regimen: "Régimen común",
      metodo_pago: "1",
      forma_pago: "Contado",
      observaciones: "Factura de prueba",

      emisor_nombre: "Mi Empresa S.A.S",
      emisor_nit: "900123456",
      pin_dian: "12345678901234567890",

      numero: "FE20250001",
      fecha: "2025-12-29",

      cliente_nombre: "Juan Perez",
      cliente_nit: "900987654",

      items: [
        {
          codigo: "P001",
          descripcion: "Producto A",
          cantidad: 2,
          unidad: "UND",
          precio_unitario: 10000,
          subtotal: 20000,
          impuesto: 3800,
          descuento: 0
        }
      ],

      total_sin_impuesto: 20000,
      total_impuesto: 3800,
      total_con_impuesto: 23800,
      moneda: "COP"
    };

    const response = await fetch("http://localhost:8001/api/factura/xml", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 8F3kL9Q2T7xWmA5R"
      },
      body: JSON.stringify(facturaJson)
    });

    const xml = await response.text();    

    if (!response.ok) {
       alert("ERRROR");
      throw new Error("Error generando XML");
    }

 
    // 👉 Opción 2: descargar el XML
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${facturaJson.numero}.xml`;
    a.click();

    URL.revokeObjectURL(url);
    alert("Xml generado y descargado correctamente");

  } catch (error) {
    console.error("Error:", error);
    alert("No se pudo generar el XML de la factura");
  }
};
