import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Target,
  MessageSquareCode,
  Milestone,
  UserCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Job Recommendations', path: '/app/jobs', icon: Briefcase },
  { name: 'Resume Analyzer', path: '/app/resume', icon: FileText },
  { name: 'Skill Gap Analysis', path: '/app/skills', icon: Target },
  { name: 'Mock Interview', path: '/app/interview', icon: MessageSquareCode },
  { name: 'Career Roadmap', path: '/app/roadmap', icon: Milestone },
  { name: 'Profile & Settings', path: '/app/profile', icon: UserCheck },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* User Mini Profile Card */}
        {user && (
          <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-sm shadow-sm">
                {user.full_name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">{user.full_name}</p>
                <p className="truncate text-[11px] text-brand-600 font-medium">{user.career_goal}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
              <span>Skills Logged:</span>
              <span className="font-semibold text-slate-800 bg-slate-200/60 px-1.5 py-0.5 rounded">
                {user.current_skills?.length || 0} skills
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Modules
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold border-r-4 border-brand-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Degree Project Badge */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-b from-indigo-50/70 to-blue-50/50 p-3.5 text-xs text-indigo-950">
        <div className="flex items-center gap-2 font-semibold text-indigo-900 mb-1">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>AI & Data Science Project</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Autonomous matching, NLP resume parsing, and real-time interview evaluation engine.
        </p>
      </div>
    </aside>
  );
};
