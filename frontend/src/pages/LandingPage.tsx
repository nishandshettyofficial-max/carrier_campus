import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Target,
  MessageSquareCode,
  Briefcase,
  TrendingUp,
  Award,
  Users,
  Star,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const { demoLogin } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleDemoClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    demoLogin();
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white selection:bg-brand-500 selection:text-white transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-md shadow-brand-500/25 flex-shrink-0">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
                CareerCompass
                <span className="hidden xs:inline-block rounded-full bg-brand-50 dark:bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
                  AI Placements
                </span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-slate-900 dark:hover:text-white transition-colors">Success Stories</a>
            <Link to="/app/jobs" className="hover:text-slate-900 dark:hover:text-white transition-colors">Explore Jobs</Link>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={isDark ? "Switch to Day mode" : "Switch to Dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
            </button>

            <button
              onClick={handleDemoClick}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-500 dark:text-brand-400" />
              <span className="hidden xs:inline">1-Click </span>Demo
            </button>
            <Link
              to="/login"
              className="hidden sm:inline-block px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-lg shadow-md shadow-brand-600/30 transition-all"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 px-4 py-4 space-y-3 animate-slide-up shadow-lg">
            <a href="#features" onClick={() => setMobileNavOpen(false)} className="block text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-1">Features</a>
            <a href="#how-it-works" onClick={() => setMobileNavOpen(false)} className="block text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-1">How It Works</a>
            <a href="#testimonials" onClick={() => setMobileNavOpen(false)} className="block text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-1">Success Stories</a>
            <Link to="/app/jobs" onClick={() => setMobileNavOpen(false)} className="block text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-1">Explore Jobs</Link>
            
            <div className="flex items-center justify-between py-2 border-t border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                {isDark ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-indigo-600" />}
                {isDark ? "Day Mode" : "Dark Mode"}
              </button>
            </div>

            <div className="pt-2 flex gap-3">
              <Link to="/login" onClick={() => setMobileNavOpen(false)} className="flex-1 text-center py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">Log in</Link>
              <Link to="/signup" onClick={() => setMobileNavOpen(false)} className="flex-1 text-center py-2 text-xs font-semibold text-white bg-brand-600 rounded-xl">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-28 lg:pb-36">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[250px] sm:h-[350px] bg-brand-500/15 blur-[100px] sm:blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[250px] sm:w-[400px] h-[200px] sm:h-[300px] bg-indigo-500/15 blur-[80px] sm:blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 sm:px-3.5 py-1 text-[11px] sm:text-xs font-medium text-brand-600 dark:text-brand-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            AI & Data Science Degree Project • 2026 Edition
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.2] sm:leading-[1.15]">
            Build the skills. <br />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-sky-600 dark:from-brand-400 dark:via-indigo-300 dark:to-sky-300 bg-clip-text text-transparent">
              Find the opportunities.
            </span> <br />
            Get career-ready.
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CareerCompass combines NLP resume parsing, semantic job matching, skill gap discovery, and AI-driven mock interviews to empower college students and freshers to land top tech roles.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto sm:max-w-none">
            <Link
              to="/signup"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30 hover:scale-105 transition-all"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 rounded-xl transition-all shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-brand-500 dark:text-brand-400" />
              Explore Interactive Demo
            </button>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-10">
            <div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">250+</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ontology Skills Tracked</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">94%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Skill Match Precision</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white">5</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Core Tech Career Tracks</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">Instant</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">AI Interview Feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-24 bg-slate-100/70 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Complete AI Placement Suite</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything you need to conquer your campus placements.
            </p>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Designed as an end-to-end companion from initial skill discovery to your final technical interview rounds.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 hover:border-brand-500/50 shadow-sm hover:shadow-md transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">1. Job Recommendations</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Smart recommendation algorithm that matches your current skills against live openings, transparently showing matched vs missing skills and match percentages.
              </p>
              <Link to="/app/jobs" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300">
                Browse Roles <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 hover:border-brand-500/50 shadow-sm hover:shadow-md transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">2. Resume Analyzer</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload your PDF resume to extract skills, evaluate action verbs, verify quantified outcomes, and get a transparent 0-100 rubric score with tailored improvement points.
              </p>
              <Link to="/app/resume" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300">
                Analyze Resume <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 hover:border-brand-500/50 shadow-sm hover:shadow-md transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">3. Skill Gap Analysis</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Benchmark your competencies against industry requirements for Data Science, AI, and Software Engineering. Get prioritized learning steps with free resources.
              </p>
              <Link to="/app/skills" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300">
                Check Skill Gaps <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 hover:border-brand-500/50 shadow-sm hover:shadow-md transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                <MessageSquareCode className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">4. Mock Interview Coach</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Practice technical, HR, and project questions. Submit your answers to receive instant scoring, missing points diagnosis, and benchmark model answers.
              </p>
              <Link to="/app/interview" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300">
                Practice Questions <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Step-by-Step Flow</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How CareerCompass guides your placement journey
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative shadow-sm">
              <span className="text-3xl font-black text-brand-600/30 dark:text-brand-500/40">01</span>
              <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">Set Your Career Target</h4>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Choose between Data Analyst, Data Scientist, ML Engineer, Software Developer, or AI Engineer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative shadow-sm">
              <span className="text-3xl font-black text-brand-600/30 dark:text-brand-500/40">02</span>
              <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">Scan Resume & Gaps</h4>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload your resume to extract skills and instantly reveal missing high-priority competencies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative shadow-sm">
              <span className="text-3xl font-black text-brand-600/30 dark:text-brand-500/40">03</span>
              <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">Follow the Roadmap</h4>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Learn via curated free courses and mark skills complete to watch your readiness score climb.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative shadow-sm">
              <span className="text-3xl font-black text-brand-600/30 dark:text-brand-500/40">04</span>
              <h4 className="mt-2 text-base font-bold text-slate-900 dark:text-white">Ace Mock Interviews</h4>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Answer real placement questions and apply directly to matched roles with top employers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-100/70 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Student Success</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Built for students, validated by real placements
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "The skill gap analysis pointed out that I lacked Docker and FastAPI for ML Engineer roles. After completing the recommended learning path, I secured an offer from PhonePe!"
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center font-bold text-xs text-white">
                  RS
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Rahul Sharma</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">B.Tech 2026 • Placed at PhonePe</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "The mock interview feature is incredible. When I answered the Bias-Variance question, the AI explicitly highlighted that I forgot the L1/L2 regularization angle."
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  PK
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Pooja Kulkarni</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Data Science Major • Placed at Swiggy</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "Resume scoring helped me replace vague project descriptions with quantified impact metrics. My score improved from 62 to 84!"
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                  AM
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Anand Menon</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">AI Engineer Intern at Razorpay</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Ready to accelerate your career preparation?
          </h2>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Test your skills, optimize your resume, and simulate real technical interviews now.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30 transition-all text-center"
            >
              Get Started Free
            </Link>
            <button
              onClick={handleDemoClick}
              className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-all shadow-sm"
            >
              Explore Demo Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>© 2026 CareerCompass. Built with AI & Data Science for engineering students and placement success.</p>
      </footer>
    </div>
  );
};
