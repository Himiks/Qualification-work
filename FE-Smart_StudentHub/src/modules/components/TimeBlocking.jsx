import React, { useState, useEffect } from "react";

const BLOCK_TYPES = [ // Define block types with colors
  { type: "Focus Work", color: "bg-indigo-400" },
  { type: "Meeting", color: "bg-yellow-400" },
  { type: "Rest", color: "bg-green-400" },
];

function DayPlanner() { // Main component for daily planner
  const [blocks, setBlocks] = useState(() => { // Load blocks from localStorage
    const saved = localStorage.getItem("dayBlocks");// get saved blocks
    return saved ? JSON.parse(saved) : [];
  });
  const [newBlock, setNewBlock] = useState({ // State for new block input
    type: BLOCK_TYPES[0].type,
    start: "09:00",
    end: "10:00",
    description: "",
  });

  useEffect(() => { // Save blocks to localStorage on change
    localStorage.setItem("dayBlocks", JSON.stringify(blocks));
  }, [blocks]);

  const addBlock = () => { // Add new block to the list
    if (!newBlock.description.trim()) return; // require description
    setBlocks([...blocks, { ...newBlock }]);
    setNewBlock({ ...newBlock, description: "" });
  };

  const removeBlock = (index) => { // Remove block by index
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  // Render the component

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
     <h2 className="flex items-center justify-center text-3xl font-bold text-indigo-700 gap-2">
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
        Daily Planner
      </h2>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow space-y-4">
        <h3 className="text-xl font-semibold text-gray-700 text-center">Add Block</h3>

        <div className="flex gap-2">
          <select
            value={newBlock.type}
            onChange={(e) => setNewBlock({ ...newBlock, type: e.target.value })} // Block type selector
            className="flex-1 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {BLOCK_TYPES.map((b) => (
              <option key={b.type} value={b.type}>{b.type}</option>
            ))}
          </select>
          <input
            type="time"
            value={newBlock.start}
            onChange={(e) => setNewBlock({ ...newBlock, start: e.target.value })} // Start time input
            className="rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="time"
            value={newBlock.end}
            onChange={(e) => setNewBlock({ ...newBlock, end: e.target.value })} // End time input
            className="rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <input
          type="text"
          placeholder="Description"
          value={newBlock.description}
          onChange={(e) => setNewBlock({ ...newBlock, description: e.target.value })} // Description input
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={addBlock} // Add block button
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold transition"
        >
          Add Block
        </button>
      </div>

      <div className="space-y-3">
        {blocks.length === 0 ? ( // No blocks message
          <p className="text-gray-400 italic text-center">Your schedule is empty. Add some blocks!</p>
        ) : (
          blocks.map((block, i) => {
            const color = BLOCK_TYPES.find((b) => b.type === block.type)?.color;
            return (
              <div
                key={i}
                className={`${color} text-white flex justify-between items-center p-3 rounded-xl shadow`}
              >
                <div>
                  <p className="font-semibold">{block.type}</p>
                  <p>{block.start} - {block.end}</p>
                  <p className="text-sm">{block.description}</p>
                </div>
                <button
                  onClick={() => removeBlock(i)} // Remove block button
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
  );
}

export default DayPlanner;
