import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_demo_login():
    response = client.post("/api/auth/demo-login")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "demo@careercompass.ai"
    assert "Python" in data["user"]["current_skills"]

def test_get_jobs_with_matching():
    response = client.get("/api/jobs")
    assert response.status_code == 200
    jobs = response.json()
    assert len(jobs) > 0
    first_job = jobs[0]
    assert "match_percentage" in first_job
    assert "matching_skills" in first_job
    assert "why_matched" in first_job

def test_resume_sample_analysis():
    response = client.post("/api/resume/sample")
    assert response.status_code == 200
    data = response.json()
    assert data["score"] >= 60
    assert len(data["extracted_skills"]) >= 5
    assert len(data["strengths"]) > 0
    assert len(data["areas_to_improve"]) > 0

def test_skill_gap_analysis():
    response = client.get("/api/skills/gap?role=Data+Scientist")
    assert response.status_code == 200
    data = response.json()
    assert data["career_goal"] == "Data Scientist"
    assert "readiness_score" in data
    assert len(data["radar_data"]) > 0

def test_interview_submit():
    # Get first question
    q_resp = client.get("/api/interview/questions")
    assert q_resp.status_code == 200
    questions = q_resp.json()
    assert len(questions) > 0
    q_id = questions[0]["id"]

    # Submit an answer
    sub_resp = client.post("/api/interview/submit", json={
        "question_id": q_id,
        "user_answer": "Bias is error from underfitting while variance is overfitting due to noise. Regularization like L1 or L2 penalizes large weights to achieve a balance."
    })
    assert sub_resp.status_code == 200
    sub_data = sub_resp.json()
    assert sub_data["score"] >= 60
    assert "feedback" in sub_data
    assert "model_answer" in sub_data

def test_dashboard_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    data = response.json()
    assert "resume_score" in data
    assert "career_readiness" in data
    assert "top_recommended_jobs" in data
    assert len(data["top_recommended_jobs"]) > 0
