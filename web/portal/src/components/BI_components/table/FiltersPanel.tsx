import { useState, useEffect } from "react"
import { Pedido } from "../../../types/pedido"
import { FilterConfig } from "../../../types/filter_config"

type Props = {
  data: Pedido[]
  onFilter: (filtered: Pedido[]) => void
  filters: FilterConfig[]
}

export default function FilterPanel({ data, onFilter, filters }: Props) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({})
  const [limit, setLimit] = useState<number | null>(null)
  const maxLimit = 5000 // Limite maximo de pedidos a mostrar
  // Obtener valores únicos por filtro
  const uniqueValues = (key: keyof Pedido): string[] => {
    return Array.from(new Set(data.map((d) => d[key]))).filter(Boolean) as string[]
  }

  const handleChange = (key: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleLimitChange = (value: string) => {
    setLimit(value ? parseInt(value) : null)
  }

  const resetFilters = () => {
    setSelectedFilters({})
    setLimit(maxLimit)
  }

  useEffect(() => {
    let filtered = data

    for (const [key, value] of Object.entries(selectedFilters)) {
      if (value) {
        filtered = filtered.filter((item) => item[key as keyof Pedido] === value)
      }
    }

    if (limit !== null) {
      filtered = filtered.slice(0, limit)
    }

    onFilter(filtered)
  }, [selectedFilters, limit, data])

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
          <label className="block text-sm mb-1">Limite</label>
          <select
            value={limit ?? ""}
            onChange={(e) => handleLimitChange(e.target.value)}
            className="w-32 px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm"
          >
            <option value={`${maxLimit}`}>Max</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="ml-auto px-4 py-2 rounded-md text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  )
}
