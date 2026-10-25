import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { AssigneeAvatar } from '../common/AssigneeAvatar';
import { ExpiryBadge } from '../common/ExpiryBadge';
import { ProgressRollup } from '../common/ProgressRollup';
import { PomodoroTimer } from '../common/PomodoroTimer';
import {
  X,
  Trash2,
  Share2,
  CheckCircle2,
  Plus,
  Send,
  MessageSquare,
  History,
  Paperclip,
  CheckSquare,
  CornerDownRight,
} from 'lucide-react';

export const TaskDetailDrawer: React.FC = () => {
  const {
    selectedTask,
    setSelectedTaskId,
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
    teamMembers,
    currentUser,
  } = useTasks();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');

  if (!selectedTask) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(selectedTask.id, {
      title: newSubtaskTitle.trim(),
      status: 'not_started',
      assigneeId: currentUser.id,
      priority: 'normal',
    });
    setNewSubtaskTitle('');
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTitle.trim()) return;
    addChecklist(selectedTask.id, newChecklistTitle.trim());
    setNewChecklistTitle('');
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(selectedTask.id, commentText);
    setCommentText('');
  };

  const getUser = (userId: string) =>
    teamMembers.find((m) => m.id === userId) || {
      name: 'Unknown User',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'Member',
    };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl h-full glass-panel bg-white/95 dark:bg-obsidian-900/95 shadow-2xl flex flex-col border-l border-slate-200 dark:border-teal-500/20 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Top Navigation Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-obsidian-750 bg-slate-50/50 dark:bg-obsidian-950/80">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/30">
              {selectedTask.id}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Sprint Q4</span>
              <span>/</span>
              <span className="text-slate-700 dark:text-teal-300 font-medium">Tasks</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-teal-300 rounded-lg hover:bg-slate-100 dark:hover:bg-obsidian-800 transition cursor-pointer"
              title="Copy task link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => deleteTask(selectedTask.id)}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedTaskId(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-obsidian-800 transition cursor-pointer"
              title="Close drawer (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata Quick Ribbon */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-obsidian-750 bg-slate-100/40 dark:bg-obsidian-800/40 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              Status:
            </span>
            <StatusBadge
              status={selectedTask.status}
              onChange={(st) => changeTaskStatus(selectedTask.id, st)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              Priority:
            </span>
            <PriorityBadge
              priority={selectedTask.priority}
              showLabel
              onChange={(p) => updateTask(selectedTask.id, { priority: p })}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              Assignees:
            </span>
            <AssigneeAvatar
              assigneeIds={selectedTask.assignees}
              onChange={(newAssignees) => updateTask(selectedTask.id, { assignees: newAssignees })}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
              Due Date:
            </span>
            <ExpiryBadge
              expiryDate={selectedTask.expiryDate}
              status={selectedTask.status}
              onChangeExpiry={(d) => updateTask(selectedTask.id, { expiryDate: d })}
            />
          </div>
        </div>

        {/* 2-Column Body Content */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-obsidian-750">
          {/* Left Column: Description, Subtask engine, Checklists, Attachments (7 Cols) */}
          <div className="md:col-span-7 p-6 space-y-6 overflow-y-auto">
            {/* Task Title editable */}
            <div>
              <input
                type="text"
                value={selectedTask.title}
                onChange={(e) => updateTask(selectedTask.id, { title: e.target.value })}
                className="w-full text-xl font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none focus:ring-1 focus:ring-teal-500 rounded px-1 -mx-1"
                placeholder="Task title..."
              />
            </div>

            {/* Subtask Rollup Progress */}
            {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-obsidian-800/80 border border-slate-200 dark:border-obsidian-700">
                <ProgressRollup task={selectedTask} />
              </div>
            )}

            {/* Description editable */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-teal-400/90">
                Description
              </label>
              <textarea
                rows={4}
                value={selectedTask.description}
                onChange={(e) => updateTask(selectedTask.id, { description: e.target.value })}
                placeholder="Add more details, requirements, acceptance criteria..."
                className="w-full text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-obsidian-800/60 border border-slate-200 dark:border-obsidian-700 rounded-xl p-3 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Subtask Engine */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Subtasks
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-obsidian-750 text-teal-400 font-mono border border-teal-500/20">
                    {selectedTask.subtasks?.length || 0}
                  </span>
                </div>
              </div>

              {/* Nested Subtask Items */}
              <div className="space-y-2">
                {(selectedTask.subtasks || []).map((subtask) => {
                  const isDone = subtask.status === 'done' || subtask.status === 'closed';
                  return (
                    <div
                      key={subtask.id}
                      className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-obsidian-800/60 border border-slate-200 dark:border-obsidian-700 hover:border-teal-500/40 transition"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateSubtask(selectedTask.id, subtask.id, {
                              status: isDone ? 'in_progress' : 'done',
                            })
                          }
                          className={`w-4 h-4 rounded flex items-center justify-center border transition cursor-pointer flex-shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-400 hover:border-emerald-500'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </button>
                        <span
                          className={`text-xs truncate ${
                            isDone
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {subtask.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge
                          status={subtask.status}
                          size="sm"
                          onChange={(st) =>
                            updateSubtask(selectedTask.id, subtask.id, { status: st })
                          }
                        />
                        <button
                          type="button"
                          onClick={() => deleteSubtask(selectedTask.id, subtask.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition cursor-pointer"
                          title="Delete subtask"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add subtask input */}
              <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Add a new subtask (press Enter)..."
                  className="flex-1 text-xs bg-slate-100 dark:bg-obsidian-950/80 border border-slate-200 dark:border-obsidian-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  disabled={!newSubtaskTitle.trim()}
                  className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white text-xs font-medium cursor-pointer transition flex items-center gap-1 shadow-glow-brand"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>

            {/* Checklists */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-obsidian-750">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Checklist
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                {(selectedTask.checklists || []).map((chk) => (
                  <div
                    key={chk.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-obsidian-800/60 group text-xs"
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={chk.completed}
                        onChange={() => toggleChecklist(selectedTask.id, chk.id)}
                        className="rounded border-slate-400 text-teal-600 focus:ring-teal-500"
                      />
                      <span
                        className={
                          chk.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-700 dark:text-slate-300'
                        }
                      >
                        {chk.title}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => deleteChecklist(selectedTask.id, chk.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddChecklist} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newChecklistTitle}
                  onChange={(e) => setNewChecklistTitle(e.target.value)}
                  placeholder="Add checklist item..."
                  className="flex-1 text-xs bg-slate-100 dark:bg-obsidian-950/80 border border-slate-200 dark:border-obsidian-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  disabled={!newChecklistTitle.trim()}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-obsidian-750 hover:bg-slate-300 dark:hover:bg-obsidian-700 disabled:opacity-50 text-xs text-slate-700 dark:text-teal-300 cursor-pointer border border-teal-500/20"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Attachments Section */}
            {selectedTask.attachments && selectedTask.attachments.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-obsidian-750">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-teal-400" />
                  Attachments ({selectedTask.attachments.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTask.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-obsidian-700 bg-slate-50 dark:bg-obsidian-800/60 flex items-center gap-2.5"
                    >
                      <Paperclip className="w-4 h-4 text-slate-400" />
                      <div className="truncate flex-1">
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                          {att.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{att.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Time Tracker, Realtime Activity & Comments (5 Cols) */}
          <div className="md:col-span-5 p-6 space-y-6 flex flex-col justify-between overflow-y-auto bg-slate-50/40 dark:bg-obsidian-950/40">
            <div className="space-y-5">
              {/* Pomodoro & Stopwatch Timer */}
              <PomodoroTimer
                taskId={selectedTask.id}
                loggedSeconds={selectedTask.loggedSeconds}
              />

              {/* Tabs: Comments vs Activity */}
              <div className="flex border-b border-slate-200 dark:border-obsidian-750">
                <button
                  type="button"
                  onClick={() => setActiveTab('comments')}
                  className={`flex items-center gap-1.5 pb-2 text-xs font-semibold border-b-2 px-3 transition cursor-pointer ${
                    activeTab === 'comments'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Comments ({selectedTask.comments?.length || 0})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('activity')}
                  className={`flex items-center gap-1.5 pb-2 text-xs font-semibold border-b-2 px-3 transition cursor-pointer ${
                    activeTab === 'activity'
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Activity Log</span>
                </button>
              </div>

              {/* Comments Thread */}
              {activeTab === 'comments' ? (
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {selectedTask.comments && selectedTask.comments.length > 0 ? (
                    selectedTask.comments.map((cm) => {
                      const author = getUser(cm.userId);
                      return (
                        <div key={cm.id} className="flex gap-2.5 text-xs">
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5"
                          />
                          <div className="flex-1 bg-white dark:bg-obsidian-800 p-3 rounded-xl border border-slate-200 dark:border-obsidian-700 shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {author.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(cm.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed break-words">
                              {cm.content}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No comments yet. Mention team members with @name!
                    </div>
                  )}
                </div>
              ) : (
                /* Activity Log */
                <div className="space-y-3 max-h-[360px] overflow-y-auto text-xs">
                  {selectedTask.activity && selectedTask.activity.length > 0 ? (
                    selectedTask.activity.map((act) => {
                      const user = getUser(act.userId);
                      return (
                        <div key={act.id} className="flex items-start gap-2 text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-300">{user.name} </span>
                            <span>{act.action}</span>
                            {act.detail && (
                              <span className="text-teal-400 italic"> &ldquo;{act.detail}&rdquo;</span>
                            )}
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {new Date(act.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No activity recorded.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comment input box */}
            {activeTab === 'comments' && (
              <form onSubmit={handleSendComment} className="pt-3 border-t border-slate-200 dark:border-obsidian-750">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment (@sadia, @tanvir)..."
                    className="flex-1 text-xs bg-white dark:bg-obsidian-800 border border-slate-200 dark:border-obsidian-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white cursor-pointer transition flex items-center justify-center shadow-glow-brand"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
