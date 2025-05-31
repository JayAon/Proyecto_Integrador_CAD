import React, { useState } from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PredictionsComponent from "./components/Predictions_components/PredictionComponent";
import HamburgerMenu from "./components/HamburgerMenu";
import BITableFilter from "./components/BI_components/BITableFilter";
import ProductionByMachine from "./components/BI_components/charts/ProductionbyMachine";
import BICharts from "./components/BI_components/BICharts";
import Alert from "./components/BI_components/alerts/alert";
import BIAlert from "./components/BI_components/alerts/BIAlert";


function App() {
  const [viewMode, setViewMode] = useState<"dark" | "light">("dark");
  React.useEffect(() => {
    if (viewMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [viewMode]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "dark" ? "light" : "dark"));
    console.log(`Modo de vista cambiado a: ${viewMode === "dark" ? "claro" : "oscuro"}`);
  };

  return (
    <BrowserRouter>
      <HamburgerMenu viewMode={viewMode} toggleViewMode={toggleViewMode} />
      <Routes>
        <Route path="/" element={<PredictionsComponent />} />
        <Route path="/table" element={<BITableFilter />} />
        <Route path="/charts" element={<BICharts />} />
        <Route path = "/alerts" element={<BIAlert message="Alerta de ejemplo" type="info" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
