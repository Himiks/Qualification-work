import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminService from "../services/adminService";
import { getAllTechniques } from "../../technique/services/techniqueService";
import { toast } from "react-toastify";
import storageService from "../../../auth/services/storageService";


function AdminUpdateTask() {
  const { id } = useParams(); // Get task ID from URL
  const navigate = useNavigate(); // Navigation hook

  const [users, setUsers] = useState([]);   // List of users
  const [techniques, setTechniques] = useState([]); // List of techniques

  const [task, setTask] = useState({ // Task state
    employeeId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
    taskStatus: "PENDING",
    technique: "NONE",
  });

  const priorities = ["LOW", "MEDIUM", "HIGH"]; // Priority options
  const statuses = ["PENDING", "IN_PROGRESS", "DEFERRED", "COMPLETED", "CANCELLED"]; // Status options

  useEffect(() => { // Fetch task, users, and techniques on mount
    const fetchData = async () => {
      try {
        const [taskData, usersData, techniquesData] = await Promise.all([ // Fetch all necessary data
          adminService.getTaskById(id), // Fetch task by ID
          adminService.getUsers(), // Fetch all users
          getAllTechniques(), // Fetch all techniques
        ]);

        setTask({ // Populate task state
          employeeId: taskData.employeeId || "",
          title: taskData.title || "",
          description: taskData.description || "",
          dueDate: taskData.dueDate ? taskData.dueDate.split("T")[0] : "",
          priority: taskData.priority || "LOW",
          taskStatus: taskData.taskStatus || "PENDING",
          technique: taskData.technique || "NONE",
        });

        setUsers(usersData || []); // Populate users state
        setTechniques(techniquesData || []); // Populate techniques state
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData(); // Call fetchData
  }, [id]);

  const handleChange = (e) => { // Handle form input changes
    const { name, value } = e.target;
    setTask({ ...task, [name]: value }); // Update task state
  };

  const handleSubmit = async (e) => { // Handle form submission
    e.preventDefault();
    try {
      await adminService.updateTask(id, task); // API call to update task
      toast.success("Task updated successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task!");
    }
  };

  const employeeName = // Get employee name for display
    users.find((u) => u.id === task.employeeId)?.name || // Full name
    users.find((u) => u.id === task.employeeId)?.fullName || // Alternative full name
    users.find((u) => u.id === task.employeeId)?.username || // Username
    "Unknown";


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

    // Render the update task form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center items-start py-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          <i className="fa-regular fa-pen-to-square"></i> Update Task (Admin) 
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5"> {/* Task update form */}

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={task.title} // Task title
              onChange={handleChange} 
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={task.description} // Task description
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
              value={task.dueDate} // Task due date
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
              onChange={handleChange} // Task priority
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              {priorities.map((p) => ( // Priority options
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Technique</label>
            <select
              name="technique"
              value={task.technique}
              onChange={handleChange} // Task technique
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="NONE">None</option>
              {techniques.map((t) => ( // Technique options
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
              onChange={handleChange} // Task status
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              {statuses.map((s) => ( // Task status options
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
            </button> {/* Submit button */}
          </div>

        </form>
      </div>
    </div>
  );
}

export default AdminUpdateTask;
