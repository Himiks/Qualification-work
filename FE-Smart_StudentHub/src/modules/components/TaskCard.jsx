import React, { useState, useLayoutEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ // Initialize draggable with task ID
    id: task.id, // Unique identifier for the draggable item
  });

  const cardRef = useRef(null); // Reference to the card element
  const [size, setSize] = useState({ width: 0, height: 0 }); // State to store card size

  useLayoutEffect(() => { // Measure card size when not dragging
    if (cardRef.current && !isDragging) { // only measure when not dragging
      const rect = cardRef.current.getBoundingClientRect(); // get size
      setSize({ width: rect.width, height: rect.height }); // update state
    } // if dragging, size remains unchanged
  }, [isDragging]);

  const style = { // Dynamic styles for the card
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 9999 : "auto",
    position: isDragging ? "fixed" : "relative",
    width: isDragging ? `${size.width}px` : "auto",
    height: isDragging ? `${size.height}px` : "auto",
    pointerEvents: isDragging ? "none" : "auto",
  };
// Render the task card
  return (
    <div
      ref={(node) => { // Set both dnd-kit and local refs
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
