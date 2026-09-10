import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  ExternalLink,
  Layers,
  TrendingUp,
  Award,
  Clock,
  ArrowRight
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { api, SkillGapData } from '../api/client';
import { useAuth } from '../context/AuthContext';

const CAREER_OPTIONS = [
  'Data Scientist',
  'Machine Learning Engineer',
  'AI Engineer',
  'Data Analyst',
  'Software Developer'
];

export const SkillGapPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedRole, setSelectedRole] = useState(
    searchParams.get('role') || user?.career_goal || 'Data Scientist'
  );
  const [gapData, setGapData] = useState<SkillGapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingSkill, setUpdatingSkill] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchGap = async (roleToFetch: string) => {
    setIsLoading(true);
    try {
      const res = await api.getSkillGap(roleToFetch, user?.id || 1);
      setGapData(res);
    } catch (err) {
      console.error('Failed to fetch skill gap:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGap(selectedRole);
  }, [selectedRole, user]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setSearchParams({ role });
  };

  const handleToggleComplete = async (skillName: string, isCurrentlyMastered: boolean) => {
    setUpdatingSkill(skillName);
    try {
      const nextStatus = isCurrentlyMastered ? 'not_started' : 'completed';
      await api.updateSkillProgress(skillName, nextStatus, user?.id || 1);
      await refreshUser();
      await fetchGap(selectedRole);
      showToast(
        isCurrentlyMastered
          ? `Removed ${skillName} from mastered list`
          : `🎉 Awesome! Marked ${skillName} as completed!`
      );
    } catch (err) {
      console.error('Failed to update skill status:', err);
    } finally {
      setUpdatingSkill(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-3 text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-slide-up">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Career Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 mb-2">
            <Target className="h-3.5 w-3.5" />
            Curriculum Alignment Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Skill Gap Analysis & Learning Paths</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare your present capabilities directly against real-world tech requirements.
          </p>
        </div>

        {/* Role Pill Selector */}
        <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {CAREER_OPTIONS.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                selectedRole === role
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !gapData ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            <p>Evaluating domain curriculum and skill requirements...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Banner: Role Description + Readiness Gauge */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Target Role</span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Market Range: {gapData.avg_salary}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{gapData.career_goal}</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{gapData.description}</p>

                {/* Progress Bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-700 dark:text-slate-300">Role Preparation Index</span>
                    <span className="text-brand-600 dark:text-brand-400">{gapData.readiness_score}% Complete</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 transition-all duration-700"
                      style={{ width: `${gapData.readiness_score}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Circular KPI */}
              <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-center">
                <div className="relative flex items-center justify-center h-24 w-24 rounded-full bg-white dark:bg-slate-900 shadow-sm border-4 border-brand-500/20">
                  <div className="text-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{gapData.readiness_score}%</span>
                    <span className="text-[9px] block text-slate-500 dark:text-slate-400 font-bold uppercase">Readiness</span>
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {gapData.matched_skills_count} of {gapData.total_skills_count} Core Skills Mastered
                </p>
              </div>
            </div>
          </div>

          {/* Recharts Radar Chart & Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Competency Domain Radar</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your mastered proficiency vs 100% role target by category</p>
              </div>

              <div className="h-[280px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={gapData.radar_data}>
                    <PolarGrid stroke="#94a3b8" strokeOpacity={0.3} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar
                      name="Your Proficiency"
                      dataKey="user_score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.4}
                    />
                    <Radar
                      name="Required Baseline"
                      dataKey="required_score"
                      stroke="#94a3b8"
                      fill="#cbd5e1"
                      fillOpacity={0.15}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  Your Profile Score
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  Required Benchmark
                </span>
              </div>
            </div>

            {/* Mastered Skills List */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Mastered Competencies ({gapData.mastered_skills.length})
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/80">
                    Verified Fit
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {gapData.mastered_skills.length > 0 ? (
                    gapData.mastered_skills.map((s) => (
                      <div
                        key={s}
                        className="flex items-center gap-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-3 py-1.5 text-xs text-emerald-900 dark:text-emerald-300 font-semibold"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{s}</span>
                        <button
                          onClick={() => handleToggleComplete(s, true)}
                          disabled={updatingSkill === s}
                          className="ml-1 text-[10px] text-emerald-700/60 dark:text-emerald-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          title="Unmark as completed"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-4">No skills logged yet. Mark skills complete below!</p>
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-4 border border-slate-200/70 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                💡 Mastered skills are saved permanently in your student profile and automatically factor into real-time job match calculations across the platform.
              </div>
            </div>
          </div>

          {/* Missing Skills by Priority & Action Buttons */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Prioritized Missing Skills</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click <strong>Mark as Completed</strong> as you learn these to instantly elevate your readiness score.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* High Priority */}
              {gapData.missing_high_priority.map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 p-5 flex flex-col justify-between hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                        High Priority (Core)
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{skill.level}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">{skill.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Domain: {skill.category}</p>

                    {/* Resources */}
                    {skill.resources && skill.resources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-amber-200/50 dark:border-amber-900/40 space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Free Resources:</p>
                        {skill.resources.map((res, i) => (
                          <a
                            key={i}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium group"
                          >
                            <span className="truncate">{res.title} ({res.platform})</span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleComplete(skill.name, false)}
                    disabled={updatingSkill === skill.name}
                    className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    {updatingSkill === skill.name ? 'Saving...' : 'Mark as Completed'}
                  </button>
                </div>
              ))}

              {/* Secondary Missing Skills */}
              {gapData.missing_secondary.map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900/60">
                        Secondary (Specialized)
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{skill.level}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-2">{skill.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Domain: {skill.category}</p>

                    {skill.resources && skill.resources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Free Resources:</p>
                        {skill.resources.map((res, i) => (
                          <a
                            key={i}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium group"
                          >
                            <span className="truncate">{res.title} ({res.platform})</span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleComplete(skill.name, false)}
                    disabled={updatingSkill === skill.name}
                    className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                    {updatingSkill === skill.name ? 'Saving...' : 'Mark as Completed'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Learning Order Path */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Recommended Sequential Learning Path</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Optimal pedagogical sequence designed to maximize placement interview performance.
            </p>

            <div className="space-y-4">
              {gapData.ordered_learning_path.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold text-xs">
                      {item.order}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.category} • {item.level} Level</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {item.resources && item.resources.length > 0 && (
                      <a
                        href={item.resources[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1"
                      >
                        Start Resource <ArrowRight className="h-3 w-3" />
                      </a>
                    )}
                    <button
                      onClick={() => handleToggleComplete(item.name, false)}
                      className="px-3 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
