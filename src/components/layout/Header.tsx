import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { ActiveView } from '../../types';
import {
  Search,
  Plus,
  Kanban,
  List,
  GitBranch,
  Calendar,
  BarChart3,
  Sun,
  Moon,
  AlertCircle,
  UserCheck,
  RefreshCw,
  Flame,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    filterState,
    setFilterState,
    theme,
    toggleTheme,
    setIsCommandPaletteOpen,
    setIsCreateModalOpen,
    setIsProfileModalOpen,
    currentUser,
    tasks,
    resetToDemoData,
  } = useTasks();

  const overdueCount = tasks.filter((t) => {
    if (t.status === 'done' || t.status === 'closed') return false;
    return t.expiryDate && new Date(t.expiryDate).getTime() < new Date().getTime();
  }).length;

  const views: { id: ActiveView; label: string; icon: any }[] = [
    { id: 'kanban', label: 'Kanban Board', icon: Kanban },
    { id: 'list', label: 'List View', icon: List },
    { id: 'timeline', label: 'Timeline / Gantt', icon: GitBranch },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-20 w-full glass-panel border-b border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-obsidian-900/90 backdrop-blur-md px-6 py-3 space-y-3">
      {/* Top row: Search, Cmd+K trigger, Actions */}
      <div className="flex items-center justify-between gap-4">
        {/* Search & Command Palette trigger */}
        <div
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-obsidian-800/90 border border-slate-200 dark:border-white/[0.06] text-slate-400 hover:text-slate-200 hover:border-teal-500/50 transition cursor-pointer max-w-sm w-full"
        >
          <Search className="w-4 h-4 text-teal-400/80" />
          <span className="text-xs flex-1 truncate">Search tasks, tags, or jump (Cmd+K)...</span>
          <kbd className="hidden sm:inline-block font-mono text-[10px] bg-slate-200 dark:bg-obsidian-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-teal-400/90 font-semibold border border-teal-500/20">
            ⌘K
          </kbd>
        </div>

        {/* Right Buttons: Reset, Theme Toggle, Profile DP, + New Task */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={resetToDemoData}
            title="Reset workspace with realistic demo data"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-obsidian-800 text-xs font-medium text-slate-600 dark:text-slate-300 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo</span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-obsidian-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-teal-500" />
            )}
          </button>

          {/* User Profile DP Button */}
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 p-1 pr-2.5 rounded-xl border border-slate-200 dark:border-obsidian-700 hover:border-teal-500/50 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition cursor-pointer"
            title="Edit Profile & Display Picture"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-teal-500/50"
            />
            <span className="hidden md:inline-block text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[110px]">
              {currentUser.name}
            </span>
          </button>

          {/* + New Task Primary CTA with Deep Teal-Emerald Gradient */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white text-xs font-semibold shadow-glow-brand transition cursor-pointer transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Bottom row: View Switcher Tabs & Smart Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-obsidian-950/80 border border-slate-200/80 dark:border-white/[0.04]">
          {views.map((v) => {
            const Icon = v.icon;
            const isActive = activeView === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveView(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-obsidian-800 text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200/60 dark:border-teal-500/30'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setFilterState((prev) => ({ ...prev, quickFilter: 'all' }))}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filterState.quickFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-teal-500/20 dark:text-teal-300 dark:border dark:border-teal-500/40 font-semibold'
                : 'bg-slate-100 dark:bg-obsidian-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-obsidian-750'
            }`}
          >
            All Tasks
          </button>

          <button
            type="button"
            onClick={() =>
              setFilterState((prev) => ({
                ...prev,
                quickFilter: prev.quickFilter === 'my_tasks' ? 'all' : 'my_tasks',
              }))
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filterState.quickFilter === 'my_tasks'
                ? 'bg-teal-700 text-white font-semibold shadow-glow-brand'
                : 'bg-slate-100 dark:bg-obsidian-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-obsidian-750'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>My Tasks</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setFilterState((prev) => ({
                ...prev,
                quickFilter: prev.quickFilter === 'overdue' ? 'all' : 'overdue',
              }))
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filterState.quickFilter === 'overdue'
                ? 'bg-red-600 text-white font-semibold shadow-glow-overdue'
                : 'bg-slate-100 dark:bg-obsidian-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-obsidian-750'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            <span>Overdue & Due Soon</span>
            {overdueCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {overdueCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              setFilterState((prev) => ({
                ...prev,
                quickFilter: prev.quickFilter === 'high_priority' ? 'all' : 'high_priority',
              }))
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              filterState.quickFilter === 'high_priority'
                ? 'bg-orange-600 text-white font-semibold'
                : 'bg-slate-100 dark:bg-obsidian-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-obsidian-750'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>High Priority</span>
          </button>
        </div>
      </div>
    </header>
  );
};
