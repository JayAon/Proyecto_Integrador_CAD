import React, { useEffect, useState } from 'react';
//import logo from './logo.svg';


import {fetchFormOptions} from '../../handlers/formOptionsHandler';
import { getDurationPrediction } from '../../handlers/predictionHandler';
import PredictionQueue from './queue/PredictionQueue';
import { Prediction } from '../../types/prediction';

function formatNumberWithThousands(value: string) {
  // Quita todo excepto números
  let onlyNums = value.replace(/\D/g, "");
  if (onlyNums === "") return "";

  // Si solo hay ceros, devuelve "0"
  if (/^0+$/.test(onlyNums)) return "0";

  // Elimina ceros a la izquierda y vuelve a poner 0 si queda vacío
  onlyNums = onlyNums.replace(/^0+/, "") || "0";

  // Formatea con coma como separador de miles
  return onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function PredictionsComponent() {

  //Estado para errores de validación
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const [predictions, setPredictions] = useState<any[]>([]);
  // Estado para la última predicción nueva para enviar a PredictionQueue
  const [lastPrediction, setLastPrediction] = useState<Prediction | null>(null);
    // Cargar cola inicial desde localStorage
    useEffect(() => {
      const stored = localStorage.getItem("predictionsQueue");
      if (stored) {
        setPredictions(JSON.parse(stored));
      }
    }, []);
    
  //Formulario
  //Estado para las opciones del formulario
  const [options, setOptions] = useState({
  referencia: [],
  maquina: [],
  seccion: [],
  proceso: [],
  usuario: [],
});

  const [formData, setFormData] = useState({
  referencia: '',
  maquina: '',
  seccion: '',
  proceso: '',
  usuario: '',
  hora_inicio: '',
  dia_semana_inicio: '',
  turno: '',
  fabricadas:'',
});
  //Mock data fetch
  //Simula la obtención de datos de un API
  useEffect(() => {
  fetchFormOptions().then((data:any) => setOptions(data))
}, [])

  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    if (errors[e.target.name]) {
    setErrors((prev) => ({ ...prev, [e.target.name]: false }));
  }
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, hora_inicio: e.target.value });
    
    if (errors.hora_inicio) {
      setErrors((prev) => ({ ...prev, hora_inicio: false }));
    }
  };

  const handleFabricadasNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Obtenemos el valor formateado con separadores
    const formatted = formatNumberWithThousands(e.target.value);
    setFormData({ ...formData, fabricadas: formatted });
    // Validamos si el campo tiene un error
    if (errors.fabricadas) {
      setErrors((prev) => ({ ...prev, fabricadas: false }));
    }
  };
const handleNewPrediction = (formData: any, result: { duracion: number }) => {
    const newEntry: Prediction = { ...formData, duracion: result.duracion };
    setLastPrediction(newEntry);
  };
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredFields = [
      "referencia",
      "maquina",
      "seccion",
      "proceso",
      "usuario",
      "hora_inicio",
      "dia_semana_inicio",
      "turno",
      "fabricadas",
    ];

    let newErrors: { [key: string]: boolean } = {};
    let hasError = false;

    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      if (
        value === "" ||
        value === null ||
        (field === "fabricadas" && (value === "0" || value === "" || value === null))
      ) {
        newErrors[field] = true;
        hasError = true;
      } else {
        newErrors[field] = false;
      }
    });
    setErrors({}); // Limpiar errores previos
    setErrors(newErrors);

    if (hasError) {
      alert("Por favor complete todos los campos requeridos");
      //Recargar el estilo

      return;
    }

    // Ejecutar la predicción
    setIsLoading(true);
  try {
    const result = await getDurationPrediction(formData);
    handleNewPrediction(formData, result);
  } catch (error) {
    console.error("Error obteniendo predicción:", error);
  } finally {
    setIsLoading(false);
  }
  };



return (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col md:flex-row items-start justify-center gap-6 p-4">

    {/* Formulario */}
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded shadow-md w-full max-w-xl mx-auto md:mx-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center">Formulario de Predicción</h1>
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        {/* Campos select con opciones dinámicas */}
        {["referencia", "maquina", "seccion", "proceso", "usuario"].map((campo) => (
          <div key={campo}>
            <label htmlFor={campo} className="block text-sm font-medium mb-1 capitalize">
              {campo}
            </label>
            <select
              id={campo}
              name={campo}
              value={formData[campo as keyof typeof formData]}
              onChange={handleChange}
              className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                errors[campo] 
                  ? 'border-red-500 focus:ring-red-500 border-2 animate-shake bg-white dark:bg-gray-700 text-black dark:text-white' 
                  : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white'
              }`}
            >
              <option value="">{`Seleccione ${campo}`}</option>
              {(options as any)[campo].map((opt: string) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Hora inicio */}
        <div>
          <label htmlFor="hora_inicio" className="block text-sm font-medium mb-1">
            Hora de inicio
          </label>
          <input
            type="time"
            id="hora_inicio"
            name="hora_inicio"
            value={formData.hora_inicio}
            onChange={handleTimeChange}
            className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.hora_inicio
                ? 'border-red-500 focus:ring-red-500 border-2 animate-shake bg-white dark:bg-gray-700 text-black dark:text-white'
                : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white'
            }`}
          />
        </div>

        {/* Día semana */}
        <div>
          <label htmlFor="dia_semana_inicio" className="block text-sm font-medium mb-1">
            Día de la semana
          </label>
          <select
            id="dia_semana_inicio"
            name="dia_semana_inicio"
            value={formData.dia_semana_inicio}
            onChange={handleChange}
            className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.dia_semana_inicio
                ? 'border-red-500 focus:ring-red-500 border-2 animate-shake bg-white dark:bg-gray-700 text-black dark:text-white'
                : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white'
            }`}
          >
            <option value="">Seleccione un día</option>
            {[
              "Lunes",
              "Martes",
              "Miércoles",
              "Jueves",
              "Viernes",
              "Sábado",
              "Domingo",
            ].map((dia) => (
              <option key={dia} value={dia}>
                {dia}
              </option>
            ))}
          </select>
        </div>

        {/* Turno */}
        <div>
          <label htmlFor="turno" className="block text-sm font-medium mb-1">
            Turno
          </label>
          <select
            id="turno"
            name="turno"
            value={formData.turno}
            onChange={handleChange}
            className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 ${
              errors.turno
                ? 'border-red-500 focus:ring-red-500 border-2 animate-shake bg-white dark:bg-gray-700 text-black dark:text-white'
                : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white'
            }`}
          >
            <option value="">Seleccione un turno</option>
            {["Mañana", "Tarde", "Noche"].map((turno) => (
              <option key={turno} value={turno}>
                {turno}
              </option>
            ))}
          </select>
        </div>

        {/* Fabricadas */}
        <div className="mb-4 col-span-1 md:col-span-2 w-full max-w-full md:max-w-xs mx-auto">
          <label htmlFor="fabricadas" className="block text-sm font-medium mb-1 text-center">
            Fabricadas
          </label>
          <input
            type="text"
            id="fabricadas"
            name="fabricadas"
            min={0}
            value={formData.fabricadas || ""}
            onChange={handleFabricadasNumericChange}
            className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 text-center ${
              errors.fabricadas
                ? 'border-red-500 focus:ring-red-500 border-2 animate-shake bg-white dark:bg-gray-700 text-black dark:text-white'
                : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white'
            }`}
            placeholder="Ingrese cantidad fabricada"
          />
        </div>

        <button
          type="submit"
          className={`relative overflow-hidden col-span-1 md:col-span-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700 dark:hover:bg-blue-400"
          }`}
          disabled={isLoading}
        >
          {isLoading && (
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-blue-400 animate-loading-bar opacity-50" />
            </div>
          )}
          <span className="relative z-10">{isLoading ? "Cargando..." : "Predecir duración"}</span>
        </button>
      </form>
    </div>

    {/* Cola de predicciones */}
    <div className="w-full md:w-96">
      <PredictionQueue initialPredictions={predictions} newPrediction={lastPrediction} />
    </div>
  </div>
);



}

export default PredictionsComponent;
