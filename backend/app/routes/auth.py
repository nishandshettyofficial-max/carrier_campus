from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, UserUpdate, UserOut, TokenResponse, ProfileSetup
from app.ai.ontology import normalize_skill

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_current_user_helper(db: Session, user_id: int = 1) -> User:
    """Helper to fetch active user or default demo user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found")
    return user

@router.post("/signup", response_model=TokenResponse)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")

    new_user = User(
        email=user_in.email,
        password_hash=user_in.password,  # Simple development credential
        full_name=user_in.full_name,
        degree=user_in.degree or "B.Tech in AI & Data Science",
        year_of_study=user_in.year_of_study or "Final Year",
        career_goal=user_in.career_goal or "Data Scientist",
        current_skills=["Python", "SQL", "Git"]  # Sensible default starter skills
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "access_token": f"token-user-{new_user.id}",
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=TokenResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or user.password_hash != login_in.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "access_token": f"token-user-{user.id}",
        "token_type": "bearer",
        "user": user
    }

@router.post("/demo-login", response_model=TokenResponse)
def demo_login(db: Session = Depends(get_db)):
    """Instant 1-click login for demonstration with pre-seeded data."""
    user = db.query(User).filter(User.email == "demo@careercompass.ai").first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not found. Please re-seed database.")

    return {
        "access_token": f"token-user-{user.id}",
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def get_current_user(user_id: int = 1, db: Session = Depends(get_db)):
    return get_current_user_helper(db, user_id)

@router.put("/profile", response_model=UserOut)
def update_profile(profile_in: UserUpdate, user_id: int = 1, db: Session = Depends(get_db)):
    user = get_current_user_helper(db, user_id)

    if profile_in.full_name is not None:
        user.full_name = profile_in.full_name
    if profile_in.degree is not None:
        user.degree = profile_in.degree
    if profile_in.year_of_study is not None:
        user.year_of_study = profile_in.year_of_study
    if profile_in.career_goal is not None:
        user.career_goal = profile_in.career_goal
    if profile_in.experience_level is not None:
        user.experience_level = profile_in.experience_level
    if profile_in.current_skills is not None:
        # Normalize skills list
        user.current_skills = sorted(list(set(normalize_skill(s) for s in profile_in.current_skills if s.strip())))

    db.commit()
    db.refresh(user)
    return user
