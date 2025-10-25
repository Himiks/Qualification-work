import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTechniqueByName } from "../modules/technique/services/techniqueService";
import employeeService from "../modules/employee/services/employeeService";
import PomodoroTimer from "../modules/components/PomodoroTimer";
import DeepWorkSession from "../modules/components/DeepWorkSession";
import TimeBlocking from "../modules/components/TimeBlocking";
import Eisenhower from "../modules/components/Eisenhower";

function TechniqueDetail() {
  const { techniqueName, taskId } = useParams();
  const [technique, setTechnique] = useState(null);
  const [task, setTask] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const techData = await getTechniqueByName(techniqueName);
        setTechnique(techData);

        if (taskId) {
          const taskData = await employeeService.getTaskById(taskId);
          setTask(taskData);
        }

        const savedSteps = localStorage.getItem(`checkedSteps_${techniqueName}`);
        if (savedSteps) {
          setCheckedSteps(JSON.parse(savedSteps));
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
        setTimeout(() => setLoaded(true), 50);
      }
    };

    loadData();
  }, [techniqueName, taskId]);

  const handleStepCheck = (index) => {
    const updated = { ...checkedSteps, [index]: !checkedSteps[index] };
    setCheckedSteps(updated);
    localStorage.setItem(`checkedSteps_${techniqueName}`, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading technique details...
      </div>
    );
  }

  if (!technique) {
    return (
      <div className="text-center text-red-500 mt-10 text-xl">
        Technique not found
      </div>
    );
  }

  const formattedName = technique.name
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const stepsArray = Array.isArray(technique.steps)
    ? technique.steps
    : technique.steps?.split(/\d+\.\s/).filter(Boolean) || [];

  const isPomodoro = formattedName === "Pomodoro";
  const isDeepWork = formattedName === "Deep Work";
  const isTimeBlocking = formattedName === "Time Blocking";
  const isEisenhower = formattedName === "Eisenhower";

  return (
  <>
    {!isEisenhower ? (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center px-4">
        <div
          className={`bg-white shadow-2xl rounded-2xl w-full max-w-6xl flex flex-col md:flex-row gap-8 p-6 md:p-8 transition-all duration-700 ease-out
            transform ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          {/* Левая колонка */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-center md:text-left mb-4 text-gray-800">
              ⚙️ {formattedName}
            </h1>

            {task && (
              <>
                <p className="text-center md:text-left mb-2 text-gray-700 text-lg">
                  Task: <span className="font-semibold">{task.title}</span>
                </p>
                <p className="text-center md:text-left mb-2 text-gray-500 text-md">
                  Description: <span className="font-semibold">{task.description}</span>
                </p>
                <p className="text-center md:text-left mb-4 text-gray-500">
                  Due Date:{" "}
                  <span className="font-semibold">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No date"}
                  </span>
                </p>
              </>
            )}

            <p className="text-gray-700 mb-6 text-lg">{technique.description}</p>

            {stepsArray.length > 0 && (
              <ul className="mt-6 space-y-3 text-gray-800">
                {stepsArray.map((step, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-3 p-2 rounded-lg transition ${
                      checkedSteps[index]
                        ? "bg-green-50 line-through text-gray-400"
                        : "hover:bg-indigo-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedSteps[index]}
                      onChange={() => handleStepCheck(index)}
                      className="w-5 h-5 accent-indigo-500 cursor-pointer"
                    />
                    <span>{step.trim()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Правая колонка */}
          <div className="flex-1 flex flex-col justify-center items-center gap-6">
            {isPomodoro && (
              <>
                <PomodoroTimer />
                <p className="text-gray-500 text-sm italic text-center mt-2">
                  Focus for 25 minutes, then take a 5-minute break.
                </p>
              </>
            )}

            {isDeepWork && <DeepWorkSession />}
            {isTimeBlocking && <TimeBlocking />}
          </div>
        </div>
      </div>
    ) : (
      <Eisenhower />
    )}
  </>
);

}

export default TechniqueDetail;
