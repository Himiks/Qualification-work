import React, { useState } from "react";
import employeeService from "../services/employeeService";
import { useNavigate } from "react-router-dom";

function EmployeePostTask() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeeService.postTask(task);
      alert("✅ Task created successfully!");
      navigate("/employee/dashboard");
    } catch (err) {
      console.error("Error posting task:", err);
      alert("❌ Failed to post task");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center items-start py-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ✏️ Create New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Title
            </label>
            <input
              name="title"
              value={task.title}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              placeholder="Enter task description"
              required
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              required
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/employee/dashboard")}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-all"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
            >
              🚀 Post Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeePostTask;
