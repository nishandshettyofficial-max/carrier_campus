import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose';
  progress?: number;
  badge?: string;
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/60',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-900/60',
    bar: 'bg-blue-600 dark:bg-blue-500',
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/60',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-100 dark:border-indigo-900/60',
    bar: 'bg-indigo-600 dark:bg-indigo-500',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-900/60',
    bar: 'bg-emerald-600 dark:bg-emerald-500',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/60',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-900/60',
    bar: 'bg-amber-600 dark:bg-amber-500',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/60',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-100 dark:border-rose-900/60',
    bar: 'bg-rose-600 dark:bg-rose-500',
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  progress,
  badge,
}) => {
  const styles = colorStyles[color];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</h3>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.bg} ${styles.text} border ${styles.border}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${styles.bar} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {(subtitle || badge) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>{subtitle}</span>
          {badge && (
            <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${styles.bg} ${styles.text}`}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
