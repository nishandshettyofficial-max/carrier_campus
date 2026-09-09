import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  GraduationCap,
  Briefcase,
  Award,
  Save,
  LogOut,
  Sparkles,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const ProfilePage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || 'Aditi Rao');
  const [degree, setDegree] = useState(user?.degree || 'B.Tech in Artificial Intelligence & Data Science');
  const [yearOfStudy, setYearOfStudy] = useState(user?.year_of_study || 'Final Year (2026)');
  const [careerGoal, setCareerGoal] = useState(user?.career_goal || 'Data Scientist');
  const [experienceLevel, setExperienceLevel] = useState(user?.experience_level || 'Entry Level / Fresher');
  const [skills, setSkills] = useState<string[]>(user?.current_skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
      setDegree(user.degree);
      setYearOfStudy(user.year_of_study);
      setCareerGoal(user.career_goal);
      setExperienceLevel(user.experience_level);
      setSkills(user.current_skills || []);
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateProfile(
        {
          full_name: fullName,
          degree,
          year_of_study: yearOfStudy,
          career_goal: careerGoal,
          experience_level: experienceLevel,
          current_skills: skills,
        },
        user?.id || 1
      );
      await refreshUser();
      showToast('Profile and skills saved successfully!');
    } catch (err: any) {
      console.error(err);
      showToast('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 rounded-xl bg-slate-900 text-white px-4 py-3 text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-slide-up">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Profile & Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, academic background, career objectives, and technical skillset.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Academic Info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-brand-600" />
            Basic Candidate Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Registered Email</label>
              <input
                type="email"
                disabled
                value={user?.email || 'demo@careercompass.ai'}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Degree / Major</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Year of Study</label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Final Year (2026)">Final Year (2026)</option>
                <option value="Pre-Final Year (2027)">Pre-Final Year (2027)</option>
                <option value="Recent Graduate (2025)">Recent Graduate (2025)</option>
                <option value="Postgraduate / Masters">Postgraduate / Masters</option>
              </select>
            </div>
          </div>
        </div>

        {/* Target Career & Experience */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-brand-600" />
            Placement Objectives
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Primary Career Goal</label>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Data Scientist">Data Scientist</option>
                <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                <option value="AI Engineer">AI Engineer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Software Developer">Software Developer</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Entry Level / Fresher">Entry Level / Fresher</option>
                <option value="Internship Seeker">Internship Seeker</option>
                <option value="Early Professional (1-2 yrs)">Early Professional (1-2 yrs)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Technical Skills Management */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Award className="h-4 w-4 text-brand-600" />
            Skills Portfolio ({skills.length})
          </h2>
          <p className="text-xs text-slate-500">
            These skills power your match percentages on the Jobs page and your Career Readiness index.
          </p>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-600 ml-1 transition-colors"
                  title="Remove skill"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. Scikit-learn, Docker, Tableau)..."
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 w-72"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Skill
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
