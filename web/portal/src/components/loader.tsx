// components/Loader.tsx
import React from 'react';

const Loader: React.FC<{ message?: string }> = ({ message = "Cargando..." }) => (
  <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
    <svg
      className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
    <span className="text-gray-700 dark:text-gray-300 text-lg">{message}</span>
  </div>
);

export default Loader;
