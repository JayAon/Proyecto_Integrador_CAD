import { BeakerIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { useLocation, useNavigate } from "react-router-dom";

const RouteToggleButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const toggleRoute = () => {
    if (location.pathname === "/bi") {
      navigate("/");
    } else {
      navigate("/bi");
    }
  };

  return (
    <button
      onClick={toggleRoute}
      className="z-50 w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      title={location.pathname === "/bi" ? "Ir a Predicciones" : "Ir a BI"}
    >
      {location.pathname === "/bi" ? (
  <BeakerIcon className="h-6 w-6 text-blue-950 dark:text-blue-400" />
) : (
  <ChartBarIcon className="h-6 w-6 text-blue-950 dark:text-blue-400" />
)}

    </button>
  );
};
export default RouteToggleButton;