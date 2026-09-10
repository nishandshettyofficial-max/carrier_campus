import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Milestone,
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  Layers
} from 'lucide-react';
import { api, CareerRoadmapData } from '../api/client';
import { useAuth } from '../context/AuthContext';

const CAREER_OPTIONS = [
  'Data Scientist',
  'Machine Learning Engineer',
  'AI Engineer',
  'Data Analyst',
  'Software Developer'
];

export const RoadmapPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.career_goal || 'Data Scientist');
  const [roadmap, setRoadmap] = useState<CareerRoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoadmap = async (role: string) => {
    setIsLoading(true);
    try {
      const res = await api.getRoadmap(role, user?.id || 1);
      setRoadmap(res);
    } catch (err) {
      console.error('Failed to load roadmap:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap(selectedRole);
  }, [selectedRole, user]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200 mb-2">
            <Milestone className="h-3.5 w-3.5" />
            Progression Timeline
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Placement Career Roadmap</h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual milestone sequence from core language foundations to capstone projects and live placement interviews.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {CAREER_OPTIONS.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                selectedRole === role
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !roadmap ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500 text-xs">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            <p>Constructing career progression timeline...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Progress Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Track: {roadmap.role_name}</span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">Overall Track Progression</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-brand-600">{roadmap.overall_progress}%</span>
                <span className="text-xs text-slate-500">Skills Acquired</span>
              </div>
            </div>

            <div className="mt-4 h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 transition-all duration-700"
                style={{ width: `${roadmap.overall_progress}%` }}
              />
            </div>
          </div>

          {/* Phased Roadmap Timeline */}
          <div className="space-y-6">
            {roadmap.phases.map((phase) => (
              <div key={phase.phase_number} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-xs shadow-sm">
                      P{phase.phase_number}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{phase.phase_title}</h3>
                      <p className="text-[11px] text-slate-500">{phase.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Milestones inside phase */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {phase.milestones.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-slate-900">{m.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          m.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200/60 text-slate-600'
                        }`}>
                          {m.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{m.description}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-white text-slate-700 font-medium text-[11px] border border-slate-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Want to test your skills right now?</h3>
              <p className="text-xs text-slate-500">Jump into the Skill Gap engine to mark skills complete or practice an interview.</p>
            </div>
            <Link
              to="/app/skills"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-sm"
            >
              Update Skill Progress
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
