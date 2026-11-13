import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Task, TaskStatus } from '../../types';
import { STATUS_CONFIG } from '../../utils/taskUtils';
import { TaskCard } from '../tasks/TaskCard';
import { Plus } from 'lucide-react';

interface KanbanViewProps {
  tasks: Task[];
}

export const KanbanView: React.FC<KanbanViewProps> = ({ tasks }) => {
  const { changeTaskStatus, setIsCreateModalOpen } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const statuses: TaskStatus[] = ['not_started', 'planning', 'in_progress', 'done', 'closed'];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    const target = e.currentTarget as HTMLElement;
    target.classList.add('card-dragging');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('card-dragging');
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      changeTaskStatus(taskId, status);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="w-full overflow-x-auto pb-12 pt-1">
      <div className="flex gap-4 min-w-[1250px] items-start">
        {statuses.map((statusKey) => {
          const config = STATUS_CONFIG[statusKey];
          const columnTasks = tasks.filter((t) => t.status === statusKey);
          const isOver = dragOverColumn === statusKey;

          return (
            <div
              key={statusKey}
              onDragOver={(e) => handleDragOver(e, statusKey)}
              onDragLeave={(e) => handleDragLeave(e, statusKey)}
              onDrop={(e) => handleDrop(e, statusKey)}
              className={`flex-1 min-w-[280px] max-w-[320px] rounded-2xl flex flex-col transition-all duration-200 border ${
                isOver
                  ? 'border-teal-500 bg-teal-50/60 shadow-md ring-2 ring-teal-500/30 dark:border-teal-500/80 dark:bg-teal-950/30 dark:shadow-glow-brand'
                  : 'border-slate-200/90 bg-slate-100/70 shadow-xs dark:border-white/[0.06] dark:bg-obsidian-900/60'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 flex items-center justify-between border-b border-slate-200/80 bg-slate-50/60 dark:bg-transparent dark:border-white/[0.04] rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {config.label}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200/80 shadow-2xs dark:bg-obsidian-750 dark:text-teal-300 font-bold dark:border-teal-500/20">
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true, statusKey)}
                  className="p-1 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-200/60 dark:hover:text-teal-400 dark:hover:bg-obsidian-750 transition cursor-pointer"
                  title={`Add task to ${config.label}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 space-y-2.5 flex-1 min-h-[350px]">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))}

                {columnTasks.length === 0 && (
                  <div
                    className={`h-24 border-2 border-dashed rounded-xl flex items-center justify-center text-xs transition ${
                      isOver
                        ? 'border-teal-500 text-teal-600 bg-teal-50 dark:border-teal-400 dark:text-teal-400 dark:bg-teal-500/10'
                        : 'border-slate-300 bg-white/40 text-slate-400 dark:border-obsidian-750 dark:bg-transparent dark:text-slate-600'
                    }`}
                  >
                    Drop tasks here
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
