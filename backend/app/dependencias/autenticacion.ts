export const getEmpresaFromStorage = () => {
  if (typeof window === "undefined") {  
    return null;
  }

  const raw = localStorage.getItem("usuario");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    //console.log("🧠 parsed usuario:", parsed);
    //console.log("🏢 empresa:", parsed.id_empresa);

    return parsed.id_empresa || null;
  } catch (error) {
   // console.error("❌ Error parseando usuario", error);
    return null;
  }
};
