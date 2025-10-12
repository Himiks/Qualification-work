import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminService from "../services/adminService";

function AdminUpdateTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [task, setTask] = useState({
    employeeId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
    taskStatus: "PENDING",
  });

  const priorities = ["LOW", "MEDIUM", "HIGH"];
  const statuses = ["PENDING", "IN_PROGRESS", "DEFERRED", "COMPLETED", "CANCELLED"];

  // 🔹 Загружаем задачу и пользователей
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskData, usersData] = await Promise.all([
          adminService.getTaskById(id),
          adminService.getUsers(),
        ]);

        setTask({
          employeeId: taskData.employeeId || "",
          title: taskData.title || "",
          description: taskData.description || "",
          dueDate: taskData.dueDate ? taskData.dueDate.split("T")[0] : "",
          priority: taskData.priority || "LOW",
          taskStatus: taskData.taskStatus || "PENDING",
        });

        setUsers(usersData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id]);

  // 🔹 Обновление состояния формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  // 🔹 Сабмит формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateTask(id, task);
      alert("✅ Task updated successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error updating task:", err);
      alert("❌ Failed to update task!");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">✏️ Update Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-semibold">Title</label>
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Enter task title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            placeholder="Enter task description"
            required
          />
        </div>

        {/* Due Date */}
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

        {/* Priority */}
        <div>
          <label className="block font-semibold">Priority</label>
          <select
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Task Status */}
        <div>
          <label className="block font-semibold">Task Status</label>
          <select
            name="taskStatus"
            value={task.taskStatus}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Employee */}
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
                {u.name || u.fullName || u.username}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Task
        </button>
      </form>
    </div>
  );
}

export default AdminUpdateTask;
