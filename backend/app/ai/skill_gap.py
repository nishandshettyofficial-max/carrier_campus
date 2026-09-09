from typing import List, Dict, Any
from app.ai.ontology import normalize_skill

CAREER_CURRICULUM = {
    "Data Analyst": {
        "description": "Transforms raw datasets into business insights, dashboards, and strategic metrics using statistical analysis and visualization.",
        "avg_salary": "₹6,50,000 - ₹12,00,000",
        "skills": [
            {"name": "Excel", "category": "Analytics", "importance": "High", "level": "Intermediate", "order": 1, "weight": 3,
             "resources": [{"title": "Excel for Data Analysis", "type": "Course", "url": "https://www.coursera.org/learn/excel-data-analysis", "platform": "Coursera"}]},
            {"name": "SQL", "category": "Databases", "importance": "High", "level": "Intermediate", "order": 2, "weight": 3,
             "resources": [{"title": "SQL for Data Science", "type": "Interactive", "url": "https://mode.com/sql-tutorial/", "platform": "Mode Analytics"}]},
            {"name": "Python", "category": "Programming", "importance": "High", "level": "Intermediate", "order": 3, "weight": 3,
             "resources": [{"title": "Python for Data Science Handbook", "type": "Book", "url": "https://jakevdp.github.io/PythonDataScienceHandbook/", "platform": "Open Source"}]},
            {"name": "Pandas", "category": "Data Processing", "importance": "High", "level": "Intermediate", "order": 4, "weight": 3,
             "resources": [{"title": "Pandas Official Tutorials", "type": "Docs", "url": "https://pandas.pydata.org/docs/getting_started/", "platform": "Pandas Docs"}]},
            {"name": "Power BI", "category": "Visualization", "importance": "High", "level": "Intermediate", "order": 5, "weight": 3,
             "resources": [{"title": "Microsoft Power BI Guided Learning", "type": "Tutorial", "url": "https://learn.microsoft.com/en-us/power-bi/", "platform": "Microsoft Learn"}]},
            {"name": "Tableau", "category": "Visualization", "importance": "Medium", "level": "Intermediate", "order": 6, "weight": 2,
             "resources": [{"title": "Tableau Free Training Videos", "type": "Video", "url": "https://www.tableau.com/learn/training", "platform": "Tableau"}]},
            {"name": "Statistics", "category": "Mathematics", "importance": "High", "level": "Intermediate", "order": 7, "weight": 3,
             "resources": [{"title": "Khan Academy Statistics & Probability", "type": "Course", "url": "https://www.khanacademy.org/math/statistics-probability", "platform": "Khan Academy"}]},
            {"name": "Exploratory Data Analysis", "category": "Analytics", "importance": "High", "level": "Intermediate", "order": 8, "weight": 2,
             "resources": [{"title": "Kaggle EDA Tutorials", "type": "Course", "url": "https://www.kaggle.com/learn", "platform": "Kaggle"}]},
            {"name": "A/B Testing", "category": "Mathematics", "importance": "Medium", "level": "Advanced", "order": 9, "weight": 2,
             "resources": [{"title": "Udacity A/B Testing by Google", "type": "Course", "url": "https://www.udacity.com/course/ab-testing--ud257", "platform": "Udacity"}]}
        ]
    },
    "Data Scientist": {
        "description": "Combines advanced machine learning, predictive modeling, statistical rigor, and big data to build intelligent systems.",
        "avg_salary": "₹9,00,000 - ₹20,00,000",
        "skills": [
            {"name": "Python", "category": "Programming", "importance": "High", "level": "Advanced", "order": 1, "weight": 3,
             "resources": [{"title": "Scientific Python Lectures", "type": "Docs", "url": "https://lectures.scientific-python.org/", "platform": "SciPy"}]},
            {"name": "SQL", "category": "Databases", "importance": "High", "level": "Intermediate", "order": 2, "weight": 3,
             "resources": [{"title": "Advanced SQL for Data Scientists", "type": "Tutorial", "url": "https://www.postgresqltutorial.com/", "platform": "PostgreSQL Tutorial"}]},
            {"name": "Pandas", "category": "Data Processing", "importance": "High", "level": "Intermediate", "order": 3, "weight": 3,
             "resources": [{"title": "Data Manipulation with Pandas", "type": "Course", "url": "https://www.kaggle.com/learn/pandas", "platform": "Kaggle"}]},
            {"name": "NumPy", "category": "Data Processing", "importance": "High", "level": "Intermediate", "order": 4, "weight": 2,
             "resources": [{"title": "NumPy Quickstart", "type": "Docs", "url": "https://numpy.org/doc/stable/user/quickstart.html", "platform": "NumPy Docs"}]},
            {"name": "Statistics", "category": "Mathematics", "importance": "High", "level": "Advanced", "order": 5, "weight": 3,
             "resources": [{"title": "StatQuest with Josh Starmer", "type": "Video Series", "url": "https://statquest.org/", "platform": "YouTube / Web"}]},
            {"name": "Machine Learning", "category": "Machine Learning", "importance": "High", "level": "Advanced", "order": 6, "weight": 3,
             "resources": [{"title": "Andrew Ng Machine Learning Specialization", "type": "Course", "url": "https://www.deeplearning.ai/courses/machine-learning-specialization/", "platform": "DeepLearning.AI"}]},
            {"name": "Scikit-learn", "category": "Machine Learning", "importance": "High", "level": "Intermediate", "order": 7, "weight": 3,
             "resources": [{"title": "Scikit-learn User Guide", "type": "Docs", "url": "https://scikit-learn.org/stable/user_guide.html", "platform": "Scikit-learn"}]},
            {"name": "Deep Learning", "category": "Deep Learning", "importance": "Medium", "level": "Intermediate", "order": 8, "weight": 2,
             "resources": [{"title": "Fast.ai Practical Deep Learning", "type": "Course", "url": "https://course.fast.ai/", "platform": "Fast.ai"}]},
            {"name": "PyTorch", "category": "Deep Learning", "importance": "Medium", "level": "Intermediate", "order": 9, "weight": 2,
             "resources": [{"title": "PyTorch 60min Blitz", "type": "Tutorial", "url": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html", "platform": "PyTorch Docs"}]},
            {"name": "Model Deployment", "category": "Deployment", "importance": "Medium", "level": "Intermediate", "order": 10, "weight": 2,
             "resources": [{"title": "Deploying Machine Learning Models with FastAPI", "type": "Project", "url": "https://fastapi.tiangolo.com/tutorial/", "platform": "FastAPI"}]}
        ]
    },
    "Machine Learning Engineer": {
        "description": "Bridges research and software engineering to scale, optimize, and deploy robust machine learning models into production.",
        "avg_salary": "₹10,00,000 - ₹24,00,000",
        "skills": [
            {"name": "Python", "category": "Programming", "importance": "High", "level": "Advanced", "order": 1, "weight": 3,
             "resources": [{"title": "Clean Code in Python", "type": "Book", "url": "https://github.com/zedr/clean-code-python", "platform": "GitHub"}]},
            {"name": "Data Structures & Algorithms", "category": "Programming", "importance": "High", "level": "Intermediate", "order": 2, "weight": 3,
             "resources": [{"title": "NeetCode Roadmap", "type": "Practice", "url": "https://neetcode.io/roadmap", "platform": "NeetCode"}]},
            {"name": "Machine Learning", "category": "Modeling", "importance": "High", "level": "Advanced", "order": 3, "weight": 3,
             "resources": [{"title": "Hands-On Machine Learning (Gerón)", "type": "Book", "url": "https://github.com/ageron/handson-ml3", "platform": "GitHub"}]},
            {"name": "PyTorch", "category": "Deep Learning", "importance": "High", "level": "Intermediate", "order": 4, "weight": 3,
             "resources": [{"title": "Deep Learning with PyTorch", "type": "Book", "url": "https://pytorch.org/deep-learning-with-pytorch", "platform": "PyTorch"}]},
            {"name": "Docker", "category": "DevOps", "importance": "High", "level": "Intermediate", "order": 5, "weight": 3,
             "resources": [{"title": "Docker for Data Science", "type": "Tutorial", "url": "https://docker-curriculum.com/", "platform": "Docker Curriculum"}]},
            {"name": "FastAPI", "category": "Backend", "importance": "High", "level": "Intermediate", "order": 6, "weight": 2,
             "resources": [{"title": "FastAPI ML Microservices", "type": "Docs", "url": "https://fastapi.tiangolo.com/", "platform": "FastAPI Docs"}]},
            {"name": "MLOps", "category": "Deployment", "importance": "High", "level": "Intermediate", "order": 7, "weight": 3,
             "resources": [{"title": "Made With ML MLOps Course", "type": "Course", "url": "https://madewithml.com/", "platform": "Made With ML"}]},
            {"name": "MLflow", "category": "Deployment", "importance": "Medium", "level": "Intermediate", "order": 8, "weight": 2,
             "resources": [{"title": "MLflow Tracking Quickstart", "type": "Docs", "url": "https://mlflow.org/docs/latest/index.html", "platform": "MLflow"}]},
            {"name": "CI/CD", "category": "DevOps", "importance": "Medium", "level": "Intermediate", "order": 9, "weight": 2,
             "resources": [{"title": "GitHub Actions for ML", "type": "Tutorial", "url": "https://docs.github.com/en/actions", "platform": "GitHub Docs"}]}
        ]
    },
    "Software Developer": {
        "description": "Architects reliable, performant software applications, RESTful APIs, modern databases, and clean frontend user experiences.",
        "avg_salary": "₹7,00,000 - ₹18,00,000",
        "skills": [
            {"name": "Data Structures & Algorithms", "category": "Computer Science", "importance": "High", "level": "Advanced", "order": 1, "weight": 3,
             "resources": [{"title": "LeetCode 75", "type": "Practice", "url": "https://leetcode.com/studyplan/leetcode-75/", "platform": "LeetCode"}]},
            {"name": "Python", "category": "Programming", "importance": "High", "level": "Intermediate", "order": 2, "weight": 3,
             "resources": [{"title": "Real Python Tutorials", "type": "Tutorial", "url": "https://realpython.com/", "platform": "Real Python"}]},
            {"name": "JavaScript", "category": "Frontend", "importance": "High", "level": "Intermediate", "order": 3, "weight": 3,
             "resources": [{"title": "javascript.info", "type": "Interactive Book", "url": "https://javascript.info/", "platform": "JavaScript.info"}]},
            {"name": "React", "category": "Frontend", "importance": "High", "level": "Intermediate", "order": 4, "weight": 3,
             "resources": [{"title": "React Official Documentation", "type": "Docs", "url": "https://react.dev/", "platform": "React.dev"}]},
            {"name": "REST APIs", "category": "Backend", "importance": "High", "level": "Intermediate", "order": 5, "weight": 3,
             "resources": [{"title": "RESTful API Design Best Practices", "type": "Guide", "url": "https://restfulapi.net/", "platform": "RESTful API"}]},
            {"name": "PostgreSQL", "category": "Databases", "importance": "High", "level": "Intermediate", "order": 6, "weight": 3,
             "resources": [{"title": "PostgreSQL Tutorial", "type": "Tutorial", "url": "https://www.postgresqltutorial.com/", "platform": "PostgreSQL"}]},
            {"name": "Git", "category": "DevOps", "importance": "High", "level": "Intermediate", "order": 7, "weight": 2,
             "resources": [{"title": "Pro Git Book", "type": "Book", "url": "https://git-scm.com/book/en/v2", "platform": "Git SCM"}]},
            {"name": "System Design", "category": "Computer Science", "importance": "Medium", "level": "Intermediate", "order": 8, "weight": 2,
             "resources": [{"title": "System Design Primer", "type": "Guide", "url": "https://github.com/donnemartin/system-design-primer", "platform": "GitHub"}]},
            {"name": "Docker", "category": "DevOps", "importance": "Medium", "level": "Intermediate", "order": 9, "weight": 2,
             "resources": [{"title": "Docker Getting Started Guide", "type": "Docs", "url": "https://docs.docker.com/get-started/", "platform": "Docker Docs"}]}
        ]
    },
    "AI Engineer": {
        "description": "Specializes in modern Generative AI, Large Language Models, RAG architectures, prompt engineering, and agentic workflows.",
        "avg_salary": "₹12,00,000 - ₹26,00,000",
        "skills": [
            {"name": "Python", "category": "Programming", "importance": "High", "level": "Advanced", "order": 1, "weight": 3,
             "resources": [{"title": "Advanced Python Patterns", "type": "Tutorial", "url": "https://realpython.com/", "platform": "Real Python"}]},
            {"name": "Large Language Models", "category": "GenAI", "importance": "High", "level": "Advanced", "order": 2, "weight": 3,
             "resources": [{"title": "Andrej Karpathy - Intro to LLMs", "type": "Video", "url": "https://www.youtube.com/watch?v=zjkBMFhNj_g", "platform": "YouTube"}]},
            {"name": "Generative AI", "category": "GenAI", "importance": "High", "level": "Intermediate", "order": 3, "weight": 3,
             "resources": [{"title": "Generative AI for Everyone (DeepLearning.AI)", "type": "Course", "url": "https://www.deeplearning.ai/courses/generative-ai-for-everyone/", "platform": "DeepLearning.AI"}]},
            {"name": "Prompt Engineering", "category": "GenAI", "importance": "High", "level": "Intermediate", "order": 4, "weight": 2,
             "resources": [{"title": "Learn Prompting", "type": "Interactive Guide", "url": "https://learnprompting.org/", "platform": "LearnPrompting"}]},
            {"name": "LangChain", "category": "GenAI Frameworks", "importance": "High", "level": "Intermediate", "order": 5, "weight": 3,
             "resources": [{"title": "LangChain Official Quickstart", "type": "Docs", "url": "https://python.langchain.com/docs/get_started/introduction", "platform": "LangChain Docs"}]},
            {"name": "RAG", "category": "GenAI Architectures", "importance": "High", "level": "Advanced", "order": 6, "weight": 3,
             "resources": [{"title": "Building Production RAG Systems", "type": "Guide", "url": "https://www.llamaindex.ai/learn", "platform": "LlamaIndex"}]},
            {"name": "Vector Databases", "category": "Databases", "importance": "High", "level": "Intermediate", "order": 7, "weight": 2,
             "resources": [{"title": "Pinecone Learning Center", "type": "Articles", "url": "https://www.pinecone.io/learn/", "platform": "Pinecone"}]},
            {"name": "Transformers", "category": "Deep Learning", "importance": "High", "level": "Intermediate", "order": 8, "weight": 3,
             "resources": [{"title": "Hugging Face NLP Course", "type": "Course", "url": "https://huggingface.co/learn/nlp-course", "platform": "Hugging Face"}]},
            {"name": "FastAPI", "category": "Backend", "importance": "Medium", "level": "Intermediate", "order": 9, "weight": 2,
             "resources": [{"title": "Building APIs for AI Services", "type": "Docs", "url": "https://fastapi.tiangolo.com/", "platform": "FastAPI"}]}
        ]
    }
}

def compute_skill_gap(
    user_skills: List[str],
    career_goal: str,
    progress_status: Dict[str, str] = None
) -> Dict[str, Any]:
    """
    Computes complete skill gap analysis, readiness score, categorized missing skills,
    and radar breakdown for the chosen career path.
    """
    if progress_status is None:
        progress_status = {}

    curriculum = CAREER_CURRICULUM.get(career_goal, CAREER_CURRICULUM["Data Scientist"])
    role_skills = curriculum["skills"]

    norm_user_skills = set(normalize_skill(s) for s in user_skills)

    # Calculate weights and status
    total_possible_weight = sum(s["weight"] for s in role_skills)
    earned_weight = 0

    mastered_skills = []
    missing_high = []
    missing_secondary = []
    ordered_path = []

    # Category aggregation for radar chart
    cat_stats: Dict[str, Dict[str, int]] = {}

    for item in role_skills:
        s_name = item["name"]
        cat = item["category"]
        weight = item["weight"]

        if cat not in cat_stats:
            cat_stats[cat] = {"required": 0, "current": 0}
        cat_stats[cat]["required"] += weight

        # Status determination: check user_skills OR explicit progress_status
        user_status = progress_status.get(s_name, "completed" if s_name in norm_user_skills else "not_started")
        is_mastered = (s_name in norm_user_skills) or (user_status == "completed")

        if is_mastered:
            earned_weight += weight
            mastered_skills.append(s_name)
            cat_stats[cat]["current"] += weight
        elif user_status == "learning":
            # Partial credit for in-progress skills
            earned_weight += (weight * 0.5)
            cat_stats[cat]["current"] += (weight * 0.5)

        detail = {
            "name": s_name,
            "category": cat,
            "importance": item["importance"],
            "level": item["level"],
            "is_mastered": is_mastered,
            "status": user_status,
            "resources": item["resources"]
        }

        if not is_mastered:
            if item["importance"] == "High":
                missing_high.append(detail)
            else:
                missing_secondary.append(detail)

            ordered_path.append({
                "order": item["order"],
                "name": s_name,
                "importance": item["importance"],
                "level": item["level"],
                "category": cat,
                "status": user_status,
                "resources": item["resources"]
            })

    # Sort ordered path by curriculum sequence order
    ordered_path.sort(key=lambda x: x["order"])

    readiness_percentage = int(min(100, max(0, round((earned_weight / total_possible_weight) * 100))))

    # Format radar chart data
    radar_data = []
    for cat_name, values in cat_stats.items():
        req = values["required"]
        curr = values["current"]
        score = int(round((curr / req) * 100)) if req > 0 else 0
        radar_data.append({
            "subject": cat_name,
            "user_score": score,
            "required_score": 100
        })

    return {
        "career_goal": career_goal,
        "description": curriculum["description"],
        "avg_salary": curriculum["avg_salary"],
        "readiness_score": readiness_percentage,
        "matched_skills_count": len(mastered_skills),
        "total_skills_count": len(role_skills),
        "mastered_skills": mastered_skills,
        "missing_high_priority": missing_high,
        "missing_secondary": missing_secondary,
        "ordered_learning_path": ordered_path,
        "radar_data": radar_data
    }
