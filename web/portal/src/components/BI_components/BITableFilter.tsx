import React, { useEffect, useState } from "react";
import { Pedido } from "../../types/pedido";
import { getPedidosData } from "../../handlers/getData";
import DataTable from "./table/DataTable";
import FilterPanel from "./table/FiltersPanel";
import { FilterConfig } from "../../types/filter_config";

const BIComponent = () => {
  const [allPedidos, setAllPedidos] = useState<Pedido[]>([])
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([])

  useEffect(() => {
    getPedidosData().then(data => {
      setAllPedidos(data)
      setFilteredPedidos(data)
    })
  }, [])

  const filterConfig:FilterConfig[] = [
  { key: "Maquina", label: "Maquina" },
  { key: "Usuario", label: "Usuario" },
  { key: "Estado", label: "Estado" },
  { key: "Pedido", label: "Pedido" },
  { key: "OP", label: "OP" }]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 pl-20 pt-4 pr-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard de Produccion</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4">
        <FilterPanel data={allPedidos} onFilter={setFilteredPedidos} filters={filterConfig} />
        <DataTable data={filteredPedidos} />
      </div>
    </div>
  )
};

export default BIComponent;

