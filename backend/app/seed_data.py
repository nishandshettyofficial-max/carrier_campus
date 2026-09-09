import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import User, Job, CareerPath, InterviewQuestion, SavedJob, ResumeAnalysis, InterviewSubmission, UserSkillProgress
from app.ai.skill_gap import CAREER_CURRICULUM

SAMPLE_JOBS = [
    {
        "title": "Junior Data Scientist",
        "company": "Swiggy",
        "location": "Bengaluru (Hybrid)",
        "job_type": "Full-time",
        "experience_level": "Entry Level (0-1 yr)",
        "description": "Join Swiggy's core AI algorithms team to build predictive models for hyper-local delivery time estimation, consumer demand forecasting, and recommendation systems. You will analyze petabytes of telemetry and order data to deliver high-impact features.",
        "salary_range": "₹12,00,000 - ₹16,00,000",
        "required_skills": ["Python", "SQL", "Machine Learning", "Pandas", "Scikit-learn", "Statistics"],
        "preferred_skills": ["PyTorch", "FastAPI", "Docker", "A/B Testing"]
    },
    {
        "title": "Associate AI Engineer",
        "company": "Razorpay",
        "location": "Bengaluru (On-site)",
        "job_type": "Full-time",
        "experience_level": "Entry Level",
        "description": "Develop and deploy GenAI solutions, automated financial document parsing agents, and LLM-powered customer service engines. Collaborate with product architects to implement scalable RAG pipelines using vector databases.",
        "salary_range": "₹14,00,000 - ₹18,00,000",
        "required_skills": ["Python", "Large Language Models", "Generative AI", "LangChain", "FastAPI", "Vector Databases"],
        "preferred_skills": ["RAG", "Docker", "PostgreSQL", "Prompt Engineering"]
    },
    {
        "title": "Data Analyst Trainee",
        "company": "Zerodha",
        "location": "Bengaluru (On-site)",
        "job_type": "Full-time",
        "experience_level": "Fresher",
        "description": "Analyze equity trading patterns, customer onboarding conversion funnels, and risk management metrics. Build automated executive dashboards in Power BI and SQL for product leadership.",
        "salary_range": "₹7,50,000 - ₹11,00,000",
        "required_skills": ["SQL", "Excel", "Python", "Power BI", "Data Analysis"],
        "preferred_skills": ["Tableau", "Pandas", "Statistics"]
    },
    {
        "title": "Machine Learning Engineer - Intern to Hire",
        "company": "PhonePe",
        "location": "Bengaluru (Hybrid)",
        "job_type": "Internship",
        "experience_level": "Fresher / Intern",
        "description": "Work with our Fraud Prevention & Trust engineering group. Train anomaly detection classifiers, benchmark real-time inference latency with ONNX and TensorRT, and automate MLOps tracking pipelines.",
        "salary_range": "₹45,000/month stipend (₹15 LPA on conversion)",
        "required_skills": ["Python", "Machine Learning", "Data Structures & Algorithms", "PyTorch", "Docker"],
        "preferred_skills": ["MLflow", "FastAPI", "Linux", "CI/CD"]
    },
    {
        "title": "Graduate Software Engineer (Backend)",
        "company": "Zomato",
        "location": "Gurugram (On-site)",
        "job_type": "Full-time",
        "experience_level": "Entry Level",
        "description": "Engineer high-throughput microservices handling millions of daily delivery order events. Optimize database query performance, maintain RESTful APIs, and participate in incident reviews.",
        "salary_range": "₹11,00,000 - ₹15,00,000",
        "required_skills": ["Python", "Data Structures & Algorithms", "PostgreSQL", "REST APIs", "Git"],
        "preferred_skills": ["Redis", "Docker", "FastAPI", "System Design"]
    },
    {
        "title": "Data Scientist - Personalization",
        "company": "CRED",
        "location": "Bengaluru (On-site)",
        "job_type": "Full-time",
        "experience_level": "1-2 years",
        "description": "Build high-cardinality ranking models and customer segmentation clustering for CRED Rewards and Store. Design experimentation frameworks and compute offline evaluation metrics.",
        "salary_range": "₹16,00,000 - ₹22,0,000",
        "required_skills": ["Python", "SQL", "Machine Learning", "Scikit-learn", "Statistics", "A/B Testing"],
        "preferred_skills": ["Deep Learning", "XGBoost", "PySpark", "Cloud & DevOps"]
    },
    {
        "title": "Business Intelligence & Data Analyst",
        "company": "Flipkart",
        "location": "Bengaluru (Hybrid)",
        "job_type": "Full-time",
        "experience_level": "0-1 yr",
        "description": "Collaborate with supply chain category managers to monitor delivery fulfillment SLAs, warehouse utilization, and regional sales spikes using SQL queries and Tableau storytelling.",
        "salary_range": "₹8,00,000 - ₹12,00,000",
        "required_skills": ["SQL", "Tableau", "Excel", "Data Analysis", "Exploratory Data Analysis"],
        "preferred_skills": ["Python", "Pandas", "Communication"]
    },
    {
        "title": "GenAI Full-Stack Developer",
        "company": "ThoughtSpot",
        "location": "Bengaluru (Hybrid)",
        "job_type": "Full-time",
        "experience_level": "Entry Level",
        "description": "Integrate natural language query engines with modern React frontends. Build micro-APIs connecting LLM agents with Snowflake and BigQuery relational backends.",
        "salary_range": "₹13,00,000 - ₹18,00,000",
        "required_skills": ["React", "JavaScript", "Python", "FastAPI", "Large Language Models"],
        "preferred_skills": ["TypeScript", "LangChain", "Vector Databases", "Tailwind CSS"]
    },
    {
        "title": "Computer Vision & Deep Learning Trainee",
        "company": "Lenskart",
        "location": "Delhi NCR (On-site)",
        "job_type": "Full-time",
        "experience_level": "Entry Level",
        "description": "Develop 3D face mesh fitting, virtual frame try-on algorithms, and eye prescription landmark regression models using PyTorch, OpenCV, and lightweight CNNs for mobile apps.",
        "salary_range": "₹10,00,000 - ₹14,00,000",
        "required_skills": ["Python", "PyTorch", "Computer Vision", "OpenCV", "Deep Learning"],
        "preferred_skills": ["CNN", "TensorFlow", "FastAPI", "Git"]
    },
    {
        "title": "Junior Cloud & MLOps Engineer",
        "company": "Groww",
        "location": "Bengaluru (On-site)",
        "job_type": "Full-time",
        "experience_level": "Entry Level",
        "description": "Automate deployment of quantitative risk models into AWS and Kubernetes clusters. Set up model drift monitoring, automated CI/CD pipelines, and Prometheus alerts.",
        "salary_range": "₹11,00,000 - ₹16,00,000",
        "required_skills": ["Python", "Docker", "Kubernetes", "AWS", "Git", "CI/CD"],
        "preferred_skills": ["MLflow", "FastAPI", "Linux", "Terraform"]
    },
    {
        "title": "Frontend Developer - Design Systems",
        "company": "Jio Financial Services",
        "location": "Mumbai (Hybrid)",
        "job_type": "Full-time",
        "experience_level": "0-2 years",
        "description": "Craft responsive, accessible web portals for investment portfolios. Implement reusable React component libraries styled with Tailwind CSS and integrated with secure REST APIs.",
        "salary_range": "₹8,00,000 - ₹13,00,000",
        "required_skills": ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS"],
        "preferred_skills": ["REST APIs", "Git", "Redux"]
    },
    {
        "title": "Natural Language Processing (NLP) Researcher",
        "company": "Sarvam AI",
        "location": "Bengaluru (On-site)",
        "job_type": "Full-time",
        "experience_level": "Entry Level / Masters",
        "description": "Train and evaluate multilingual Indic language LLMs and speech models. Conduct ablation studies on tokenizer efficiency, curriculum learning, and synthetic data generation.",
        "salary_range": "₹18,00,000 - ₹26,00,000",
        "required_skills": ["Python", "PyTorch", "Natural Language Processing", "Transformers", "Large Language Models"],
        "preferred_skills": ["Hugging Face", "Deep Learning", "Fine-Tuning", "Linux"]
    }
]

SAMPLE_QUESTIONS = [
    # Technical: Data Science & ML
    {
        "role": "Data Scientist",
        "category": "technical",
        "difficulty": "intermediate",
        "question": "What is the difference between Bias and Variance in Machine Learning, and how does regularization help address it?",
        "key_points": [
            "Bias is error due to overly simplistic assumptions (underfitting)",
            "Variance is error due to excessive sensitivity to training noise (overfitting)",
            "Bias-variance tradeoff balancing generalization vs memorization",
            "Regularization (L1 Lasso, L2 Ridge) penalizes large model weights to reduce variance"
        ],
        "sample_good_answer": "Bias refers to the error introduced by approximating a complex real-world phenomenon with an overly simplistic model, which typically leads to underfitting and high training error. Variance refers to the model's sensitivity to small fluctuations in the training dataset; high-variance models overfit training noise and fail to generalize to unseen test data.\n\nThe bias-variance tradeoff describes the delicate balance between minimizing both errors. Regularization techniques like L1 (Lasso) and L2 (Ridge) add penalty terms proportional to the magnitude of the model's coefficients. This penalization restricts model complexity, pulls weights toward zero, and directly curtails variance at the expense of a negligible increase in bias, resulting in superior test set generalization.",
        "tips": "Clearly distinguish underfitting vs overfitting and mention L1 vs L2 regularization mechanics."
    },
    {
        "role": "Data Analyst",
        "category": "technical",
        "difficulty": "beginner",
        "question": "What is the key difference between WHERE and HAVING clauses in SQL?",
        "key_points": [
            "WHERE filters rows before any group aggregation takes place",
            "HAVING filters aggregated groups after the GROUP BY clause is computed",
            "WHERE cannot use aggregate functions like COUNT(), SUM(), AVG() directly",
            "HAVING operates specifically on aggregated metrics"
        ],
        "sample_good_answer": "In SQL, the fundamental difference between WHERE and HAVING lies in their order of query execution.\n\nThe WHERE clause filters individual records before any grouping or aggregation occurs. Because it executes row-by-row, it cannot directly reference aggregate functions like COUNT(), AVG(), or SUM().\n\nIn contrast, the HAVING clause is evaluated after the GROUP BY clause has aggregated rows into groups. It is specifically designed to filter those summarized groups based on conditions involving aggregate calculations (for example: `HAVING COUNT(order_id) > 5`). In summary: use WHERE for row filtering, and HAVING for group aggregate filtering.",
        "tips": "Provide an explicit code snippet or execution order example to stand out."
    },
    {
        "role": "Data Scientist",
        "category": "technical",
        "difficulty": "intermediate",
        "question": "Explain when you would evaluate a model using Precision and Recall instead of Accuracy.",
        "key_points": [
            "Accuracy is misleading when classes are severely imbalanced (e.g., 99% negative fraud data)",
            "Precision measures the proportion of true positives among all predicted positives (cost of false positives)",
            "Recall measures the proportion of actual positives successfully captured (cost of false negatives)",
            "F1-score harmonic mean balances both metrics"
        ],
        "sample_good_answer": "Accuracy becomes a misleading metric whenever working with imbalanced datasets. For instance, in credit card fraud detection where only 0.1% of transactions are fraudulent, a naive classifier that predicts 'legitimate' 100% of the time achieves 99.9% accuracy despite being useless.\n\nPrecision and Recall provide targeted insight into classification trade-offs:\n- Precision (TP / (TP + FP)) answers: Of all samples we flagged as positive, how many were truly positive? We optimize precision when the cost of a false alarm is severe (e.g., spam filtering where legitimate emails cannot be lost).\n- Recall (TP / (TP + FN)) answers: Of all true positive cases in reality, how many did we capture? We maximize recall when missing a positive case is catastrophic (e.g., cancer diagnosis or loan default detection).\nThe F1-Score provides the harmonic mean between the two when both errors carry critical weight.",
        "tips": "Always ground this answer with a concrete domain scenario like medical diagnosis or fraud."
    },
    {
        "role": "AI Engineer",
        "category": "technical",
        "difficulty": "advanced",
        "question": "Explain the architectural pipeline of Retrieval-Augmented Generation (RAG) and how vector databases fit into it.",
        "key_points": [
            "RAG grounds LLM responses with external, private or updated knowledge",
            "Document chunking, embedding generation using transformer encoders",
            "Vector database indexing for semantic similarity search (cosine, dot product)",
            "Retrieval of top-k context passages injected into prompt",
            "Mitigates hallucinations and enables source citations"
        ],
        "sample_good_answer": "Retrieval-Augmented Generation (RAG) is an architectural pattern that augments LLMs with factual, private, or real-time documents without requiring fine-tuning.\n\nThe pipeline consists of three core phases:\n1. Ingestion & Indexing: Source documents are parsed, divided into semantically coherent chunks (e.g., 500 tokens with overlap), and converted into dense numerical vectors using an embedding model. These embeddings are indexed inside a specialized vector database (such as Pinecone, Qdrant, or Chroma) with indices optimized for approximate nearest neighbor (ANN) search.\n2. Retrieval: When a user poses a query, it is embedded using the exact same model. The vector database computes semantic similarity (using cosine similarity or HNSW) to retrieve the top-K most relevant chunks.\n3. Generation: The retrieved passages are merged with the user's original query into a structured system prompt, instructing the LLM to formulate an answer grounded strictly in the provided context, thereby drastically eliminating hallucinations and supplying verifiable citations.",
        "tips": "Detail chunking strategy and embedding model alignment."
    },
    {
        "role": "Software Developer",
        "category": "technical",
        "difficulty": "intermediate",
        "question": "What is the difference between a Process and a Thread, and how does memory sharing work between them?",
        "key_points": [
            "A process is an independent execution unit with its own isolated virtual memory address space",
            "A thread is a lightweight execution stream running inside a parent process",
            "Threads within the same process share heap, global variables, and open file descriptors",
            "Threads have their own private stacks and registers",
            "Inter-process communication (IPC) requires pipes/sockets/shared memory"
        ],
        "sample_good_answer": "A process is an independent instance of a program in execution, allocated its own isolated virtual address space, heap, memory descriptors, and system resources by the operating system. Because processes are isolated, crashes in one process do not corrupt another, and communication requires explicit Inter-Process Communication (IPC) mechanisms like sockets, pipes, or shared memory.\n\nA thread, often termed a lightweight process, is a unit of execution within a parent process. All threads belonging to the same process share the process's code segment, heap, global data, and file descriptors. However, each thread maintains its own private program counter, register state, and stack memory. Because memory is shared, multithreading delivers fast context switching and easy data sharing, but demands concurrency controls (mutexes, semaphores) to prevent race conditions.",
        "tips": "Explicitly highlight what is shared (heap, globals) vs private (stack, registers)."
    },
    # HR & Behavioral Questions
    {
        "role": "Data Scientist",
        "category": "hr",
        "difficulty": "beginner",
        "question": "Tell me about a challenging technical roadblock you encountered in a project and how you resolved it.",
        "key_points": [
            "Use STAR method (Situation, Task, Action, Result)",
            "Clear technical description of the bottleneck",
            "Systematic debugging or diagnostic approach",
            "Quantifiable positive outcome and key learning"
        ],
        "sample_good_answer": "In my academic capstone project building a real-time sentiment classifier, we faced a critical bottleneck where model inference took over 450ms per request on our test server, making live interactive classification laggy.\n\nTo resolve this, I took a systematic profiling approach. First, I analyzed the pipeline latency and discovered that text preprocessing with heavy spaCy pipelines and unbatched tokenization consumed 70% of the execution time. I refactored the pipeline to use lightweight vectorized regex tokenizers and converted our heavy BERT model into an ONNX runtime representation with dynamic 8-bit quantization. This reduced model memory footprint by 65% and slashed inference latency from 450ms down to 42ms with zero loss in classification F1-score (0.91). This taught me the paramount importance of production profiling before jumping to infrastructure upgrades.",
        "tips": "Structure using the STAR framework: Situation, Task, Action, Result."
    },
    {
        "role": "AI Engineer",
        "category": "hr",
        "difficulty": "beginner",
        "question": "Where do you see yourself in 3 to 5 years in the field of Artificial Intelligence?",
        "key_points": [
            "Demonstrate passion for continuous learning in fast-evolving AI",
            "Ambition to grow from core implementation to system architecture",
            "Desire to deliver measurable business impact with production AI systems",
            "Mentorship and collaborative team contribution"
        ],
        "sample_good_answer": "Over the next 3 to 5 years, my goal is to evolve from an entry-level practitioner into a Senior AI Solutions Architect. In the first 1-2 years, I want to master full-lifecycle model deployment—building robust RAG systems, mastering scalable MLOps, and writing resilient production services. By years 3 to 5, I aspire to lead technical design for complex GenAI and predictive systems, translating high-level business problems into elegant AI architectures while mentoring incoming junior engineers.",
        "tips": "Balance technical growth with business value and team collaboration."
    },
    # Project & Experience Questions
    {
        "role": "Data Analyst",
        "category": "project",
        "difficulty": "intermediate",
        "question": "Walk me through how you clean, validate, and handle missing values in an exploratory data analysis project.",
        "key_points": [
            "Distinguish MCAR, MAR, and MNAR missingness mechanisms",
            "Investigate distributions with summary stats and visualizations",
            "Imputation strategies: mean/median for numerical, mode for categorical, KNN/Iterative for multivariate",
            "Outlier detection using IQR or Z-score without hasty deletion"
        ],
        "sample_good_answer": "When approaching data cleaning in a fresh project, I follow a disciplined 4-stage pipeline:\n\n1. Initial Audit: I inspect data types, memory usage, null counts, and duplicates using `df.info()` and `df.describe()`. I look for hidden missing tokens like 'NA', '?', or whitespace.\n2. Mechanism Assessment: I analyze whether missing values are Missing Completely at Random (MCAR) or systematically correlated with other variables. If a column has >60% missing entries and low predictive value, I consider dropping it.\n3. Imputation Strategy: For skewed numerical columns, I prefer median imputation over mean to resist outliers, or use grouped imputation based on related categories. For critical predictive variables, I apply iterative multivariate imputation (MICE or KNN). For categorical fields, mode or an explicit 'Unknown' indicator category is appropriate.\n4. Outlier & Sanity Validation: I use boxplots and IQR thresholds to spot anomalies, cross-referencing domain logic before transforming or capping outliers.",
        "tips": "Mention that you verify whether missing data is random before selecting an imputation strategy."
    }
]

def seed_database(db: Session):
    """Seed initial demo data if tables are empty."""
    # 1. Seed Jobs
    if db.query(Job).count() == 0:
        for job_data in SAMPLE_JOBS:
            job = Job(
                title=job_data["title"],
                company=job_data["company"],
                location=job_data["location"],
                job_type=job_data["job_type"],
                experience_level=job_data["experience_level"],
                description=job_data["description"],
                salary_range=job_data["salary_range"],
                required_skills=job_data["required_skills"],
                preferred_skills=job_data["preferred_skills"],
                posted_date=datetime.utcnow() - timedelta(days=len(job_data["title"]) % 10)
            )
            db.add(job)
        db.commit()

    # 2. Seed Career Paths & Roadmaps
    if db.query(CareerPath).count() == 0:
        for role_name, data in CAREER_CURRICULUM.items():
            # Build 4 milestone phases for roadmap
            phases = [
                {
                    "phase_number": 1,
                    "phase_title": "Foundations & Core Programming",
                    "duration": "Weeks 1 - 4",
                    "milestones": [
                        {"id": f"{role_name}-m1", "title": "Programming Fluency", "description": "Master core syntax, data structures, and algorithmic logic.", "skills": [data["skills"][0]["name"] if data["skills"] else "Python"], "status": "completed", "resources": []},
                        {"id": f"{role_name}-m2", "title": "Data Querying & Relational Databases", "description": "Write complex SQL joins, aggregations, and window functions.", "skills": ["SQL"], "status": "completed", "resources": []}
                    ]
                },
                {
                    "phase_number": 2,
                    "phase_title": "Data Processing & Mathematics",
                    "duration": "Weeks 5 - 8",
                    "milestones": [
                        {"id": f"{role_name}-m3", "title": "Numerical & Tabular Manipulation", "description": "Clean, reshape, and engineer features using standard libraries.", "skills": ["Pandas", "NumPy"], "status": "completed", "resources": []},
                        {"id": f"{role_name}-m4", "title": "Applied Statistical Rigor", "description": "Hypothesis testing, probability distributions, and A/B test analysis.", "skills": ["Statistics"], "status": "in_progress", "resources": []}
                    ]
                },
                {
                    "phase_number": 3,
                    "phase_title": "Advanced Domain Competencies",
                    "duration": "Weeks 9 - 14",
                    "milestones": [
                        {"id": f"{role_name}-m5", "title": "Production Machine Learning / Domain Specialization", "description": "Train, evaluate, and tune high-performance models.", "skills": ["Machine Learning", "Scikit-learn"], "status": "upcoming", "resources": []},
                        {"id": f"{role_name}-m6", "title": "Modern Tooling & Frameworks", "description": "Leverage specialized architectures or BI visualization software.", "skills": [s["name"] for s in data["skills"][4:7]], "status": "upcoming", "resources": []}
                    ]
                },
                {
                    "phase_number": 4,
                    "phase_title": "Placement Preparation & Real-World Capstones",
                    "duration": "Weeks 15 - 18",
                    "milestones": [
                        {"id": f"{role_name}-m7", "title": "End-to-End Capstone Project", "description": "Build and document a full portfolio project with real datasets.", "skills": ["Git", "Docker", "FastAPI"], "status": "upcoming", "resources": []},
                        {"id": f"{role_name}-m8", "title": "Technical & HR Mock Interviews", "description": "Practice rapid-fire live interview questions with AI feedback.", "skills": ["Communication", "Problem Solving"], "status": "upcoming", "resources": []}
                    ]
                }
            ]

            cp = CareerPath(
                role_name=role_name,
                description=data["description"],
                avg_salary=data["avg_salary"],
                skills_taxonomy=data["skills"],
                roadmap_phases=phases
            )
            db.add(cp)
        db.commit()

    # 3. Seed Interview Questions
    if db.query(InterviewQuestion).count() == 0:
        for q_data in SAMPLE_QUESTIONS:
            q = InterviewQuestion(
                role=q_data["role"],
                category=q_data["category"],
                difficulty=q_data["difficulty"],
                question=q_data["question"],
                key_points=q_data["key_points"],
                sample_good_answer=q_data["sample_good_answer"],
                tips=q_data["tips"]
            )
            db.add(q)
        db.commit()

    # 4. Seed Demo User
    demo_user = db.query(User).filter(User.email == "demo@careercompass.ai").first()
    if not demo_user:
        demo_user = User(
            email="demo@careercompass.ai",
            password_hash="password123",  # Simple dev credential
            full_name="Aditi Rao",
            degree="B.Tech in Artificial Intelligence & Data Science",
            year_of_study="Final Year (2026)",
            career_goal="Data Scientist",
            experience_level="Entry Level / Fresher",
            current_skills=[
                "Python", "SQL", "Pandas", "NumPy", "Scikit-learn",
                "Machine Learning", "Exploratory Data Analysis", "Git",
                "FastAPI", "Data Analysis", "Statistics"
            ],
            created_at=datetime.utcnow() - timedelta(days=30)
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        # Seed Saved Jobs for Demo User
        first_job = db.query(Job).filter(Job.title.like("%Data Scientist%")).first()
        second_job = db.query(Job).filter(Job.title.like("%AI Engineer%")).first()
        third_job = db.query(Job).filter(Job.title.like("%Swiggy%")).first()

        if first_job:
            db.add(SavedJob(user_id=demo_user.id, job_id=first_job.id, status="saved"))
        if second_job:
            db.add(SavedJob(user_id=demo_user.id, job_id=second_job.id, status="applied"))
        if third_job and third_job.id != first_job.id:
            db.add(SavedJob(user_id=demo_user.id, job_id=third_job.id, status="saved"))

        # Seed Sample Resume Analysis for Demo User
        sample_resume_analysis = ResumeAnalysis(
            user_id=demo_user.id,
            filename="Aditi_Rao_Resume.pdf",
            score=78,
            sections_detected={"contact": True, "education": True, "skills": True, "projects": True, "experience": True, "certifications": True},
            extracted_skills=["Python", "SQL", "Pandas", "NumPy", "Scikit-learn", "Machine Learning", "FastAPI", "Git", "Statistics"],
            strengths=[
                "Strong technical competency profile with 9 identified AI/DS tools.",
                "Demonstrated quantitative results across machine learning projects (e.g. 'boosted accuracy by 14%').",
                "Well-structured format including Education, Projects, and Work Experience."
            ],
            weaknesses=[
                "Could add more production deployment tools such as Docker or MLOps frameworks.",
                "Summary statement is absent; adding a targeted 2-line pitch will help recruiters."
            ],
            improvements=[
                "Include a concise career summary highlighting your target role.",
                "Quantify remaining academic projects with runtime latency or throughput metrics.",
                "Add direct hyperlinks to your live hosted projects and GitHub repositories."
            ],
            created_at=datetime.utcnow() - timedelta(days=2)
        )
        db.add(sample_resume_analysis)

        # Seed Sample Interview Submissions for Demo User
        sample_q = db.query(InterviewQuestion).first()
        if sample_q:
            sub = InterviewSubmission(
                user_id=demo_user.id,
                question_id=sample_q.id,
                user_answer="Bias is the error from bad assumptions which leads to underfitting. Variance is how much your model swings based on random noise in training data causing overfitting. Regularization adds a penalty term like L1 or L2 to keep weights small so the model generalizes better.",
                score=82,
                correctness="Good",
                missing_points=["Explicitly naming the bias-variance tradeoff as a balancing act"],
                feedback="Solid technical grasp of both underfitting vs overfitting and regularization penalty mechanics.",
                model_answer=sample_q.sample_good_answer,
                created_at=datetime.utcnow() - timedelta(days=1)
            )
            db.add(sub)

        db.commit()
