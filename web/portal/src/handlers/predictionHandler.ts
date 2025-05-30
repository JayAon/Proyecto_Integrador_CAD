interface FormDataType {
  referencia: string;
  maquina: string;
  seccion: string;
  proceso: string;
  usuario: string;
  hora_inicio: string;
  dia_semana_inicio: string;
  turno: string;
  fabricadas: string;
}

// Simula una solicitud a un modelo de predicción
export const getDurationPrediction = async (
  formData: FormDataType
): Promise<{ duracion: number }> => {
  console.log("Enviando a modelo:", formData);

  return new Promise((resolve) => {
    setTimeout(() => {
      const randomDuration = Math.random() * 1000 + 100;
      resolve({ duracion: randomDuration });
    }, Math.random() * 5000);
  });
};
