
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { Pedido } from "../../../types/pedido"

type Props = {
  data: Pedido[]
}

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

export default function StatusChart({ data }: Props) {
  // Count occurrences by State
  const groupedData = data.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.Estado)
    if (found) {
      found.value += 1
    } else {
      acc.push({ name: curr.Estado, value: 1 })
    }
    return acc
  }, [] as { name: string; value: number }[])

  return (
    <div className="w-full h-96 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Distribución de estados de producción</h3>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={groupedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#2563EB"
            label
          >
            {groupedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
