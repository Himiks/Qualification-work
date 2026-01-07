import { useState, useEffect } from "react";

export default function MessageBox({ message, type = "info", duration = 3000, onClose }) {
  const [show, setShow] = useState(true);

  useEffect(() => { // Auto close after duration
    const timer = setTimeout(() => {
      setShow(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [duration, onClose]);

  if (!show) return null; // Don't render if not showing

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed top-5 right-5 px-5 py-3 rounded-lg text-white shadow-lg transform transition-all duration-300 ${colors[type]}`}
    >
      {message}
    </div>
  );
}
