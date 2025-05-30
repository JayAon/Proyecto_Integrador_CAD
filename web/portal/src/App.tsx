import React, { useState } from "react";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PredictionsComponent from "./components/PredictionComponent";
import BIComponent from "./components/BIComponent";
import HamburgerMenu from "./components/HamburgerMenu";

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
        <Route path="/bi" element={<BIComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
