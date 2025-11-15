import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import employeeService from "../services/employeeService";
import { getAllTechniques } from "../../technique/services/techniqueService";

function EmployeeUpdateTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
    taskStatus: "PENDING",
    technique: "NONE",
  });

  const [techniques, setTechniques] = useState([]);
  const priorities = ["LOW", "MEDIUM", "HIGH", "MINOR"];
  const statuses = ["PENDING", "IN_PROGRESS", "DEFERRED", "COMPLETED", "CANCELLED"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskData = await employeeService.getTaskById(id);
        setTask({
          title: taskData.title || "",
          description: taskData.description || "",
          dueDate: taskData.dueDate ? taskData.dueDate.split("T")[0] : "",
          priority: taskData.priority || "LOW",
          taskStatus: taskData.taskStatus || "PENDING",
          technique: taskData.technique || "NONE",
        });

        const techniquesData = await getAllTechniques();
        setTechniques(techniquesData);
      } catch (err) {
        console.error("Error fetching task or techniques:", err);
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
      await employeeService.updateTask(id, task);
      alert("✅ Task updated successfully!");
      navigate("/employee/dashboard");
    } catch (err) {
      console.error("Error updating task:", err);
      alert("❌ Failed to update task!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center items-start py-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          ✏️ Update Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
         
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={task.title}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
              placeholder="Enter task title"
              required
            />
          </div>

       
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg h-28 resize-none focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
              placeholder="Enter task description"
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
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
              required
            />
          </div>

          
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
              required
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Technique</label>
            <select
              name="technique"
              value={task.technique}
              onChange={handleChange}
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
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
              className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none"
              required
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

         
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
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md"
            >
              💾 Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeUpdateTask;
