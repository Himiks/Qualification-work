import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./Column";
import employeeService from "../employee/services/employeeService";

const COLUMNS = [
  { id: "High", title: "Important + Urgent → Do immediately" },
  { id: "Medium", title: "Important + Not urgent → Schedule" },
  { id: "Low", title: "Not important + Urgent → Delegate" },
  { id: "Minor", title: "Not important + Not urgent → Eliminate" },
];

export default function Eisenhower() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загружаем все задачи по технике (например: eisenhower)
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const pathParts = window.location.pathname.split("/");
        const techniqueName = pathParts[pathParts.length - 2]; // например /techniques/eisenhower/15

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
            case "high":
              status = "High";
              break;
            case "medium":
              status = "Medium";
              break;
            case "low":
              status = "Low";
              break;
            case "minor":
              status = "Minor";
              break;
            default:
              status = "Low";
          }

          return {
            id: String(taskData.id),
            title: taskData.title,
            description: taskData.description || "No description",
            status,
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

  // Обработка перетаскивания задач между колонками
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading Eisenhower matrix...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
        Eisenhower Matrix
      </h2>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 justify-center flex-wrap">
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
