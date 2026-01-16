import React, { useEffect, useState } from "react";

function timeToMinutes(time) { // convert "HH:MM" to minutes since midnight
  const [h, m] = time.split(":").map(Number);

  if (
    Number.isNaN(h) ||
    Number.isNaN(m) ||
    h < 0 ||
    h > 23 ||
    m < 0 ||
    m > 59
  ) {
    throw new Error("Invalid time format. Use HH:MM (00:00–23:59)");
  }

  return h * 60 + m;
}


function getNowMinutes() { // current time in minutes since midnight
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export default function GlobalTimer() { // shows current time block and progress
  const [activeBlock, setActiveBlock] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => { // update every second
    const interval = setInterval(() => {
      const saved = localStorage.getItem("dayBlocks");
      if (!saved) return;

      const blocks = JSON.parse(saved); // array of { start, end, type, description }
      const now = getNowMinutes(); // current time in minutes since midnight

      const current = blocks.find((b) => { // find active block
        const start = timeToMinutes(b.start);
        const end = timeToMinutes(b.end);
        return now >= start && now < end;
      });

      if (!current) { // no active block
        setActiveBlock(null);
        setProgress(0);
        return;
      }

      const start = timeToMinutes(current.start); // calculate progress
      const end = timeToMinutes(current.end); // in percentage
      const percent = ((now - start) / (end - start)) * 100;

      setActiveBlock(current);
      setProgress(Math.min(100, Math.max(0, percent))); // clamp 0-100
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!activeBlock) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-4">
      <p className="text-sm text-gray-500">Current block</p> {/* Block type and time */}

      <h4 className="font-bold text-indigo-700">
        {activeBlock.type}
      </h4>

      <p className="text-sm text-gray-600">
        {activeBlock.start} – {activeBlock.end} {/* Time range */}
      </p>

      <p className="text-sm mt-1">{activeBlock.description}</p>

      <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all"
          style={{ width: `${progress}%` }} 
        />
      </div>

      <p className="text-xs text-right text-gray-400 mt-1">
        {Math.round(progress)}%
      </p> {/* Progress percentage */}
    </div>
  );
}
