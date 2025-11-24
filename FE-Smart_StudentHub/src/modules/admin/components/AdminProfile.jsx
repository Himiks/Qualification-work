import React, { useState, useEffect } from "react";
import storageService from "../../../auth/services/storageService";
import axios from "axios";
import adminService from "../services/adminService";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
    const navigate = useNavigate();

  const user = storageService.getUser();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: ""
      });
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {

      await adminService.updateProfile(form);
      alert("Profile updated successfully!");
      storageService.saveUser({
        ...user,
        name: form.name,
        email: form.email
      });
    } catch (err) {
      alert("Error: " + err.message);
    }
    navigate('/admin/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Admin Profile</h2>

      <div className="flex flex-col gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="p-3 border rounded-lg"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-3 border rounded-lg"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="New Password (optional)"
          className="p-3 border rounded-lg"
        />

        <button
          onClick={handleSave}
          className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
