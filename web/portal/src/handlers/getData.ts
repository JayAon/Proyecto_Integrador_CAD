import { Pedido } from "../types/pedido";
import mockData from "../data/mockData.json";

// En el futuro puedes cambiar esta función para hacer fetch desde S3
export const getPedidosData = async (): Promise<Pedido[]> => {
  // Aquí puedes dejar un condicional para cambiar entre local o remoto
  const useRemote = false;

  if (useRemote) {
    // Ejemplo de fetch desde S3 público (reemplazar por URL real)
    const response = await fetch(
      "https://bucket-name.s3.amazonaws.com/pedidos.json"
    );
    const data = await response.json();
    return data as Pedido[];
  }

  return mockData as Pedido[];
};
