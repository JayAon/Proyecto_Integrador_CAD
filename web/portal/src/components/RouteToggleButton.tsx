import { BeakerIcon, ChartBarIcon, TableCellsIcon } from "@heroicons/react/24/solid"
import { useLocation, useNavigate } from "react-router-dom"

type RouteOption = {
  path: string
  title: string
  icon: React.ReactNode
}

const routes: RouteOption[] = [
  {
    path: "/",
    title: "Ir a Predicciones",
    icon: <BeakerIcon className="h-6 w-6 text-blue-950 dark:text-blue-400" />,
  },
  {
    path: "/table",
    title: "Ir a tabla de datos",
    icon: <TableCellsIcon className="h-6 w-6 text-blue-950 dark:text-blue-400" />,
  },
  {
    path:"/charts",
    title: "Ir a gráfico de producción por máquina",
    icon: <ChartBarIcon className="h-6 w-6 text-blue-950 dark:text-blue-400" />,
  }
]

const RouteToggleButton: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Filtramos para no mostrar botón de la ruta actual
  const otherRoutes = routes.filter((r) => r.path !== location.pathname)

  return (
    <div className="flex space-x-2 z-50">
      {otherRoutes.map((route) => (
        <button
          key={route.path}
          onClick={() => navigate(route.path)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          title={route.title}
        >
          {route.icon}
        </button>
      ))}
    </div>
  )
}

export default RouteToggleButton
