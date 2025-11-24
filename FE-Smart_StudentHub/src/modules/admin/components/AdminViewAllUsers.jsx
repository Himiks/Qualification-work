import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService'
import storageService from '../../../auth/services/storageService';

function AdminViewAllUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminService.getUsers();
        setUsers(res);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await adminService.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/user/${id}/edit`);
  };

  if (storageService.getUserRole() === 'ADMIN') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">📋 All Users</h2>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="py-3 px-4 font-medium text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-800">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 hover:text-blue-700 transition-colors"
                      title="Edit User"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:text-red-700 transition-colors"
                      title="Delete User"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return (
      <div className="p-6 w-full h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-red-600 drop-shadow mb-4">
            ❌ Access Denied
          </h2>
          <p className="text-gray-600 text-lg">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }
}

export default AdminViewAllUsers;
