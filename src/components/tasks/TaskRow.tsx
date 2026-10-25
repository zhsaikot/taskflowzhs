import React, { useState } from 'react';
import { Task } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { AssigneeAvatar } from '../common/AssigneeAvatar';
import { ExpiryBadge } from '../common/ExpiryBadge';
import { ProgressRollup } from '../common/ProgressRollup';
import { Check, ChevronRight, MessageSquare } from 'lucide-react';

interface TaskRowProps {
  task: Task;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task }) => {
  const {
    setSelectedTaskId,
    selectedTaskIds,
    toggleSelectTask,
    updateTask,
    changeTaskStatus,
  } = useTasks();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);

  const isSelected = selectedTaskIds.includes(task.id);

  const handleRowClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, [role="button"]')) {
      return;
    }
    setSelectedTaskId(task.id);
  };

  const handleTitleSubmit = () => {
    if (titleValue.trim() && titleValue !== task.title) {
      updateTask(task.id, { title: titleValue.trim() });
    }
    setIsEditingTitle(false);
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group flex items-center gap-3 px-4 py-2.5 border-b transition-colors cursor-pointer text-xs ${
        isSelected
          ? 'bg-teal-950/40 dark:bg-teal-950/50 border-teal-500/40'
          : 'bg-white dark:bg-obsidian-900/60 hover:bg-slate-50/80 dark:hover:bg-obsidian-800/80 border-slate-200/80 dark:border-white/[0.05]'
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleSelectTask(task.id);
        }}
        className={`w-4 h-4 rounded flex items-center justify-center border transition cursor-pointer flex-shrink-0 ${
          isSelected
            ? 'bg-teal-600 border-teal-600 text-white'
            : 'border-slate-300 dark:border-slate-700 hover:border-teal-400 opacity-60 group-hover:opacity-100'
        }`}
      >
        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
      </button>

      {/* Task ID */}
      <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-400 w-18 flex-shrink-0 group-hover:text-teal-400 transition">
        {task.id}
      </span>

      {/* Task Title */}
      <div className="flex-1 min-w-0 pr-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={titleValue}
            autoFocus
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') {
                setTitleValue(task.title);
                setIsEditingTitle(false);
              }
            }}
            className="w-full text-xs font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-obsidian-800 rounded px-1.5 py-0.5 outline-none ring-1 ring-teal-500"
          />
        ) : (
          <div className="flex items-center gap-2">
            <span
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
              className={`font-medium truncate ${
                task.status === 'closed'
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-300'
              }`}
            >
              {task.title}
            </span>
            {task.comments && task.comments.length > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                <MessageSquare className="w-3 h-3" />
                <span>{task.comments.length}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Subtask Rollup */}
      <div className="w-24 flex-shrink-0">
        <ProgressRollup task={task} compact />
      </div>

      {/* Status Pill */}
      <div className="w-28 flex-shrink-0">
        <StatusBadge
          status={task.status}
          size="sm"
          onChange={(st) => changeTaskStatus(task.id, st)}
        />
      </div>

      {/* Priority Flag */}
      <div className="w-12 flex-shrink-0 flex justify-center">
        <PriorityBadge
          priority={task.priority}
          size="sm"
          onChange={(p) => updateTask(task.id, { priority: p })}
        />
      </div>

      {/* Expiry / Due Date */}
      <div className="w-32 flex-shrink-0 text-right">
        <ExpiryBadge
          expiryDate={task.expiryDate}
          status={task.status}
          onChangeExpiry={(d) => updateTask(task.id, { expiryDate: d })}
        />
      </div>

      {/* Assignees */}
      <div className="w-20 flex-shrink-0 flex justify-end">
        <AssigneeAvatar
          assigneeIds={task.assignees}
          size="sm"
          onChange={(newAssignees) => updateTask(task.id, { assignees: newAssignees })}
        />
      </div>

      {/* Action / Detail chevron */}
      <div className="w-8 flex-shrink-0 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTaskId(task.id);
          }}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-obsidian-750 text-slate-400 hover:text-teal-400"
          title="Open details"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
