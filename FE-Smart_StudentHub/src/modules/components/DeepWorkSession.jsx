import React, { useEffect, useState } from "react";

function DeepWorkSession() {
  const [timeLeft, setTimeLeft] = useState(90 * 60);
  const [isActive, setIsActive] = useState(false);
  const [audio] = useState(new Audio("/sounds/focus.mp3"));
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

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
      alert("🎯 Deep Work session completed!");
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
    if (!newGoal.trim()) return;
    const updated = [...goals, { text: newGoal, done: false }];
    saveGoals(updated);
    setNewGoal("");
  };

  const toggleGoal = (index) => {
    const updated = goals.map((g, i) =>
      i === index ? { ...g, done: !g.done } : g
    );
    saveGoals(updated);
  };

  const deleteGoal = (index) => {
    const updated = goals.filter((_, i) => i !== index);
    saveGoals(updated);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto space-y-8">
   
      <div className="flex flex-col items-center bg-indigo-50 rounded-2xl shadow-lg p-8 w-full">
        <h2 className="text-3xl font-bold mb-4 text-indigo-700">Deep Work Session</h2>
        <p className="text-5xl font-mono text-gray-800 mb-6">{formatTime(timeLeft)}</p>

        <button
          onClick={toggleSession}
          className={`px-8 py-3 rounded-xl text-white text-lg font-semibold shadow-md transition ${
            isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isActive ? "Stop" : "Start"}
        </button>

        <p className="text-gray-500 text-sm italic mt-4 text-center">
          {isActive ? "Focus deeply... distractions off!" : "Work deeply for 60–90 minutes."}
        </p>
      </div>

    
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">📝 Goals for this session</h3>

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Add a sub-task..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="flex-grow border border-gray-300 rounded-l-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={addGoal}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-r-xl transition"
          >
            Add
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {goals.length === 0 ? (
            <p className="text-gray-400 italic text-center mt-4">No goals yet — add one below.</p>
          ) : (
            goals.map((goal, i) => (
              <div
                key={i}
                className={`flex items-center justify-between gap-3 p-3 rounded-xl transition ${
                  goal.done ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer flex-grow">
                  <input
                    type="checkbox"
                    checked={goal.done}
                    onChange={() => toggleGoal(i)}
                    className="w-5 h-5 accent-indigo-500"
                  />
                  <span className={`${goal.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {goal.text}
                  </span>
                </label>
                <button
                  onClick={() => deleteGoal(i)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DeepWorkSession;
