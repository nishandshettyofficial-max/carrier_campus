import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquareCode,
  Menu
} from 'lucide-react';

interface BottomNavProps {
  onOpenMore: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenMore }) => {
  const tabs = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', path: '/app/jobs', icon: Briefcase },
    { name: 'Resume', path: '/app/resume', icon: FileText },
    { name: 'Mock Qs', path: '/app/interview', icon: MessageSquareCode },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200/90 dark:border-slate-800 safe-area-bottom shadow-lg shadow-slate-900/10 transition-colors duration-200"
    >
      <div className="grid grid-cols-5 h-14 items-center px-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-lg transition-colors ${
                      isActive ? 'bg-brand-50 dark:bg-brand-950/70' : ''
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] tracking-tight mt-0.5">{tab.name}</span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* More Drawer Button */}
        <button
          type="button"
          onClick={onOpenMore}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
          aria-label="Open Full Menu"
        >
          <div className="p-1 rounded-lg">
            <Menu className="h-5 w-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">More</span>
        </button>
      </div>
    </nav>
  );
};
