import React from "react";
import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="rounded-md bg-neutral-700 p-3 text-neutral-100 shadow-md cursor-grab hover:bg-neutral-600 transition"
    >
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-neutral-300">{task.description}</p>
    </div>
  );
}
