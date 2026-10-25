import confetti from 'canvas-confetti';
import { Task, TaskPriority, TaskStatus } from '../types';

export const STATUS_CONFIG: Record<
  TaskStatus,
  {
    label: string;
    color: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
  }
> = {
  not_started: {
    label: 'Not Started',
    color: '#64748B',
    bgClass: 'bg-slate-500/10 dark:bg-slate-500/20',
    textClass: 'text-slate-600 dark:text-slate-400',
    borderClass: 'border-slate-400/30 dark:border-slate-600/30',
    dotClass: 'bg-[#64748B]',
  },
  planning: {
    label: 'Planning',
    color: '#0284C7', // Dark Ocean Blue
    bgClass: 'bg-sky-500/10 dark:bg-sky-500/20',
    textClass: 'text-sky-600 dark:text-sky-400',
    borderClass: 'border-sky-400/30 dark:border-sky-500/30',
    dotClass: 'bg-[#0284C7]',
  },
  in_progress: {
    label: 'In Progress',
    color: '#0D9488', // Dark Teal
    bgClass: 'bg-teal-500/10 dark:bg-teal-500/20',
    textClass: 'text-teal-600 dark:text-teal-400',
    borderClass: 'border-teal-400/30 dark:border-teal-500/30',
    dotClass: 'bg-[#0D9488]',
  },
  done: {
    label: 'Done',
    color: '#059669', // Deep Emerald Green
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-emerald-400/30 dark:border-emerald-500/30',
    dotClass: 'bg-[#059669]',
  },
  closed: {
    label: 'Closed',
    color: '#475569',
    bgClass: 'bg-slate-800/10 dark:bg-slate-800/30',
    textClass: 'text-slate-500 dark:text-slate-500 line-through',
    borderClass: 'border-slate-700/20 dark:border-slate-700/30',
    dotClass: 'bg-[#475569]',
  },
};

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  {
    label: string;
    color: string;
    textColor: string;
    bgClass: string;
    borderClass: string;
  }
> = {
  urgent: {
    label: 'Urgent',
    color: '#EF4444',
    textColor: 'text-red-500 dark:text-red-400',
    bgClass: 'bg-red-500/10 dark:bg-red-500/20',
    borderClass: 'border-red-400/30',
  },
  high: {
    label: 'High',
    color: '#F97316',
    textColor: 'text-orange-500 dark:text-orange-400',
    bgClass: 'bg-orange-500/10 dark:bg-orange-500/20',
    borderClass: 'border-orange-400/30',
  },
  normal: {
    label: 'Normal',
    color: '#0284C7',
    textColor: 'text-sky-500 dark:text-sky-400',
    bgClass: 'bg-sky-500/10 dark:bg-sky-500/20',
    borderClass: 'border-sky-400/30',
  },
  low: {
    label: 'Low',
    color: '#94A3B8',
    textColor: 'text-slate-400 dark:text-slate-400',
    bgClass: 'bg-slate-500/10 dark:bg-slate-500/20',
    borderClass: 'border-slate-400/20',
  },
};

export interface ExpiryStatus {
  isOverdue: boolean;
  isDueSoon: boolean;
  text: string;
  fullDate: string;
  badgeClass: string;
}

export function getExpiryStatus(expiryDateStr?: string, status?: TaskStatus): ExpiryStatus | null {
  if (!expiryDateStr) return null;
  const expiry = new Date(expiryDateStr);
  if (isNaN(expiry.getTime())) return null;

  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  const fullDate = expiry.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: expiry.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });

  if (status === 'done' || status === 'closed') {
    return {
      isOverdue: false,
      isDueSoon: false,
      text: fullDate,
      fullDate,
      badgeClass: 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/40',
    };
  }

  if (diffMs < 0) {
    const daysAgo = Math.max(1, Math.floor(Math.abs(diffHours) / 24));
    return {
      isOverdue: true,
      isDueSoon: false,
      text: daysAgo === 1 ? 'Overdue (Yesterday)' : `Overdue (${daysAgo}d ago)`,
      fullDate,
      badgeClass: 'text-red-500 dark:text-red-400 bg-red-500/15 border border-red-500/30 badge-overdue-pulse font-semibold',
    };
  }

  if (diffHours <= 24) {
    const hoursRemaining = Math.max(1, Math.ceil(diffHours));
    return {
      isOverdue: false,
      isDueSoon: true,
      text: `Due Soon (${hoursRemaining}h)`,
      fullDate,
      badgeClass: 'text-amber-500 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 font-medium',
    };
  }

  return {
    isOverdue: false,
    isDueSoon: false,
    text: fullDate,
    fullDate,
    badgeClass: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50',
  };
}

export function calculateSubtaskRollup(task: Task) {
  if (!task.subtasks || task.subtasks.length === 0) {
    return null;
  }
  const total = task.subtasks.length;
  const completed = task.subtasks.filter(
    (st) => st.status === 'done' || st.status === 'closed'
  ).length;
  const percentage = Math.round((completed / total) * 100);

  return {
    total,
    completed,
    percentage,
    allDone: completed === total,
  };
}

export function triggerDoneConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0D9488', '#059669', '#0284C7', '#10B981'],
      disableForReducedMotion: true,
    });
  } catch (err) {
    console.error('Confetti trigger error:', err);
  }
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
}
