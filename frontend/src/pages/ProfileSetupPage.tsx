import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, GraduationCap, Calendar, Briefcase, Award, CheckCircle2, ArrowRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api/client';

const POPULAR_SKILLS = [
  "Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "Machine Learning",
  "Deep Learning", "PyTorch", "FastAPI", "Docker", "Git", "Data Analysis",
  "Excel", "Power BI", "Statistics", "Exploratory Data Analysis", "React",
  "JavaScript", "PostgreSQL", "Large Language Models", "LangChain"
];

export const ProfileSetupPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [degree, setDegree] = useState(user?.degree || 'B.Tech in Artificial Intelligence & Data Science');
  const [yearOfStudy, setYearOfStudy] = useState(user?.year_of_study || 'Final Year (2026)');
  const [careerGoal, setCareerGoal] = useState(user?.career_goal || 'Data Scientist');
  const [experienceLevel, setExperienceLevel] = useState(user?.experience_level || 'Entry Level / Fresher');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    user?.current_skills && user.current_skills.length > 0
      ? user.current_skills
      : ["Python", "SQL", "Pandas", "NumPy", "Git"]
  );
  const [customSkill, setCustomSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    if (user) {
      const updatedUser = {
        ...user,
        degree,
        year_of_study: yearOfStudy,
        career_goal: careerGoal,
        experience_level: experienceLevel,
        current_skills: selectedSkills,
      };
      api.updateProfile(updatedUser, user.id).catch(console.warn);
      refreshUser().catch(console.warn);
    }
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          title={isDark ? "Switch to Day mode" : "Switch to Dark mode"}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
        </button>
      </div>

      <div className="max-w-3xl mx-auto z-10 relative">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/30 mb-3">
            <Compass className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Complete Your Placement Profile
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Tell us about your educational background, target career, and current competencies so we can personalize your matches and roadmaps.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          {/* Degree & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                Degree / Specialization
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="e.g. B.Tech in Computer Science"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                Year of Study
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Final Year (2026)">Final Year (2026)</option>
                <option value="Pre-Final Year (2027)">Pre-Final Year (2027)</option>
                <option value="Recent Graduate (2025)">Recent Graduate (2025)</option>
                <option value="Postgraduate / Masters">Postgraduate / Masters</option>
              </select>
            </div>
          </div>

          {/* Career Goal & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                Target Placement Role
              </label>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Data Scientist">Data Scientist</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                <option value="AI Engineer">AI Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Software Developer">Software Developer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Entry Level / Fresher">Entry Level / Fresher (0-1 yrs)</option>
                <option value="Internship Seeker">Internship Seeker</option>
                <option value="Early Professional (1-2 yrs)">Early Professional (1-2 yrs)</option>
              </select>
            </div>
          </div>

          {/* Skills Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Select Your Current Skills ({selectedSkills.length} selected)
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Click on the technologies you are comfortable with. These feed directly into our recommendation algorithm.
            </p>

            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
              {POPULAR_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-brand-600 text-white font-semibold shadow-sm border border-brand-500'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                  </button>
                );
              })}
            </div>

            {/* Add Custom Skill */}
            <form onSubmit={handleAddCustomSkill} className="mt-3 flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add other skill (e.g. OpenCV, XGBoost)..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
              >
                Add
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving Profile...' : 'Save & Enter Dashboard'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
