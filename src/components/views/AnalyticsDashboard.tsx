import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { Task } from '../../types';
import { PRIORITY_CONFIG, formatDuration } from '../../utils/taskUtils';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Users,
  TrendingUp,
  BarChart,
  Activity,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  tasks: Task[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ tasks }) => {
  const { teamMembers } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done' || t.status === 'closed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const planningTasks = tasks.filter((t) => t.status === 'planning').length;
  const notStartedTasks = tasks.filter((t) => t.status === 'not_started').length;

  const now = new Date();
  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'done' || t.status === 'closed') return false;
    if (!t.expiryDate) return false;
    return new Date(t.expiryDate).getTime() < now.getTime();
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalSecondsLogged = tasks.reduce((acc, t) => acc + (t.loggedSeconds || 0), 0);

  // Workload distribution per team member
  const memberWorkload = teamMembers.map((member) => {
    const memberTasks = tasks.filter((t) => t.assignees.includes(member.id));
    const memberCompleted = memberTasks.filter(
      (t) => t.status === 'done' || t.status === 'closed'
    ).length;
    const memberActive = memberTasks.length - memberCompleted;
    return {
      ...member,
      total: memberTasks.length,
      active: memberActive,
      completed: memberCompleted,
      completionRate:
        memberTasks.length > 0 ? Math.round((memberCompleted / memberTasks.length) * 100) : 0,
    };
  });

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total & Active */}
        <div className="p-5 rounded-2xl bg-white dark:bg-obsidian-800 border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
            {totalTasks}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <span className="text-teal-400 font-semibold">{inProgressTasks} In Progress</span>
            <span>·</span>
            <span>{planningTasks} Planning</span>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-obsidian-800 border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completion Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
              {completionRate}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({completedTasks}/{totalTasks} done)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-obsidian-700 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Overdue Alerts */}
        <div className="p-5 rounded-2xl bg-white dark:bg-obsidian-800 border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Alerts</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-bold font-mono ${
                overdueTasks.length > 0
                  ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {overdueTasks.length}
            </span>
            <span className="text-xs text-slate-400">tasks overdue</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {overdueTasks.length > 0 ? 'Requires immediate action' : 'All tasks on schedule!'}
          </p>
        </div>

        {/* Time Logged */}
        <div className="p-5 rounded-2xl bg-white dark:bg-obsidian-800 border border-slate-200 dark:border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Logged Hours</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
            {formatDuration(totalSecondsLogged)}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
            <span>Tracked via built-in timer</span>
          </div>
        </div>
      </div>

      {/* Status Breakdown Bar & Priority Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Distribution (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-obsidian-800 border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Status Workflow Distribution
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">ClickUp 3.0 Stages</span>
          </div>

          {/* Segmented Bar */}
          <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-obsidian-700">
            {totalTasks > 0 && (
              <>
                <div
                  title={`Not Started: ${notStartedTasks}`}
                  className="h-full bg-[#64748B] transition-all"
                  style={{ width: `${(notStartedTasks / totalTasks) * 100}%` }}
                />
                <div
                  title={`Planning: ${planningTasks}`}
                  className="h-full bg-[#0284C7] transition-all"
                  style={{ width: `${(planningTasks / totalTasks) * 100}%` }}
                />
                <div
                  title={`In Progress: ${inProgressTasks}`}
                  className="h-full bg-[#0D9488] transition-all"
                  style={{ width: `${(inProgressTasks / totalTasks) * 100}%` }}
                />
                <div
                  title={`Completed: ${completedTasks}`}
                  className="h-full bg-[#059669] transition-all"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                />
              </>
            )}
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: 'Not Started', count: notStartedTasks, color: '#64748B' },
              { label: 'Planning', count: planningTasks, color: '#0284C7' },
              { label: 'In Progress', count: inProgressTasks, color: '#0D9488' },
              { label: 'Done & Closed', count: completedTasks, color: '#059669' },
            ].map((st) => (
              <div key={st.label} className="p-3 rounded-xl bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/50 dark:border-white/[0.04]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                  <span className="text-xs text-slate-400 truncate">{st.label}</span>
                </div>
                <div className="font-mono text-lg font-bold text-slate-800 dark:text-white">
                  {st.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-obsidian-800 border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Priority Distribution
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Risk Matrix</span>
          </div>

          <div className="space-y-3 pt-1">
            {(['urgent', 'high', 'normal', 'low'] as const).map((pr) => {
              const conf = PRIORITY_CONFIG[pr];
              const count = tasks.filter((t) => t.priority === pr).length;
              const percent = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
              return (
                <div key={pr} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: conf.color }} />
                      {conf.label}
                    </span>
                    <span className="font-mono text-slate-400">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-obsidian-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${percent}%`, backgroundColor: conf.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Workload Distribution */}
      <div className="p-6 rounded-2xl bg-white dark:bg-obsidian-800 border border-slate-200 dark:border-white/[0.08] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Team Member Workload & Capacity
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Real-time Task Allocation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {memberWorkload.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-obsidian-900/60 border border-slate-200/60 dark:border-white/[0.04] space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/30"
                />
                <div className="truncate">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {member.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Active Workload</span>
                  <span className="font-bold text-teal-400">{member.active} active</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-obsidian-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${member.completionRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{member.completed} completed</span>
                  <span>{member.total} total</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
