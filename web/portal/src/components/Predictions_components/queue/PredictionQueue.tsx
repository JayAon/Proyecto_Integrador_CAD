import React, { useEffect, useState } from "react";
import { TrashIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { Prediction } from "../../../types/prediction";

interface PredictionQueueProps {
  initialPredictions?: Prediction[];
  newPrediction?: Prediction | null;
}

interface PredictionWithToggle extends Prediction {
  showDetails: boolean;
}

const PredictionQueue: React.FC<PredictionQueueProps> = ({
  initialPredictions = [],
  newPrediction = null,
}) => {
  const [predictions, setPredictions] = useState<PredictionWithToggle[]>(() => {
    const stored = localStorage.getItem("predictionsQueue");
    if (stored) {
      return JSON.parse(stored).map((p: Prediction) => ({ ...p, showDetails: false }));
    }
    return initialPredictions.map((p) => ({ ...p, showDetails: false }));
  });
  useEffect(() => {
    if (newPrediction) {
      setPredictions((prev) => {
        const updated = [...prev, { ...newPrediction, showDetails: false }];
        localStorage.setItem("predictionsQueue", JSON.stringify(updated.map(({ showDetails, ...p }) => p)));
        return updated;
      });
    }
  }, [newPrediction]);

  const handleDelete = (index: number) => {
    setPredictions((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem("predictionsQueue", JSON.stringify(updated.map(({ showDetails, ...p }) => p)));
      return updated;
    });
  };

  const toggleDetails = (index: number) => {
    predictions[index].showDetails = !predictions[index].showDetails;
    setPredictions([...predictions]); // Forzar re-render
  };

  const clearAll = () => {
    setPredictions([]);
    localStorage.removeItem("predictionsQueue");
  };

  const formatTime = (predictions: Prediction[]) => {
    const totalSeconds = predictions.reduce((acum, val) => acum + (val.duracion || 0) * 60, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${hours.toString().padStart(2, '0')} horas : ${minutes.toString().padStart(2, '0')} minutos y ${seconds.toString().padStart(2, '0')} segundos`;
  };

return (
  <div className="flex justify-center p-4">
    <div className="w-full max-w-sm md:max-w-md lg:max-w-lg max-h-[80vh] md:max-h-[90vh] overflow-auto p-4 bg-white dark:bg-gray-800 rounded shadow-md flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Cola de Predicciones ({predictions.length})</h2>
        {predictions.length > 0 && (
          <button
            onClick={clearAll}
            title="Borrar todas las predicciones"
            className="text-red-500 hover:text-red-700 transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      {predictions.length > 0 ? (
        <div>
          <h3>Duracion total</h3>
          <p className="text-sm text-gray-600 mb-2">{formatTime(predictions)}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No hay predicciones aún.</p>
      )}

      <ul className="space-y-3 flex-grow overflow-auto">
        <AnimatePresence>
          {predictions.map((p, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-300 dark:border-gray-600 rounded p-3 relative"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-start">
                <div className="flex-1">
                  <p><strong>Referencia:</strong> {p.referencia}</p>
                  <p><strong>Máquina:</strong> {p.maquina}</p>

                  <AnimatePresence initial={false}>
                    {p.showDetails && (
                      <motion.div
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <p><strong>Sección:</strong> {p.seccion}</p>
                        <p><strong>Proceso:</strong> {p.proceso}</p>
                        <p><strong>Usuario:</strong> {p.usuario}</p>
                        <p><strong>Hora inicio:</strong> {p.hora_inicio}</p>
                        <p><strong>Día semana:</strong> {p.dia_semana_inicio}</p>
                        <p><strong>Turno:</strong> {p.turno}</p>
                        <p><strong>Fabricadas:</strong> {p.fabricadas}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p><strong>Duración:</strong> {p.duracion.toFixed(2)} minutos</p>
                </div>

                <div className="flex flex-row md:flex-col items-start mt-3 md:mt-0 ml-0 md:ml-3 space-x-3 md:space-x-0 md:space-y-2 min-h-[48px]">
                  <button
                    onClick={() => toggleDetails(i)}
                    title={p.showDetails ? "Mostrar menos detalles" : "Mostrar más detalles"}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <ChevronDownIcon className={`h-6 w-6 transform transition-transform duration-200 ${p.showDetails ? "rotate-180" : "rotate-0"}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    title="Borrar predicción"
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <TrashIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  </div>
);



};

export default PredictionQueue;
