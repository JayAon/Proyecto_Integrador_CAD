import React from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { Prediction } from "../../../types/prediction";

interface DownloadPredictionsProps {
  data: Prediction[];
  fileName?: string;
}

const DownloadPredictions: React.FC<DownloadPredictionsProps> = ({
  data,
  fileName = "predicciones"
}) => {
  const handleDownload = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      title="Descargar predicciones"
      className="text-green-500 hover:text-green-700 transition mr-2"
      disabled={data.length === 0}
    >
      <ArrowDownTrayIcon className="h-6 w-6" />
    </button>
  );
};

export default DownloadPredictions;