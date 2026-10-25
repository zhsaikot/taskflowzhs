export type TaskStatus = 'not_started' | 'planning' | 'in_progress' | 'done' | 'closed';

export type TaskPriority = 'urgent' | 'high' | 'normal' | 'low';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  reactions?: Record<string, number>;
}

export interface ActivityItem {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  detail?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  status: TaskStatus;
  assigneeId?: string;
  startDate?: string;
  expiryDate?: string;
  priority?: TaskPriority;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: string[]; // user IDs
  startDate: string;   // ISO string e.g. "2026-10-25"
  expiryDate: string;  // ISO string e.g. "2026-10-30"
  tags: string[];
  subtasks: Subtask[];
  checklists: ChecklistItem[];
  comments: Comment[];
  activity: ActivityItem[];
  attachments: Attachment[];
  spaceId: string;
  listId: string;
  estimatedHours?: number;
  loggedSeconds?: number;
  isTimerRunning?: boolean;
}

export interface ListItem {
  id: string;
  name: string;
  folderId?: string;
  spaceId: string;
  color?: string;
  icon?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  spaceId: string;
  lists: ListItem[];
}

export interface SpaceItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  folders: FolderItem[];
  standaloneLists: ListItem[];
}

export interface Workspace {
  id: string;
  name: string;
  logo: string;
  plan: string;
  spaces: SpaceItem[];
}

export type ActiveView = 'list' | 'kanban' | 'timeline' | 'calendar' | 'analytics';

export interface FilterState {
  searchQuery: string;
  statusFilter: TaskStatus | 'all';
  priorityFilter: TaskPriority | 'all';
  assigneeFilter: string | 'all';
  tagFilter: string | 'all';
  quickFilter: 'all' | 'my_tasks' | 'due_soon' | 'overdue' | 'high_priority';
}
