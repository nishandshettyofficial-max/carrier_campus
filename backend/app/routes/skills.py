from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, CareerPath, UserSkillProgress
from app.schemas import SkillGapResponse, SkillProgressUpdate, CareerRoadmapResponse
from app.ai.skill_gap import compute_skill_gap, CAREER_CURRICULUM
from app.ai.ontology import normalize_skill

router = APIRouter(prefix="/skills", tags=["Skill Gap & Career Roadmap"])

@router.get("/gap", response_model=SkillGapResponse)
def get_skill_gap(
    role: Optional[str] = None,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    target_role = role or (user.career_goal if user else "Data Scientist")

    # If role not in curriculum, fallback to Data Scientist
    if target_role not in CAREER_CURRICULUM:
        target_role = "Data Scientist"

    # Query user skill progress statuses
    progress_dict = {}
    if user:
        records = db.query(UserSkillProgress).filter(UserSkillProgress.user_id == user.id).all()
        for r in records:
            progress_dict[r.skill_name] = r.status

    user_skills = user.current_skills if user else []
    result = compute_skill_gap(
        user_skills=user_skills,
        career_goal=target_role,
        progress_status=progress_dict
    )
    return result

@router.post("/progress")
def update_skill_progress(
    update_in: SkillProgressUpdate,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    norm_name = normalize_skill(update_in.skill_name)

    # Update or insert record in UserSkillProgress
    progress_entry = db.query(UserSkillProgress).filter(
        UserSkillProgress.user_id == user.id,
        UserSkillProgress.skill_name == norm_name
    ).first()

    if progress_entry:
        progress_entry.status = update_in.status
    else:
        new_entry = UserSkillProgress(
            user_id=user.id,
            skill_name=norm_name,
            status=update_in.status
        )
        db.add(new_entry)

    # If marked as completed, ensure it is added to user.current_skills
    skills_list = list(user.current_skills or [])
    if update_in.status == "completed":
        if norm_name not in skills_list:
            skills_list.append(norm_name)
            user.current_skills = skills_list
    elif update_in.status == "not_started":
        if norm_name in skills_list:
            skills_list.remove(norm_name)
            user.current_skills = skills_list

    db.commit()
    return {
        "message": f"Skill '{norm_name}' updated to '{update_in.status}'",
        "skill_name": norm_name,
        "status": update_in.status
    }

@router.get("/roadmap", response_model=CareerRoadmapResponse)
def get_roadmap(
    role: Optional[str] = None,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    target_role = role or (user.career_goal if user else "Data Scientist")

    cp = db.query(CareerPath).filter(CareerPath.role_name == target_role).first()
    if not cp:
        cp = db.query(CareerPath).first()

    phases = cp.roadmap_phases if cp else []

    # Calculate overall progress from skill gap
    gap_result = compute_skill_gap(
        user_skills=user.current_skills if user else [],
        career_goal=target_role
    )

    return {
        "role_name": target_role,
        "target_role": target_role,
        "overall_progress": gap_result["readiness_score"],
        "phases": phases
    }
