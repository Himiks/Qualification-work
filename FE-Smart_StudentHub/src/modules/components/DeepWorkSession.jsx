import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const GOAL_TYPES = [
  { type: "Focus Work", color: "bg-indigo-500" },
  { type: "Break", color: "bg-green-500" },
  { type: "Other", color: "bg-yellow-400" },
];

function DeepWorkPlanner() {
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [isActive, setIsActive] = useState(false);
  const [audio] = useState(new Audio("/sounds/focus.mp3"));
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ type: GOAL_TYPES[0].type, description: "" });

  const LOCAL_STORAGE_KEY = "deepWorkGoals";

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setGoals(JSON.parse(stored));
      } catch {
        setGoals([]);
      }
    }
  }, []);

  const saveGoals = (updatedGoals) => {
    setGoals(updatedGoals);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedGoals));
  };

  useEffect(() => {
    let interval;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      audio.pause();
      toast.success("Deep Work session completed!");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleSession = () => {
    if (isActive) {
      setIsActive(false);
      audio.pause();
    } else {
      setIsActive(true);
      audio.loop = true;
      audio.play().catch(() => console.log("Audio playback prevented"));
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const addGoal = () => {
    if (!newGoal.description.trim()) return;
    saveGoals([...goals, { ...newGoal, done: false }]);
    setNewGoal({ type: GOAL_TYPES[0].type, description: "" });
  };

  const toggleGoal = (index) => {
    const updated = goals.map((g, i) =>
      i === index ? { ...g, done: !g.done } : g
    );
    saveGoals(updated);
  };

  const removeGoal = (index) => {
    const updated = goals.filter((_, i) => i !== index);
    saveGoals(updated);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex flex-col items-center bg-indigo-50 rounded-2xl shadow-md p-6 w-full">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2">Deep Work Timer</h2>
        <p className="text-3xl font-mono font-semibold text-gray-800 mb-4 border rounded-lg px-6 py-2 bg-white shadow-sm">
          {formatTime(timeLeft)}
        </p>
        <button
          onClick={toggleSession}
          className={`px-6 py-2 rounded-xl text-white font-semibold shadow-md transition ${
            isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isActive ? "Stop" : "Start"}
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 text-center">Add Goal</h3>
        <div className="flex gap-2 mb-4">
          <select
            value={newGoal.type}
            onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
            className="flex-1 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {GOAL_TYPES.map((g) => (
              <option key={g.type} value={g.type}>{g.type}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Goal description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            className="flex-2 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={addGoal}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold transition"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {goals.length === 0 ? (
            <p className="text-gray-400 italic text-center">No goals yet. Add one above!</p>
          ) : (
            goals.map((goal, i) => {
              const color = GOAL_TYPES.find((b) => b.type === goal.type)?.color;
              return (
                <div
                  key={i}
                  className={`${color} text-white flex justify-between items-center p-3 rounded-xl shadow`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={goal.done}
                      onChange={() => toggleGoal(i)}
                      className="w-5 h-5 accent-white"
                    />
                    <span className={`${goal.done ? "line-through opacity-80" : ""}`}>{goal.description}</span>
                  </div>
                  <button
                    onClick={() => removeGoal(i)}
                    className="text-white font-bold hover:text-red-200"
                  >
                    ✕
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default DeepWorkPlanner;
