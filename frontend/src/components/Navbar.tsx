import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, User as UserIcon, LogOut, Sparkles, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle, isMenuOpen }) => {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // For public marketing navigation dropdown when not in /app
  const [publicMenuOpen, setPublicMenuOpen] = useState(false);
  const isInApp = location.pathname.startsWith('/app');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Left: Mobile Menu Button + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger toggle button for in-app or public mobile view */}
          {isInApp ? (
            <button
              type="button"
              onClick={onMenuToggle}
              className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label={isMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPublicMenuOpen(!publicMenuOpen)}
              className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {publicMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                CareerCompass
                <span className="hidden sm:inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 border border-brand-200">
                  AI Placements
                </span>
              </span>
              <p className="text-[10px] text-slate-500 hidden md:block">Your skills. Your career. Your next opportunity.</p>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-medium text-slate-600">
          <Link to="/app/dashboard" className="hover:text-brand-600 transition-colors">Dashboard</Link>
          <Link to="/app/jobs" className="hover:text-brand-600 transition-colors">Jobs</Link>
          <Link to="/app/resume" className="hover:text-brand-600 transition-colors">Resume</Link>
          <Link to="/app/skills" className="hover:text-brand-600 transition-colors">Skill Gap</Link>
          <Link to="/app/interview" className="hover:text-brand-600 transition-colors">Interview</Link>
          <Link to="/app/roadmap" className="hover:text-brand-600 transition-colors">Roadmap</Link>
        </nav>

        {/* Right: User Profile / Auth State */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900 truncate max-w-[120px]">{user.full_name}</span>
                <span className="text-[10px] text-brand-600 font-medium truncate max-w-[120px]">{user.career_goal}</span>
              </div>
              <Link
                to="/app/profile"
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-bold text-xs border border-brand-200 hover:ring-2 hover:ring-brand-400 transition-all flex-shrink-0"
                title="View Profile"
              >
                {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={async () => {
                  await demoLogin();
                  navigate('/app/dashboard');
                }}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span className="hidden xs:inline sm:inline">1-Click </span>Demo
              </button>
              <Link
                to="/login"
                className="hidden sm:inline-block px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Public Mobile Dropdown (when outside /app) */}
      {!isInApp && publicMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 shadow-lg animate-slide-up">
          <Link
            to="/app/dashboard"
            onClick={() => setPublicMenuOpen(false)}
            className="block py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 border-b border-slate-50"
          >
            Dashboard
          </Link>
          <Link
            to="/app/jobs"
            onClick={() => setPublicMenuOpen(false)}
            className="block py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 border-b border-slate-50"
          >
            Explore Job Openings
          </Link>
          <Link
            to="/app/resume"
            onClick={() => setPublicMenuOpen(false)}
            className="block py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 border-b border-slate-50"
          >
            Resume Analyzer
          </Link>
          <Link
            to="/app/interview"
            onClick={() => setPublicMenuOpen(false)}
            className="block py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 border-b border-slate-50"
          >
            Mock Interview Practice
          </Link>
          <div className="pt-2 flex items-center justify-between">
            <Link
              to="/login"
              onClick={() => setPublicMenuOpen(false)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setPublicMenuOpen(false)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-brand-600 rounded-lg"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
