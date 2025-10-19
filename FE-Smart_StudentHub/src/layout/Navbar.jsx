import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import storageService from "../auth/services/storageService";
import { HiMenu, HiX } from "react-icons/hi";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(storageService.isAdminLoggedIn());
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(storageService.isEmployeeLoggedIn());
  const [menuOpen, setMenuOpen] = useState(false);

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

  const title = isAdminLoggedIn
    ? "Admin Dashboard"
    : isEmployeeLoggedIn
    ? "Employee Portal"
    : "Smart Student Hub";

  const navLinks = [];
  if (isAdminLoggedIn) {
    navLinks.push(
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/task", label: "Post Task" }
    );
  } else if (isEmployeeLoggedIn) {
    navLinks.push(
      { to: "/employee/dashboard", label: "Dashboard" },
      { to: "/employee/task", label: "Post Task" }
    );
  }

  const linkClass = (to) =>
    `block px-3 py-2 rounded transition-colors ${
      location.pathname === to
        ? "bg-white text-blue-600 font-semibold shadow-md"
        : "hover:bg-blue-500"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-blue-600 bg-opacity-80 backdrop-blur-sm text-white px-6 py-3 shadow-md">
      <div className="flex justify-between items-center">
        <span className="font-bold text-xl">{title}</span>

        {/* Hamburger menu button for mobile */}
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex gap-2">
          {!isAdminLoggedIn && !isEmployeeLoggedIn ? (
            <>
              <Link to="/register" className={linkClass("/register")}>
                Register
              </Link>
              <Link to="/login" className={linkClass("/login")}>
                Login
              </Link>
            </>
          ) : (
            <>
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded hover:bg-red-500 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden mt-2 flex flex-col gap-2">
          {!isAdminLoggedIn && !isEmployeeLoggedIn ? (
            <>
              <Link to="/register" className={linkClass("/register")} onClick={() => setMenuOpen(false)}>
                Register
              </Link>
              <Link to="/login" className={linkClass("/login")} onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </>
          ) : (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={linkClass(link.to)}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="px-3 py-2 rounded hover:bg-red-500 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
