import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "./Column";
import employeeService from "../employee/services/employeeService";
import { toast } from "react-toastify";


const COLUMNS = [ // Eisenhower matrix columns
  { id: "High", title: "Important + Urgent → Do immediately" },
  { id: "Medium", title: "Important + Not urgent → Schedule" },
  { id: "Low", title: "Not important + Urgent → Delegate" },
  { id: "Minor", title: "Not important + Not urgent → Eliminate" },
];

export default function Eisenhower() { // Eisenhower matrix component
  const [tasks, setTasks] = useState([]); // Tasks state
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => { // Load tasks on mount
    const fetchTasks = async () => { // Fetch tasks function
      try {
        const pathParts = window.location.pathname.split("/"); // Extract technique name from URL
        const techniqueName = pathParts[pathParts.length - 2]; // Assuming URL ends with /technique/:techniqueName/eisenhower
        if (!techniqueName) return;

        const taskList = await employeeService.getAllTasksByTechniqueName(techniqueName); // Fetch tasks by technique name

        if (!Array.isArray(taskList)) { // Validate response
          console.error("Expected an array but got:", taskList);
          setTasks([]);
          return;
        }

        const formattedTasks = taskList.map((taskData) => { // Format tasks for Eisenhower matrix
          let status = "Low";
          switch (taskData.priority?.toLowerCase()) { // Map priority to status
            case "high": status = "High"; break;
            case "medium": status = "Medium"; break;
            case "low": status = "Low"; break;
            case "minor": status = "Minor"; break;
            default: status = "Low";
          }

          return { // Return formatted task object
            id: String(taskData.id),
            title: taskData.title,
            description: taskData.description || "No description",
            status,
            raw: taskData,
          };
        });

        setTasks(formattedTasks); // Update tasks state
      } catch (err) {
        console.error("Error loading tasks:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []); // Empty dependency array to run once on mount

  async function handleDragEnd(event) { // Handle drag end event
    const { active, over } = event; // active the item being dragged and over the drop target
    if (!over) return;

    const taskId = active.id; // ID of dragged task
    const newStatus = over.id; // ID of target column
    const movedTask = tasks.find((t) => t.id === taskId); // Find moved task
    if (!movedTask) return; 

    const oldStatus = movedTask.status; // Previous status
    if (oldStatus === newStatus) return;

    setTasks((prev) => // Optimistically update task status
      prev.map((task) => // Update task status in state
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    try {
      const updatedTask = { ...movedTask.raw, priority: newStatus.toUpperCase() }; // Prepare updated task data
      await employeeService.updateTask(movedTask.id, updatedTask); // Send update to server
      console.log(`Task ${movedTask.title} updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update task:", err);
      toast.error("Failed to update task priority on server!");
      setTasks((prev) =>
        prev.map((task) => // Revert task status on failure
          task.id === taskId ? { ...task, status: oldStatus } : task
        )
      );
    }
  }

  if (loading) {
    // Show loading state
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

      <DndContext onDragEnd={handleDragEnd}> {/* Drag-and-drop context */}
        <div className="flex flex-wrap justify-center gap-8">
          {COLUMNS.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)} // Filter tasks by column
            />
          ))}
        </div>
      </DndContext>

      
      
    </div>
    

              
  );
}
