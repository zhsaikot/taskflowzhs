import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../../context/TaskContext';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import {
  Search,
  PlusCircle,
  Sun,
  Moon,
  Kanban,
  List,
  Calendar,
  BarChart3,
  GitBranch,
  RefreshCw,
  AlertCircle,
  X,
  UserCog,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    tasks,
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setSelectedTaskId,
    setActiveView,
    setIsCreateModalOpen,
    setIsProfileModalOpen,
    theme,
    toggleTheme,
    setFilterState,
    resetToDemoData,
  } = useTasks();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredTasks = query.trim()
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.id.toLowerCase().includes(query.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : tasks.slice(0, 5);

  const navigationActions = [
    {
      id: 'act-edit-profile',
      label: 'Edit User Profile & Display Picture (DP)',
      icon: UserCog,
      action: () => setIsProfileModalOpen(true),
    },
    {
      id: 'nav-kanban',
      label: 'Switch to Kanban Board View',
      icon: Kanban,
      action: () => setActiveView('kanban'),
    },
    {
      id: 'nav-list',
      label: 'Switch to List View (Grouped by Status)',
      icon: List,
      action: () => setActiveView('list'),
    },
    {
      id: 'nav-timeline',
      label: 'Switch to Timeline / Gantt View',
      icon: GitBranch,
      action: () => setActiveView('timeline'),
    },
    {
      id: 'nav-calendar',
      label: 'Switch to Calendar View',
      icon: Calendar,
      action: () => setActiveView('calendar'),
    },
    {
      id: 'nav-analytics',
      label: 'Switch to Analytics & Workload Dashboard',
      icon: BarChart3,
      action: () => setActiveView('analytics'),
    },
    {
      id: 'act-new-task',
      label: 'Create New Task (Quick Add)',
      icon: PlusCircle,
      action: () => setIsCreateModalOpen(true),
    },
    {
      id: 'act-toggle-theme',
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
      icon: theme === 'dark' ? Sun : Moon,
      action: () => toggleTheme(),
    },
    {
      id: 'act-filter-overdue',
      label: 'Filter: Overdue & Due Soon Only',
      icon: AlertCircle,
      action: () =>
        setFilterState((prev) => ({
          ...prev,
          quickFilter: prev.quickFilter === 'overdue' ? 'all' : 'overdue',
        })),
    },
    {
      id: 'act-reset',
      label: 'Reset Workspace to Demo Data',
      icon: RefreshCw,
      action: () => resetToDemoData(),
    },
  ];

  const filteredActions = query.trim()
    ? navigationActions.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase())
      )
    : navigationActions;

  const totalItems = filteredTasks.length + filteredActions.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (totalItems || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (totalItems || 1)) % (totalItems || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < filteredTasks.length) {
        const task = filteredTasks[selectedIndex];
        setSelectedTaskId(task.id);
        setIsCommandPaletteOpen(false);
      } else {
        const actionIdx = selectedIndex - filteredTasks.length;
        const action = filteredActions[actionIdx];
        if (action) {
          action.action();
          setIsCommandPaletteOpen(false);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-2xl glass-dropdown shadow-2xl border border-teal-500/20 overflow-hidden flex flex-col max-h-[80vh] bg-obsidian-900"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-obsidian-750 bg-obsidian-950/80">
          <Search className="w-5 h-5 text-teal-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search tasks (e.g. TSK-1042, Dark Mode, Kanban)..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
          />
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-500 hover:text-slate-300 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="overflow-y-auto p-2 space-y-4 max-h-[60vh]">
          {/* Tasks Group */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-teal-400/80 uppercase tracking-wider">
                Tasks
              </div>
              <div className="space-y-1">
                {filteredTasks.map((task, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        setIsCommandPaletteOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition ${
                        isSelected
                          ? 'bg-teal-500/20 text-white border border-teal-500/40 shadow-glow-brand'
                          : 'text-slate-300 hover:bg-obsidian-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="font-mono text-xs text-teal-400 font-semibold">
                          {task.id}
                        </span>
                        <span className="text-sm font-medium truncate">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <PriorityBadge priority={task.priority} size="sm" />
                        <StatusBadge status={task.status} size="sm" interactive={false} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions Group */}
          {filteredActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-teal-400/80 uppercase tracking-wider">
                Actions & Navigation
              </div>
              <div className="space-y-1">
                {filteredActions.map((action, idx) => {
                  const globalIdx = filteredTasks.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = action.icon;
                  return (
                    <div
                      key={action.id}
                      onClick={() => {
                        action.action();
                        setIsCommandPaletteOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition ${
                        isSelected
                          ? 'bg-teal-500/20 text-white border border-teal-500/40 shadow-glow-brand'
                          : 'text-slate-300 hover:bg-obsidian-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-teal-400" />
                        <span className="text-sm font-medium">{action.label}</span>
                      </div>
                      <span className="text-[11px] text-teal-400/60 font-mono">Jump</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {totalItems === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">
              No tasks or commands matching &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-obsidian-750 bg-obsidian-950/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-teal-400/70">Tip: Press Cmd/Ctrl + K anytime</span>
        </div>
      </div>
    </div>
  );
};
