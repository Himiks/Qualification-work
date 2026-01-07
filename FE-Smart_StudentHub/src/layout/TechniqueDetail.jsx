import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTechniqueByName } from "../modules/technique/services/techniqueService";
import employeeService from "../modules/employee/services/employeeService";
import PomodoroTimer from "../modules/components/PomodoroTimer";
import DeepWorkSession from "../modules/components/DeepWorkSession";
import TimeBlocking from "../modules/components/TimeBlocking";
import Eisenhower from "../modules/components/Eisenhower";

function TechniqueDetail() {
  const { techniqueName, taskId } = useParams(); // taskId is optional
  const [technique, setTechnique] = useState(null); // Technique details
  const [task, setTask] = useState(null); // Task details
  const [checkedSteps, setCheckedSteps] = useState({}); // Track checked steps
  const [loading, setLoading] = useState(true); // Loading state
  const [loaded, setLoaded] = useState(false); // For transition effect

  useEffect(() => { // Load technique and task data
    const loadData = async () => {
      try {
        const techData = await getTechniqueByName(techniqueName);
        setTechnique(techData);

        if (taskId) { // If taskId is provided, fetch task details
          const taskData = await employeeService.getTaskById(taskId);
          setTask(taskData);
        }

        const savedSteps = localStorage.getItem(`checkedSteps_${techniqueName}`); // Load saved steps
        if (savedSteps) {
          setCheckedSteps(JSON.parse(savedSteps)); // Parse and set checked steps
        }
      } catch (err) { // Handle errors
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
        setTimeout(() => setLoaded(true), 50);
      }
    };

    loadData(); // Invoke data loading
  }, [techniqueName, taskId]);

  const handleStepCheck = (index) => { // Toggle step checked state
    const updated = { ...checkedSteps, [index]: !checkedSteps[index] };
    setCheckedSteps(updated);
    localStorage.setItem(`checkedSteps_${techniqueName}`, JSON.stringify(updated));
  };

  if (loading) { // Show loading state
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading technique details...
      </div>
    );
  }

  if (!technique) { // Handle technique not found
    return (
      <div className="text-center text-red-500 mt-10 text-xl">
        Technique not found
      </div>
    );
  }

  const formattedName = technique.name // Format technique name
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const stepsArray = Array.isArray(technique.steps) // Handle steps format
    ? technique.steps
    : technique.steps?.split(/\d+\.\s/).filter(Boolean) || []; // Split by numbered list

  const isPomodoro = formattedName === "Pomodoro"; // Determine which component to show
  const isDeepWork = formattedName === "Deep Work";
  const isTimeBlocking = formattedName === "Time Blocking";
  const isEisenhower = formattedName === "Eisenhower";

return (
  <>
    {!isEisenhower ? ( // Show technique details unless Eisenhower
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#ecfeff] px-6 py-20">
        <div
          className={`max-w-7xl mx-auto transition-all duration-700 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-[0_30px_80px_rgba(79,70,229,0.15)] space-y-8">
              
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 flex items-center gap-4">
            <span className="inline-block text-indigo-500">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
</span>        {formattedName} 
              </h1>

              {task && (
                <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-100 to-cyan-100 border border-indigo-200 space-y-2">
                  <p className="text-lg text-gray-800">
                    <span className="font-semibold text-indigo-600">Task:</span>{" "}
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {task.description || "No description"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Due:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No date"}
                  </p>
                </div>
              )}

              <p className="text-gray-700 text-lg leading-relaxed">
                {technique.description}
              </p>

              {stepsArray.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stepsArray.map((step, index) => (
                    <div
                      key={index}
                      onClick={() => handleStepCheck(index)}
                      className={`flex gap-4 items-start p-4 rounded-2xl border cursor-pointer transition-all
                        ${
                          checkedSteps[index]
                            ? "bg-green-100 border-green-300 text-gray-400 line-through"
                            : "bg-white border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 hover:scale-[1.03]"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!checkedSteps[index]}
                        onChange={() => handleStepCheck(index)}
                        className="mt-1 w-5 h-5 accent-indigo-500"
                      />
                      <span className="text-sm text-gray-800 font-medium">
                        {step.trim()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 shadow-[0_30px_80px_rgba(6,182,212,0.15)] flex flex-col items-center justify-center gap-10">
              {isPomodoro && <PomodoroTimer />} {/* Pomodoro Timer */}
              {isDeepWork && <DeepWorkSession />} {/* Deep Work Session */}
              {isTimeBlocking && <TimeBlocking />} {/* Time Blocking */}
            </div>

          </div>
        </div>
      </div>
    ) : (
      <Eisenhower /> // Eisenhower component
    )}
  </>
);

}

export default TechniqueDetail;
