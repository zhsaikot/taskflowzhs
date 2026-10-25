import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Task } from '../../types';
import { STATUS_CONFIG, getExpiryStatus } from '../../utils/taskUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const { setSelectedTaskId } = useTasks();
  const [currentMonth] = useState('October 2026');

  const paddingDays = 4;
  const daysInMonth = 31;

  const calendarDays = Array.from({ length: paddingDays + daysInMonth }, (_, i) => {
    if (i < paddingDays) return null;
    return i - paddingDays + 1;
  });

  const getTasksForDay = (day: number) => {
    const dayStr = `2026-10-${String(day).padStart(2, '0')}`;
    return tasks.filter((t) => {
      const expDay = t.expiryDate ? t.expiryDate.slice(0, 10) : '';
      const startDay = t.startDate ? t.startDate.slice(0, 10) : '';
      return expDay === dayStr || startDay === dayStr;
    });
  };

  return (
    <div className="w-full bg-white dark:bg-obsidian-900 rounded-2xl border border-slate-200 dark:border-white/[0.06] overflow-hidden shadow-sm">
      {/* Calendar Header */}
      <div className="p-4 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between bg-slate-50/50 dark:bg-obsidian-950/80">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {currentMonth}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 font-mono border border-teal-500/30">
            Sprint Phase
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1 rounded-lg border border-slate-200 dark:border-obsidian-750 text-slate-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1 rounded-lg border border-slate-200 dark:border-obsidian-750 text-slate-400 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-white/[0.06] bg-slate-100/50 dark:bg-obsidian-800/60 text-center text-xs font-semibold text-slate-400 py-2.5">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-200/60 dark:divide-white/[0.04] text-xs">
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`pad-${idx}`}
                className="min-h-[105px] bg-slate-50/30 dark:bg-obsidian-950/40 p-2 text-slate-400/40 select-none"
              />
            );
          }

          const dayTasks = getTasksForDay(day);
          const isToday = day === 25;

          return (
            <div
              key={`day-${day}`}
              className={`min-h-[110px] p-2 flex flex-col justify-between transition hover:bg-slate-50/50 dark:hover:bg-obsidian-800/40 ${
                isToday ? 'bg-teal-500/[0.06] ring-1 ring-inset ring-teal-500/30' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-semibold ${
                    isToday
                      ? 'bg-teal-600 text-white shadow-glow-brand'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {day}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Task blocks in this day */}
              <div className="space-y-1 flex-1">
                {dayTasks.slice(0, 3).map((task) => {
                  const config = STATUS_CONFIG[task.status];
                  const expiryInfo = getExpiryStatus(task.expiryDate, task.status);

                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="group/item p-1 px-1.5 rounded-lg border border-slate-200/60 dark:border-white/[0.06] bg-white dark:bg-obsidian-800 shadow-xs hover:border-teal-500/50 cursor-pointer transition flex items-center justify-between"
                      title={`${task.id}: ${task.title}`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass} flex-shrink-0`} />
                        <span className="font-medium text-[11px] truncate text-slate-800 dark:text-slate-200 group-hover/item:text-teal-300">
                          {task.title}
                        </span>
                      </div>
                      {expiryInfo?.isOverdue && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 animate-ping ml-1" />
                      )}
                    </div>
                  );
                })}

                {dayTasks.length > 3 && (
                  <div className="text-[10px] text-teal-400 font-mono text-center font-medium">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
