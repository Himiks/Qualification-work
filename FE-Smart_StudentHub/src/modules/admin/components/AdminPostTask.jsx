import React, { useEffect, useState } from "react";
import adminService from "../services/adminService";
import { useNavigate } from "react-router-dom";

function AdminPostTask() {
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState({
    employeeId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminService.postTask(task);
        navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error posting task:", err);
      alert("Error posting task");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Post Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-semibold">Title</label>
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Priority</label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Assign to Employee</label>
          <select
            name="employeeId"
            value={task.employeeId}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="">Select employee</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Task
        </button>
      </form>
    </div>
  );
}

export default AdminPostTask;
