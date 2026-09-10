import React, { useState, useEffect } from 'react';
import {
  MessageSquareCode,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Clock,
  History,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api, InterviewQuestion, InterviewEvaluation, InterviewSubmission } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const InterviewPage: React.FC = () => {
  const { user } = useAuth();

  const [roleFilter, setRoleFilter] = useState(user?.career_goal || 'Data Scientist');
  const [categoryFilter, setCategoryFilter] = useState('technical');
  const [difficultyFilter, setDifficultyFilter] = useState('intermediate');

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // History tab
  const [activeTab, setActiveTab] = useState<'practice' | 'history'>('practice');
  const [history, setHistory] = useState<InterviewSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const qs = await api.listQuestions({
        role: roleFilter,
        category: categoryFilter,
        difficulty: difficultyFilter,
      });
      setQuestions(qs);
      if (qs.length > 0) {
        setActiveQuestion(qs[0]);
        setEvaluation(null);
        setUserAnswer('');
        setShowModelAnswer(false);
      } else {
        setActiveQuestion(null);
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const hist = await api.getInterviewHistory(user?.id || 1);
      setHistory(hist);
    } catch (err) {
      console.error('Failed to fetch interview history:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [roleFilter, categoryFilter, difficultyFilter]);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestion || !userAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await api.submitAnswer(activeQuestion.id, userAnswer, user?.id || 1);
      setEvaluation(result);
      fetchHistory();
    } catch (err) {
      console.error('Failed to evaluate answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const wordCount = userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Interactive Mock Interview Simulator
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Mock Interview Preparation</h1>
          <p className="text-xs text-slate-500 mt-1">
            Solve realistic technical, HR, and project questions. Receive instant scoring, key point verification, and model answers.
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap flex-1 sm:flex-none text-center ${
              activeTab === 'practice' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            Practice Simulator
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-none text-center ${
              activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            Past Submissions ({history.length})
          </button>
        </div>
      </div>

      {activeTab === 'practice' ? (
        <div className="space-y-6">
          {/* Controls Bar: Role, Category, Difficulty */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Target Domain Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Software Developer">Software Developer</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Interview Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="technical">Technical Questions</option>
                  <option value="hr">HR & Behavioral</option>
                  <option value="project">Project Experience</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Question Difficulty
                </label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="beginner">Beginner / Fresher</option>
                  <option value="intermediate">Intermediate (Standard)</option>
                  <option value="advanced">Advanced / In-Depth</option>
                </select>
              </div>
            </div>
          </div>

          {/* Question & Practice Form */}
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-slate-500 text-xs">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                <p>Loading curated interview questions...</p>
              </div>
            </div>
          ) : !activeQuestion ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-xs text-slate-500">
              No questions found for the selected combination. Try switching role or difficulty.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Question & Answer Box (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                        {activeQuestion.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                        {activeQuestion.difficulty}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Target: {activeQuestion.role}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {activeQuestion.question}
                  </h3>

                  {activeQuestion.tips && (
                    <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 text-xs text-amber-900 flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Recruiter Tip:</strong> {activeQuestion.tips}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <label className="font-semibold text-slate-700">Your Technical Response</label>
                      <span>{wordCount} words (aim for 35 - 150 words)</span>
                    </div>
                    <textarea
                      rows={7}
                      required
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your explanation here. Touch upon key trade-offs, architecture, and practical examples..."
                      className="w-full p-3.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 font-normal leading-relaxed"
                    />

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          // Load sample answer into input for testing
                          setUserAnswer((activeQuestion.sample_good_answer || 'Bias is error from inaccurate assumptions leading to underfitting, whereas variance is sensitivity to fluctuations. Regularization penalizes complex weights.').slice(0, 180) + '...');
                        }}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium text-left sm:text-left py-1"
                      >
                        ⚡ Insert Sample Answer Snippet
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting || !userAnswer.trim()}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-md shadow-brand-600/20 transition-all disabled:opacity-50 w-full sm:w-auto"
                      >
                        <Send className="h-3.5 w-3.5" />
                        {isSubmitting ? 'AI Evaluating...' : 'Submit for AI Evaluation'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* AI Evaluation Card */}
                {evaluation && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 animate-slide-up">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-lg shadow-sm">
                          {evaluation.score}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">AI Evaluation Report</h4>
                          <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                            evaluation.score >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            Verdict: {evaluation.correctness}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                      <strong>Constructive Feedback:</strong> {evaluation.feedback}
                    </div>

                    {/* Points Covered vs Missing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3.5">
                        <p className="font-bold text-emerald-800 mb-1.5">Key Concepts Covered ({evaluation.key_points_covered?.length || 0}):</p>
                        <ul className="space-y-1">
                          {evaluation.key_points_covered?.map((kp, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px] text-emerald-900">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span>{kp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-xl bg-rose-50/70 border border-rose-200 p-3.5">
                        <p className="font-bold text-rose-800 mb-1.5">Points to Mention Next Time ({evaluation.missing_points?.length || 0}):</p>
                        <ul className="space-y-1">
                          {evaluation.missing_points?.map((mp, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px] text-rose-900">
                              <AlertCircle className="h-3.5 w-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                              <span>{mp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Expandable Benchmark Model Answer */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setShowModelAnswer(!showModelAnswer)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-brand-600" />
                          View Benchmark Model Answer
                        </span>
                        {showModelAnswer ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>

                      {showModelAnswer && (
                        <div className="mt-3 p-4 rounded-xl bg-slate-900 text-slate-200 text-xs leading-relaxed whitespace-pre-line font-mono">
                          {evaluation.model_answer}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: Question Bank Selector (4 cols) */}
              <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Question Bank ({questions.length})
                </h4>
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {questions.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setActiveQuestion(q);
                        setEvaluation(null);
                        setUserAnswer('');
                        setShowModelAnswer(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        activeQuestion?.id === q.id
                          ? 'bg-brand-50 border-brand-300 text-brand-900 font-semibold shadow-sm'
                          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>Q{idx + 1}</span>
                        <span className="capitalize">{q.difficulty}</span>
                      </div>
                      <p className="line-clamp-2 leading-relaxed">{q.question}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* History View */
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Past Mock Interview Submissions</h3>
          {history.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No submissions recorded yet. Start practicing questions!</p>
          ) : (
            <div className="space-y-4">
              {history.map((sub) => (
                <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{sub.question_text}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                      sub.score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sub.score}/100 • {sub.correctness}
                    </span>
                  </div>
                  <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80 italic">
                    "{sub.user_answer}"
                  </p>
                  <p className="text-slate-700"><strong>AI Feedback:</strong> {sub.feedback}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
