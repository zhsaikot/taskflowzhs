import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { formatDuration } from '../../utils/taskUtils';
import { Play, Pause, RotateCcw, Clock, Plus } from 'lucide-react';

interface PomodoroTimerProps {
  taskId: string;
  loggedSeconds?: number;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ taskId, loggedSeconds = 0 }) => {
  const { logTime } = useTasks();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'stopwatch' | 'pomodoro'>('stopwatch');
  const [pomodoroLeft, setPomodoroLeft] = useState(25 * 60);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (mode === 'stopwatch') {
          setSeconds((s) => s + 1);
        } else {
          setPomodoroLeft((p) => {
            if (p <= 1) {
              setIsActive(false);
              logTime(taskId, 25 * 60);
              return 25 * 60;
            }
            return p - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, mode, taskId, logTime]);

  const handleLogCurrent = () => {
    if (seconds > 0) {
      logTime(taskId, seconds);
      setSeconds(0);
      setIsActive(false);
    }
  };

  const currentDisplayTime = mode === 'stopwatch' ? seconds : pomodoroLeft;
  const mins = Math.floor(currentDisplayTime / 60);
  const secs = currentDisplayTime % 60;

  return (
    <div className="p-3 rounded-xl bg-obsidian-950/90 border border-teal-500/20 text-slate-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Clock className="w-3.5 h-3.5 text-teal-400" />
          <span>Time Tracking</span>
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-obsidian-800 rounded-lg text-[10px]">
          <button
            type="button"
            onClick={() => {
              setMode('stopwatch');
              setIsActive(false);
            }}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              mode === 'stopwatch' ? 'bg-teal-700 text-white font-medium' : 'text-slate-400'
            }`}
          >
            Track
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('pomodoro');
              setIsActive(false);
              setPomodoroLeft(25 * 60);
            }}
            className={`px-2 py-0.5 rounded cursor-pointer ${
              mode === 'pomodoro' ? 'bg-teal-700 text-white font-medium' : 'text-slate-400'
            }`}
          >
            Pomodoro (25m)
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-2xl font-bold tracking-wider text-teal-400">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Total Logged: {formatDuration(loggedSeconds)}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`p-2 rounded-lg cursor-pointer transition ${
              isActive
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-teal-600 hover:bg-teal-500 text-white shadow-glow-brand'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsActive(false);
              setSeconds(0);
              setPomodoroLeft(25 * 60);
            }}
            className="p-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-slate-400 hover:text-white cursor-pointer transition border border-obsidian-700"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {mode === 'stopwatch' && seconds > 0 && (
            <button
              type="button"
              onClick={handleLogCurrent}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer transition"
              title="Add current elapsed seconds to logged time"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
