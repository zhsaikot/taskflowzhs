import React, { useState, useRef, useEffect } from 'react';
import { TaskStatus } from '../../types';
import { STATUS_CONFIG } from '../../utils/taskUtils';
import { ChevronDown, Check } from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus;
  onChange?: (newStatus: TaskStatus) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  onChange,
  size = 'md',
  interactive = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentConfig = STATUS_CONFIG[status] || STATUS_CONFIG.not_started;

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

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  const canClick = interactive && Boolean(onChange);

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
        className={`inline-flex items-center rounded-full transition-all duration-150 border ${currentConfig.bgClass} ${currentConfig.textClass} ${currentConfig.borderClass} ${sizeClasses} ${
          canClick ? 'hover:brightness-110 cursor-pointer shadow-sm' : 'cursor-default'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${currentConfig.dotClass} ${
            status === 'in_progress' ? 'animate-pulse' : ''
          }`}
        />
        <span className="whitespace-nowrap">{currentConfig.label}</span>
        {canClick && (
          <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
        )}
      </button>

      {isOpen && canClick && (
        <div className="absolute left-0 z-50 mt-1.5 w-44 rounded-xl glass-dropdown shadow-2xl p-1.5 ring-1 ring-black/10 focus:outline-none animate-in fade-in zoom-in-95 duration-100 bg-obsidian-900 border border-teal-500/20">
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Change Status
          </div>
          {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((key) => {
            const config = STATUS_CONFIG[key];
            const isSelected = key === status;
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
                    ? 'bg-teal-500/20 text-white font-medium border border-teal-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${config.dotClass}`} />
                  <span>{config.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
