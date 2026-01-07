import React, { useState, useEffect } from "react";
import storageService from "../../../auth/services/storageService";
import adminService from "../services/adminService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



export default function AdminProfile() {
  const [form, setForm] = useState({ // Form state
    name: "",
    email: "",
    password: ""
  });
    const navigate = useNavigate(); // Navigation hook

  const user = storageService.getUser(); // Get current user

  useEffect(() => { // Populate form with user data on mount
    if (user) {
      setForm({
        name: user.name, // User name
        email: user.email, // User email
        password: "" // Empty password
      });
    }
  }, []);

  const handleChange = (e) => // Handle form input changes
    setForm({ ...form, [e.target.name]: e.target.value }); // Update form state

  const handleSave = async () => {// Save updated profile
    try {

      await adminService.updateProfile(form); // API call to update profile
      toast.success("Profile updated successfully!");
      storageService.saveUser({
        ...user,
        name: form.name,
        email: form.email
      });
    } catch (err) {
      toast.error("Error: " + err.message);
    }
    navigate('/admin/dashboard');
  };


  if (storageService.getUserRole() !== "ADMIN") { // Access control
    return (
      <div className="p-6 w-full h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-red-600 drop-shadow mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 text-lg">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  // Render the profile form
  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Admin Profile</h2>

      <div className="flex flex-col gap-4">
        <input
          name="name"
          value={form.name} // User name
          onChange={handleChange}
          placeholder="Name"
          className="p-3 border rounded-lg"
        />

        <input
          name="email"
          value={form.email} // User email
          onChange={handleChange}
          placeholder="Email"
          className="p-3 border rounded-lg"
        />

        <input
          name="password"
          type="password"
          value={form.password} // New password
          onChange={handleChange}
          placeholder="New Password (optional)"
          className="p-3 border rounded-lg"
        />

        <button
          onClick={handleSave} // Save profile changes
          className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
