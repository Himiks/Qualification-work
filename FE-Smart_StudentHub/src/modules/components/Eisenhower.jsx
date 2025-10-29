import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./Column";
import employeeService from "../employee/services/employeeService";

const COLUMNS = [
  { id: "High", title: "🔥 Important + Urgent → Do immediately" },
  { id: "Medium", title: "⏰ Important + Not urgent → Schedule" },
  { id: "Low", title: "🤝 Not important + Urgent → Delegate" },
  { id: "Minor", title: "🧘 Not important + Not urgent → Eliminate" },
];

export default function Eisenhower() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const pathParts = window.location.pathname.split("/");
        const techniqueName = pathParts[pathParts.length - 2];
        if (!techniqueName) return;

        const taskList = await employeeService.getAllTasksByTechniqueName(techniqueName);

        if (!Array.isArray(taskList)) {
          console.error("Expected an array but got:", taskList);
          setTasks([]);
          return;
        }

        const formattedTasks = taskList.map((taskData) => {
          let status = "Low";
          switch (taskData.priority?.toLowerCase()) {
            case "high": status = "High"; break;
            case "medium": status = "Medium"; break;
            case "low": status = "Low"; break;
            case "minor": status = "Minor"; break;
            default: status = "Low";
          }

          return {
            id: String(taskData.id),
            title: taskData.title,
            description: taskData.description || "No description",
            status,
            raw: taskData,
          };
        });

        setTasks(formattedTasks);
      } catch (err) {
        console.error("Error loading tasks:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;
    const movedTask = tasks.find((t) => t.id === taskId);
    if (!movedTask) return;

    const oldStatus = movedTask.status;
    if (oldStatus === newStatus) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      const updatedTask = { ...movedTask.raw, priority: newStatus.toUpperCase() };
      await employeeService.updateTask(movedTask.id, updatedTask);
      console.log(`✅ Task ${movedTask.title} updated to ${newStatus}`);
    } catch (err) {
      console.error("❌ Failed to update task:", err);
      alert("Failed to update task priority on server!");
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: oldStatus } : task
        )
      );
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading Eisenhower matrix...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-10">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-indigo-700 tracking-tight">
        Eisenhower Matrix
      </h2>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap justify-center gap-8">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
