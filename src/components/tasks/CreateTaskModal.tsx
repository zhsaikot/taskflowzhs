import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { TaskStatus, TaskPriority, Subtask } from '../../types';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../../utils/taskUtils';
import { X, Plus, Sparkles, CornerDownRight } from 'lucide-react';

export const CreateTaskModal: React.FC = () => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    createModalDefaultStatus,
    addTask,
    teamMembers,
    currentUser,
    activeSpaceId,
    activeListId,
    setSelectedTaskId,
  } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(createModalDefaultStatus || 'not_started');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [assignees, setAssignees] = useState<string[]>([currentUser.id]);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().slice(0, 10);
  });
  const [tagsInput, setTagsInput] = useState('Frontend, DarkTeal');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [subtaskInput, setSubtaskInput] = useState('');

  if (!isCreateModalOpen) return null;

  const handleAddSubtaskDraft = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks([...subtasks, subtaskInput.trim()]);
    setSubtaskInput('');
  };

  const handleRemoveSubtaskDraft = (idx: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const createdSubtasks: Subtask[] = subtasks.map((stTitle, i) => ({
      id: `SUB-DRAFT-${i}`,
      title: stTitle,
      status: 'not_started',
      assigneeId: assignees[0] || currentUser.id,
      priority: 'normal',
    }));

    const newTask = addTask({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignees,
      startDate: `${startDate}T09:00:00Z`,
      expiryDate: `${expiryDate}T18:00:00Z`,
      tags: parsedTags,
      spaceId: activeSpaceId !== 'all' ? activeSpaceId : 'sp_eng',
      listId: activeListId !== 'all' ? activeListId : 'lst_frontend',
      subtasks: createdSubtasks,
    });

    setIsCreateModalOpen(false);
    setSelectedTaskId(newTask.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-teal-500/20 overflow-hidden flex flex-col max-h-[90vh] bg-white dark:bg-obsidian-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-obsidian-750 bg-slate-50 dark:bg-obsidian-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Create New Task</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">ClickUp-style quick creation with subtasks & dates</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Interactive Kanban Drag & Drop View..."
              className="w-full text-sm font-semibold bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-teal-400 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline acceptance criteria, technical details, or notes..."
              className="w-full text-xs font-medium bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-teal-500"
            />
          </div>

          {/* Status, Priority, Assignees row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full text-xs font-medium bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
              >
                {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((key) => (
                  <option key={key} value={key}>
                    {STATUS_CONFIG[key].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full text-xs font-medium bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
              >
                {(['urgent', 'high', 'normal', 'low'] as TaskPriority[]).map((key) => (
                  <option key={key} value={key}>
                    {PRIORITY_CONFIG[key].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Primary Assignee
              </label>
              <select
                value={assignees[0] || currentUser.id}
                onChange={(e) => setAssignees([e.target.value])}
                className="w-full text-xs font-medium bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates: Start & Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs font-medium bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Expiry (Due) Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full text-xs font-medium bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Frontend, Sprint42, DarkTeal"
              className="w-full text-xs font-medium bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-teal-500"
            />
          </div>

          {/* Subtasks initial list */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-obsidian-750">
            <label className="block text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
              Add Initial Subtasks (Optional)
            </label>
            <div className="space-y-1.5">
              {subtasks.map((st, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-1.5 bg-slate-50 dark:bg-obsidian-800/80 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-obsidian-700"
                >
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{st}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtaskDraft(i)}
                    className="text-slate-400 hover:text-red-500 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtaskDraft();
                  }
                }}
                placeholder="Type subtask title and click Add or press Enter..."
                className="flex-1 text-xs font-medium bg-white dark:bg-obsidian-800 border border-slate-300 dark:border-obsidian-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-teal-500"
              />
              <button
                type="button"
                onClick={handleAddSubtaskDraft}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-obsidian-700 dark:hover:bg-obsidian-600 text-slate-800 dark:text-teal-300 rounded-xl text-xs font-semibold cursor-pointer border border-slate-300 dark:border-teal-500/30"
              >
                Add
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-obsidian-750">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white text-xs font-bold shadow-glow-brand transition cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
