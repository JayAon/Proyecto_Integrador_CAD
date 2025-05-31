//here the alerts will be displayed
import React, { useState, useEffect } from "react";


//Create component for displaying alerts
export default function BIAlert({ message, type }: { message: string; type: 'success' | 'error' | 'info' }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000); // Hide alert after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const alertStyles = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <div className={`p-4 top-8 right-0 rounded-md ${alertStyles[type]}`}>
      <strong>{type.charAt(0).toUpperCase() + type.slice(1)}:</strong> {message}
    </div>
  );
}