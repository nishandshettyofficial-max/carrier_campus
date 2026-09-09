import io
import re
from typing import Dict, Any, List, Optional
from pypdf import PdfReader
from app.ai.skill_extractor import extract_skills_from_text, extract_contact_info

ACTION_VERBS = [
    "accelerated", "achieved", "analyzed", "architected", "automated", "built",
    "calculated", "collaborated", "constructed", "created", "decreased", "delivered",
    "deployed", "designed", "developed", "engineered", "established", "evaluated",
    "executed", "extracted", "fine-tuned", "formulated", "generated", "implemented",
    "improved", "increased", "initiated", "integrated", "launched", "led", "managed",
    "modeled", "monitored", "optimized", "orchestrated", "predicted", "produced",
    "reduced", "resolved", "restructured", "scaled", "simulated", "spearheaded",
    "streamlined", "trained", "transformed", "upgraded", "validated"
]

SECTION_PATTERNS = {
    "contact": r"(email|phone|linkedin|github|mobile)",
    "education": r"(education|academic|b\.tech|bachelor|degree|university|college|gpa)",
    "skills": r"(skills|technical skills|technologies|proficiencies|competencies|tools)",
    "experience": r"(experience|internship|work experience|employment|professional history)",
    "projects": r"(projects|academic projects|personal projects|key projects)",
    "certifications": r"(certifications|certificates|licenses|courses|achievements)"
}

QUANTIFIER_REGEX = re.compile(
    r'(\b\d+%\b|\b\d+\s*(?:percent|k|million|users|requests|ms|seconds|accuracy|f1|hours)\b|\$\d+|\b\d+\+\b|\b\d{2,}\b)',
    re.IGNORECASE
)

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract plain text from an uploaded PDF file."""
    text_content = []
    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_content.append(page_text)
    except Exception as e:
        raise ValueError(f"Could not read PDF document: {str(e)}")

    return "\n".join(text_content)

def analyze_resume_text(resume_text: str, filename: str = "resume.pdf") -> Dict[str, Any]:
    """
    Analyzes resume text across structure, skills, impact, and action verbs.
    Produces a transparent 0-100 score with granular diagnostics.
    """
    lowered_text = resume_text.lower()

    # 1. Contact Info
    contact = extract_contact_info(resume_text)

    # 2. Section Detection
    detected_sections = {}
    for sec_name, pattern in SECTION_PATTERNS.items():
        detected_sections[sec_name] = bool(re.search(pattern, lowered_text))

    # 3. Skills Extraction
    extracted_skills = extract_skills_from_text(resume_text)

    # 4. Quantifiers / Measurable Results
    quantifier_matches = QUANTIFIER_REGEX.findall(resume_text)
    quantified_count = len(quantifier_matches)

    # 5. Action Verbs
    found_verbs = set()
    for verb in ACTION_VERBS:
        if re.search(r'\b' + verb + r'\b', lowered_text):
            found_verbs.add(verb)
    verb_count = len(found_verbs)

    # 6. Scoring Breakdown (Total: 100)
    # Sections score (max 25)
    sec_points = 0
    if detected_sections.get("contact"): sec_points += 5
    if detected_sections.get("education"): sec_points += 5
    if detected_sections.get("skills"): sec_points += 5
    if detected_sections.get("projects"): sec_points += 5
    if detected_sections.get("experience"): sec_points += 5
    sec_score = min(25, sec_points)

    # Skills score (max 30): rewarding diverse recognized skills
    if len(extracted_skills) >= 12:
        skill_score = 30
    elif len(extracted_skills) >= 8:
        skill_score = 25
    elif len(extracted_skills) >= 5:
        skill_score = 18
    elif len(extracted_skills) >= 2:
        skill_score = 12
    else:
        skill_score = 5

    # Impact & Quantification score (max 25)
    if quantified_count >= 5:
        impact_score = 25
    elif quantified_count >= 3:
        impact_score = 20
    elif quantified_count >= 1:
        impact_score = 14
    else:
        impact_score = 6

    # Action verbs & formatting tone (max 20)
    if verb_count >= 8:
        verb_score = 20
    elif verb_count >= 5:
        verb_score = 16
    elif verb_count >= 2:
        verb_score = 11
    else:
        verb_score = 5

    total_score = min(100, sec_score + skill_score + impact_score + verb_score)

    # 7. Generate Strengths
    strengths = []
    if len(extracted_skills) >= 8:
        strengths.append(f"Strong technical skill breadth: {len(extracted_skills)} recognized competencies identified.")
    if quantified_count >= 3:
        strengths.append(f"Good evidence of quantified impact with {quantified_count} numerical metrics or outcomes.")
    if verb_count >= 6:
        strengths.append(f"Engaging language with {verb_count} distinct proactive action verbs.")
    if detected_sections.get("projects") and detected_sections.get("skills"):
        strengths.append("Clear structural alignment with dedicated Projects and Skills sections.")
    if not strengths:
        strengths.append("Clear baseline layout ready for expansion with targeted project details.")

    # 8. Generate Actionable Improvements
    improvements = []
    if quantified_count < 3:
        improvements.append("Add measurable outcomes to your project bullets (e.g., 'achieved 92% accuracy', 'reduced response time by 35%').")
    if verb_count < 5:
        improvements.append("Begin project bullet points with strong power verbs like 'Architected', 'Engineered', 'Optimized' instead of 'Worked on'.")
    if not detected_sections.get("experience"):
        improvements.append("Add an Experience, Internship, or Open Source Contributions section to demonstrate applied work.")
    if len(extracted_skills) < 8:
        improvements.append("Expand technical competencies to include relevant frameworks, databases, and deployment tools.")
    if not contact.get("github") or not contact.get("linkedin"):
        improvements.append("Ensure clickable links to your GitHub profile and LinkedIn are placed in the header.")
    if not improvements:
        improvements.append("Tailor technical keywords directly to specific target job descriptions to maximize recruiter engagement.")
        improvements.append("Attach live deployment demo links alongside GitHub repository links for top projects.")

    return {
        "filename": filename,
        "score": total_score,
        "score_breakdown": {
            "sections": sec_score,
            "skills": skill_score,
            "impact": impact_score,
            "formatting": verb_score
        },
        "extracted_contact": contact,
        "extracted_skills": extracted_skills,
        "sections_detected": detected_sections,
        "strengths": strengths,
        "areas_to_improve": improvements,
        "quantified_bullet_count": quantified_count,
        "action_verb_count": verb_count
    }
