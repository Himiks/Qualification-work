import React, { useEffect, useState } from "react";
import adminService from "../services/adminService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import storageService from "../../../auth/services/storageService";


function AdminPostTask() {
  const [users, setUsers] = useState([]); // List of users for task assignment
  const [task, setTask] = useState({ // Task form state
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
    technique: "NONE",
  });

  const navigate = useNavigate(); // Navigation hook

  useEffect(() => { // Fetch users on component mount
    const fetchUsers = async () => {
      try {
        const res = await adminService.getUsers(); // API call to get users
        setUsers(res);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers(); // Fetch users when component mounts
  }, []);

  const handleChange = (e) => { // Handle form input changes
    const { name, value } = e.target;
    setTask({ ...task, [name]: value }); // Update task state
  };

  const handleSubmit = async (e) => { // Handle form submission
    e.preventDefault();
    try {
      await adminService.postTask(task); // API call to post new task
      toast.success("Task created successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Error posting task:", err);
      toast.error("Failed to post task");
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

  {/** Render the create task form */}
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center items-start py-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          <i className="fa-solid fa-circle-plus text-cyan-500 mr-2 transition-transform duration-200 hover:scale-110"></i> reate New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5"> {/* Task creation form */}
      
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Title
            </label>
            <input
              name="title"
              value={task.title} // Task title
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              placeholder="Enter task title"
              required
            />
          </div>

       
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={task.description} // Task description
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              placeholder="Enter task description"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate} // Task due date
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              required
            />
          </div>

         
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={task.priority} // Task priority
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              required
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Technique
            </label>
            <select
               id="technique"
              name="technique"
              value={task.technique || "NONE"}
              onChange={handleChange} // Task technique
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              required
            >
              <option value="NONE">None</option>
              <option value="POMODORO">Pomodoro</option>
              <option value="EISENHOWER">Eisenhower Matrix</option>
              <option value="TIME_BLOCKING">Time Blocking</option>
              <option value="DEEP_WORK">Deep Work</option>
            </select>
          </div>

          
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")} // Back to dashboard
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-all"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
            >
                <i className="fa-solid fa-floppy-disk"></i> Create Task {/* Submit button */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPostTask;
