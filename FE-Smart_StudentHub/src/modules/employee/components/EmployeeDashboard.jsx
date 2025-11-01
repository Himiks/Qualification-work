import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import employeeService from "../services/employeeService";
import { motion, AnimatePresence } from "framer-motion";
import { HiSearch } from "react-icons/hi";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await employeeService.getAllTasksByUserId();
      setTasks(res);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await employeeService.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task.");
    }
  };

  const handleEdit = (id) => navigate(`/employee/task/${id}/edit`);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      fetchTasks();
      return;
    }

    try {
      const res = await employeeService.searchTask(value);
      setTasks(res);
    } catch (err) {
      console.error("Error searching tasks:", err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH": return "from-red-400 to-red-600 text-white";
      case "MEDIUM": return "from-yellow-400 to-yellow-600 text-white";
      case "LOW": return "from-green-400 to-green-600 text-white";
      default: return "from-gray-300 to-gray-500 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED": return "from-green-300 to-green-500 text-white";
      case "IN_PROGRESS": return "from-blue-400 to-blue-600 text-white";
      case "PENDING": return "from-gray-300 to-gray-500 text-gray-800";
      default: return "from-gray-200 to-gray-400 text-gray-700";
    }
  };

  return (
   <div className="min-h-screen p-6 bg-gradient-to-br from-blue-900 via-blue-900 to-blue-900">
      {/* Header и поиск */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 drop-shadow-lg">
          📋 All Tasks
        </h2>
        <div className="relative w-full sm:w-64">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Enter keyword to search..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-cyan-400 focus:outline-none placeholder-gray-400 transition-all shadow-sm"
          />
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-lg text-center mt-20 animate-pulse">
          No tasks found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg hover:shadow-cyan-500/40 transition-all flex flex-col justify-between"
              >
                {/* Кнопки действий — всегда видны */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/employee/task/${task.id}/details`)}
                    className="text-purple-400 hover:text-purple-600 text-lg"
                    title="View Details"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="text-blue-400 hover:text-blue-600 text-lg"
                    title="Edit Task"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-400 hover:text-red-600 text-lg"
                    title="Delete Task"
                  >
                    🗑️
                  </button>
                </div>

                {/* Заголовок */}
                <h3 className="text-xl font-semibold text-white mb-2 truncate">{task.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{task.description}</p>

                {/* Информация */}
                <div className="flex flex-wrap items-center gap-2 mt-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPriorityColor(task.priority)} shadow-md`}>
                    {task.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(task.taskStatus)} shadow-md`}>
                    {task.taskStatus}
                  </span>
                  <span className="ml-auto text-gray-500 text-xs">📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                  <button
                    onClick={() => {
                      if (task.technique && task.technique !== "NONE") {
                        navigate(`/techniques/${task.technique.toLowerCase()}/${task.id}`);
                      }
                    }}
                    className={`px-2 py-1 text-xs rounded shadow-md transition-all ${
                      task.technique && task.technique !== "NONE"
                        ? "bg-cyan-500 text-white hover:bg-cyan-600 cursor-pointer"
                        : "bg-gray-400 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    ▶ Start
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
