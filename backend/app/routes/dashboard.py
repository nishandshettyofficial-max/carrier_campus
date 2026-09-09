from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, ResumeAnalysis, InterviewSubmission, SavedJob, Job
from app.schemas import DashboardSummaryOut, JobOut
from app.ai.skill_gap import compute_skill_gap
from app.ai.job_matcher import compute_job_match

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary", response_model=DashboardSummaryOut)
def get_dashboard_summary(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    user_skills = user.current_skills if user else []
    user_goal = user.career_goal if user else "Data Scientist"

    # 1. Resume Score
    latest_resume = None
    if user:
        latest_resume = db.query(ResumeAnalysis).filter(
            ResumeAnalysis.user_id == user.id
        ).order_by(ResumeAnalysis.created_at.desc()).first()

    resume_score = latest_resume.score if latest_resume else 78

    # 2. Career Readiness & Skill Gaps
    gap_data = compute_skill_gap(user_skills=user_skills, career_goal=user_goal)
    career_readiness = gap_data["readiness_score"]
    skills_matched_count = gap_data["matched_skills_count"]
    total_skills_required = gap_data["total_skills_count"]
    high_priority_gaps = [s["name"] for s in gap_data["missing_high_priority"][:3]]

    # 3. Interview Progress
    interview_count = 0
    if user:
        interview_count = db.query(InterviewSubmission).filter(
            InterviewSubmission.user_id == user.id
        ).count()

    # 4. Top Recommended Jobs (top 3)
    saved_map = {}
    if user:
        user_saved = db.query(SavedJob).filter(SavedJob.user_id == user.id).all()
        for sj in user_saved:
            saved_map[sj.job_id] = sj.status

    all_jobs = db.query(Job).all()
    matched_jobs = []
    for j in all_jobs:
        match_info = compute_job_match(
            user_skills=user_skills,
            user_goal=user_goal,
            job_title=j.title,
            job_description=j.description,
            required_skills=j.required_skills or [],
            preferred_skills=j.preferred_skills or []
        )
        status = saved_map.get(j.id)
        matched_jobs.append({
            "id": j.id,
            "title": j.title,
            "company": j.company,
            "location": j.location,
            "job_type": j.job_type,
            "experience_level": j.experience_level,
            "description": j.description,
            "salary_range": j.salary_range,
            "required_skills": j.required_skills or [],
            "preferred_skills": j.preferred_skills or [],
            "posted_date": j.posted_date,
            "match_percentage": match_info["match_percentage"],
            "matching_skills": match_info["matching_skills"],
            "missing_skills": match_info["missing_skills"],
            "why_matched": match_info["why_matched"],
            "is_saved": status == "saved",
            "is_applied": status == "applied"
        })

    matched_jobs.sort(key=lambda x: x["match_percentage"], reverse=True)
    top_jobs = matched_jobs[:3]

    # 5. Recent Activity Feed
    activities = []
    if latest_resume:
        activities.append({
            "id": "act-1",
            "title": "Resume Evaluation Completed",
            "description": f"Analyzed '{latest_resume.filename}' - Score: {latest_resume.score}/100",
            "timestamp": latest_resume.created_at.strftime("%b %d, %H:%M"),
            "icon": "FileText",
            "color": "blue"
        })

    if user:
        latest_interview = db.query(InterviewSubmission).filter(
            InterviewSubmission.user_id == user.id
        ).order_by(InterviewSubmission.created_at.desc()).first()
        if latest_interview:
            activities.append({
                "id": "act-2",
                "title": f"Mock Interview Practice ({latest_interview.correctness})",
                "description": f"Scored {latest_interview.score}/100 with detailed AI feedback.",
                "timestamp": latest_interview.created_at.strftime("%b %d, %H:%M"),
                "icon": "MessageSquare",
                "color": "emerald"
            })

        latest_saved = db.query(SavedJob).filter(
            SavedJob.user_id == user.id
        ).order_by(SavedJob.updated_at.desc()).first()
        if latest_saved and latest_saved.job:
            activities.append({
                "id": "act-3",
                "title": f"Job {latest_saved.status.capitalize()}",
                "description": f"{latest_saved.job.title} at {latest_saved.job.company}",
                "timestamp": latest_saved.updated_at.strftime("%b %d, %H:%M"),
                "icon": "Briefcase",
                "color": "amber"
            })

    # Default activity if list is sparse
    if not activities:
        activities.append({
            "id": "act-default",
            "title": "Account Activated",
            "description": f"Welcome to CareerCompass! Ready for {user_goal} placements.",
            "timestamp": "Today",
            "icon": "CheckCircle",
            "color": "indigo"
        })

    return {
        "user_name": user.full_name if user else "Student",
        "career_goal": user_goal,
        "resume_score": resume_score,
        "career_readiness": career_readiness,
        "skills_matched_count": skills_matched_count,
        "total_skills_required": total_skills_required,
        "interview_progress_count": interview_count,
        "total_interview_target": 20,
        "top_recommended_jobs": top_jobs,
        "high_priority_gaps": high_priority_gaps,
        "recent_activities": activities
    }
