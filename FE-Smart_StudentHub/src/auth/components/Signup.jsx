import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ // Form state
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [hidePassword, setHidePassword] = useState(true); // Toggle password visibility
  const [errors, setErrors] = useState({});   // Validation error messages

  const handleChange = (e) => { // Update form state on input change
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => { // Basic form validation
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Please enter a valid name.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email.";
    if (!form.password.trim())
      newErrors.password = "Please enter a valid password.";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors); // Update error state
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => { // Handle form submission
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await authService.signup(form);
      if (res.id) {
        navigate("/login");
      } else {
        toast.error("Signup failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Signup failed. Try again.");
    }
  };

  const isInvalid =
    !form.name || !form.email || !form.password || !form.confirmPassword; // Disable submit if form is incomplete

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4"> {/* Signup form */}
          
          <div>
            <label className="block text-gray-700 mb-1">Name</label> {/* Name input field */}
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label> {/* Email input field */}
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label> {/* Password input field */}
            <div className="relative">
              <input
                type={hidePassword ? "password" : "text"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setHidePassword(!hidePassword)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                <i className={`fa-solid ${hidePassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label> {/* Confirm Password input field */}
            <input
              type={hidePassword ? "password" : "text"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button 
            type="submit"
            disabled={isInvalid} // Disable button if form is invalid
            className={`w-full py-2 rounded-md text-white font-semibold ${
              isInvalid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Sign Up 
          </button> {/* Submit button */}
        </form>
      </div>
    </div>
  );
}

export default Signup;
