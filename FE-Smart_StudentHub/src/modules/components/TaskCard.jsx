import React, { useState, useLayoutEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const cardRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (cardRef.current && !isDragging) {
      const rect = cardRef.current.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    }
  }, [isDragging]);

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 9999 : "auto",
    position: isDragging ? "fixed" : "relative",
    width: isDragging ? `${size.width}px` : "auto",
    height: isDragging ? `${size.height}px` : "auto",
    pointerEvents: isDragging ? "none" : "auto",
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        cardRef.current = node;
      }}
      {...attributes}
      {...listeners}
      style={style}
      className={`rounded-xl bg-indigo-50 p-4 shadow-sm cursor-grab hover:shadow-md hover:bg-indigo-100 active:cursor-grabbing transition-all ${
        isDragging ? "scale-105 shadow-xl ring-2 ring-indigo-400" : ""
      }`}
    >
      <h3 className="font-semibold text-indigo-800">{task.title}</h3>
      <p className="text-sm text-gray-600 mt-1 line-clamp-3">{task.description}</p>
    </div>
  );
}
