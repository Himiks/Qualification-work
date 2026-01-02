import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import adminService from "../services/adminService";
import storageService from "../../../auth/services/storageService";
import { toast } from "react-toastify";

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await adminService.getTasks();
      setTasks(res);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await adminService.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/task/${id}/edit`);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      fetchTasks();
      return;
    }

    try {
      const res = await adminService.searchTask(value);
      setTasks(res);
    } catch (err) {
      console.error("Error searching tasks:", err);
    }
  };

 const getPriorityColor = (priority) => {
  switch (priority?.toUpperCase()) {
    case "HIGH":
      return "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md";
    case "MEDIUM":
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md";
    case "LOW":
      return "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md";
    default:
      return "bg-gray-200 text-gray-800 shadow-md";
  }
};

 const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "IN_PROGRESS":
      return "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md";
    case "COMPLETED":
      return "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md";
    case "PENDING":
      return "bg-gray-300 text-gray-800 shadow-md";
    default:
      return "bg-gray-200 text-gray-700 shadow-md";
  }
};

  if (storageService.getUserRole() !== "ADMIN") {
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

  return (
    <div className="p-6 max-w-7xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800"> All Tasks (Admin)</h2>

        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Enter keyword to search..."
          className="border border-gray-300 rounded-lg p-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-lg text-center mt-10">No tasks found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border border-gray-200 rounded-2xl shadow-sm bg-white p-5 flex flex-col justify-between relative transform transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => navigate(`/admin/task/${task.id}/details`)}
                  className="text-purple-500 hover:text-purple-700"
                  title="View Details"
                >
                  <i className="fa-regular fa-eye transition-transform hover:scale-110"></i>
                </button>
                <button
                  onClick={() => handleEdit(task.id)}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit Task"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Task"
                >
                  <i className="fa-regular fa-trash-can transition hover:scale-110"></i>
                </button>
              </div>

            
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                  {task.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {task.description}
                </p>
              </div>

             
              <div className="text-sm text-gray-700 space-y-1 mt-auto">
                <p>
                  <span className="font-semibold"> <i className="fa-solid fa-clock text-cyan-500 mr-1"></i>Due Date:</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold"><i className="fa-solid fa-user-astronaut text-purple-500 mr-1"></i>User:</span>{" "}
                  {task.employeeName}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      task.taskStatus
                    )}`}
                  >
                    {task.taskStatus}
                  </span>

                 
                 <button
                      onClick={() => {
                        if (task.technique && task.technique !== "NONE") {
                          navigate(`/techniques/${task.technique.toLowerCase()}/${task.id}`);
                        }
                      }}
                      className={`ml-2 px-3 py-1 text-xs rounded-full font-semibold shadow-md transition-all ${
                        task.technique && task.technique !== "NONE"
                          ? "bg-gradient-to-r from-cyan-400 to-cyan-600 text-white hover:from-cyan-500 hover:to-cyan-700 hover:scale-105"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      ▶ Start
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
