import React, { useState, useEffect } from "react";
import employeeService from "../services/employeeService";
import storageService from "../../../auth/services/storageService";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function EmployeeProfile() { // Employee profile component
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
        name: user.name,
        email: user.email,
        password: ""
      });
    }
  }, []);

  const handleChange = (e) => // Handle form input changes
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => { // Save updated profile
    try {
    await employeeService.updateProfile(form); // API call to update profile
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

  // Render the profile form
  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

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
          onClick={handleSave} // Save updated profile
          className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
