//Alert display component
import React from 'react';


export default function Alert({ message, type }: { message: string; type: 'success' | 'error' | 'info' }) {
  const alertStyles = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className={`p-4 rounded-md ${alertStyles[type]}`}>
      <strong>{type.charAt(0).toUpperCase() + type.slice(1)}:</strong> {message}
    </div>
  );
}