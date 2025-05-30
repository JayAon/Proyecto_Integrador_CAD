import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Pedido } from "../../../types/pedido"

type Props = {
  data: Pedido[]
}

const DurationChart = ({ data }: Props) => {
  const resumen = Object.values(
    data.reduce<Record<string, { name: string; total: number; count: number }>>((acc, curr) => {
      const key = curr.Seccion
      if (!acc[key]) acc[key] = { name: key, total: 0, count: 0 }
      acc[key].total += curr.DuracionMin
      acc[key].count += 1
      return acc
    }, {})
  ).map(({ name, total, count }) => ({ name, promedio: total / count }))

  return (
    <div className="w-full h-80 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Duración total por sección</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart width={600} height={300} data={resumen}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="promedio" fill="#8884d8" />
        </BarChart>
    </ResponsiveContainer>
    </div>
  )
}

export default DurationChart
