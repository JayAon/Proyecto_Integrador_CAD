import { useState, useEffect } from "react"
import { Pedido } from "../../../types/pedido"
import { FilterConfig } from "../../../types/filter_config"
import { getPedidosData } from "../../../handlers/getData"
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/solid"


type Props = {
  data: Pedido[]
  onFilter: (filtered: Pedido[]) => void
  filters: FilterConfig[]
  setLoading?: (loading: boolean) => void
}

export default function FilterPanel({ data, onFilter, filters,setLoading }: Props) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({})
  const [daysBack, setDaysBack] = useState<number | null>(10)
  const [baseDate, setBaseDate] = useState<string>("2024-01-01")
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const uniqueValues = (key: keyof Pedido): string[] => {
    return Array.from(new Set(data.map((d) => d[key]))).filter(Boolean) as string[]
  }

  const handleChange = (key: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleDaysBackChange = (value: string) => {
    setDaysBack(value ? parseInt(value) : null)
    setButtonEnabled(true)
  }

  const handleBaseDateChange = (value: string) => {
    setBaseDate(value)
    setButtonEnabled(true)
  }

  const resetFilters = () => {
    setSelectedFilters({});
    setDaysBack(10);
    setBaseDate("2024-01-01");
    setButtonEnabled(true);

  }

  const handleFetchPedidos = async () => {
    if (!baseDate || daysBack === null) {
      alert("Selecciona fecha base y cantidad de dias.")
      return
    }
    try {
      if (setLoading) setLoading(true)
      const nuevosDatos = await getPedidosData(baseDate, daysBack)
      onFilter(nuevosDatos)
    } catch (error) {
      console.error("Error al obtener pedidos:", error)
    }
    finally{
      if (setLoading) setLoading(false)
      setButtonEnabled(false)
    }
  }

  useEffect(() => {
    let filtered = data

    for (const [key, value] of Object.entries(selectedFilters)) {
      if (value) {
        filtered = filtered.filter((item) => item[key as keyof Pedido] == value)
      }
    }
    onFilter(filtered)
  }, [selectedFilters, daysBack, baseDate, data])

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>

      <div className="flex flex-wrap gap-4 items-end">
        {filters.map((filter, idx) => (
          <div key={idx}>
            <label className="block text-sm mb-1">{filter.label}</label>
            <select
              value={selectedFilters[filter.key] || ""}
              onChange={(e) => handleChange(filter.key, e.target.value)}
              className="w-48 px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm"
            >
              <option value="">Todos</option>
              {uniqueValues(filter.key).map((val, i) => (
                <option key={i} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <label className="block text-sm mb-1">Fecha base</label>
          <input
            type="date"
            value={baseDate}
            defaultValue={"2024-01-01"}
            onChange={(e) => handleBaseDateChange(e.target.value)}
            className="w-40 px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Ultimos dias</label>
          <select
            value={daysBack ?? ""}
            onChange={(e) => handleDaysBackChange(e.target.value)}
            className="w-32 px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm"
          >
            <option value="10">10 dias</option>
            <option value="15">15 dias</option>
            <option value="30">30 dias</option>
            <option value="90">90 dias</option>
            <option value="-1">Todo antes de</option>
          </select>
        </div>

       {buttonEnabled && (
          <button
            onClick={handleFetchPedidos}
            className="px-2 py-2 rounded-md text-sm transition"
            title="Actualizar datos"
          >
            <ArrowPathIcon className="h-6 w-6 text-orange-500 dark:text-orange-400" />
          </button>
        )}


        <button
          onClick={resetFilters}
          className="px-2 py-2 rounded-md text-sm transition"
          title="Limpiar filtros"
        >
          <TrashIcon className={`h-6 w-6 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-600"} `}/>
        </button>
      </div>
    </div>
  )
}
