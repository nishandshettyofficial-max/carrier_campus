import re
from typing import List, Dict, Set
from app.ai.ontology import ALL_CANONICAL_SKILLS, SKILL_ALIASES, normalize_skill

EMAIL_REGEX = re.compile(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+')
PHONE_REGEX = re.compile(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}')
LINKEDIN_REGEX = re.compile(r'linkedin\.com/in/[a-zA-Z0-9_-]+', re.IGNORECASE)
GITHUB_REGEX = re.compile(r'github\.com/[a-zA-Z0-9_-]+', re.IGNORECASE)

def extract_contact_info(text: str) -> Dict[str, str]:
    """Extract contact points like email, phone, and profile links from text."""
    contact = {
        "email": "",
        "phone": "",
        "linkedin": "",
        "github": ""
    }
    email_match = EMAIL_REGEX.search(text)
    if email_match:
        contact["email"] = email_match.group(0)

    phone_match = PHONE_REGEX.search(text)
    if phone_match:
        contact["phone"] = phone_match.group(0)

    linkedin_match = LINKEDIN_REGEX.search(text)
    if linkedin_match:
        contact["linkedin"] = f"https://{linkedin_match.group(0)}"

    github_match = GITHUB_REGEX.search(text)
    if github_match:
        contact["github"] = f"https://{github_match.group(0)}"

    return contact

def extract_skills_from_text(text: str) -> List[str]:
    """
    Extract recognized technical and soft skills from arbitrary text using regex boundary matching
    against the ontology and alias dictionary.
    """
    if not text:
        return []

    found_skills: Set[str] = set()
    cleaned_text = " " + text.replace("/", " ").replace(",", " ").replace(";", " ") + " "

    # 1. Search aliases
    for alias, canonical in SKILL_ALIASES.items():
        pattern = r'(?<![a-zA-Z0-9_#+])' + re.escape(alias) + r'(?![a-zA-Z0-9_#+])'
        if re.search(pattern, cleaned_text, re.IGNORECASE):
            found_skills.add(canonical)

    # 2. Search canonical skills
    for canonical in ALL_CANONICAL_SKILLS:
        pattern = r'(?<![a-zA-Z0-9_#+])' + re.escape(canonical) + r'(?![a-zA-Z0-9_#+])'
        if re.search(pattern, cleaned_text, re.IGNORECASE):
            found_skills.add(canonical)

    return sorted(list(found_skills))
