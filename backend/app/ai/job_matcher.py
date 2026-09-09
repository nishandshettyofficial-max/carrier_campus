from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.ai.ontology import normalize_skill

def compute_job_match(
    user_skills: List[str],
    user_goal: str,
    job_title: str,
    job_description: str,
    required_skills: List[str],
    preferred_skills: List[str]
) -> Dict[str, Any]:
    """
    Computes a realistic match score between a candidate's profile and a job listing.
    Combines direct skill intersection with TF-IDF cosine similarity.
    """
    norm_user_skills = set(normalize_skill(s) for s in user_skills)
    norm_required = [normalize_skill(s) for s in required_skills]
    norm_preferred = [normalize_skill(s) for s in preferred_skills]

    # Calculate skill overlaps
    all_job_skills = set(norm_required + norm_preferred)
    matching_skills = sorted(list(norm_user_skills.intersection(all_job_skills)))
    missing_required = sorted(list(set(norm_required) - norm_user_skills))

    # Base skill match score
    if norm_required:
        required_matched = len(set(norm_required).intersection(norm_user_skills))
        required_ratio = required_matched / len(norm_required)
    else:
        required_ratio = 0.5

    preferred_matched = len(set(norm_preferred).intersection(norm_user_skills))
    preferred_ratio = (preferred_matched / len(norm_preferred)) if norm_preferred else 0.5

    skill_score = (0.75 * required_ratio) + (0.25 * preferred_ratio)

    # TF-IDF semantic similarity
    user_profile_text = f"{user_goal} {' '.join(user_skills)} candidate developer engineer analyst"
    job_full_text = f"{job_title} {job_description} {' '.join(required_skills)} {' '.join(preferred_skills)}"

    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([user_profile_text, job_full_text])
        sim = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
    except Exception:
        sim = 0.4

    # Role title relevance bonus
    title_bonus = 0.0
    if user_goal.lower() in job_title.lower() or any(w in job_title.lower() for w in user_goal.lower().split()):
        title_bonus = 0.10

    # Composite weighted percentage
    composite_raw = (0.60 * skill_score) + (0.30 * sim) + title_bonus
    # Scale to 0-100 with bounds
    final_percentage = int(min(100, max(15, round(composite_raw * 100))))

    # Human-readable explanation
    if final_percentage >= 80:
        why_matched = f"Strong match! You possess {len(matching_skills)} of the requested skills including core technologies."
    elif final_percentage >= 60:
        why_matched = f"Solid fit for your profile. Acquiring {missing_required[:2]} will elevate your candidacy."
    else:
        why_matched = f"Good stepping stone. This role requires additional depth in {missing_required[:3]}."

    return {
        "match_percentage": final_percentage,
        "matching_skills": matching_skills,
        "missing_skills": missing_required,
        "why_matched": why_matched
    }
