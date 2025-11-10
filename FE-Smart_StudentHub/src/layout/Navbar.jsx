// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import storageService from "../auth/services/storageService";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

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
    { to: "/admin/task", label: "Post Task" },
    { to: "/techniques", label: "Techniques" },
    { to: "/folders", label: "Folders" }, 
    { to: "/expenses", label: "Expenses" }
  );
} else if (isEmployeeLoggedIn) {
  navLinks.push(
    { to: "/employee/dashboard", label: "Dashboard" },
    { to: "/employee/task", label: "Post Task" },
    { to: "/techniques", label: "Techniques" },
    { to: "/folders", label: "Folders" }, 
    { to: "/expenses", label: "Expenses" }
  );
}

  const linkClass = (to) =>
    `relative px-4 py-2 font-medium transition-all duration-300 
     ${location.pathname === to ? "text-cyan-400" : "text-white/90 hover:text-cyan-300"}
     group`;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-gradient-to-r from-slate-900/80 via-blue-900/70 to-slate-900/80 border-b border-cyan-500/20 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Title */}
        <motion.span
          whileHover={{ scale: 1.05, textShadow: "0px 0px 15px rgba(56,189,248,0.7)" }}
          className="font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 drop-shadow"
        >
          {title}
        </motion.span>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-cyan-400 focus:outline-none"
        >
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-6">
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
                <div key={link.to} className="relative">
                  <Link to={link.to} className={linkClass(link.to)}>
                    {link.label}
                    <motion.span
                      layoutId="underline"
                      className={`absolute left-0 bottom-0 w-0 h-[2px] bg-cyan-400 group-hover:w-full transition-all duration-300 ${
                        location.pathname === link.to ? "w-full" : ""
                      }`}
                    />
                  </Link>
                </div>
              ))}
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#ef4444" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg text-white font-medium shadow-lg hover:shadow-cyan-400/30 transition-all"
              >
                Logout
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden bg-slate-900/90 backdrop-blur-lg border-t border-cyan-400/20"
          >
            <div className="flex flex-col items-start px-6 py-4 space-y-2">
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
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg text-white font-medium shadow-md hover:shadow-cyan-400/30 transition-all"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
