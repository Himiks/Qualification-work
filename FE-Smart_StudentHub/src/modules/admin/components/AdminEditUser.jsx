import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../services/adminService";
import { toast } from "react-toastify";
import storageService from "../../../auth/services/storageService";


export default function AdminEditUser() {
  const { id } = useParams(); // User ID from URL
  const navigate = useNavigate(); // Navigation hook
  const [form, setForm] = useState({ // Form state
    name: "",
    email: "",
    password: ""
  });

  useEffect(() => { // Fetch user data on mount
    const fetchUser = async () => {
      try {
        const userData = await adminService.getUserById(id); // API call to get user data
        setForm({ name: userData.name, email: userData.email, password: "" }); //   Populate form
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user data");
      }
    };
    fetchUser(); // Call fetchUser
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value }); // Handle form input changes

  const handleSave = async () => { // Save updated user data
    try {
      await adminService.updateUser(id, form); // API call to update user
      toast.success("User updated successfully!");
      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    }
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

  {/** Render the edit user form */}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Edit User
        </h2>
        <div className="flex flex-col gap-4">
          <input
            name="name"
            value={form.name} // User name
            onChange={handleChange} // Handle input change
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
            onClick={handleSave}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Save Changes {/* Save button */}
          </button>
        </div>
      </div>
    </div>
  );
}
