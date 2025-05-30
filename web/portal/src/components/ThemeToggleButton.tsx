import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

interface ThemeToggleButtonProps {
  viewMode: "dark" | "light";
  toggleViewMode: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  viewMode,
  toggleViewMode,
}) => {
  return (
    <button
      onClick={toggleViewMode}
      title="Alternar tema claro/oscuro"
      className="z-50 w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      {viewMode === "dark" ? (
        <SunIcon className="w-6 h-6 text-yellow-400" />
      ) : (
        <MoonIcon className="w-6 h-6 text-gray-900" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
