from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    degree = Column(String(255), default="B.Tech in AI & Data Science")
    year_of_study = Column(String(50), default="Final Year")
    career_goal = Column(String(100), default="Data Scientist")
    experience_level = Column(String(50), default="Entry Level / Fresher")
    current_skills = Column(JSON, default=list)  # List of skill strings: ["Python", "SQL", ...]
    created_at = Column(DateTime, default=datetime.utcnow)

    saved_jobs = relationship("SavedJob", back_populates="user", cascade="all, delete-orphan")
    resume_analyses = relationship("ResumeAnalysis", back_populates="user", cascade="all, delete-orphan")
    skill_progresses = relationship("UserSkillProgress", back_populates="user", cascade="all, delete-orphan")
    interview_submissions = relationship("InterviewSubmission", back_populates="user", cascade="all, delete-orphan")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    job_type = Column(String(50), default="Full-time")  # Full-time, Internship, Remote, Hybrid
    experience_level = Column(String(50), default="Entry Level")
    description = Column(Text, nullable=False)
    salary_range = Column(String(100), default="₹6,00,000 - ₹12,00,000")
    required_skills = Column(JSON, default=list)
    preferred_skills = Column(JSON, default=list)
    posted_date = Column(DateTime, default=datetime.utcnow)

    saved_entries = relationship("SavedJob", back_populates="job", cascade="all, delete-orphan")


class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    status = Column(String(50), default="saved")  # 'saved' | 'applied'
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saved_entries")


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    score = Column(Integer, default=70)  # 0 to 100
    sections_detected = Column(JSON, default=dict)
    extracted_skills = Column(JSON, default=list)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    improvements = Column(JSON, default=list)
    matched_job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resume_analyses")
    matched_job = relationship("Job")


class CareerPath(Base):
    __tablename__ = "career_paths"

    id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    avg_salary = Column(String(100), default="₹8,00,000 - ₹18,00,000")
    skills_taxonomy = Column(JSON, default=list)  # list of {name, category, importance, order, resources}
    roadmap_phases = Column(JSON, default=list)    # list of {phase_title, description, milestones}


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    status = Column(String(50), default="learning")  # 'learning' | 'completed'
    proficiency = Column(String(50), default="intermediate")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="skill_progresses")


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(100), index=True, nullable=False)  # Data Analyst, Data Scientist, etc.
    category = Column(String(50), default="technical")      # 'technical' | 'hr' | 'project'
    difficulty = Column(String(50), default="intermediate") # 'beginner' | 'intermediate' | 'advanced'
    question = Column(Text, nullable=False)
    key_points = Column(JSON, default=list)                 # Essential concepts required for a full answer
    sample_good_answer = Column(Text, nullable=False)
    tips = Column(Text, default="")

    submissions = relationship("InterviewSubmission", back_populates="question")


class InterviewSubmission(Base):
    __tablename__ = "interview_submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("interview_questions.id"), nullable=False)
    user_answer = Column(Text, nullable=False)
    score = Column(Integer, default=0)                      # 0 to 100
    correctness = Column(String(50), default="Partial")    # Excellent, Good, Partial, Needs Improvement
    missing_points = Column(JSON, default=list)
    feedback = Column(Text, nullable=False)
    model_answer = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interview_submissions")
    question = relationship("InterviewQuestion", back_populates="submissions")
