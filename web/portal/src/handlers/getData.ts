import { Pedido } from "../types/pedido";
import mockData from "../data/mockData.json";

// En el futuro puedes cambiar esta función para hacer fetch desde S3
export const getPedidosData = async (limit: number = 10): Promise<Pedido[]> => {
  // Aquí puedes dejar un condicional para cambiar entre local o remoto
  const useRemote = true;

  if (useRemote) {
    const response = await fetch(
      `https://4wwqgxtrfd5cvd4nzexvqhtmnu0nnrve.lambda-url.us-east-1.on.aws/?limit=${limit}`
    );
    const jsonResponse = await response.json();

    // jsonResponse tiene la forma { data: [...] }
    const dataArray = jsonResponse.data;

    // Ahora parseas ese array de arrays
    const parsedData = parsePedidos(dataArray);
    console.log("Datos obtenidos desde la API:", parsedData);
    return parsedData as Pedido[];
  }

  return mockData as Pedido[];
};

export const parsePedidos = (data: string[][]): Pedido[] => {
  return data.map((row) => ({
    Pedido: Number(row[0]),
    OP: Number(row[1]),
    Referencia: row[2],
    Maquina: row[3],
    Seccion: row[4],
    Proceso: row[5],
    Usuario: row[6],
    Estado: row[7],
    Fabricadas: Number(row[8]),
    FechaInicio: row[9],
    FechaFin: row[10],
    Duracion: row[11],
    DuracionMin: Number(row[12]),
    Ayudante: row[13],
    InfoExtra1: row[14] ?? "",
  }));
};
