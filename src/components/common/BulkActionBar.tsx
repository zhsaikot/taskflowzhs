import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskStatus } from '../../types';
import { STATUS_CONFIG } from '../../utils/taskUtils';
import { CheckCircle2, Trash2, Users, X, Layers } from 'lucide-react';

export const BulkActionBar: React.FC = () => {
  const {
    selectedTaskIds,
    clearSelection,
    bulkUpdateStatus,
    bulkDelete,
    bulkAssign,
    teamMembers,
  } = useTasks();

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  if (selectedTaskIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className="px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-300 dark:border-teal-500/30 flex items-center gap-3 backdrop-blur-xl bg-white/95 dark:bg-obsidian-900/95 ring-1 ring-black/5">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-obsidian-750 text-xs font-semibold text-slate-800 dark:text-slate-300">
          <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[11px] font-bold">
            {selectedTaskIds.length}
          </span>
          <span>selected</span>
        </div>

        {/* 1-Click Mark Done */}
        <button
          type="button"
          onClick={() => bulkUpdateStatus('done')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-600/20 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-600/30 text-xs font-bold transition cursor-pointer border border-emerald-300 dark:border-emerald-500/30"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Mark Done</span>
        </button>

        {/* Change Status Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsStatusOpen(!isStatusOpen);
              setIsAssignOpen(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-800 dark:hover:bg-obsidian-750 text-slate-800 dark:text-slate-300 text-xs font-semibold transition cursor-pointer border border-slate-300 dark:border-obsidian-700"
          >
            <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Set Status</span>
          </button>

          {isStatusOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-44 rounded-xl shadow-2xl p-1.5 ring-1 ring-black/10 focus:outline-none bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-teal-500/20">
              {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((key) => {
                const conf = STATUS_CONFIG[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      bulkUpdateStatus(key);
                      setIsStatusOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-obsidian-800 text-slate-800 dark:text-slate-200 cursor-pointer text-left"
                  >
                    <span className={`w-2 h-2 rounded-full ${conf.dotClass}`} />
                    <span>{conf.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Assign Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsAssignOpen(!isAssignOpen);
              setIsStatusOpen(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-800 dark:hover:bg-obsidian-750 text-slate-800 dark:text-slate-300 text-xs font-semibold transition cursor-pointer border border-slate-300 dark:border-obsidian-700"
          >
            <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Assign</span>
          </button>

          {isAssignOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-52 rounded-xl shadow-2xl p-1.5 ring-1 ring-black/10 focus:outline-none bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-teal-500/20">
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => {
                    bulkAssign(member.id);
                    setIsAssignOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-obsidian-800 text-slate-800 dark:text-slate-200 cursor-pointer text-left"
                >
                  <img src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="truncate">{member.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={bulkDelete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-rose-700 dark:text-red-400 text-xs font-bold transition cursor-pointer border border-rose-200 dark:border-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>

        {/* Deselect All */}
        <button
          type="button"
          onClick={clearSelection}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-800 transition cursor-pointer ml-1"
          title="Deselect all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
