import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Task,
  TaskStatus,
  TaskPriority,
  ActiveView,
  FilterState,
  User,
  Workspace,
  Subtask,
  ChecklistItem,
  Comment,
} from '../types';
import {
  INITIAL_TASKS,
  INITIAL_WORKSPACE,
  CURRENT_USER,
  TEAM_MEMBERS,
} from '../data/mockData';
import { triggerDoneConfetti } from '../utils/taskUtils';

interface TaskContextType {
  tasks: Task[];
  workspace: Workspace;
  currentUser: User;
  teamMembers: User[];
  activeSpaceId: string;
  activeListId: string;
  activeView: ActiveView;
  selectedTaskId: string | null;
  selectedTask: Task | null;
  selectedTaskIds: string[];
  filterState: FilterState;
  theme: 'dark' | 'light';
  isCommandPaletteOpen: boolean;
  isCreateModalOpen: boolean;
  createModalDefaultStatus?: TaskStatus;

  // Navigation & UI Actions
  setActiveSpaceId: (id: string) => void;
  setActiveListId: (id: string) => void;
  setActiveView: (view: ActiveView) => void;
  setSelectedTaskId: (id: string | null) => void;
  setSelectedTaskIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelectTask: (id: string) => void;
  selectAllTasks: (taskIds: string[]) => void;
  clearSelection: () => void;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setIsCommandPaletteOpen: (open: boolean) => void;
  setIsCreateModalOpen: (open: boolean, defaultStatus?: TaskStatus) => void;

  // Task Mutations
  addTask: (task: Omit<Task, 'id' | 'activity' | 'comments' | 'attachments' | 'checklists' | 'subtasks'> & {
    subtasks?: Subtask[];
    checklists?: ChecklistItem[];
  }) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  changeTaskStatus: (id: string, newStatus: TaskStatus) => void;

  // Subtask Mutations
  addSubtask: (taskId: string, subtask: Omit<Subtask, 'id'>) => void;
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Checklist & Comment Mutations
  toggleChecklist: (taskId: string, checklistId: string) => void;
  addChecklist: (taskId: string, title: string) => void;
  deleteChecklist: (taskId: string, checklistId: string) => void;
  addComment: (taskId: string, content: string) => void;
  logTime: (taskId: string, additionalSeconds: number) => void;

  // Bulk Actions
  bulkUpdateStatus: (status: TaskStatus) => void;
  bulkDelete: () => void;
  bulkAssign: (userId: string) => void;
  resetToDemoData: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'taskflow_pro_tasks_v2';
const THEME_STORAGE_KEY = 'taskflow_pro_theme';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('taskflow_pro_tasks_v1');
      if (saved) {
        const parsed: Task[] = JSON.parse(saved);
        // Seamlessly migrate old user ID if present
        return parsed.map((t) => ({
          ...t,
          assignees: t.assignees.map((a) => (a === 'usr_rahim' ? 'usr_ziaul' : a)),
          subtasks: (t.subtasks || []).map((st) => ({
            ...st,
            assigneeId: st.assigneeId === 'usr_rahim' ? 'usr_ziaul' : st.assigneeId,
          })),
        }));
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    return INITIAL_TASKS;
  });

  const [workspace] = useState<Workspace>(INITIAL_WORKSPACE);
  const [currentUser] = useState<User>(CURRENT_USER);
  const [teamMembers] = useState<User[]>(TEAM_MEMBERS);

  const [activeSpaceId, setActiveSpaceId] = useState<string>('all');
  const [activeListId, setActiveListId] = useState<string>('all');
  const [activeView, setActiveView] = useState<ActiveView>('kanban');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultStatus, setCreateModalDefaultStatus] = useState<TaskStatus | undefined>(undefined);

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' ? 'light' : 'dark';
  });

  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    statusFilter: 'all',
    priorityFilter: 'all',
    assigneeFilter: 'all',
    tagFilter: 'all',
    quickFilter: 'all',
  });

  // Sync tasks to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  }, [tasks]);

  // Sync theme
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } catch (e) {
      console.error('Theme sync error', e);
    }
  }, [theme]);

  // Global hotkeys: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        if (selectedTaskId) setSelectedTaskId(null);
        if (isCommandPaletteOpen) setIsCommandPaletteOpen(false);
        if (isCreateModalOpen) setIsCreateModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTaskId, isCommandPaletteOpen, isCreateModalOpen]);

  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const openCreateModal = (open: boolean, defaultStatus?: TaskStatus) => {
    setCreateModalDefaultStatus(defaultStatus);
    setIsCreateModalOpen(open);
  };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  const toggleSelectTask = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllTasks = (taskIds: string[]) => {
    setSelectedTaskIds(taskIds);
  };

  const clearSelection = () => {
    setSelectedTaskIds([]);
  };

  // CRUD Implementations
  const addTask: TaskContextType['addTask'] = (taskData) => {
    const newId = `TSK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTask: Task = {
      ...taskData,
      id: newId,
      subtasks: taskData.subtasks || [],
      checklists: taskData.checklists || [],
      comments: [],
      attachments: [],
      activity: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          action: 'created this task',
          timestamp: new Date().toISOString(),
        },
      ],
      loggedSeconds: 0,
      spaceId: taskData.spaceId || 'sp_eng',
      listId: taskData.listId || 'lst_frontend',
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return { ...t, ...updates };
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (selectedTaskId === id) setSelectedTaskId(null);
    setSelectedTaskIds((prev) => prev.filter((item) => item !== id));
  };

  const changeTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.status === newStatus) return t;

        const newActivity = [
          {
            id: `act-${Date.now()}`,
            userId: currentUser.id,
            action: `changed status to ${newStatus.replace('_', ' ').toUpperCase()}`,
            timestamp: new Date().toISOString(),
          },
          ...(t.activity || []),
        ];

        return {
          ...t,
          status: newStatus,
          activity: newActivity,
        };
      })
    );

    if (newStatus === 'done') {
      triggerDoneConfetti();
    }
  };

  // Subtask mutations
  const addSubtask = (taskId: string, subtaskData: Omit<Subtask, 'id'>) => {
    const subtaskId = `SUB-${Math.floor(10 + Math.random() * 90)}`;
    const newSubtask: Subtask = {
      ...subtaskData,
      id: subtaskId,
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: [...(t.subtasks || []), newSubtask],
        };
      })
    );
  };

  const updateSubtask = (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = (t.subtasks || []).map((st) => {
          if (st.id !== subtaskId) return st;
          return { ...st, ...updates };
        });

        // Check if this update changed status to done
        if (updates.status === 'done') {
          triggerDoneConfetti();
        }

        return {
          ...t,
          subtasks: updatedSubtasks,
        };
      })
    );
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: (t.subtasks || []).filter((st) => st.id !== subtaskId),
        };
      })
    );
  };

  // Checklists
  const toggleChecklist = (taskId: string, checklistId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated = (t.checklists || []).map((c) =>
          c.id === checklistId ? { ...c, completed: !c.completed } : c
        );
        return { ...t, checklists: updated };
      })
    );
  };

  const addChecklist = (taskId: string, title: string) => {
    if (!title.trim()) return;
    const item: ChecklistItem = {
      id: `chk-${Date.now()}`,
      title: title.trim(),
      completed: false,
    };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return { ...t, checklists: [...(t.checklists || []), item] };
      })
    );
  };

  const deleteChecklist = (taskId: string, checklistId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          checklists: (t.checklists || []).filter((c) => c.id !== checklistId),
        };
      })
    );
  };

  // Comments & Time
  const addComment = (taskId: string, content: string) => {
    if (!content.trim()) return;
    const newComment: Comment = {
      id: `cm-${Date.now()}`,
      userId: currentUser.id,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          comments: [...(t.comments || []), newComment],
        };
      })
    );
  };

  const logTime = (taskId: string, additionalSeconds: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          loggedSeconds: (t.loggedSeconds || 0) + additionalSeconds,
        };
      })
    );
  };

  // Bulk Actions
  const bulkUpdateStatus = (status: TaskStatus) => {
    if (selectedTaskIds.length === 0) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (selectedTaskIds.includes(t.id)) {
          return { ...t, status };
        }
        return t;
      })
    );
    if (status === 'done') triggerDoneConfetti();
    clearSelection();
  };

  const bulkDelete = () => {
    if (selectedTaskIds.length === 0) return;
    setTasks((prev) => prev.filter((t) => !selectedTaskIds.includes(t.id)));
    clearSelection();
  };

  const bulkAssign = (userId: string) => {
    if (selectedTaskIds.length === 0) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (selectedTaskIds.includes(t.id)) {
          const assignees = t.assignees.includes(userId)
            ? t.assignees
            : [...t.assignees, userId];
          return { ...t, assignees };
        }
        return t;
      })
    );
    clearSelection();
  };

  const resetToDemoData = () => {
    setTasks(INITIAL_TASKS);
    clearSelection();
    setSelectedTaskId(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        workspace,
        currentUser,
        teamMembers,
        activeSpaceId,
        activeListId,
        activeView,
        selectedTaskId,
        selectedTask,
        selectedTaskIds,
        filterState,
        theme,
        isCommandPaletteOpen,
        isCreateModalOpen,
        createModalDefaultStatus,

        setActiveSpaceId,
        setActiveListId,
        setActiveView,
        setSelectedTaskId,
        setSelectedTaskIds,
        toggleSelectTask,
        selectAllTasks,
        clearSelection,
        setFilterState,
        setTheme,
        toggleTheme,
        setIsCommandPaletteOpen,
        setIsCreateModalOpen: openCreateModal,

        addTask,
        updateTask,
        deleteTask,
        changeTaskStatus,
        addSubtask,
        updateSubtask,
        deleteSubtask,
        toggleChecklist,
        addChecklist,
        deleteChecklist,
        addComment,
        logTime,

        bulkUpdateStatus,
        bulkDelete,
        bulkAssign,
        resetToDemoData,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
