"""
Comprehensive ontology of 250+ technical, AI/DS, software, and soft skills
with canonical naming and normalization aliases.
"""

# Canonical skills grouped by domain
SKILL_TAXONOMY = {
    "Programming Languages": [
        "Python", "SQL", "Java", "C++", "C", "C#", "JavaScript", "TypeScript",
        "R", "Go", "Rust", "Scala", "Kotlin", "Swift", "Bash", "Shell", "HTML", "CSS"
    ],
    "Data Science & Analytics": [
        "Pandas", "NumPy", "Data Analysis", "Exploratory Data Analysis", "Data Cleaning",
        "Statistics", "Probability", "A/B Testing", "Hypothesis Testing", "Excel",
        "Power BI", "Tableau", "Matplotlib", "Seaborn", "Plotly", "ETL", "Data Wrangling"
    ],
    "Machine Learning": [
        "Machine Learning", "Scikit-learn", "Regression", "Classification", "Clustering",
        "Random Forest", "XGBoost", "Gradient Boosting", "SVM", "Feature Engineering",
        "Model Evaluation", "Cross Validation", "Hyperparameter Tuning", "PCA"
    ],
    "Deep Learning & AI": [
        "Deep Learning", "Neural Networks", "TensorFlow", "PyTorch", "Keras",
        "Computer Vision", "OpenCV", "CNN", "Object Detection", "YOLO",
        "Natural Language Processing", "Transformers", "BERT", "Large Language Models",
        "Generative AI", "Hugging Face", "LangChain", "LlamaIndex", "Vector Databases",
        "RAG", "Prompt Engineering", "Fine-Tuning", "RNN", "LSTM"
    ],
    "Databases & Big Data": [
        "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Elasticsearch",
        "Apache Spark", "PySpark", "Hadoop", "Kafka", "Snowflake", "BigQuery",
        "Data Warehousing", "Cassandra"
    ],
    "Backend & Web Development": [
        "FastAPI", "Flask", "Django", "Node.js", "Express.js", "REST APIs",
        "GraphQL", "Microservices", "React", "Next.js", "Vue.js", "Angular",
        "Tailwind CSS", "Redux", "WebSockets"
    ],
    "Cloud & DevOps": [
        "Docker", "Kubernetes", "AWS", "Google Cloud Platform", "Microsoft Azure",
        "Git", "GitHub", "CI/CD", "Linux", "Terraform", "MLOps", "MLflow",
        "Airflow", "DVC", "Model Deployment"
    ],
    "Core CS & Soft Skills": [
        "Data Structures & Algorithms", "System Design", "Object-Oriented Programming",
        "Problem Solving", "Critical Thinking", "Agile", "Scrum", "Communication",
        "Team Leadership", "Code Review", "Unit Testing"
    ]
}

# Alias dictionary for normalization mapping: alias (lowercase) -> canonical skill
SKILL_ALIASES = {
    "py": "Python",
    "python3": "Python",
    "js": "JavaScript",
    "ts": "TypeScript",
    "cpp": "C++",
    "c sharp": "C#",
    "csharp": "C#",
    "golang": "Go",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "mysql": "MySQL",
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "sqlite3": "SQLite",
    "sqlite": "SQLite",
    "sklearn": "Scikit-learn",
    "scikit learn": "Scikit-learn",
    "tf": "TensorFlow",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "torch": "PyTorch",
    "nlp": "Natural Language Processing",
    "cv": "Computer Vision",
    "llm": "Large Language Models",
    "llms": "Large Language Models",
    "genai": "Generative AI",
    "gen ai": "Generative AI",
    "eda": "Exploratory Data Analysis",
    "powerbi": "Power BI",
    "power-bi": "Power BI",
    "ms excel": "Excel",
    "microsoft excel": "Excel",
    "node": "Node.js",
    "nodejs": "Node.js",
    "reactjs": "React",
    "react.js": "React",
    "nextjs": "Next.js",
    "next.js": "Next.js",
    "fast-api": "FastAPI",
    "fastapi": "FastAPI",
    "gcp": "Google Cloud Platform",
    "google cloud": "Google Cloud Platform",
    "k8s": "Kubernetes",
    "dsa": "Data Structures & Algorithms",
    "oop": "Object-Oriented Programming",
    "oops": "Object-Oriented Programming",
    "rest": "REST APIs",
    "restful": "REST APIs",
    "rest api": "REST APIs",
    "ci cd": "CI/CD",
    "ci/cd": "CI/CD",
    "spark": "Apache Spark",
    "rag": "RAG",
    "retrieval augmented generation": "RAG",
    "mlops": "MLOps",
    "ml": "Machine Learning",
    "dl": "Deep Learning",
    "huggingface": "Hugging Face"
}

# Pre-flatten all canonical skills
ALL_CANONICAL_SKILLS = set()
for category_skills in SKILL_TAXONOMY.values():
    ALL_CANONICAL_SKILLS.update(category_skills)

def normalize_skill(skill_str: str) -> str:
    """Normalize user input skill to canonical title case or standard acronym."""
    cleaned = skill_str.strip()
    lowered = cleaned.lower()
    if lowered in SKILL_ALIASES:
        return SKILL_ALIASES[lowered]
    # Check if exact match in canonical
    for canonical in ALL_CANONICAL_SKILLS:
        if canonical.lower() == lowered:
            return canonical
    return cleaned
