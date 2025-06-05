import { Pedido } from "../../../types/pedido"


type Props = {
  data: Pedido[]
}

const DataTable = ({ data }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-left">
            <th className="px-4 py-2 font-semibold">Fecha Inicio</th>
            <th className="px-4 py-2 font-semibold">Fecha Fin</th>
            <th className="px-4 py-2 font-semibold">Pedido</th>
            <th className="px-4 py-2 font-semibold">OP</th>
            <th className="px-4 py-2 font-semibold">Maquina</th>
            <th className="px-4 py-2 font-semibold">Usuario</th>
            <th className="px-4 py-2 font-semibold">Estado</th>
            <th className="px-4 py-2 font-semibold">Duracion [min]</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={`border-b border-gray-200 dark:border-gray-700 ${
                idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"
              }`}
            >
              <td className="px-4 py-2">{row.FechaInicio}</td>
              <td className="px-4 py-2">{row.FechaFin}</td>
              <td className="px-4 py-2">{row.Pedido}</td>
              <td className="px-4 py-2">{row.OP}</td>
              <td className="px-4 py-2">{row.Maquina}</td>
              <td className="px-4 py-2">{row.Usuario}</td>
              <td className="px-4 py-2">{row.Estado}</td>
              <td className="px-4 py-2">{row.DuracionMin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
