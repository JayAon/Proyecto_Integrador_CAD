export interface FormOptions {
  referencia: string[];
  maquina: string[];
  seccion: string[];
  proceso: string[];
  usuario: string[];
}
export interface FormDataStructure {
  referencia: string;
  maquina: string;
  seccion: string;
  proceso: string;
  usuario: string;
  fabricadas: string; // como string para formatear miles
  turno: string;
}

export interface RegressionRequest {
  referencia: string;
  maquina: string;
  seccion: string;
  proceso: string;
  usuario: string;
  fabricadas: number;
  turno: string;
}

export interface ClassificationRequest {
  maquina: string;
  referencia: string;
  proceso: string;
  fabricadas: number;
}
