import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Target,
  CheckCircle2,
  MessageSquareCode,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Calendar,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { JobCard } from '../components/JobCard';
import { Modal } from '../components/Modal';
import { api, DashboardSummary, Job } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      const data = await api.getDashboardSummary(user?.id || 1);
      setSummary(data);
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [user]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveToggle = async (jobId: number, currentSaved: boolean) => {
    try {
      if (currentSaved) {
        await api.unsaveJob(jobId, user?.id || 1);
        showToast('Job removed from saved list');
      } else {
        await api.saveJob(jobId, 'saved', user?.id || 1);
        showToast('Job saved to your bookmarks!');
      }
      fetchSummary();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (jobId: number) => {
    try {
      await api.saveJob(jobId, 'applied', user?.id || 1);
      showToast('Application marked as submitted!');
      fetchSummary();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-xs">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          <p>Compiling placement intelligence...</p>
        </div>
      </div>
    );
  }

  const readinessScore = summary?.career_readiness || 64;
  const resumeScore = summary?.resume_score || 78;
  const skillsMatched = summary?.skills_matched_count || 12;
  const skillsTotal = summary?.total_skills_required || 18;
  const interviewCount = summary?.interview_progress_count || 8;
  const interviewTarget = summary?.total_interview_target || 20;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-3 text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-slide-up">
          <Sparkles className="h-4 w-4 text-brand-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6 lg:p-8 text-white shadow-md border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300 border border-brand-500/30 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              Target Career: {summary?.career_goal || user?.career_goal || 'Data Scientist'}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {summary?.user_name || user?.full_name || 'Student'}!
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 max-w-xl">
              You are currently <strong className="text-brand-400 font-semibold">{readinessScore}% career-ready</strong> for campus placement drives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 w-full sm:w-auto">
            <Link
              to="/app/interview"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-sm"
            >
              <MessageSquareCode className="h-4 w-4" />
              Practice Interview
            </Link>
            <Link
              to="/app/resume"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Scan Resume
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Resume Score"
          value={`${resumeScore} / 100`}
          subtitle="Rubric ATS & Impact Evaluation"
          badge={resumeScore >= 75 ? 'Strong' : 'Needs Polish'}
          icon={FileText}
          color="blue"
          progress={resumeScore}
        />

        <MetricCard
          title="Career Readiness"
          value={`${readinessScore}%`}
          subtitle={`Curriculum for ${summary?.career_goal || 'Target Role'}`}
          badge={readinessScore >= 70 ? 'Interview Ready' : 'In Progress'}
          icon={Target}
          color="indigo"
          progress={readinessScore}
        />

        <MetricCard
          title="Skills Matched"
          value={`${skillsMatched} / ${skillsTotal}`}
          subtitle={`${skillsTotal - skillsMatched} high-impact skills missing`}
          badge={`${Math.round((skillsMatched / (skillsTotal || 1)) * 100)}% Matched`}
          icon={CheckCircle2}
          color="emerald"
          progress={(skillsMatched / (skillsTotal || 1)) * 100}
        />

        <MetricCard
          title="Interview Progress"
          value={`${interviewCount} / ${interviewTarget}`}
          subtitle="Completed mock evaluations"
          badge={`${interviewCount} Done`}
          icon={MessageSquareCode}
          color="amber"
          progress={(interviewCount / (interviewTarget || 1)) * 100}
        />
      </div>

      {/* Career Readiness Overview & Skill Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Meter & Roadmap Shortcut */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Placement Readiness Overview</h2>
              <p className="text-xs text-slate-500">Benchmark calculated against active tech hiring standards</p>
            </div>
            <Link
              to="/app/skills"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              Skill Gap Dashboard <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Role Competency Fulfillment</span>
                <span className="text-brand-600">{readinessScore}% Complete</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-600 transition-all duration-700"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
            </div>

            {/* High Priority Gaps */}
            {summary?.high_priority_gaps && summary.high_priority_gaps.length > 0 && (
              <div className="mt-4 rounded-xl bg-amber-50/70 border border-amber-200/80 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span>Immediate High-ROI Skills to Learn for Campus Drives</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {summary.high_priority_gaps.map((gap) => (
                    <Link
                      key={gap}
                      to={`/app/skills?highlight=${encodeURIComponent(gap)}`}
                      className="px-3 py-1 bg-white border border-amber-300 rounded-lg text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors"
                    >
                      ⚡ Learn {gap} →
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions Bar */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/app/roadmap"
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-brand-50 hover:border-brand-200 transition-all text-left group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-brand-700">Career Roadmap</p>
                <p className="text-[11px] text-slate-500 mt-0.5">View your 4-phase timeline</p>
              </Link>
              <Link
                to="/app/interview"
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-left group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">Mock Interview</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Solve a question in 5 mins</p>
              </Link>
              <Link
                to="/app/jobs"
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left group"
              >
                <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Job Matches</p>
                <p className="text-[11px] text-slate-500 mt-0.5">15 active verified openings</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 pb-4 border-b border-slate-100">Recent Activity</h2>
            <div className="mt-4 space-y-3.5">
              {summary?.recent_activities && summary.recent_activities.length > 0 ? (
                summary.recent_activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 font-bold">
                      •
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 truncate">{act.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{act.description}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{act.timestamp}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">No recent activities yet.</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              to="/app/profile"
              className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center justify-between"
            >
              <span>Manage Profile & Skills</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Top Recommended Jobs Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Top Recommended Jobs for You</h2>
            <p className="text-xs text-slate-500">Based on your {user?.career_goal || 'current'} skills & profile match score</p>
          </div>
          <Link
            to="/app/jobs"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            View All Jobs <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {summary?.top_recommended_jobs && summary.top_recommended_jobs.length > 0 ? (
            summary.top_recommended_jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSaveToggle={handleSaveToggle}
                onApply={handleApply}
                onViewDetails={(j) => setSelectedJob(j)}
              />
            ))
          ) : (
            <p className="text-xs text-slate-500 col-span-3 py-6 text-center">
              No jobs found. Check back soon or adjust your skill profile.
            </p>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          title={selectedJob.title}
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-sm font-bold text-slate-900">{selectedJob.company}</span>
                <p className="text-slate-500">{selectedJob.location} • {selectedJob.job_type}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800">{selectedJob.salary_range}</span>
                <p className="text-[11px] font-semibold text-brand-600">{selectedJob.match_percentage}% Profile Match</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1">Role Description</h4>
              <p className="text-slate-600 leading-relaxed">{selectedJob.description}</p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-1.5">Required Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.required_skills?.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {selectedJob.why_matched && (
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-blue-900">
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  Why you match:
                </p>
                <p>{selectedJob.why_matched}</p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApply(selectedJob.id);
                  setSelectedJob(null);
                }}
                disabled={selectedJob.is_applied}
                className="px-5 py-2 rounded-lg font-bold text-white bg-brand-600 hover:bg-brand-500 transition-colors disabled:opacity-50"
              >
                {selectedJob.is_applied ? 'Applied' : 'Apply for this Role'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
