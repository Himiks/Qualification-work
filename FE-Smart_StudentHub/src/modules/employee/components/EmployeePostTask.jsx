import React, { useEffect, useState } from "react";
import employeeService from "../services/employeeService";
import { getAllTechniques } from "../../technique/services/techniqueService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EmployeePostTask() { // Employee task posting component
  const [task, setTask] = useState({ // Task state
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
    technique: "NONE",
  });

  const [techniques, setTechniques] = useState([]); // Available techniques
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => { // Fetch techniques on mount
    const fetchTechniques = async () => {
      try {
        const data = await getAllTechniques();
        setTechniques(data);
      } catch (err) {
        console.error("Error fetching techniques:", err);
      }
    };
    fetchTechniques();
  }, []);

  const handleChange = (e) => { // Handle form input changes
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => { // Submit new task
    e.preventDefault();
    try {
      await employeeService.postTask(task);
      toast.success("Task created successfully!");
      navigate("/employee/dashboard");
    } catch (err) {
      console.error("Error posting task:", err);
      toast.error("Failed to post task");
    }
  };

  // Render the task posting form
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center items-start py-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          <i className="fa-solid fa-circle-plus text-cyan-500 mr-2 transition-transform duration-200 hover:scale-110"></i> Create New Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5"> {/* Task creation form */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={task.title}
              onChange={handleChange} // Handle input change
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange} // Handle input change
              className="border border-gray-300 p-3 w-full rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              placeholder="Enter task description"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate} // Handle input change
              onChange={handleChange} 
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={task.priority} // Handle input change
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              required
            >
              <option value="LOW">LOW</option> {/* Priority options */}
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="MINOR">MINOR</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Technique</label>
            <select
              name="technique"
              value={task.technique} // Handle input change
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              required
            >
              <option value="NONE">None</option>
              {techniques.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/employee/dashboard")} // Back to dashboard
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-all"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
            >
                <i className="fa-solid fa-floppy-disk"></i> Post Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeePostTask;
