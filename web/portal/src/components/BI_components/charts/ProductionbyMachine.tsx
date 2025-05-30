
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { Pedido } from "../../../types/pedido"

type Props = {
  data: Pedido[]
}

export default function ProductionByMachine({ data }: Props) {
  // Group Fabricadas by Machine
  const groupedData = data.reduce((acc, curr) => {
    const found = acc.find(item => item.Machine === curr.Maquina)
    if (found) {
      found.Fabricadas += Math.round(curr.Fabricadas/1000)
    } else {
      acc.push({ Machine: curr.Maquina, Fabricadas: curr.Fabricadas })
    }
    return acc
  }, [] as { Machine: string; Fabricadas: number }[])
  return (
    <div className="w-full h-80 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Producción (miles) por máquina </h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={groupedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={undefined} />
          <XAxis dataKey="Machine" stroke={undefined} />
          <YAxis stroke={undefined} />
          <Tooltip />
          <Bar dataKey="Fabricadas" fill="#2563EB" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
