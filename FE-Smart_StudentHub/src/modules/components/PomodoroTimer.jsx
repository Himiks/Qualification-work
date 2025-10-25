import React, { useState, useEffect, useRef } from "react";

function PomodoroTimer() {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;
  const LONG_BREAK_INTERVAL = 4;

  const [secondsLeft, setSecondsLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((prev) => prev - 1), 1000);
    } else if (secondsLeft === 0) {
      handleSessionEnd();
    }
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const handleSessionEnd = () => {
    audioRef.current?.play();
    if (mode === "work") {
      const nextCount = pomodoroCount + 1;
      setPomodoroCount(nextCount);
      if (nextCount % LONG_BREAK_INTERVAL === 0) {
        setMode("long");
        setSecondsLeft(LONG_BREAK);
      } else {
        setMode("short");
        setSecondsLeft(SHORT_BREAK);
      }
    } else {
      setMode("work");
      setSecondsLeft(WORK_TIME);
    }
    setIsRunning(false);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setPomodoroCount(0);
    setMode("work");
    setSecondsLeft(WORK_TIME);
  };


  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress =
    mode === "work"
      ? ((WORK_TIME - secondsLeft) / WORK_TIME) * circumference
      : mode === "short"
      ? ((SHORT_BREAK - secondsLeft) / SHORT_BREAK) * circumference
      : ((LONG_BREAK - secondsLeft) / LONG_BREAK) * circumference;

  const modeColors = {
    work: "from-red-400 to-red-600",
    short: "from-green-400 to-green-600",
    long: "from-blue-400 to-blue-600",
  };

  return (
    <div className="bg-white shadow-2xl rounded-3xl p-6 w-80 mx-auto flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="rotate-[-90deg]" width="100%" height="100%">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={`url(#grad)`}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s linear" }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={mode === "work" ? "#f87171" : mode === "short" ? "#34d399" : "#60a5fa"} />
              <stop offset="100%" stopColor={mode === "work" ? "#dc2626" : mode === "short" ? "#059669" : "#1d4ed8"} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold mb-1 capitalize">{mode} session</h2>
          <span className="text-4xl font-mono">{formatTime(secondsLeft)}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-2 rounded-xl text-white font-semibold transition ${
            isRunning
              ? "bg-yellow-500 hover:bg-yellow-600"
              : mode === "work"
              ? "bg-red-500 hover:bg-red-600"
              : mode === "short"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
        >
          Reset
        </button>
      </div>

      <p className="mt-4 text-gray-500 text-sm">
         Pomodoros completed: <span className="font-semibold">{pomodoroCount}</span>
      </p>

      <audio
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        preload="auto"
      />
    </div>
  );
}

export default PomodoroTimer;
