import React, { useEffect, useState } from "react";
import { Pedido } from "../../types/pedido";
import { getPedidosData } from "../../handlers/getData";
import DataTable from "./table/DataTable";
import FilterPanel from "./table/FiltersPanel";
import { FilterConfig } from "../../types/filter_config";
import Loader from "../loader";

const BIComponent = () => {
  const [allPedidos, setAllPedidos] = useState<Pedido[]>([])
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [dataLoadingOptions,setdataLoadingOptions] = useState(false);
const [error, setError] = useState<string | null>(null);


  const filterConfig:FilterConfig[] = [
  { key: "Maquina", label: "Maquina" },
  { key: "Usuario", label: "Usuario" },
  { key: "Estado", label: "Estado" }]
   

  useEffect(() => {
  getPedidosData()
    .then(data => {
      setAllPedidos(data);
      setFilteredPedidos(data);
    })
    .catch(err => {
      setError("Error al cargar los datos");
      console.error(err);
    }).finally(() => {
        setLoadingOptions(false);
      });;
}, []);

if (loadingOptions) {
  return <Loader message="Cargando tabla de datos..." />;
}
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 pl-20 pt-4 pr-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Produccion</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4">
        <FilterPanel data={allPedidos} onFilter={setFilteredPedidos} filters={filterConfig} setLoading={setdataLoadingOptions}/>
        <div className="relative">
        <div className="relative">
          <DataTable data={filteredPedidos} />

          {dataLoadingOptions && (
            <div className="absolute inset-0 items-center justify-center rounded-2xl z-10">
              <Loader message="Cargando tabla de datos..." opacity={70} />
            </div>
          )}
      </div>  
      </div>
      </div>
    </div>
  )
};

export default BIComponent;

