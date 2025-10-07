import { Link } from "react-router-dom";


function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <span className="font-bold text-xl">Smart Student Hub</span>

      <div className="flex gap-4">
        <Link
          to="/register"
          className="hover:bg-blue-500 px-3 py-2 rounded transition"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="hover:bg-blue-500 px-3 py-2 rounded transition"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
