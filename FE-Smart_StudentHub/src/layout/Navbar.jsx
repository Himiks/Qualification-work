import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import storageService from "../auth/services/storageService";

function Navbar() {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(storageService.isAdminLoggedIn());
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(storageService.isEmployeeLoggedIn());

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAdminLoggedIn(storageService.isAdminLoggedIn());
      setIsEmployeeLoggedIn(storageService.isEmployeeLoggedIn());
    };

    
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const handleLogout = () => {
    storageService.logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <span className="font-bold text-xl">
        {isAdminLoggedIn
          ? "Admin Dashboard"
          : isEmployeeLoggedIn
          ? "Employee Portal"
          : "Smart Student Hub"}
      </span>

      <div className="flex gap-4">
        {!isAdminLoggedIn && !isEmployeeLoggedIn && (
          <>
            <Link to="/register" className="hover:bg-blue-500 px-3 py-2 rounded transition">
              Register
            </Link>
            <Link to="/login" className="hover:bg-blue-500 px-3 py-2 rounded transition">
              Login
            </Link>
          </>
        )}

        {isAdminLoggedIn && (
          <>
            <Link to="/admin/dashboard" className="hover:bg-blue-500 px-3 py-2 rounded transition">
              Dashboard
            </Link>
            <Link to="/admin/task" className="hover:bg-blue-500 px-3 py-2 rounded transition">
              POST TASK
            </Link>
            <button onClick={handleLogout} className="hover:bg-red-500 px-3 py-2 rounded transition">
              Logout
            </button>
          </>
        )}

        {isEmployeeLoggedIn && (
          <>
            <Link to="/employee/dashboard" className="hover:bg-blue-500 px-3 py-2 rounded transition">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="hover:bg-red-500 px-3 py-2 rounded transition">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
