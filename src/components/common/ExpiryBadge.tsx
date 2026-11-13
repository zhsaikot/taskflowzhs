import React, { useState } from 'react';
import { getExpiryStatus } from '../../utils/taskUtils';
import { TaskStatus } from '../../types';
import { Calendar, AlertCircle, Clock } from 'lucide-react';

interface ExpiryBadgeProps {
  startDate?: string;
  expiryDate?: string;
  status: TaskStatus;
  onChangeExpiry?: (newDate: string) => void;
  showIcon?: boolean;
}

export const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({
  expiryDate,
  status,
  onChangeExpiry,
  showIcon = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const expiryInfo = getExpiryStatus(expiryDate, status);

  if (!expiryDate && !onChangeExpiry) return null;

  if (isEditing && onChangeExpiry) {
    const defaultVal = expiryDate ? expiryDate.slice(0, 10) : '';
    return (
      <input
        type="date"
        defaultValue={defaultVal}
        autoFocus
        onBlur={(e) => {
          if (e.target.value) {
            onChangeExpiry(`${e.target.value}T18:00:00Z`);
          }
          setIsEditing(false);
        }}
        onChange={(e) => {
          if (e.target.value) {
            onChangeExpiry(`${e.target.value}T18:00:00Z`);
            setIsEditing(false);
          }
        }}
        className="text-xs bg-white dark:bg-slate-800 border border-teal-500 rounded px-1.5 py-0.5 text-slate-900 dark:text-slate-200 outline-none shadow-sm"
      />
    );
  }

  if (!expiryInfo) {
    return onChangeExpiry ? (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>Set due date</span>
      </button>
    ) : null;
  }

  return (
    <div
      onClick={(e) => {
        if (!onChangeExpiry) return;
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono transition-all ${
        expiryInfo.badgeClass
      } ${onChangeExpiry ? 'cursor-pointer hover:brightness-110' : ''}`}
      title={`Due: ${expiryInfo.fullDate}`}
    >
      {showIcon && (
        <>
          {expiryInfo.isOverdue ? (
            <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 animate-pulse" />
          ) : expiryInfo.isDueSoon ? (
            <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          ) : (
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          )}
        </>
      )}
      <span className="whitespace-nowrap">{expiryInfo.text}</span>
    </div>
  );
};
