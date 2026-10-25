import React from 'react';
import { Task } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { PriorityBadge } from '../common/PriorityBadge';
import { AssigneeAvatar } from '../common/AssigneeAvatar';
import { ExpiryBadge } from '../common/ExpiryBadge';
import { ProgressRollup } from '../common/ProgressRollup';
import { MessageSquare, Check } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onDragEnd }) => {
  const {
    setSelectedTaskId,
    selectedTaskIds,
    toggleSelectTask,
    updateTask,
  } = useTasks();

  const isSelected = selectedTaskIds.includes(task.id);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, [role="button"]')) {
      return;
    }
    setSelectedTaskId(task.id);
  };

  return (
    <div
      draggable={Boolean(onDragStart)}
      onDragStart={(e) => onDragStart?.(e, task.id)}
      onDragEnd={onDragEnd}
      onClick={handleCardClick}
      className={`group relative p-3.5 rounded-2xl transition-all duration-200 cursor-pointer select-none ${
        isSelected
          ? 'bg-teal-950/50 border-teal-500/80 ring-1 ring-teal-500 shadow-glow-brand'
          : 'bg-white dark:bg-obsidian-800 hover:bg-slate-50 dark:hover:bg-obsidian-750 border border-slate-200 dark:border-white/[0.06] hover:border-teal-500/30 dark:hover:border-teal-500/30 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top row: Checkbox, ID, Priority flag */}
      <div className="flex items-center justify-between mb-2 gap-2">
        <div className="flex items-center gap-2">
          {/* Custom Checkbox */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleSelectTask(task.id);
            }}
            className={`w-4 h-4 rounded-md flex items-center justify-center border transition cursor-pointer ${
              isSelected
                ? 'bg-teal-600 border-teal-600 text-white'
                : 'border-slate-300 dark:border-slate-700 hover:border-teal-400 opacity-60 group-hover:opacity-100'
            }`}
          >
            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-400 group-hover:text-teal-400 transition">
            {task.id}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <PriorityBadge
            priority={task.priority}
            size="sm"
            onChange={(p) => updateTask(task.id, { priority: p })}
          />
        </div>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors line-clamp-2 leading-snug mb-2">
        {task.title}
      </h4>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-obsidian-750 text-slate-500 dark:text-teal-300/80 border border-slate-200/50 dark:border-teal-500/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Subtask Rollup Progress */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-3">
          <ProgressRollup task={task} />
        </div>
      )}

      {/* Bottom row: Expiry date badge, comment count, and Assignee avatars */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/[0.05] text-xs">
        <ExpiryBadge
          expiryDate={task.expiryDate}
          status={task.status}
          onChangeExpiry={(d) => updateTask(task.id, { expiryDate: d })}
        />

        <div className="flex items-center gap-2.5">
          {task.comments && task.comments.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{task.comments.length}</span>
            </span>
          )}

          <AssigneeAvatar
            assigneeIds={task.assignees}
            size="sm"
            onChange={(newAssignees) => updateTask(task.id, { assignees: newAssignees })}
          />
        </div>
      </div>
    </div>
  );
};
