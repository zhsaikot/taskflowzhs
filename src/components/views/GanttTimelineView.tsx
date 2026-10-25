import React, { useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Task } from '../../types';
import { STATUS_CONFIG, calculateSubtaskRollup } from '../../utils/taskUtils';
import { PriorityBadge } from '../common/PriorityBadge';
import { AssigneeAvatar } from '../common/AssigneeAvatar';
import { Calendar } from 'lucide-react';

interface GanttTimelineViewProps {
  tasks: Task[];
}

export const GanttTimelineView: React.FC<GanttTimelineViewProps> = ({ tasks }) => {
  const { setSelectedTaskId } = useTasks();

  const timelineDays = useMemo(() => {
    const start = new Date('2026-10-20T00:00:00Z');
    const days: Date[] = [];
    for (let i = 0; i < 16; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  const startDateWindow = timelineDays[0].getTime();
  const endDateWindow = timelineDays[timelineDays.length - 1].getTime() + 86400000;
  const totalWindowMs = endDateWindow - startDateWindow;

  const calculateBar = (task: Task) => {
    const taskStart = task.startDate ? new Date(task.startDate).getTime() : startDateWindow;
    const taskEnd = task.expiryDate ? new Date(task.expiryDate).getTime() : taskStart + 86400000 * 3;

    const clampedStart = Math.max(taskStart, startDateWindow);
    const clampedEnd = Math.min(taskEnd, endDateWindow);

    if (clampedEnd < startDateWindow || clampedStart > endDateWindow) {
      return { left: '0%', width: '0%', isVisible: false };
    }

    const leftPercent = ((clampedStart - startDateWindow) / totalWindowMs) * 100;
    const widthPercent = Math.max(4, ((clampedEnd - clampedStart) / totalWindowMs) * 100);

    return {
      left: `${leftPercent}%`,
      width: `${Math.min(100 - leftPercent, widthPercent)}%`,
      isVisible: true,
    };
  };

  return (
    <div className="w-full bg-white dark:bg-obsidian-900 rounded-2xl border border-slate-200 dark:border-white/[0.06] overflow-hidden shadow-sm pb-8">
      {/* Top Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between bg-slate-50/50 dark:bg-obsidian-950/80">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Sprint Timeline & Dependencies
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Oct 20 — Nov 05, 2026
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
          <span>Horizontal bar shows Start Date → Expiry Date</span>
        </div>
      </div>

      {/* Gantt Grid Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[950px]">
          {/* Days Header */}
          <div className="grid grid-cols-12 border-b border-slate-200 dark:border-white/[0.06] bg-slate-100/60 dark:bg-obsidian-800/80 text-[11px] font-mono font-medium text-slate-500">
            <div className="col-span-4 p-3 border-r border-slate-200 dark:border-white/[0.06]">
              Task & Assignee
            </div>
            <div className="col-span-8 grid grid-cols-16 divide-x divide-slate-200/50 dark:divide-white/[0.04]">
              {timelineDays.map((d, idx) => {
                const isToday = d.toISOString().slice(0, 10) === '2026-10-25';
                return (
                  <div
                    key={idx}
                    className={`py-2 text-center text-[10px] ${
                      isToday
                        ? 'bg-teal-500/20 text-teal-300 font-bold border-b-2 border-teal-400'
                        : ''
                    }`}
                  >
                    <div>{d.toLocaleDateString('en-US', { weekday: 'narrow' })}</div>
                    <div>{d.getDate()}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-200/60 dark:divide-white/[0.04]">
            {tasks.map((task) => {
              const bar = calculateBar(task);
              const config = STATUS_CONFIG[task.status];
              const rollup = calculateSubtaskRollup(task);

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className="grid grid-cols-12 hover:bg-slate-50/60 dark:hover:bg-obsidian-800/60 transition cursor-pointer group text-xs"
                >
                  {/* Left Column: Task Info */}
                  <div className="col-span-4 p-3 flex items-center justify-between border-r border-slate-200 dark:border-white/[0.06] truncate">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[11px] font-semibold text-slate-400">
                        {task.id}
                      </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-teal-300 truncate">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <PriorityBadge priority={task.priority} size="sm" />
                      <AssigneeAvatar assigneeIds={task.assignees} size="sm" />
                    </div>
                  </div>

                  {/* Right Column: Timeline Bar */}
                  <div className="col-span-8 relative py-3 px-1 flex items-center">
                    {/* Background day grid lines */}
                    <div className="absolute inset-0 grid grid-cols-16 divide-x divide-slate-100 dark:divide-white/[0.02] pointer-events-none" />

                    {/* Today indicator vertical line */}
                    <div
                      className="absolute top-0 bottom-0 border-r-2 border-teal-500/50 z-10 pointer-events-none"
                      style={{ left: '31.25%' }}
                    />

                    {/* Timeline Bar */}
                    {bar.isVisible && (
                      <div
                        className="relative h-7 rounded-lg shadow-sm flex items-center px-2 text-white text-[11px] font-medium overflow-hidden transition-all group-hover:brightness-110"
                        style={{
                          left: bar.left,
                          width: bar.width,
                          backgroundColor: config.color,
                        }}
                      >
                        {rollup && (
                          <div
                            className="absolute top-0 left-0 bottom-0 bg-black/25"
                            style={{ width: `${rollup.percentage}%` }}
                          />
                        )}
                        <span className="relative z-10 truncate font-semibold drop-shadow-sm">
                          {task.title}
                        </span>
                        {rollup && (
                          <span className="relative z-10 ml-auto pl-1 font-mono text-[10px] opacity-90 drop-shadow-sm">
                            {rollup.percentage}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
