import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./Column"; 

const COLUMNS = [
  { id: "High", title: "Important + Urgent → Do immediately" },
  { id: "Medium", title: "Important + Not urgent → Schedule" },
  { id: "Low", title: "Not important + Urgent → Delegate" },
  { id: "Eliminate", title: "Not important + Not urgent → Eliminate" },
];

const INITIAL_TASKS = [
  {
    id: "1",
    title: "Research Project",
    description: "Gather requirements and create initial documentation",
    status: "Low",
  },
  {
    id: "2",
    title: "Design System",
    description: "Create component library and design tokens",
    status: "Low",
  },
  {
    id: "3",
    title: "API Integration",
    description: "Implement REST API endpoints",
    status: "High",
  },
  {
    id: "4",
    title: "Testing",
    description: "Write unit tests for core functionality",
    status: "Medium",
  },
];

export default function Eisenhower() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

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

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">
        Eisenhower Matrix
      </h2>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 justify-center">
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
