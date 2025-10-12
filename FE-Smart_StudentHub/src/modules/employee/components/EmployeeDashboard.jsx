import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import employeeService from "../services/employeeService";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await employeeService.getAllTasksByUserId();
      setTasks(res);
    } catch (err) {
      console.error("Error fetching employee tasks:", err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "text-red-600 bg-red-100";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100";
      case "LOW":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "text-green-600 bg-green-100";
    case "IN_PROGRESS":
      return "text-blue-600 bg-blue-100";
    case "PENDING":
      return "text-gray-600 bg-gray-100";
    case "DEFERRED":
      return "text-yellow-700 bg-yellow-100";
    case "CANCELLED":
      return "text-red-700 bg-red-100";
    default:
      return "text-gray-500 bg-gray-100";
  }
};


  const handleEdit = (id) => {
    navigate(`/employee/task/${id}/edit`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">👨‍💻 My Tasks</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-lg text-center mt-10">
          No tasks assigned yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-white p-5 relative"
            >
              {/* Кнопка редактирования */}
              <button
                onClick={() => handleEdit(task.id)}
                className="absolute top-3 right-3 text-blue-600 hover:text-blue-800"
              >
                ✏️
              </button>

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
                  <span className="font-semibold text-gray-800">📅 Due Date:</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      task.taskStatus
                    )}`}
                  >
                    {task.taskStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
