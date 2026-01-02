import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminService from "../services/adminService";
import { getAllTechniques } from "../../technique/services/techniqueService";
import { toast } from "react-toastify";

function AdminUpdateTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [techniques, setTechniques] = useState([]);

  const [task, setTask] = useState({
    employeeId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
    taskStatus: "PENDING",
    technique: "NONE",
  });

  const priorities = ["LOW", "MEDIUM", "HIGH"];
  const statuses = ["PENDING", "IN_PROGRESS", "DEFERRED", "COMPLETED", "CANCELLED"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskData, usersData, techniquesData] = await Promise.all([
          adminService.getTaskById(id),
          adminService.getUsers(),
          getAllTechniques(),
        ]);

        setTask({
          employeeId: taskData.employeeId || "",
          title: taskData.title || "",
          description: taskData.description || "",
          dueDate: taskData.dueDate ? taskData.dueDate.split("T")[0] : "",
          priority: taskData.priority || "LOW",
          taskStatus: taskData.taskStatus || "PENDING",
          technique: taskData.technique || "NONE",
        });

        setUsers(usersData || []);
        setTechniques(techniquesData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateTask(id, task);
      toast.success("Task updated successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task!");
    }
  };

  const employeeName =
    users.find((u) => u.id === task.employeeId)?.name ||
    users.find((u) => u.id === task.employeeId)?.fullName ||
    users.find((u) => u.id === task.employeeId)?.username ||
    "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center items-start py-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          <i className="fa-regular fa-pen-to-square"></i> Update Task (Admin)
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={task.title}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Technique</label>
            <select
              name="technique"
              value={task.technique}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="NONE">None</option>
              {techniques.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label className="block font-semibold text-gray-700 mb-1">Task Status</label>
            <select
              name="taskStatus"
              value={task.taskStatus}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">User</label>
            <div className="border border-gray-300 p-3 w-full rounded-lg bg-gray-50">
              {employeeName}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 shadow-md"
            >
                <i className="fa-solid fa-floppy-disk"></i> Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AdminUpdateTask;
