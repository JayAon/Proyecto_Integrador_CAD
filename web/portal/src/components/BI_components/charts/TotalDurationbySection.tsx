
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from "recharts"
import { Pedido } from "../../../types/pedido"

type Props = {
  data: Pedido[]
}

const COLORS = [
  "#f0fff4", "#c6f6d5", "#9ae6b4", "#68d391", "#48bb78",
  "#38a169", "#2f855a", "#276749", "#22543d", "#1c4532",
]

export default function TotalDurationBySection({ data }: Props) {
  // Agrupamos y sumamos duracion_min por Seccion
  const groupedData = data.reduce((acc, curr) => {
    const found = acc.find(item => item.Seccion === curr.Seccion)
    if (found) {
      found.DuracionMin += curr["DuracionMin"]
    } else {
      acc.push({ Seccion: curr.Seccion, DuracionMin: curr["DuracionMin"] })
    }
    return acc
  }, [] as { Seccion: string; DuracionMin: number }[])

  // Orden descendente por DuracionMin
  groupedData.sort((a, b) => b.DuracionMin - a.DuracionMin)

  return (
    <div className="w-full h-64 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Duración (min) por sección</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={groupedData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={undefined} />
          <XAxis type="number" stroke={undefined} />
          <YAxis dataKey="Seccion" type="category" stroke={undefined} />
          <Tooltip />
          <Bar dataKey="DuracionMin" fill="#48bb78">
            {groupedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
