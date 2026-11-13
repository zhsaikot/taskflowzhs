import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskFlowLogo } from '../common/TaskFlowLogo';
import {
  Code2,
  Megaphone,
  Palette,
  Folder,
  FolderOpen,
  List as ListIcon,
  ChevronDown,
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  UserCog,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    workspace,
    activeSpaceId,
    setActiveSpaceId,
    activeListId,
    setActiveListId,
    currentUser,
    tasks,
    setIsProfileModalOpen,
  } = useTasks();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    fld_q4: true,
    fld_campaigns: true,
  });

  const toggleFolder = (folderId: string) => {
    setOpenFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const getSpaceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return Code2;
      case 'Megaphone':
        return Megaphone;
      case 'Palette':
        return Palette;
      default:
        return Layers;
    }
  };

  const myTaskCount = tasks.filter(
    (t) => t.assignees.includes(currentUser.id) && t.status !== 'done' && t.status !== 'closed'
  ).length;

  if (isCollapsed) {
    return (
      <aside className="w-16 h-screen sticky top-0 flex flex-col justify-between items-center py-4 border-r border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-950 flex-shrink-0 z-30 transition-all">
        <div className="flex flex-col items-center gap-6">
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="cursor-pointer transition-transform hover:scale-105"
            title="Expand Sidebar"
          >
            <TaskFlowLogo size="md" />
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-obsidian-800"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsProfileModalOpen(true)}
          className="relative group cursor-pointer"
          title="Edit Profile & DP"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/50 group-hover:ring-teal-400 transition"
          />
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <UserCog className="w-3.5 h-3.5 text-teal-300" />
          </div>
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col justify-between border-r border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-950 flex-shrink-0 z-30 overflow-y-auto select-none transition-all">
      {/* Top Workspace Header */}
      <div>
        <div className="p-4 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TaskFlowLogo size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                  Task<span className="text-teal-600 dark:text-teal-400">Flow</span>
                </h2>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-300 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/30">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-teal-400/90 font-medium truncate block max-w-[120px]">
                {workspace.name}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition cursor-pointer"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Global Views / All Spaces Option */}
        <div className="px-3 pt-4 pb-2 space-y-1">
          <button
            type="button"
            onClick={() => {
              setActiveSpaceId('all');
              setActiveListId('all');
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
              activeSpaceId === 'all'
                ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200 dark:bg-teal-500/15 dark:text-teal-400 dark:border-teal-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-obsidian-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-teal-600 dark:text-teal-500" />
              <span className="font-semibold">All Workspaces</span>
            </div>
            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-obsidian-800 dark:text-teal-300 font-bold">
              {tasks.length}
            </span>
          </button>
        </div>

        {/* SPACES & FOLDERS & LISTS HIERARCHY */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">
            <span>Spaces</span>
            <span className="text-[10px] lowercase font-mono">clickup 4-tier</span>
          </div>

          <div className="space-y-3">
            {workspace.spaces.map((space) => {
              const Icon = getSpaceIcon(space.icon);
              const isSpaceActive = activeSpaceId === space.id;

              return (
                <div key={space.id} className="space-y-1">
                  {/* Space Level */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSpaceId(space.id);
                      setActiveListId('all');
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer text-left ${
                      isSpaceActive
                        ? 'bg-teal-50 text-teal-900 border-l-2 border-teal-600 dark:bg-obsidian-800 dark:text-white dark:border-teal-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-white shadow-xs"
                        style={{ backgroundColor: space.color }}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="truncate">{space.name}</span>
                    </div>
                  </button>

                  {/* Folders & Lists */}
                  <div className="pl-4 space-y-1 border-l border-slate-200 dark:border-white/[0.04] ml-3">
                    {/* Folders */}
                    {space.folders.map((folder) => {
                      const isFolderOpen = Boolean(openFolders[folder.id]);
                      return (
                        <div key={folder.id} className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => toggleFolder(folder.id)}
                            className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          >
                            {isFolderOpen ? (
                              <FolderOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                            ) : (
                              <Folder className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            )}
                            <span className="truncate font-medium">{folder.name}</span>
                          </button>

                          {/* Lists inside folder */}
                          {isFolderOpen && (
                            <div className="pl-4 space-y-0.5">
                              {folder.lists.map((list) => {
                                const isListActive = activeListId === list.id;
                                return (
                                  <button
                                    key={list.id}
                                    type="button"
                                    onClick={() => {
                                      setActiveSpaceId(space.id);
                                      setActiveListId(list.id);
                                    }}
                                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-[11px] transition cursor-pointer ${
                                      isListActive
                                        ? 'bg-teal-50 text-teal-800 font-bold border-l-2 border-teal-600 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-400'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                                  >
                                    <ListIcon className="w-3 h-3 text-slate-400" />
                                    <span className="truncate">{list.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Standalone Lists */}
                    {space.standaloneLists.map((list) => {
                      const isListActive = activeListId === list.id;
                      return (
                        <button
                          key={list.id}
                          type="button"
                          onClick={() => {
                            setActiveSpaceId(space.id);
                            setActiveListId(list.id);
                          }}
                          className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-[11px] transition cursor-pointer ${
                            isListActive
                              ? 'bg-teal-50 text-teal-800 font-bold border-l-2 border-teal-600 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-400'
                              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                          }`}
                        >
                          <ListIcon className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{list.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Profile & Workload Pill - Click to Edit */}
      <div className="p-3 border-t border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-obsidian-950/80">
        <div
          onClick={() => setIsProfileModalOpen(true)}
          className="group flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/[0.05] hover:border-teal-500/50 shadow-sm cursor-pointer transition"
          title="Click to edit profile & display picture"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/40 group-hover:ring-teal-500 transition"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-obsidian-900" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-300 transition">
                  {currentUser.name}
                </p>
                <UserCog className="w-3 h-3 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition opacity-0 group-hover:opacity-100 flex-shrink-0" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">{currentUser.role}</p>
            </div>
          </div>
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20"
            title={`${myTaskCount} active tasks assigned to you`}
          >
            {myTaskCount}
          </span>
        </div>
      </div>
    </aside>
  );
};
