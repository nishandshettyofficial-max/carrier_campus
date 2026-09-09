from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Job, User, SavedJob
from app.schemas import JobOut, SaveJobRequest
from app.ai.job_matcher import compute_job_match

router = APIRouter(prefix="/jobs", tags=["Jobs & Recommendations"])

@router.get("", response_model=List[JobOut])
def list_jobs(
    q: Optional[str] = None,
    location: Optional[str] = None,
    job_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    skill: Optional[str] = None,
    min_match: Optional[int] = None,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """
    List all jobs with real-time semantic and skill-based recommendation scores
    tailored to the active student profile.
    """
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    user_skills = user.current_skills if user else []
    user_goal = user.career_goal if user else "Data Scientist"

    # Query all saved/applied jobs for this user
    saved_map = {}
    if user:
        user_saved = db.query(SavedJob).filter(SavedJob.user_id == user.id).all()
        for sj in user_saved:
            saved_map[sj.job_id] = sj.status

    query = db.query(Job)

    if q:
        search = f"%{q}%"
        query = query.filter(
            (Job.title.ilike(search)) |
            (Job.company.ilike(search)) |
            (Job.description.ilike(search))
        )
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if job_type:
        query = query.filter(Job.job_type.ilike(f"%{job_type}%"))
    if experience_level:
        query = query.filter(Job.experience_level.ilike(f"%{experience_level}%"))

    jobs = query.all()
    results = []

    for job in jobs:
        # Check skill filter if provided
        if skill:
            all_skills = [s.lower() for s in (job.required_skills or []) + (job.preferred_skills or [])]
            if skill.lower() not in all_skills:
                continue

        match_info = compute_job_match(
            user_skills=user_skills,
            user_goal=user_goal,
            job_title=job.title,
            job_description=job.description,
            required_skills=job.required_skills or [],
            preferred_skills=job.preferred_skills or []
        )

        match_pct = match_info["match_percentage"]
        if min_match and match_pct < min_match:
            continue

        job_status = saved_map.get(job.id)

        job_dict = {
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "job_type": job.job_type,
            "experience_level": job.experience_level,
            "description": job.description,
            "salary_range": job.salary_range,
            "required_skills": job.required_skills or [],
            "preferred_skills": job.preferred_skills or [],
            "posted_date": job.posted_date,
            "match_percentage": match_pct,
            "matching_skills": match_info["matching_skills"],
            "missing_skills": match_info["missing_skills"],
            "why_matched": match_info["why_matched"],
            "is_saved": job_status == "saved",
            "is_applied": job_status == "applied"
        }
        results.append(job_dict)

    # Sort primarily by match percentage descending
    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return results

@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    user_skills = user.current_skills if user else []
    user_goal = user.career_goal if user else "Data Scientist"

    match_info = compute_job_match(
        user_skills=user_skills,
        user_goal=user_goal,
        job_title=job.title,
        job_description=job.description,
        required_skills=job.required_skills or [],
        preferred_skills=job.preferred_skills or []
    )

    saved_entry = None
    if user:
        saved_entry = db.query(SavedJob).filter(
            SavedJob.user_id == user.id,
            SavedJob.job_id == job.id
        ).first()

    return {
        "id": job.id,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "job_type": job.job_type,
        "experience_level": job.experience_level,
        "description": job.description,
        "salary_range": job.salary_range,
        "required_skills": job.required_skills or [],
        "preferred_skills": job.preferred_skills or [],
        "posted_date": job.posted_date,
        "match_percentage": match_info["match_percentage"],
        "matching_skills": match_info["matching_skills"],
        "missing_skills": match_info["missing_skills"],
        "why_matched": match_info["why_matched"],
        "is_saved": bool(saved_entry and saved_entry.status == "saved"),
        "is_applied": bool(saved_entry and saved_entry.status == "applied")
    }

@router.post("/save")
def save_or_apply_job(req: SaveJobRequest, user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    job = db.query(Job).filter(Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing = db.query(SavedJob).filter(
        SavedJob.user_id == user.id,
        SavedJob.job_id == req.job_id
    ).first()

    if existing:
        existing.status = req.status
    else:
        new_saved = SavedJob(user_id=user.id, job_id=req.job_id, status=req.status)
        db.add(new_saved)

    db.commit()
    return {"message": f"Job marked as {req.status}", "job_id": req.job_id, "status": req.status}

@router.delete("/save/{job_id}")
def unsave_job(job_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    if user:
        entry = db.query(SavedJob).filter(
            SavedJob.user_id == user.id,
            SavedJob.job_id == job_id
        ).first()
        if entry:
            db.delete(entry)
            db.commit()
    return {"message": "Job unsaved", "job_id": job_id}

@router.get("/user/saved", response_model=List[JobOut])
def get_saved_jobs(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    if not user:
        return []

    saved_records = db.query(SavedJob).filter(SavedJob.user_id == user.id).all()
    job_ids = [s.job_id for s in saved_records]
    status_by_id = {s.job_id: s.status for s in saved_records}

    jobs = db.query(Job).filter(Job.id.in_(job_ids)).all()
    results = []

    for job in jobs:
        match_info = compute_job_match(
            user_skills=user.current_skills or [],
            user_goal=user.career_goal or "Data Scientist",
            job_title=job.title,
            job_description=job.description,
            required_skills=job.required_skills or [],
            preferred_skills=job.preferred_skills or []
        )
        status = status_by_id.get(job.id, "saved")
        results.append({
            "id": job.id,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "job_type": job.job_type,
            "experience_level": job.experience_level,
            "description": job.description,
            "salary_range": job.salary_range,
            "required_skills": job.required_skills or [],
            "preferred_skills": job.preferred_skills or [],
            "posted_date": job.posted_date,
            "match_percentage": match_info["match_percentage"],
            "matching_skills": match_info["matching_skills"],
            "missing_skills": match_info["missing_skills"],
            "why_matched": match_info["why_matched"],
            "is_saved": status == "saved",
            "is_applied": status == "applied"
        })
    return results
