// src/handlers/predictionHandler.ts

import {
  ClassificationRequest,
  FormDataStructure,
  RegressionRequest,
} from "../types/form";
import { Prediction } from "../types/prediction";

export function transformFormDataRegression(
  formData: FormDataStructure
): RegressionRequest {
  return {
    referencia: formData.referencia,
    maquina: formData.maquina,
    seccion: formData.seccion,
    proceso: formData.proceso,
    usuario: formData.usuario,
    turno: formData.turno,
    fabricadas: Number(formData.fabricadas.replace(/,/g, "")),
  };
}
export function transformFormDataClassification(
  formData: FormDataStructure
): ClassificationRequest {
  return {
    fabricadas: Number(formData.fabricadas.replace(/,/g, "")),
    referencia: formData.referencia,
    maquina: formData.maquina,
    proceso: formData.proceso,
  };
}
export const getDurationPrediction = async (
  formData: FormDataStructure
): Promise<Prediction> => {
  //console.log("Enviando a modelo (simulado):", formData);

  const regressionData: RegressionRequest =
    transformFormDataRegression(formData);
  const response = await fetch("http://52.71.170.75:8000/predict-regression", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(regressionData),
  });

  if (!response.ok) {
    throw new Error("Error en la solicitud a la API");
  }

  const { duration_minutes } = await response.json();

  const classificationData: ClassificationRequest =
    transformFormDataClassification(formData);

  const response_class = await fetch(
    "http://52.71.170.75:8000/predict-classification",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classificationData),
    }
  );
  if (!response_class.ok) {
    throw new Error("Error en la solicitud a la API");
  }

  const { classification } = await response_class.json();

  // Construir objeto Prediction completo
  const prediction: Prediction = {
    referencia: formData.referencia,
    maquina: formData.maquina,
    seccion: formData.seccion,
    proceso: formData.proceso,
    usuario: formData.usuario,
    fabricadas: Number(formData.fabricadas.replace(/,/g, "")),
    turno: formData.turno,
    duracion: duration_minutes,
    optimal: classification.toLowerCase() === "true",
  };
  console.log("Prediction", prediction);
  return prediction;
};
