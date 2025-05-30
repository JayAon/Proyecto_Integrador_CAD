import { Pedido } from "./pedido";

type FilterConfig = {
  key: keyof Pedido;
  label: string;
};
export type { FilterConfig };
