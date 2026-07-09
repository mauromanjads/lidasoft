export const getEmpresaFromStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem("usuario");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed.id_empresa || null;
  } catch {
    return null;
  }
};
