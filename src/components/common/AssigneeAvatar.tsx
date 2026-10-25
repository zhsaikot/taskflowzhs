import React, { useState, useRef, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Plus, UserCheck, Check } from 'lucide-react';

interface AssigneeAvatarProps {
  assigneeIds: string[];
  onChange?: (newAssignees: string[]) => void;
  maxVisible?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const AssigneeAvatar: React.FC<AssigneeAvatarProps> = ({
  assigneeIds,
  onChange,
  maxVisible = 3,
  size = 'md',
}) => {
  const { teamMembers, currentUser } = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const assignedUsers = teamMembers.filter((m) => assigneeIds.includes(m.id));
  const hiddenCount = Math.max(0, assignedUsers.length - maxVisible);
  const visibleUsers = assignedUsers.slice(0, maxVisible);

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-8 h-8 text-sm',
  }[size];

  const canEdit = Boolean(onChange);

  const toggleAssignee = (userId: string) => {
    if (!onChange) return;
    if (assigneeIds.includes(userId)) {
      onChange(assigneeIds.filter((id) => id !== userId));
    } else {
      onChange([...assigneeIds, userId]);
    }
  };

  const isAssignedToMe = assigneeIds.includes(currentUser.id);

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      <div
        onClick={(e) => {
          if (!canEdit) return;
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center -space-x-2 overflow-hidden py-0.5 px-0.5 rounded-full ${
          canEdit ? 'cursor-pointer hover:ring-2 hover:ring-teal-500/40 transition-all' : ''
        }`}
        title={assignedUsers.map((u) => u.name).join(', ') || 'Unassigned'}
      >
        {visibleUsers.length > 0 ? (
          visibleUsers.map((user) => (
            <img
              key={user.id}
              src={user.avatar}
              alt={user.name}
              className={`inline-block rounded-full ring-2 ring-white dark:ring-obsidian-800 object-cover ${sizeClasses}`}
            />
          ))
        ) : (
          <div
            className={`inline-flex items-center justify-center rounded-full bg-slate-200 dark:bg-obsidian-750 text-slate-500 dark:text-teal-400 ring-2 ring-white dark:ring-obsidian-800 border border-dashed border-teal-500/40 ${sizeClasses}`}
          >
            <Plus className="w-3.5 h-3.5" />
          </div>
        )}

        {hiddenCount > 0 && (
          <span
            className={`inline-flex items-center justify-center rounded-full bg-teal-800 text-white font-semibold ring-2 ring-white dark:ring-obsidian-800 ${sizeClasses}`}
          >
            +{hiddenCount}
          </span>
        )}
      </div>

      {isOpen && canEdit && (
        <div className="absolute left-0 z-50 mt-2 w-60 rounded-xl glass-dropdown shadow-2xl p-2 ring-1 ring-black/10 focus:outline-none animate-in fade-in zoom-in-95 duration-100 bg-obsidian-900 border border-teal-500/20">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-obsidian-750">
            <span className="text-xs font-semibold text-slate-300">Assignees</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleAssignee(currentUser.id);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-400 hover:underline cursor-pointer"
            >
              <UserCheck className="w-3 h-3" />
              {isAssignedToMe ? 'Unassign me' : 'Assign to me'}
            </button>
          </div>

          <div className="space-y-1">
            {teamMembers.map((member) => {
              const isSelected = assigneeIds.includes(member.id);
              return (
                <button
                  key={member.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAssignee(member.id);
                  }}
                  className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-teal-500/20 text-teal-200 font-medium'
                      : 'hover:bg-obsidian-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div>
                      <p className="leading-tight text-xs">{member.name}</p>
                      <p className="text-[10px] text-slate-400">{member.role}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-teal-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
