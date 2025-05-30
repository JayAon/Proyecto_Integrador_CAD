import React, { useRef, useEffect } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import RouteToggleButton from "./RouteToggleButton";
import ThemeToggleButton from "./ThemeToggleButton";

interface HamburgerMenuProps {
  viewMode: "dark" | "light";
  toggleViewMode: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ viewMode, toggleViewMode }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div ref={menuRef} className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setMenuOpen((open) => !open)}
        className="z-50 w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        aria-label="Abrir menú"
        title="Abrir menú"
      >
        <Bars3Icon className="h-6 w-6 text-blue-950 dark:text-blue-400" />
      </button>

      {menuOpen && (
        <div className="mt-2 flex flex-col space-y-2 bg-white dark:bg-gray-800 p-2 rounded shadow-md">
          <RouteToggleButton />
          <ThemeToggleButton viewMode={viewMode} toggleViewMode={toggleViewMode} />
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
