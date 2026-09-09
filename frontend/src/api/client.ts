// API client for CareerCompass
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

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('career_compass_token');
  const headers = new Headers(options.headers || {});
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

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

  return response.json();
}

export const api = {
  // Auth
  demoLogin: () => request<{ access_token: string; user: User }>('/auth/demo-login', { method: 'POST' }),
  login: (data: { email: string; password: string }) => request<{ access_token: string; user: User }>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  signup: (data: any) => request<{ access_token: string; user: User }>('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  getMe: (userId: number = 1) => request<User>(`/auth/me?user_id=${userId}`),
  updateProfile: (data: any, userId: number = 1) => request<User>(`/auth/profile?user_id=${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),

  // Jobs
  listJobs: (params: { q?: string; location?: string; job_type?: string; experience_level?: string; skill?: string; min_match?: number; user_id?: number } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') query.append(key, String(val));
    });
    return request<Job[]>(`/jobs?${query.toString()}`);
  },
  getJob: (id: number, userId: number = 1) => request<Job>(`/jobs/${id}?user_id=${userId}`),
  saveJob: (job_id: number, status: 'saved' | 'applied' = 'saved', userId: number = 1) => request<any>(`/jobs/save?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job_id, status }),
  }),
  unsaveJob: (job_id: number, userId: number = 1) => request<any>(`/jobs/save/${job_id}?user_id=${userId}`, {
    method: 'DELETE',
  }),
  getSavedJobs: (userId: number = 1) => request<Job[]>(`/jobs/user/saved?user_id=${userId}`),

  // Resume
  uploadResume: (formData: FormData, userId: number = 1) => {
    const token = localStorage.getItem('career_compass_token');
    return fetch(`${BASE_URL}/resume/upload?user_id=${userId}`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData
    }).then(async res => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || 'Resume upload failed');
      }
      return res.json() as Promise<ResumeAnalysisResult>;
    });
  },
  loadSampleResume: (userId: number = 1) => request<ResumeAnalysisResult>(`/resume/sample?user_id=${userId}`, { method: 'POST' }),
  getLatestResume: (userId: number = 1) => request<ResumeAnalysisResult>(`/resume/latest?user_id=${userId}`),
  compareResumeWithJob: (resume_id: number, job_id: number) => request<any>('/resume/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume_id, job_id }),
  }),

  // Skills
  getSkillGap: (role?: string, userId: number = 1) => {
    const q = role ? `?role=${encodeURIComponent(role)}&user_id=${userId}` : `?user_id=${userId}`;
    return request<SkillGapData>(`/skills/gap${q}`);
  },
  updateSkillProgress: (skill_name: string, status: 'learning' | 'completed' | 'not_started', userId: number = 1) => request<any>(`/skills/progress?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skill_name, status }),
  }),
  getRoadmap: (role?: string, userId: number = 1) => {
    const q = role ? `?role=${encodeURIComponent(role)}&user_id=${userId}` : `?user_id=${userId}`;
    return request<CareerRoadmapData>(`/skills/roadmap${q}`);
  },

  // Interview
  listQuestions: (params: { role?: string; category?: string; difficulty?: string } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val) query.append(key, val);
    });
    return request<InterviewQuestion[]>(`/interview/questions?${query.toString()}`);
  },
  getQuestion: (id: number) => request<InterviewQuestion>(`/interview/questions/${id}`),
  submitAnswer: (question_id: number, user_answer: string, userId: number = 1) => request<InterviewEvaluation>(`/interview/submit?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question_id, user_answer }),
  }),
  getInterviewHistory: (userId: number = 1) => request<InterviewSubmission[]>(`/interview/history?user_id=${userId}`),

  // Dashboard
  getDashboardSummary: (userId: number = 1) => request<DashboardSummary>(`/dashboard/summary?user_id=${userId}`),
};
