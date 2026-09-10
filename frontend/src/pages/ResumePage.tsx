import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Layers,
  ChevronDown
} from 'lucide-react';
import { api, ResumeAnalysisResult, Job } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const ResumePage: React.FC = () => {
  const { user } = useAuth();

  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [jobComparison, setJobComparison] = useState<any | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [showPastedMode, setShowPastedMode] = useState(false);

  useEffect(() => {
    // Load existing resume or preloaded sample
    const loadInitial = async () => {
      try {
        const latest = await api.getLatestResume(user?.id || 1);
        setAnalysis(latest);
      } catch (err) {
        console.warn('No existing resume found, ready for upload.');
      }
      try {
        const allJobs = await api.listJobs({ user_id: user?.id || 1 });
        setJobs(allJobs);
        if (allJobs.length > 0) setSelectedJobId(allJobs[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    loadInitial();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.uploadResume(formData, user?.id || 1);
      setAnalysis(res);
      setJobComparison(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze PDF file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadSample = async () => {
    setIsUploading(true);
    setErrorMsg(null);
    try {
      const res = await api.loadSampleResume(user?.id || 1);
      setAnalysis(res);
      setJobComparison(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load sample resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePastedSubmit = async () => {
    if (!pastedText.trim()) return;
    setIsUploading(true);
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append('raw_text', pastedText);
      const res = await api.uploadResume(formData, user?.id || 1);
      setAnalysis(res);
      setJobComparison(null);
      setShowPastedMode(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to analyze text');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompareJob = async () => {
    if (!analysis?.id || !selectedJobId) return;
    setIsComparing(true);
    try {
      const res = await api.compareResumeWithJob(analysis.id, selectedJobId);
      setJobComparison(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200 mb-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          Transparent Rubric Scoring • No Fake ATS Guarantees
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Resume Analysis & Improvement</h1>
        <p className="text-xs text-slate-500 mt-1">
          Extract technical skills, verify quantitative impact metrics, detect action verbs, and benchmark your resume against specific target openings.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-6 text-center hover:border-brand-500 transition-colors relative">
        <UploadCloud className="mx-auto h-10 w-10 text-slate-400 mb-2" />
        <h3 className="text-sm font-bold text-slate-800">Upload your Resume (PDF)</h3>
        <p className="text-xs text-slate-500 mt-1">
          Drag and drop your file here, or click browse to upload from your device.
        </p>

        {errorMsg && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-2 text-xs text-rose-700">
            <AlertTriangle className="h-4 w-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-sm">
            <span>{isUploading ? 'Analyzing...' : 'Browse PDF File'}</span>
            <input
              type="file"
              accept=".pdf,.txt"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>

          <button
            type="button"
            onClick={handleLoadSample}
            disabled={isUploading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Load Sample Student Resume (Aditi Rao)
          </button>

          <button
            type="button"
            onClick={() => setShowPastedMode(!showPastedMode)}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            {showPastedMode ? 'Hide Text Area' : 'Or Paste Raw Resume Text'}
          </button>
        </div>

        {/* Paste raw text mode */}
        {showPastedMode && (
          <div className="mt-4 max-w-xl mx-auto text-left">
            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste the text of your resume here..."
              className="w-full p-3 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              onClick={handlePastedSubmit}
              disabled={isUploading || !pastedText.trim()}
              className="mt-2 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-brand-600 hover:bg-brand-500"
            >
              Analyze Pasted Text
            </button>
          </div>
        )}
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="space-y-6">
          {/* Main Score Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25">
                  <div className="text-center">
                    <span className="text-xl sm:text-2xl font-black">{analysis.score}</span>
                    <span className="text-[10px] block opacity-80">/ 100</span>
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">Overall Resume Score</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {analysis.score >= 75 ? 'Placement Ready' : 'Needs Optimization'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Evaluated for <strong>{analysis.filename}</strong> with multi-category rubric analysis.
                  </p>
                </div>
              </div>

              {/* Sub-Score Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Sections</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {analysis.score_breakdown?.sections || 25} / 25
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Skills Breadth</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {analysis.score_breakdown?.skills || 25} / 30
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Impact Metrics</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {analysis.score_breakdown?.impact || 20} / 25
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Action Verbs</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {analysis.score_breakdown?.formatting || 18} / 20
                  </p>
                </div>
              </div>
            </div>

            {/* Diagnostic Counters */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span><strong>{analysis.extracted_skills?.length || 0}</strong> technical skills identified</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-brand-500" />
                <span><strong>{analysis.quantified_bullet_count || 0}</strong> quantified metrics detected</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span><strong>{analysis.action_verb_count || 0}</strong> strong action verbs found</span>
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
                  ✓
                </span>
                Detected Strengths
              </h3>
              <ul className="mt-4 space-y-2.5">
                {analysis.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Improve */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50 text-amber-600 text-xs font-bold">
                  !
                </span>
                Actionable Areas to Improve
              </h3>
              <ul className="mt-4 space-y-2.5">
                {analysis.areas_to_improve?.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="h-4 w-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Extracted Skills Tag Cloud */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Recognized Technical & Domain Skills ({analysis.extracted_skills?.length || 0})
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Skills extracted from your resume via normalized ontology mapping:
            </p>
            <div className="flex flex-wrap gap-2">
              {analysis.extracted_skills?.map((s) => (
                <span key={s} className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Compare Resume Against a Specific Job */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-blue-50/40 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-indigo-100">
              <div>
                <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-600" />
                  Compare Resume Against Target Opening
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  See how well your resume matches any specific job currently in the placement directory.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedJobId || ''}
                  onChange={(e) => setSelectedJobId(Number(e.target.value))}
                  className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-indigo-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.company}: {j.title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleCompareJob}
                  disabled={isComparing}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50 text-center justify-center"
                >
                  {isComparing ? 'Comparing...' : 'Compare Fit'}
                </button>
              </div>
            </div>

            {/* Comparison Result */}
            {jobComparison && (
              <div className="mt-5 space-y-4 animate-slide-up">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900">
                    Fit for {jobComparison.job_title} at {jobComparison.company}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm">
                    {jobComparison.match_percentage}% Match
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-white border border-emerald-200">
                    <p className="font-bold text-emerald-800 mb-1.5">Resume Has ({jobComparison.matching_skills?.length || 0}):</p>
                    <div className="flex flex-wrap gap-1">
                      {jobComparison.matching_skills?.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-100">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-rose-200">
                    <p className="font-bold text-rose-800 mb-1.5">Add to Resume ({jobComparison.missing_skills?.length || 0}):</p>
                    <div className="flex flex-wrap gap-1">
                      {jobComparison.missing_skills?.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-medium text-[11px] border border-rose-100">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-indigo-900/80 bg-white/70 p-3 rounded-lg border border-indigo-100">
                  {jobComparison.why_matched}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
