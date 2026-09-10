import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Bookmark,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Layers
} from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { Modal } from '../components/Modal';
import { api, Job } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const JobsPage: React.FC = () => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'applied'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [minMatch, setMinMatch] = useState<number>(0);

  // Modals & Toasts
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const allJobs = await api.listJobs({
        q: searchQuery,
        location: locationFilter,
        job_type: jobTypeFilter,
        experience_level: experienceFilter,
        min_match: minMatch > 0 ? minMatch : undefined,
        user_id: user?.id || 1,
      });
      setJobs(allJobs);

      const saved = await api.getSavedJobs(user?.id || 1);
      setSavedJobs(saved);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [user, searchQuery, locationFilter, jobTypeFilter, experienceFilter, minMatch]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveToggle = async (jobId: number, currentSaved: boolean) => {
    try {
      if (currentSaved) {
        await api.unsaveJob(jobId, user?.id || 1);
        showToast('Removed from saved list');
      } else {
        await api.saveJob(jobId, 'saved', user?.id || 1);
        showToast('Job bookmarked!');
      }
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (jobId: number) => {
    try {
      await api.saveJob(jobId, 'applied', user?.id || 1);
      showToast('Application marked as submitted!');
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  // Determine displayed list by tab
  const displayedJobs = () => {
    if (activeTab === 'saved') {
      return savedJobs.filter((j) => j.is_saved);
    } else if (activeTab === 'applied') {
      return savedJobs.filter((j) => j.is_applied);
    }
    return jobs;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-3 text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-slide-up">
          <Sparkles className="h-4 w-4 text-brand-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Job Recommendations</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Autonomous semantic matching ranked against your <strong>{user?.career_goal || 'active'}</strong> skill set.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 text-xs font-semibold text-slate-600 dark:text-slate-400 overflow-x-auto no-scrollbar w-full sm:w-auto border border-slate-200/60 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none text-center ${
              activeTab === 'all' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Roles ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none text-center ${
              activeTab === 'saved' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Saved ({savedJobs.filter((j) => j.is_saved).length})
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none text-center ${
              activeTab === 'applied' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Applied ({savedJobs.filter((j) => j.is_applied).length})
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, or keyword (e.g. Swiggy, Python)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Locations</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Gurugram">Gurugram</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Remote">Remote / Hybrid</option>
            </select>
          </div>

          {/* Job Type */}
          <div className="relative">
            <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <select
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Minimum Match % */}
          <div className="relative">
            <Sparkles className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <select
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="0">Any Match %</option>
              <option value="80">High Match (&gt;= 80%)</option>
              <option value="60">Medium Match (&gt;= 60%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Grid */}
      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            <p>Evaluating openings and computing match vectors...</p>
          </div>
        </div>
      ) : displayedJobs().length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500 mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No jobs match your current filters</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try lowering the minimum match threshold or resetting keyword filters to discover more openings.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setLocationFilter('');
              setJobTypeFilter('');
              setExperienceFilter('');
              setMinMatch(0);
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/60"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedJobs().map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSaveToggle={handleSaveToggle}
              onApply={handleApply}
              onViewDetails={(j) => setSelectedJob(j)}
            />
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          title={selectedJob.title}
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{selectedJob.company}</span>
                <p className="text-slate-500 dark:text-slate-400">{selectedJob.location} • {selectedJob.job_type} • {selectedJob.experience_level}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedJob.salary_range}</span>
                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">{selectedJob.match_percentage}% Profile Fit</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">About the Role</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedJob.description}</p>
            </div>

            {selectedJob.why_matched && (
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-3 text-blue-950 dark:text-blue-200">
                <p className="font-bold mb-1 flex items-center gap-1.5 text-blue-900 dark:text-blue-300">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  Why you match this role:
                </p>
                <p>{selectedJob.why_matched}</p>
              </div>
            )}

            {/* Matching & Missing Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-3">
                <p className="font-bold text-emerald-800 dark:text-emerald-300 mb-1.5">Matching Competencies ({selectedJob.matching_skills?.length || 0})</p>
                <div className="flex flex-wrap gap-1">
                  {selectedJob.matching_skills?.map((s) => (
                    <span key={s} className="bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded font-medium text-[11px]">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3">
                <p className="font-bold text-rose-800 dark:text-rose-300 mb-1.5">Missing Skills ({selectedJob.missing_skills?.length || 0})</p>
                <div className="flex flex-wrap gap-1">
                  {selectedJob.missing_skills?.map((s) => (
                    <span key={s} className="bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-2 py-0.5 rounded font-medium text-[11px]">
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
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
                {selectedJob.is_applied ? 'Applied' : 'Apply Now'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
