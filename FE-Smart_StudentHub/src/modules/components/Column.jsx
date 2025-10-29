import React from "react";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

export default function Column({ column, tasks }) {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-80 bg-white rounded-2xl shadow-md border border-gray-200 transition-all hover:shadow-xl"
    >
      <div className="bg-indigo-600 text-white py-3 px-4 rounded-t-2xl text-center font-semibold">
        {column.title}
      </div>
      <div className="flex flex-col gap-3 p-4 overflow-y-auto max-h-[75vh]">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 italic">No tasks</p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
