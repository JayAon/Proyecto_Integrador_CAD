import React from "react";

const BIComponent = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Gráficos de Predicciones</h1>
      {/* Aquí puedes integrar librerías como Chart.js, Recharts, Victory, etc */}
      <p className="text-lg text-center max-w-xl">
        Aquí puedes agregar tus gráficos interactivos para visualizar las predicciones.
      </p>
    </div>
  );
};

export default BIComponent;

