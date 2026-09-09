import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User as UserIcon, LogOut, Sparkles, Briefcase, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                CareerCompass
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 border border-brand-200">
                  AI Placements
                </span>
              </span>
              <p className="text-[11px] text-slate-500 hidden sm:block">Your skills. Your career. Your next opportunity.</p>
            </div>
          </Link>
        </div>

        {/* Center / Navigation Links for Public View */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/app/dashboard" className="hover:text-brand-600 transition-colors">Dashboard</Link>
          <Link to="/app/jobs" className="hover:text-brand-600 transition-colors">Jobs</Link>
          <Link to="/app/resume" className="hover:text-brand-600 transition-colors">Resume Analyzer</Link>
          <Link to="/app/skills" className="hover:text-brand-600 transition-colors">Skill Gap</Link>
          <Link to="/app/interview" className="hover:text-brand-600 transition-colors">Mock Interview</Link>
          <Link to="/app/roadmap" className="hover:text-brand-600 transition-colors">Roadmap</Link>
        </nav>

        {/* User Profile / Auth State */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900">{user.full_name}</span>
                <span className="text-[11px] text-brand-600 font-medium">{user.career_goal}</span>
              </div>
              <Link
                to="/app/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-xs border border-brand-200 hover:ring-2 hover:ring-brand-400 transition-all"
                title="View Profile"
              >
                {user.full_name.split(' ').map(n => n[0]).join('')}
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  await demoLogin();
                  navigate('/app/dashboard');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                1-Click Demo
              </button>
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
