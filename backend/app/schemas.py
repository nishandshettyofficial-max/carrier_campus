from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, EmailStr

# Auth & User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    degree: Optional[str] = "B.Tech in AI & Data Science"
    year_of_study: Optional[str] = "Final Year"
    career_goal: Optional[str] = "Data Scientist"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ProfileSetup(BaseModel):
    full_name: Optional[str] = None
    degree: Optional[str] = None
    year_of_study: Optional[str] = None
    career_goal: Optional[str] = None
    experience_level: Optional[str] = None
    current_skills: Optional[List[str]] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    degree: Optional[str] = None
    year_of_study: Optional[str] = None
    career_goal: Optional[str] = None
    experience_level: Optional[str] = None
    current_skills: Optional[List[str]] = None

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    degree: str
    year_of_study: str
    career_goal: str
    experience_level: str
    current_skills: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Job Schemas
class JobOut(BaseModel):
    id: int
    title: str
    company: str
    location: str
    job_type: str
    experience_level: str
    description: str
    salary_range: str
    required_skills: List[str]
    preferred_skills: List[str]
    posted_date: datetime
    # Dynamically calculated when matched against user
    match_percentage: Optional[int] = None
    matching_skills: Optional[List[str]] = None
    missing_skills: Optional[List[str]] = None
    why_matched: Optional[str] = None
    is_saved: Optional[bool] = False
    is_applied: Optional[bool] = False

    class Config:
        from_attributes = True

class SaveJobRequest(BaseModel):
    job_id: int
    status: str = "saved"  # 'saved' or 'applied'

# Resume Schemas
class ResumeAnalyzeResponse(BaseModel):
    id: Optional[int] = None
    filename: str
    score: int
    score_breakdown: Dict[str, int]  # content, skills, impact, formatting
    extracted_contact: Dict[str, str]
    extracted_skills: List[str]
    sections_detected: Dict[str, bool]
    strengths: List[str]
    areas_to_improve: List[str]
    quantified_bullet_count: int
    action_verb_count: int
    missing_skills: Optional[List[str]] = []
    job_match: Optional[Dict[str, Any]] = None

class ResumeCompareRequest(BaseModel):
    resume_id: int
    job_id: int

# Skill Gap Schemas
class LearningResource(BaseModel):
    title: str
    type: str  # Course, Docs, Video, Project
    url: str
    platform: str

class SkillDetail(BaseModel):
    name: str
    category: str
    importance: str  # High, Medium, Nice-to-have
    level: str       # Beginner, Intermediate, Advanced
    is_mastered: bool
    status: str      # not_started, learning, completed
    resources: List[LearningResource]

class SkillGapResponse(BaseModel):
    career_goal: str
    description: str
    avg_salary: str
    readiness_score: int
    matched_skills_count: int
    total_skills_count: int
    mastered_skills: List[str]
    missing_high_priority: List[SkillDetail]
    missing_secondary: List[SkillDetail]
    ordered_learning_path: List[Dict[str, Any]]
    radar_data: List[Dict[str, Any]]

class SkillProgressUpdate(BaseModel):
    skill_name: str
    status: str  # 'learning' or 'completed'

# Interview Schemas
class InterviewQuestionOut(BaseModel):
    id: int
    role: str
    category: str
    difficulty: str
    question: str
    key_points: List[str]
    tips: str

    class Config:
        from_attributes = True

class InterviewSubmitRequest(BaseModel):
    question_id: int
    user_answer: str

class InterviewEvaluationResponse(BaseModel):
    submission_id: int
    question_id: int
    score: int
    correctness: str  # "Excellent", "Good", "Partial", "Needs Improvement"
    key_points_covered: List[str]
    missing_points: List[str]
    feedback: str
    model_answer: str

class InterviewSubmissionOut(BaseModel):
    id: int
    question_id: int
    question_text: str
    role: str
    category: str
    difficulty: str
    user_answer: str
    score: int
    correctness: str
    feedback: str
    model_answer: str
    created_at: datetime

    class Config:
        from_attributes = True

# Career Roadmap
class RoadmapMilestone(BaseModel):
    id: str
    title: str
    description: str
    skills: List[str]
    status: str  # completed, in_progress, upcoming
    resources: List[LearningResource]

class RoadmapPhase(BaseModel):
    phase_number: int
    phase_title: str
    duration: str
    milestones: List[RoadmapMilestone]

class CareerRoadmapResponse(BaseModel):
    role_name: str
    target_role: str
    overall_progress: int
    phases: List[RoadmapPhase]

# Dashboard Summary
class DashboardSummaryOut(BaseModel):
    user_name: str
    career_goal: str
    resume_score: int
    career_readiness: int
    skills_matched_count: int
    total_skills_required: int
    interview_progress_count: int
    total_interview_target: int
    top_recommended_jobs: List[JobOut]
    high_priority_gaps: List[str]
    recent_activities: List[Dict[str, Any]]
