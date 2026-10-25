import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskRow } from '../tasks/TaskRow';
import { TaskStatus, Task } from '../../types';
import { STATUS_CONFIG } from '../../utils/taskUtils';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';

interface ListViewProps {
  tasks: Task[];
}

export const ListView: React.FC<ListViewProps> = ({ tasks }) => {
  const { setIsCreateModalOpen, addTask, currentUser } = useTasks();

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    closed: false,
  });

  const [quickAddStatus, setQuickAddStatus] = useState<TaskStatus | null>(null);
  const [quickAddTitle, setQuickAddTitle] = useState('');

  const toggleSection = (status: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleQuickAddSubmit = (status: TaskStatus) => {
    if (!quickAddTitle.trim()) {
      setQuickAddStatus(null);
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + 3);
    addTask({
      title: quickAddTitle.trim(),
      description: '',
      status,
      priority: 'normal',
      assignees: [currentUser.id],
      startDate: new Date().toISOString(),
      expiryDate: d.toISOString(),
      tags: [],
      spaceId: 'sp_eng',
      listId: 'lst_frontend',
    });
    setQuickAddTitle('');
    setQuickAddStatus(null);
  };

  const statuses: TaskStatus[] = ['not_started', 'planning', 'in_progress', 'done', 'closed'];

  return (
    <div className="w-full space-y-6 pb-20">
      {/* Table Column Titles */}
      <div className="hidden md:flex items-center gap-3 px-4 py-2 text-[11px] font-semibold text-slate-400 dark:text-teal-400/60 uppercase tracking-wider border-b border-slate-200 dark:border-white/[0.06]">
        <div className="w-4 flex-shrink-0" />
        <div className="w-18 flex-shrink-0">ID</div>
        <div className="flex-1 min-w-0 pr-4">Task Name</div>
        <div className="w-24 flex-shrink-0">Subtasks</div>
        <div className="w-28 flex-shrink-0">Status</div>
        <div className="w-12 flex-shrink-0 text-center">Priority</div>
        <div className="w-32 flex-shrink-0 text-right">Due Date</div>
        <div className="w-20 flex-shrink-0 text-right">Assignees</div>
        <div className="w-8 flex-shrink-0" />
      </div>

      {/* Grouped Status Sections */}
      {statuses.map((statusKey) => {
        const config = STATUS_CONFIG[statusKey];
        const groupTasks = tasks.filter((t) => t.status === statusKey);
        const isCollapsed = Boolean(collapsedSections[statusKey]);

        return (
          <div
            key={statusKey}
            className="rounded-2xl border border-slate-200/80 dark:border-white/[0.06] bg-white/40 dark:bg-obsidian-900/50 overflow-hidden shadow-sm"
          >
            {/* Section Header */}
            <div
              onClick={() => toggleSection(statusKey)}
              className="flex items-center justify-between px-4 py-2.5 bg-slate-100/60 dark:bg-obsidian-800/80 hover:bg-slate-200/50 dark:hover:bg-obsidian-750 transition cursor-pointer select-none border-b border-slate-200/60 dark:border-white/[0.04]"
            >
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />

                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {config.label}
                </span>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-obsidian-700 text-slate-600 dark:text-teal-300 font-semibold border border-teal-500/20">
                  {groupTasks.length}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreateModalOpen(true, statusKey);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            {/* Tasks in this status */}
            {!isCollapsed && (
              <div>
                {groupTasks.length > 0 ? (
                  groupTasks.map((task) => <TaskRow key={task.id} task={task} />)
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400 italic">
                    No tasks in {config.label}
                  </div>
                )}

                {/* Inline Quick-Add Row */}
                {quickAddStatus === statusKey ? (
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-obsidian-950/70 border-t border-slate-200/50 dark:border-white/[0.04]">
                    <Plus className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <input
                      type="text"
                      autoFocus
                      value={quickAddTitle}
                      onChange={(e) => setQuickAddTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleQuickAddSubmit(statusKey);
                        if (e.key === 'Escape') setQuickAddStatus(null);
                      }}
                      onBlur={() => handleQuickAddSubmit(statusKey)}
                      placeholder={`Add task to ${config.label}... (Press Enter)`}
                      className="flex-1 text-xs bg-transparent text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setQuickAddStatus(statusKey);
                      setQuickAddTitle('');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-obsidian-800/40 transition text-left cursor-pointer border-t border-slate-200/40 dark:border-white/[0.04]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ New task in {config.label}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
