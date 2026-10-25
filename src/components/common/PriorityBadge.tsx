import React, { useState, useRef, useEffect } from 'react';
import { TaskPriority } from '../../types';
import { PRIORITY_CONFIG } from '../../utils/taskUtils';
import { Flag, Check } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TaskPriority;
  onChange?: (newPriority: TaskPriority) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  onChange,
  showLabel = false,
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const current = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.normal;

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

  const canClick = Boolean(onChange);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        disabled={!canClick}
        onClick={(e) => {
          if (!canClick) return;
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title={`Priority: ${current.label}`}
        className={`inline-flex items-center gap-1.5 rounded-lg border transition-all duration-150 ${current.bgClass} ${current.textColor} ${current.borderClass} ${
          size === 'sm' ? 'p-1 text-xs' : 'px-2 py-1 text-xs'
        } ${canClick ? 'hover:brightness-110 cursor-pointer' : 'cursor-default'}`}
      >
        <Flag
          className={`flex-shrink-0 ${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`}
          fill={current.color}
          strokeWidth={1.5}
        />
        {showLabel && <span className="font-medium">{current.label}</span>}
      </button>

      {isOpen && canClick && (
        <div className="absolute left-0 z-50 mt-1.5 w-40 rounded-xl glass-dropdown shadow-2xl p-1.5 ring-1 ring-black/10 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Set Priority
          </div>
          {(['urgent', 'high', 'normal', 'low'] as TaskPriority[]).map((key) => {
            const config = PRIORITY_CONFIG[key];
            const isSelected = key === priority;
            return (
              <button
                key={key}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.(key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-900 dark:text-white font-medium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Flag className="w-3.5 h-3.5" fill={config.color} color={config.color} />
                  <span>{config.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
