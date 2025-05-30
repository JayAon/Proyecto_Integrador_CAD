// Simula la obtención de datos desde una API o base de datos
export const fetchFormOptions = async () => {
  return {
    referencia: ["REF-100", "REF-200", "REF-300"],
    maquina: ["M1", "M2", "M3"],
    seccion: ["Corte", "Ensamble", "Empaque"],
    proceso: ["P1", "P2", "P3"],
    usuario: ["ana", "luis", "pedro"],
  };
};
