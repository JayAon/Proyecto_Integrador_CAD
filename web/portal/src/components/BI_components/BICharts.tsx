import { useEffect, useState } from "react";
import ProductionByMachine from "./charts/ProductionbyMachine";
import { Pedido } from "../../types/pedido";
import { getPedidosData } from "../../handlers/getData";
import DurationChart from "./charts/DurationChart";
import StatusChart from "./charts/StatusChart";
import TotalDurationBySection from "./charts/TotalDurationbySection";
import { FilterConfig } from "../../types/filter_config";
import FilterPanel from "./table/FiltersPanel";
import Loader from "../loader";

export default function BICharts() {
  const [allPedidos, setAllPedidos] = useState<Pedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([])
  //Agregar loader
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [dataLoadingOptions,setdataLoadingOptions] = useState(false);

  
  useEffect(() => {
    getPedidosData().then(data => {
      setAllPedidos(data)
      setFilteredPedidos(data)
    }).catch((error) => {
        console.error("Error al cargar las opciones del formulario:", error);
      })
      .finally(() => {
        setLoadingOptions(false);
      });
  }, [])

  const filterConfig:FilterConfig[] = [
    { key: "Maquina", label: "Maquina" },
    { key: "Usuario", label: "Usuario" },
    { key: "Estado", label: "Estado" }]

  if (loadingOptions) {
  return <Loader message="Cargando gráficos..." />;
}

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 pl-20 pt-4 pr-4">
      <FilterPanel data={allPedidos} onFilter={setFilteredPedidos} filters={filterConfig} setLoading={setdataLoadingOptions}/>
      <h1 className="text-2xl font-bold mb-6">BI Charts</h1>
      <div className="relative">
      <ProductionByMachine data={filteredPedidos}/>
      <DurationChart data={filteredPedidos} />
      <StatusChart data={filteredPedidos} />
      <TotalDurationBySection data={filteredPedidos} />
      {dataLoadingOptions && (
            <div className="absolute inset-0 items-center justify-center rounded-2xl z-10">
              <Loader message="Cargando datos a graficar..." opacity={70} />
            </div>
          )}
      </div>
      
      
    </div>
  );
}