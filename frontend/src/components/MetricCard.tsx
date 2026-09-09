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
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
    bar: 'bg-blue-600',
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    border: 'border-indigo-100',
    bar: 'bg-indigo-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
    bar: 'bg-emerald-600',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
    bar: 'bg-amber-600',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
    bar: 'bg-rose-600',
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.bg} ${styles.text} border ${styles.border}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${styles.bar} transition-all duration-500`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}

      {(subtitle || badge) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
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
