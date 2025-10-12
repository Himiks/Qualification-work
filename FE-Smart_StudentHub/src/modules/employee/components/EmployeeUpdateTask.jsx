import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import employeeService from "../services/employeeService";

function EmployeeUpdateTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const tasks = await employeeService.getAllTasksByUserId();
      const foundTask = tasks.find((t) => t.id === Number(id));
      setTask(foundTask);
      setStatus(foundTask?.taskStatus || "");
    } catch (err) {
      console.error("Error fetching task:", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await employeeService.updateTaskStatus(id, status);
      alert("✅ Task status updated successfully!");
      navigate("/employee/dashboard");
    } catch (err) {
      console.error("Error updating task:", err);
      alert("❌ Failed to update task status");
    }
  };

  if (!task) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        ✏️ Update Task Status
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            value={task.title}
            disabled
            className="border p-2 w-full rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={task.description}
            disabled
            className="border p-2 w-full rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-semibold">Task Status</label>
          <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  className="border p-2 w-full rounded"
  required
>
  <option value="PENDING">PENDING</option>
  <option value="IN_PROGRESS">IN_PROGRESS</option>
  <option value="COMPLETED">COMPLETED</option>
  <option value="DEFERRED">DEFERRED</option>
  <option value="CANCELLED">CANCELLED</option>
</select>

        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Status
        </button>
      </form>
    </div>
  );
}

export default EmployeeUpdateTask;
