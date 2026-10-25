import React, { useMemo } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ListView } from './components/views/ListView';
import { KanbanView } from './components/views/KanbanView';
import { GanttTimelineView } from './components/views/GanttTimelineView';
import { CalendarView } from './components/views/CalendarView';
import { AnalyticsDashboard } from './components/views/AnalyticsDashboard';
import { TaskDetailDrawer } from './components/tasks/TaskDetailDrawer';
import { CreateTaskModal } from './components/tasks/CreateTaskModal';
import { CommandPalette } from './components/common/CommandPalette';
import { BulkActionBar } from './components/common/BulkActionBar';

const MainAppContent: React.FC = () => {
  const { tasks, activeSpaceId, activeListId, activeView, filterState, currentUser } = useTasks();

  // Filter tasks based on hierarchy & smart filter pills
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Hierarchy filter
    if (activeSpaceId !== 'all') {
      result = result.filter((t) => t.spaceId === activeSpaceId);
    }
    if (activeListId !== 'all') {
      result = result.filter((t) => t.listId === activeListId);
    }

    // Quick filter
    if (filterState.quickFilter === 'my_tasks') {
      result = result.filter((t) => t.assignees.includes(currentUser.id));
    } else if (filterState.quickFilter === 'overdue') {
      const now = new Date().getTime();
      result = result.filter((t) => {
        if (t.status === 'done' || t.status === 'closed') return false;
        if (!t.expiryDate) return false;
        const diffMs = new Date(t.expiryDate).getTime() - now;
        return diffMs < 86400000; // < 24h or past due
      });
    } else if (filterState.quickFilter === 'high_priority') {
      result = result.filter((t) => t.priority === 'urgent' || t.priority === 'high');
    }

    // Search query filter
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [tasks, activeSpaceId, activeListId, filterState, currentUser.id]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-obsidian-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* 4-tier Workspace Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header />

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto px-6 py-4">
          {activeView === 'kanban' && <KanbanView tasks={filteredTasks} />}
          {activeView === 'list' && <ListView tasks={filteredTasks} />}
          {activeView === 'timeline' && <GanttTimelineView tasks={filteredTasks} />}
          {activeView === 'calendar' && <CalendarView tasks={filteredTasks} />}
          {activeView === 'analytics' && <AnalyticsDashboard tasks={filteredTasks} />}
        </main>
      </div>

      {/* Global Slide-Over Task Detail Drawer */}
      <TaskDetailDrawer />

      {/* Command Palette Spotlight (Cmd+K) */}
      <CommandPalette />

      {/* Create Task Modal */}
      <CreateTaskModal />

      {/* Bulk Action Floating Glass Bar */}
      <BulkActionBar />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <MainAppContent />
    </TaskProvider>
  );
}
