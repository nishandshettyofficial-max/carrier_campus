import re
from typing import List, Dict, Any
from app.config import settings

def grade_interview_answer(
    question_text: str,
    key_points: List[str],
    sample_good_answer: str,
    user_answer: str
) -> Dict[str, Any]:
    """
    Evaluates student interview answer using key concept coverage, length adequacy,
    and technical clarity, producing an actionable score and feedback.
    """
    cleaned_answer = user_answer.strip().lower()
    word_count = len(re.findall(r'\b\w+\b', cleaned_answer))

    # Guard: Extremely short or empty answers
    if word_count < 6:
        return {
            "score": 15,
            "correctness": "Needs Improvement",
            "key_points_covered": [],
            "missing_points": key_points,
            "feedback": "Your answer is too brief to demonstrate technical comprehension. Elaborate on the core concepts, syntax, and practical trade-offs.",
            "model_answer": sample_good_answer
        }

    covered_points = []
    missing_points = []

    # Check each key point for semantic match
    for kp in key_points:
        kp_clean = kp.lower()
        # Tokenize key concept words (filtering short words)
        concept_tokens = [w for w in re.findall(r'[a-zA-Z0-9_-]{3,}', kp_clean)
                          if w not in ("with", "from", "that", "this", "when", "then", "into", "used")]

        if not concept_tokens:
            covered_points.append(kp)
            continue

        # Count matched tokens
        matches = sum(1 for token in concept_tokens if token in cleaned_answer)
        match_ratio = matches / len(concept_tokens)

        # If at least 50% of the concept tokens are present or the phrase is in answer
        if match_ratio >= 0.45 or kp_clean in cleaned_answer:
            covered_points.append(kp)
        else:
            missing_points.append(kp)

    # 1. Concept Coverage Score (Max 60 points)
    if key_points:
        concept_ratio = len(covered_points) / len(key_points)
    else:
        concept_ratio = 0.8
    concept_score = int(round(concept_ratio * 60))

    # 2. Length & Depth Score (Max 25 points)
    # Ideal answers for technical questions are generally between 35 and 150 words
    if word_count >= 50:
        length_score = 25
    elif word_count >= 30:
        length_score = 20
    elif word_count >= 15:
        length_score = 14
    else:
        length_score = 8

    # 3. Structure & Cohesion (Max 15 points)
    # Check for formatting, examples, or technical transition words
    structural_indicators = ["because", "for example", "whereas", "while", "unlike", "specifically", "in contrast", "such as"]
    structure_bonus = min(15, 5 + (sum(2 for ind in structural_indicators if ind in cleaned_answer)))

    total_score = min(100, max(15, concept_score + length_score + structure_bonus))

    # Determine qualitative status
    if total_score >= 85:
        correctness = "Excellent"
        feedback = "Comprehensive and well-structured response! You covered the essential technical criteria with clarity and appropriate depth."
    elif total_score >= 70:
        correctness = "Good"
        feedback = f"Solid answer that communicates the main premise well. To make it top-tier, touch upon: {'; '.join(missing_points[:2]) if missing_points else 'additional edge cases'}."
    elif total_score >= 50:
        correctness = "Partial"
        feedback = f"You touched on some basic points, but missed critical concepts: {'; '.join(missing_points[:2]) if missing_points else 'key architectural details'}. Review the model answer below."
    else:
        correctness = "Needs Improvement"
        feedback = f"The response lacks technical depth. Key concepts omitted: {'; '.join(missing_points[:3]) if missing_points else 'fundamental principles'}. Study the sample answer for optimal phrasing."

    return {
        "score": total_score,
        "correctness": correctness,
        "key_points_covered": covered_points,
        "missing_points": missing_points,
        "feedback": feedback,
        "model_answer": sample_good_answer
    }
