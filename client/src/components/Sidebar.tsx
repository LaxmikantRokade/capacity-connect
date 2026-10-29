import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Calendar,
  FileText,
  BarChart2,
  Users,
  Settings,
  ShieldCheck,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  onOpenBot?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenBot }) => {
  const { user } = useAuth();
  const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const isTrainer = user?.role === 'TRAINER';

  const mainLinks = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', to: '/courses', icon: BookOpen },
    { label: 'Assessments', to: '/assessments', icon: CheckSquare },
    { label: 'Competencies', to: '/skills', icon: Award },
    { label: 'Training Sessions', to: '/training', icon: Calendar },
    { label: 'Knowledge Base', to: '/knowledge', icon: FileText },
    { label: 'Certificates', to: '/certificates', icon: Award },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-navy-900 hidden lg:flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* User Mini Profile */}
        {user && (
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user.name}
              className="h-10 w-10 rounded-full object-cover border border-brand-500/30"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.jobRole || user.role}</p>
              <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                {user.role}
              </span>
            </div>
          </div>
        )}

        {/* Learning Navigation */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Workspace
          </p>
          <nav className="space-y-1">
            {mainLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 font-semibold'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Administration / Management (Role restricted) */}
        {isAdminOrManager && (
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Management
            </p>
            <nav className="space-y-1">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition ${
                    isActive
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Users className="h-4 w-4" />
                <span>Admin & Users</span>
              </NavLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition ${
                    isActive
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                <BarChart2 className="h-4 w-4" />
                <span>Analytics & Reports</span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      {/* Bot Assistant Promo Card */}
      {onOpenBot && (
        <div className="rounded-xl border border-teal-500/30 bg-teal-50/50 p-3.5 dark:bg-teal-950/30">
          <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
            <Sparkles className="h-4 w-4 animate-spin text-teal-500" />
            <span className="text-xs font-bold">CapacityBot AI</span>
          </div>
          <p className="mt-1 text-[11px] text-teal-800 dark:text-teal-200 leading-snug">
            Need course recommendations or compliance guidance?
          </p>
          <button
            onClick={onOpenBot}
            className="mt-2.5 w-full rounded-lg bg-teal-600 py-1.5 text-center text-xs font-semibold text-white hover:bg-teal-700 shadow-sm transition"
          >
            Launch Assistant
          </button>
        </div>
      )}
    </aside>
  );
};
