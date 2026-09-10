import React from 'react';
import { Bookmark, CheckCircle2, Sparkles, MapPin, Briefcase, IndianRupee, ArrowUpRight } from 'lucide-react';
import { Job } from '../api/client';

interface JobCardProps {
  job: Job;
  onSaveToggle: (jobId: number, currentSaved: boolean) => void;
  onApply: (jobId: number) => void;
  onViewDetails: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSaveToggle,
  onApply,
  onViewDetails,
}) => {
  const match = job.match_percentage || 0;

  // Match badge styling based on percentage
  const getMatchBadge = (score: number) => {
    if (score >= 80) {
      return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    } else if (score >= 60) {
      return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    } else {
      return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Header: Title, Company, Match % */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 tracking-wide uppercase block truncate">{job.company}</span>
            <h3
              className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors cursor-pointer leading-snug"
              onClick={() => onViewDetails(job)}
            >
              {job.title}
            </h3>
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${getMatchBadge(match)}`}>
            <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{match}% Match</span>
          </div>
        </div>

        {/* Location, Type, Salary */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <span className="truncate">{job.job_type} • {job.experience_level}</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
            <IndianRupee className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
            <span>{job.salary_range}</span>
          </span>
        </div>

        {/* Short Description */}
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Why this matches */}
        {job.why_matched && (
          <div className="mt-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 p-2 sm:p-2.5 text-[11px] text-blue-900 dark:text-blue-200 border border-blue-100 dark:border-blue-900/50 flex items-start gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{job.why_matched}</span>
          </div>
        )}

        {/* Skills Breakdown */}
        <div className="mt-3.5 space-y-2">
          {job.matching_skills && job.matching_skills.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Matching Skills</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {job.matching_skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="rounded-md bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
                    ✓ {skill}
                  </span>
                ))}
                {job.matching_skills.length > 4 && (
                  <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    +{job.matching_skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {job.missing_skills && job.missing_skills.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Missing Skills</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {job.missing_skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="rounded-md bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80">
                    + {skill}
                  </span>
                ))}
                {job.missing_skills.length > 3 && (
                  <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    +{job.missing_skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(job)}
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition-colors py-1"
        >
          Details
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSaveToggle(job.id, !!job.is_saved)}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              job.is_saved
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            title={job.is_saved ? 'Job Saved' : 'Save Job'}
          >
            <Bookmark className={`h-4 w-4 ${job.is_saved ? 'fill-amber-500' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => onApply(job.id)}
            disabled={job.is_applied}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              job.is_applied
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 cursor-default flex items-center gap-1'
                : 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
            }`}
          >
            {job.is_applied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Applied
              </>
            ) : (
              'Apply Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
