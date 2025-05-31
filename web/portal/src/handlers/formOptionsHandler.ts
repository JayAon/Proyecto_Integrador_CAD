// Simula la obtención de datos desde una API o base de datos
// export const fetchFormOptions = async () => {
//   return {
//     referencia: ["REF-100", "REF-200", "REF-300"],
//     maquina: ["M1", "M2", "M3"],
//     seccion: ["Corte", "Ensamble", "Empaque"],
//     proceso: ["P1", "P2", "P3"],
//     usuario: ["ana", "luis", "pedro"],
//   };
// };

import { FormOptions } from "../types/form";

// src/handlers/fetchFormOptions.ts
// src/handlers/fetchFormOptions.ts
const max_limit = 10; // Define el límite máximo de opciones
export const fetchFormOptions = async (): Promise<FormOptions> => {
  const response = await fetch(
    "https://xkzba457tyg5kovvj43wjqa5bq0vnksv.lambda-url.us-east-1.on.aws/?limit=" +
      max_limit
  );
  console.log("Fetching form options from API...");
  if (!response.ok) throw new Error("Error al obtener opciones del formulario");
  return await response.json();
};
