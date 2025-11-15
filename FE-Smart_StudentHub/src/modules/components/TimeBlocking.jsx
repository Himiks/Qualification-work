import React, { useState } from "react";

const BLOCKS = ["Morning", "Afternoon", "Evening"];

function TimeBlocking() {
  const [goals, setGoals] = useState(() => {
  
    const saved = localStorage.getItem("timeBlockingGoals");
    return saved ? JSON.parse(saved) : [];
  });
  const [newGoal, setNewGoal] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("Morning");

  const saveGoals = (updatedGoals) => {
    setGoals(updatedGoals);
    localStorage.setItem("timeBlockingGoals", JSON.stringify(updatedGoals));
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    const updated = [...goals, { text: newGoal, done: false, block: selectedBlock }];
    saveGoals(updated);
    setNewGoal("");
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
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto mt-8 gap-8 px-4">
      {/* Левая колонка — блоки времени */}
      <div className="flex-1 min-w-[220px] grid grid-cols-1 gap-6">
        {BLOCKS.map((block) => (
          <div
            key={block}
            className="bg-indigo-50 rounded-2xl shadow-lg p-6 transition hover:scale-105"
          >
            <h3 className="text-xl font-bold mb-3 text-indigo-700">{block}</h3>
            <ul className="list-decimal ml-6 space-y-2">
              {goals
                .filter((g) => g.block === block)
                .map((goal, i) => (
                  <li
                    key={i}
                    className={`flex justify-between items-center ${
                      goal.done ? "line-through text-gray-400" : "text-gray-800"
                    }`}
                  >
                    <span>{goal.text}</span>
                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        checked={goal.done}
                        onChange={() => toggleGoal(goals.indexOf(goal))}
                        className="w-5 h-5 accent-indigo-500"
                      />
                      <button
                        onClick={() => removeGoal(goals.indexOf(goal))}
                        className="text-red-500 font-bold hover:text-red-700 transition"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      
      <div className="flex-shrink-0 w-full md:w-[380px] bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          📝 Add Goal
        </h3>

        <select
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
        >
          {BLOCKS.map((block) => (
            <option key={block} value={block}>
              {block}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
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

        {goals.length === 0 && (
          <p className="text-gray-400 italic text-center mt-2">
            No goals yet — add one above.
          </p>
        )}
      </div>
    </div>
  );
}

export default TimeBlocking;
