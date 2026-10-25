import React from 'react';
import { Task } from '../../types';
import { calculateSubtaskRollup } from '../../utils/taskUtils';
import { CheckSquare } from 'lucide-react';

interface ProgressRollupProps {
  task: Task;
  compact?: boolean;
}

export const ProgressRollup: React.FC<ProgressRollupProps> = ({ task, compact = false }) => {
  const rollup = calculateSubtaskRollup(task);
  if (!rollup) return null;

  const { completed, total, percentage, allDone } = rollup;

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 text-xs font-mono px-2 py-0.5 rounded ${
          allDone
            ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30'
            : 'bg-slate-100 dark:bg-obsidian-800 text-slate-600 dark:text-slate-300'
        }`}
        title={`${completed} of ${total} subtasks completed (${percentage}%)`}
      >
        <CheckSquare className={`w-3.5 h-3.5 ${allDone ? 'text-emerald-400' : 'text-teal-400'}`} />
        <span>
          {completed}/{total}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-1.5" title={`${completed} of ${total} subtasks completed`}>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <CheckSquare className="w-3.5 h-3.5 text-teal-400" />
          Subtasks ({completed}/{total})
        </span>
        <span
          className={`font-semibold ${
            allDone
              ? 'text-emerald-400'
              : 'text-teal-400'
          }`}
        >
          {percentage}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 dark:bg-obsidian-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            allDone
              ? 'bg-emerald-500'
              : percentage > 50
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500'
              : 'bg-teal-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
