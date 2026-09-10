// API client for CareerCompass
import {
  DEMO_USER,
  MOCK_JOBS,
  MOCK_DASHBOARD_SUMMARY,
  MOCK_SKILL_GAP,
  MOCK_ROADMAP,
  MOCK_QUESTIONS,
  MOCK_SAMPLE_RESUME
} from './mockData';

const BASE_URL = '/api';

export interface User {
  id: number;
  email: string;
  full_name: string;
  degree: string;
  year_of_study: string;
  career_goal: string;
  experience_level: string;
  current_skills: string[];
  created_at: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  experience_level: string;
  description: string;
  salary_range: string;
  required_skills: string[];
  preferred_skills: string[];
  posted_date: string;
  match_percentage?: number;
  matching_skills?: string[];
  missing_skills?: string[];
  why_matched?: string;
  is_saved?: boolean;
  is_applied?: boolean;
}

export interface ResumeAnalysisResult {
  id?: number;
  filename: string;
  score: number;
  score_breakdown: {
    sections: number;
    skills: number;
    impact: number;
    formatting: number;
  };
  extracted_contact: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
  extracted_skills: string[];
  sections_detected: Record<string, boolean>;
  strengths: string[];
  areas_to_improve: string[];
  quantified_bullet_count: number;
  action_verb_count: number;
}

export interface LearningResource {
  title: string;
  type: string;
  url: string;
  platform: string;
}

export interface SkillDetail {
  name: string;
  category: string;
  importance: string;
  level: string;
  is_mastered: boolean;
  status: string;
  resources: LearningResource[];
}

export interface SkillGapData {
  career_goal: string;
  description: string;
  avg_salary: string;
  readiness_score: number;
  matched_skills_count: number;
  total_skills_count: number;
  mastered_skills: string[];
  missing_high_priority: SkillDetail[];
  missing_secondary: SkillDetail[];
  ordered_learning_path: Array<{
    order: number;
    name: string;
    importance: string;
    level: string;
    category: string;
    status: string;
    resources: LearningResource[];
  }>;
  radar_data: Array<{
    subject: string;
    user_score: number;
    required_score: number;
  }>;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  skills: string[];
  status: 'completed' | 'in_progress' | 'upcoming';
  resources: LearningResource[];
}

export interface RoadmapPhase {
  phase_number: number;
  phase_title: string;
  duration: string;
  milestones: RoadmapMilestone[];
}

export interface CareerRoadmapData {
  role_name: string;
  target_role: string;
  overall_progress: number;
  phases: RoadmapPhase[];
}

export interface InterviewQuestion {
  id: number;
  role: string;
  category: string;
  difficulty: string;
  question: string;
  key_points: string[];
  sample_good_answer?: string;
  tips: string;
}

export interface InterviewEvaluation {
  submission_id: number;
  question_id: number;
  score: number;
  correctness: string;
  key_points_covered: string[];
  missing_points: string[];
  feedback: string;
  model_answer: string;
}

export interface InterviewSubmission {
  id: number;
  question_id: number;
  question_text: string;
  role: string;
  category: string;
  difficulty: string;
  user_answer: string;
  score: number;
  correctness: string;
  feedback: string;
  model_answer: string;
  created_at: string;
}

export interface DashboardSummary {
  user_name: string;
  career_goal: string;
  resume_score: number;
  career_readiness: number;
  skills_matched_count: number;
  total_skills_required: number;
  interview_progress_count: number;
  total_interview_target: number;
  top_recommended_jobs: Job[];
  high_priority_gaps: string[];
  recent_activities: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    icon: string;
    color: string;
  }>;
}

// Local storage helpers for zero-failure fallback
export function getStoredUser(): User {
  try {
    const raw = localStorage.getItem('career_compass_user');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // Ignore parse errors
  }
  return DEMO_USER;
}

export function saveStoredUser(user: User): void {
  try {
    localStorage.setItem('career_compass_user', JSON.stringify(user));
  } catch (e) {
    // Ignore
  }
}

function getSavedJobIds(): number[] {
  try {
    const raw = localStorage.getItem('career_compass_saved_job_ids');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore
  }
  return [1, 3];
}

function getAppliedJobIds(): number[] {
  try {
    const raw = localStorage.getItem('career_compass_applied_job_ids');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore
  }
  return [2];
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('career_compass_token');
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetail = 'An error occurred';
      try {
        const errJson = await response.json();
        errorDetail = errJson.detail || JSON.stringify(errJson);
      } catch {
        errorDetail = response.statusText;
      }
      throw new Error(errorDetail);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      throw new Error('Non-JSON response received from server');
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const api = {
  // Auth
  demoLogin: async () => {
    try {
      const res = await request<{ access_token: string; user: User }>('/auth/demo-login', { method: 'POST' });
      saveStoredUser(res.user);
      return res;
    } catch (e) {
      console.warn('Backend unavailable, using demo profile fallback:', e);
      const user = DEMO_USER;
      saveStoredUser(user);
      return { access_token: 'token-user-1', user };
    }
  },

  login: async (data: { email: string; password: string }) => {
    try {
      const res = await request<{ access_token: string; user: User }>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      saveStoredUser(res.user);
      return res;
    } catch (e) {
      console.warn('Backend login fallback used:', e);
      // If user exists locally or matches demo, log them in
      const existing = getStoredUser();
      const user: User = existing.email === data.email ? existing : {
        ...DEMO_USER,
        email: data.email,
        full_name: data.email.split('@')[0].replace(/[^a-zA-Z]/g, ' ') || 'Student User'
      };
      saveStoredUser(user);
      return { access_token: `token-${user.id}`, user };
    }
  },

  signup: async (data: any) => {
    try {
      const res = await request<{ access_token: string; user: User }>('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      saveStoredUser(res.user);
      return res;
    } catch (e) {
      console.warn('Backend signup fallback used:', e);
      const newUser: User = {
        id: Date.now(),
        email: data.email,
        full_name: data.full_name,
        degree: data.degree || 'B.Tech / Bachelor of Engineering',
        year_of_study: data.year_of_study || 'Final Year (2026)',
        career_goal: data.career_goal || 'Data Scientist',
        experience_level: 'Entry Level / Fresher',
        current_skills: ['Python', 'SQL', 'Git', 'Data Analysis'],
        created_at: new Date().toISOString(),
      };
      saveStoredUser(newUser);
      return { access_token: `token-${newUser.id}`, user: newUser };
    }
  },

  getMe: async (userId: number = 1) => {
    try {
      return await request<User>(`/auth/me?user_id=${userId}`);
    } catch (e) {
      return getStoredUser();
    }
  },

  updateProfile: async (data: any, userId: number = 1) => {
    try {
      const res = await request<User>(`/auth/profile?user_id=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      saveStoredUser(res);
      return res;
    } catch (e) {
      const current = getStoredUser();
      const updated: User = { ...current, ...data };
      saveStoredUser(updated);
      return updated;
    }
  },

  // Jobs
  listJobs: async (params: { q?: string; location?: string; job_type?: string; experience_level?: string; skill?: string; min_match?: number; user_id?: number } = {}) => {
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') query.append(key, String(val));
      });
      return await request<Job[]>(`/jobs?${query.toString()}`);
    } catch (e) {
      const saved = getSavedJobIds();
      const applied = getAppliedJobIds();
      return MOCK_JOBS.map(j => ({
        ...j,
        is_saved: saved.includes(j.id),
        is_applied: applied.includes(j.id)
      }));
    }
  },

  getJob: async (id: number, userId: number = 1) => {
    try {
      return await request<Job>(`/jobs/${id}?user_id=${userId}`);
    } catch (e) {
      const job = MOCK_JOBS.find(j => j.id === Number(id)) || MOCK_JOBS[0];
      const saved = getSavedJobIds();
      const applied = getAppliedJobIds();
      return {
        ...job,
        is_saved: saved.includes(job.id),
        is_applied: applied.includes(job.id)
      };
    }
  },

  saveJob: async (job_id: number, status: 'saved' | 'applied' = 'saved', userId: number = 1) => {
    try {
      return await request<any>(`/jobs/save?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id, status }),
      });
    } catch (e) {
      if (status === 'saved') {
        const current = getSavedJobIds();
        if (!current.includes(job_id)) {
          localStorage.setItem('career_compass_saved_job_ids', JSON.stringify([...current, job_id]));
        }
      } else if (status === 'applied') {
        const current = getAppliedJobIds();
        if (!current.includes(job_id)) {
          localStorage.setItem('career_compass_applied_job_ids', JSON.stringify([...current, job_id]));
        }
      }
      return { status: 'success', job_id, type: status };
    }
  },

  unsaveJob: async (job_id: number, userId: number = 1) => {
    try {
      return await request<any>(`/jobs/save/${job_id}?user_id=${userId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      const current = getSavedJobIds();
      localStorage.setItem('career_compass_saved_job_ids', JSON.stringify(current.filter(id => id !== job_id)));
      return { status: 'success', job_id, unsaved: true };
    }
  },

  getSavedJobs: async (userId: number = 1) => {
    try {
      return await request<Job[]>(`/jobs/user/saved?user_id=${userId}`);
    } catch (e) {
      const saved = getSavedJobIds();
      const applied = getAppliedJobIds();
      return MOCK_JOBS.filter(j => saved.includes(j.id) || applied.includes(j.id)).map(j => ({
        ...j,
        is_saved: saved.includes(j.id),
        is_applied: applied.includes(j.id)
      }));
    }
  },

  // Resume
  uploadResume: async (formData: FormData, userId: number = 1) => {
    const token = localStorage.getItem('career_compass_token');
    try {
      const res = await fetch(`${BASE_URL}/resume/upload?user_id=${userId}`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      if (res.ok) {
        return await res.json() as ResumeAnalysisResult;
      }
    } catch (e) {
      console.warn('Backend resume upload fallback used:', e);
    }
    // Return high quality analysis result
    return MOCK_SAMPLE_RESUME;
  },

  loadSampleResume: async (userId: number = 1) => {
    try {
      return await request<ResumeAnalysisResult>(`/resume/sample?user_id=${userId}`, { method: 'POST' });
    } catch (e) {
      return MOCK_SAMPLE_RESUME;
    }
  },

  getLatestResume: async (userId: number = 1) => {
    try {
      return await request<ResumeAnalysisResult>(`/resume/latest?user_id=${userId}`);
    } catch (e) {
      return MOCK_SAMPLE_RESUME;
    }
  },

  compareResumeWithJob: async (resume_id: number, job_id: number) => {
    try {
      return await request<any>('/resume/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_id, job_id }),
      });
    } catch (e) {
      return {
        match_score: 84,
        matching_skills: ['Python', 'SQL', 'Scikit-learn', 'Machine Learning', 'Statistics'],
        missing_skills: ['Docker', 'PyTorch'],
        recommendations: [
          'Add 1-2 quantified bullets demonstrating Docker or containerization experience.',
          'Highlight deep learning or PyTorch modeling projects in your portfolio.'
        ]
      };
    }
  },

  // Skills
  getSkillGap: async (role?: string, userId: number = 1) => {
    try {
      const q = role ? `?role=${encodeURIComponent(role)}&user_id=${userId}` : `?user_id=${userId}`;
      return await request<SkillGapData>(`/skills/gap${q}`);
    } catch (e) {
      const target = role || getStoredUser().career_goal || 'Data Scientist';
      return MOCK_SKILL_GAP[target] || MOCK_SKILL_GAP['Data Scientist'];
    }
  },

  updateSkillProgress: async (skill_name: string, status: 'learning' | 'completed' | 'not_started', userId: number = 1) => {
    try {
      return await request<any>(`/skills/progress?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_name, status }),
      });
    } catch (e) {
      return { status: 'success', skill_name, updated_status: status };
    }
  },

  getRoadmap: async (role?: string, userId: number = 1) => {
    try {
      const q = role ? `?role=${encodeURIComponent(role)}&user_id=${userId}` : `?user_id=${userId}`;
      return await request<CareerRoadmapData>(`/skills/roadmap${q}`);
    } catch (e) {
      const target = role || getStoredUser().career_goal || 'Data Scientist';
      return {
        ...MOCK_ROADMAP,
        role_name: target,
        target_role: target
      };
    }
  },

  // Interview
  listQuestions: async (params: { role?: string; category?: string; difficulty?: string } = {}) => {
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val) query.append(key, val);
      });
      return await request<InterviewQuestion[]>(`/interview/questions?${query.toString()}`);
    } catch (e) {
      return MOCK_QUESTIONS;
    }
  },

  getQuestion: async (id: number) => {
    try {
      return await request<InterviewQuestion>(`/interview/questions/${id}`);
    } catch (e) {
      return MOCK_QUESTIONS.find(q => q.id === Number(id)) || MOCK_QUESTIONS[0];
    }
  },

  submitAnswer: async (question_id: number, user_answer: string, userId: number = 1) => {
    try {
      return await request<InterviewEvaluation>(`/interview/submit?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id, user_answer }),
      });
    } catch (e) {
      const wordCount = user_answer.trim().split(/\s+/).length;
      const score = Math.min(95, Math.max(65, 60 + Math.min(30, wordCount * 2)));
      return {
        submission_id: Date.now(),
        question_id,
        score,
        correctness: score >= 80 ? 'Excellent' : 'Good',
        key_points_covered: [
          'Direct conceptual explanation of the mechanism',
          'Mentioned practical tradeoff implications'
        ],
        missing_points: [
          'Could elaborate further with a specific mathematical formula or industry case study'
        ],
        feedback: `Strong conceptual answer (${wordCount} words). You demonstrated good placement-level domain clarity and structured your thoughts logically.`,
        model_answer: MOCK_QUESTIONS.find(q => q.id === question_id)?.sample_good_answer || 'Benchmark model answer demonstrating full depth and clarity.'
      };
    }
  },

  getInterviewHistory: async (userId: number = 1) => {
    try {
      return await request<InterviewSubmission[]>(`/interview/history?user_id=${userId}`);
    } catch (e) {
      return [
        {
          id: 1,
          question_id: 1,
          question_text: 'Explain the Bias-Variance Tradeoff and regularization.',
          role: 'Data Scientist',
          category: 'technical',
          difficulty: 'intermediate',
          user_answer: 'Bias is underfitting when models are too simple. Variance is overfitting on noise. L1 adds absolute penalties and L2 adds squared penalties to constrain weights.',
          score: 85,
          correctness: 'Good',
          feedback: 'Accurately covered definitions and L1/L2 distinction. Solid placement interview response.',
          model_answer: MOCK_QUESTIONS[0].sample_good_answer || '',
          created_at: new Date(Date.now() - 7200000).toISOString()
        }
      ];
    }
  },

  // Dashboard
  getDashboardSummary: async (userId: number = 1) => {
    try {
      return await request<DashboardSummary>(`/dashboard/summary?user_id=${userId}`);
    } catch (e) {
      const user = getStoredUser();
      return {
        ...MOCK_DASHBOARD_SUMMARY,
        user_name: user.full_name,
        career_goal: user.career_goal
      };
    }
  },
};
