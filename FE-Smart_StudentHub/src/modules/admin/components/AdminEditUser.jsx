import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../services/adminService";

export default function AdminEditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await adminService.getUserById(id);
        setForm({ name: userData.name, email: userData.email, password: "" });
      } catch (err) {
        console.error(err);
        alert("Failed to load user data");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await adminService.updateUser(id, form);
      alert("User updated successfully!");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Edit User
        </h2>
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
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
