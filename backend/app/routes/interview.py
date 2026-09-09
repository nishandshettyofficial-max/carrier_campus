from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import InterviewQuestion, InterviewSubmission, User
from app.schemas import (
    InterviewQuestionOut,
    InterviewSubmitRequest,
    InterviewEvaluationResponse,
    InterviewSubmissionOut
)
from app.ai.interview_grader import grade_interview_answer

router = APIRouter(prefix="/interview", tags=["Mock Interview Practice"])

@router.get("/questions", response_model=List[InterviewQuestionOut])
def list_questions(
    role: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(InterviewQuestion)
    if role:
        query = query.filter(InterviewQuestion.role.ilike(f"%{role}%"))
    if category:
        query = query.filter(InterviewQuestion.category == category.lower())
    if difficulty:
        query = query.filter(InterviewQuestion.difficulty == difficulty.lower())

    questions = query.all()
    return questions

@router.get("/questions/{question_id}", response_model=InterviewQuestionOut)
def get_question(question_id: int, db: Session = Depends(get_db)):
    q = db.query(InterviewQuestion).filter(InterviewQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    return q

@router.post("/submit", response_model=InterviewEvaluationResponse)
def submit_answer(
    req: InterviewSubmitRequest,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    q = db.query(InterviewQuestion).filter(InterviewQuestion.id == req.question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    # Run AI evaluation engine
    eval_result = grade_interview_answer(
        question_text=q.question,
        key_points=q.key_points or [],
        sample_good_answer=q.sample_good_answer,
        user_answer=req.user_answer
    )

    submission = InterviewSubmission(
        user_id=user.id,
        question_id=q.id,
        user_answer=req.user_answer,
        score=eval_result["score"],
        correctness=eval_result["correctness"],
        missing_points=eval_result["missing_points"],
        feedback=eval_result["feedback"],
        model_answer=eval_result["model_answer"]
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "submission_id": submission.id,
        "question_id": q.id,
        "score": eval_result["score"],
        "correctness": eval_result["correctness"],
        "key_points_covered": eval_result["key_points_covered"],
        "missing_points": eval_result["missing_points"],
        "feedback": eval_result["feedback"],
        "model_answer": eval_result["model_answer"]
    }

@router.get("/history", response_model=List[InterviewSubmissionOut])
def get_interview_history(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first() or db.query(User).first()
    if not user:
        return []

    submissions = db.query(InterviewSubmission).filter(
        InterviewSubmission.user_id == user.id
    ).order_by(InterviewSubmission.created_at.desc()).all()

    results = []
    for s in submissions:
        q = s.question
        results.append({
            "id": s.id,
            "question_id": s.question_id,
            "question_text": q.question if q else "Question",
            "role": q.role if q else "General",
            "category": q.category if q else "technical",
            "difficulty": q.difficulty if q else "intermediate",
            "user_answer": s.user_answer,
            "score": s.score,
            "correctness": s.correctness,
            "feedback": s.feedback,
            "model_answer": s.model_answer,
            "created_at": s.created_at
        })
    return results
