import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
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
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-glow-brand cursor-pointer"
            title="Expand Sidebar"
          >
            T
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-obsidian-800"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        </div>

        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/50"
        />
      </aside>
    );
  }

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col justify-between border-r border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-950 flex-shrink-0 z-30 overflow-y-auto select-none transition-all">
      {/* Top Workspace Header */}
      <div>
        <div className="p-4 border-b border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-glow-brand">
              TF
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {workspace.name}
                </h2>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-[10px] font-mono text-teal-400 font-semibold">
                {workspace.plan}
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
                ? 'bg-teal-500/10 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 font-semibold border border-teal-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-obsidian-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-teal-500" />
              <span>All Workspaces</span>
            </div>
            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-obsidian-800 text-slate-500 dark:text-teal-300 font-semibold">
              {tasks.length}
            </span>
          </button>
        </div>

        {/* SPACES & FOLDERS & LISTS HIERARCHY */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <span>Spaces</span>
            <span className="text-[10px] lowercase font-mono">ClickUp 4-tier</span>
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
                        ? 'bg-slate-100 dark:bg-obsidian-800 text-slate-900 dark:text-white border-l-2 border-teal-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-obsidian-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-white"
                        style={{ backgroundColor: space.color }}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="truncate">{space.name}</span>
                    </div>
                  </button>

                  {/* Folders & Lists */}
                  <div className="pl-4 space-y-1 border-l border-slate-200/60 dark:border-white/[0.04] ml-3">
                    {/* Folders */}
                    {space.folders.map((folder) => {
                      const isFolderOpen = Boolean(openFolders[folder.id]);
                      return (
                        <div key={folder.id} className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => toggleFolder(folder.id)}
                            className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          >
                            {isFolderOpen ? (
                              <FolderOpen className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
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
                                        ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 font-semibold'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
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
                              ? 'bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-300 font-semibold'
                              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
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

      {/* Bottom Profile & Workload Pill */}
      <div className="p-3 border-t border-slate-200 dark:border-white/[0.06] bg-slate-50/50 dark:bg-obsidian-950/80">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-white/[0.05] shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-teal-500/40"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.role}</p>
            </div>
          </div>
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-bold border border-teal-500/20"
            title={`${myTaskCount} active tasks assigned to you`}
          >
            {myTaskCount}
          </span>
        </div>
      </div>
    </aside>
  );
};
