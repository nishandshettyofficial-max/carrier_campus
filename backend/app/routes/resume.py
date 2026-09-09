from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ResumeAnalysis, User, Job
from app.schemas import ResumeAnalyzeResponse, ResumeCompareRequest
from app.ai.resume_analyzer import extract_text_from_pdf, analyze_resume_text
from app.ai.job_matcher import compute_job_match

router = APIRouter(prefix="/resume", tags=["Resume Analysis"])

SAMPLE_RESUME_TEXT = """
Aditi Rao
Bengaluru, Karnataka | aditi.rao@email.com | +91 98765 43210
linkedin.com/in/aditi-rao | github.com/aditi-rao

EDUCATION
B.Tech in Artificial Intelligence & Data Science (2022 - 2026)
Visvesvaraya Technological University, Bengaluru
CGPA: 8.8 / 10.0

TECHNICAL SKILLS
Languages: Python, SQL, C++
Data Science & ML: Pandas, NumPy, Scikit-learn, Exploratory Data Analysis, Statistics
AI & Deep Learning: Machine Learning, PyTorch, Natural Language Processing
Backend & Tools: FastAPI, Git, GitHub, Linux, Docker, PostgreSQL

KEY PROJECTS
Real-Time Delivery Demand Forecasting (Python, Pandas, Scikit-learn, FastAPI)
- Engineered XGBoost and Random Forest regression models to predict regional order volume.
- Achieved 93.4% prediction accuracy, outperforming the historical baseline by 18%.
- Built high-throughput REST APIs with FastAPI serving 1,200 inference requests per minute.
- Deployed containerized microservice with Docker on AWS EC2.

Multilingual Customer Review Sentiment Classifier (Python, PyTorch, Transformers)
- Analyzed 50,000+ consumer feedback reviews across 3 Indian regional languages.
- Fine-tuned transformer models, accelerating sentiment tagging speed by 40%.
- Integrated PostgreSQL for storing tagged inferences and visualized results in Streamlit.

EXPERIENCE & INTERNSHIPS
Machine Learning Engineering Intern | TechNova Analytics (June 2025 - August 2025)
- Spearheaded feature engineering pipelines for automated churn risk prediction across 100k active users.
- Optimized database SQL queries, reducing ETL processing latency from 45 minutes to 12 minutes.
- Collaborated with senior data scientists in daily agile standups and presented sprint outcomes to leadership.

CERTIFICATIONS
- Machine Learning Specialization by Andrew Ng (DeepLearning.AI)
- Advanced SQL for Data Scientists (Coursera)
"""

@router.post("/upload", response_model=ResumeAnalyzeResponse)
async def upload_resume(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    filename = "pasted_resume.txt"
    text = ""

    if file:
        filename = file.filename
        content = await file.read()
        if filename.lower().endswith(".pdf"):
            try:
                text = extract_text_from_pdf(content)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to read PDF: {str(e)}")
        else:
            text = content.decode("utf-8", errors="ignore")
    elif raw_text:
        text = raw_text
    else:
        raise HTTPException(status_code=400, detail="Please upload a PDF file or provide resume text")

    if not text.strip():
        raise HTTPException(status_code=400, detail="The uploaded document contains no readable text")

    analysis_data = analyze_resume_text(text, filename=filename)

    # Save to database
    record = ResumeAnalysis(
        user_id=user.id,
        filename=filename,
        score=analysis_data["score"],
        sections_detected=analysis_data["sections_detected"],
        extracted_skills=analysis_data["extracted_skills"],
        strengths=analysis_data["strengths"],
        improvements=analysis_data["areas_to_improve"]
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    analysis_data["id"] = record.id
    return analysis_data

@router.post("/sample", response_model=ResumeAnalyzeResponse)
def load_sample_resume(user_id: int = 1, db: Session = Depends(get_db)):
    """Preloads realistic sample resume for instant demonstration without file picker."""
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    analysis_data = analyze_resume_text(SAMPLE_RESUME_TEXT, filename="Sample_Student_Resume.pdf")

    record = ResumeAnalysis(
        user_id=user.id if user else 1,
        filename="Sample_Student_Resume.pdf",
        score=analysis_data["score"],
        sections_detected=analysis_data["sections_detected"],
        extracted_skills=analysis_data["extracted_skills"],
        strengths=analysis_data["strengths"],
        improvements=analysis_data["areas_to_improve"]
    )
    if user:
        db.add(record)
        db.commit()
        db.refresh(record)
        analysis_data["id"] = record.id

    return analysis_data

@router.get("/latest", response_model=ResumeAnalyzeResponse)
def get_latest_resume(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    record = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.user_id == user.id
    ).order_by(ResumeAnalysis.created_at.desc()).first()

    if not record:
        # Fallback to analyzing sample resume
        return load_sample_resume(user_id=user.id, db=db)

    return {
        "id": record.id,
        "filename": record.filename,
        "score": record.score,
        "score_breakdown": {
            "sections": 25 if record.sections_detected else 20,
            "skills": 25,
            "impact": 20,
            "formatting": 18
        },
        "extracted_contact": {"email": user.email, "phone": "+91 98765 43210", "linkedin": "https://linkedin.com/in/aditi-rao", "github": "https://github.com/aditi-rao"},
        "extracted_skills": record.extracted_skills or [],
        "sections_detected": record.sections_detected or {},
        "strengths": record.strengths or [],
        "areas_to_improve": record.improvements or [],
        "quantified_bullet_count": 4,
        "action_verb_count": 7,
        "missing_skills": []
    }

@router.post("/compare")
def compare_resume_with_job(req: ResumeCompareRequest, db: Session = Depends(get_db)):
    resume = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == req.resume_id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume record not found")

    job = db.query(Job).filter(Job.id == req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    match_info = compute_job_match(
        user_skills=resume.extracted_skills or [],
        user_goal=job.title,
        job_title=job.title,
        job_description=job.description,
        required_skills=job.required_skills or [],
        preferred_skills=job.preferred_skills or []
    )

    return {
        "job_title": job.title,
        "company": job.company,
        "match_percentage": match_info["match_percentage"],
        "matching_skills": match_info["matching_skills"],
        "missing_skills": match_info["missing_skills"],
        "why_matched": match_info["why_matched"]
    }
