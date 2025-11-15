import { useState } from "react";
import authService from "../services/authService";
import storageService from "../services/storageService";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [hidePassword, setHidePassword] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email address.";
    if (!form.password.trim()) newErrors.password = "Please enter a valid password.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await authService.login(form);
      console.log("Login response:", res);

      if (res.userId) {
        const user = {
          id: res.userId,
          role: res.userRole,
        };

        storageService.saveUser(user);
        storageService.saveToken(res.jwt);

        if (storageService.isAdminLoggedIn()) {
          navigate("/admin/dashboard");
        } else if (storageService.isEmployeeLoggedIn()) {
          navigate("/employee/dashboard");
        }
        
      } else {
        alert("Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Check your credentials.");
    }
  };

  const isInvalid = !form.email || !form.password;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

         
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={hidePassword ? "password" : "text"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setHidePassword(!hidePassword)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                {hidePassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isInvalid}
            className={`w-full py-2 rounded-md text-white font-semibold transition ${
              isInvalid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/register" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Don’t have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
