import {
  User,
  Job,
  DashboardSummary,
  SkillGapData,
  CareerRoadmapData,
  InterviewQuestion,
  InterviewEvaluation,
  InterviewSubmission,
  ResumeAnalysisResult
} from './client';

export const DEMO_USER: User = {
  id: 1,
  email: 'demo@careercompass.ai',
  full_name: 'Aditi Rao',
  degree: 'B.Tech in Artificial Intelligence & Data Science',
  year_of_study: 'Final Year (2026)',
  career_goal: 'Data Scientist',
  experience_level: 'Entry Level / Fresher',
  current_skills: [
    'Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn',
    'Machine Learning', 'Exploratory Data Analysis', 'Git', 'FastAPI', 'Statistics'
  ],
  created_at: '2026-08-10T09:24:41.641934'
};

export const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: 'Junior Data Scientist - Campus Placements',
    company: 'PhonePe',
    location: 'Bangalore, India (Hybrid)',
    job_type: 'Full-time',
    experience_level: 'Fresher (0-1 yrs)',
    salary_range: '₹14,00,000 - ₹18,00,000',
    description: 'We are seeking passionate freshers from top engineering campuses to join our Fraud Risk & Core Analytics teams. You will design statistical models, analyze digital payment graphs, and build ML inference endpoints.',
    required_skills: ['Python', 'SQL', 'Scikit-learn', 'Machine Learning', 'Statistics'],
    preferred_skills: ['FastAPI', 'Docker', 'Pandas', 'Git'],
    posted_date: '2026-09-02',
    match_percentage: 92,
    matching_skills: ['Python', 'SQL', 'Scikit-learn', 'Machine Learning', 'Statistics', 'Pandas', 'Git', 'FastAPI'],
    missing_skills: ['Docker'],
    why_matched: 'Outstanding 92% overlap with your Data Scientist skillset and core statistics background.',
    is_saved: true,
    is_applied: false
  },
  {
    id: 2,
    title: 'Associate Machine Learning Engineer',
    company: 'Swiggy',
    location: 'Bangalore, India (On-site)',
    job_type: 'Full-time',
    experience_level: 'Entry Level (0-2 yrs)',
    salary_range: '₹16,00,000 - ₹22,00,000',
    description: 'Help develop real-time delivery estimation, dynamic catalog search, and dispatch optimization algorithms. Collaborate closely with platform engineering to package models with high throughput.',
    required_skills: ['Python', 'Machine Learning', 'Docker', 'FastAPI', 'Data Structures'],
    preferred_skills: ['PyTorch', 'AWS', 'Redis', 'SQL'],
    posted_date: '2026-09-05',
    match_percentage: 84,
    matching_skills: ['Python', 'Machine Learning', 'SQL', 'FastAPI'],
    missing_skills: ['Docker', 'PyTorch', 'Data Structures'],
    why_matched: 'Strong Python & ML base; learning Docker and PyTorch will maximize interview readiness.',
    is_saved: false,
    is_applied: true
  },
  {
    id: 3,
    title: 'Data Analyst Graduate Trainee',
    company: 'CRED',
    location: 'Bangalore, India (On-site)',
    job_type: 'Full-time',
    experience_level: 'Fresher (0-1 yrs)',
    salary_range: '₹12,00,000 - ₹15,00,000',
    description: 'Work with cross-functional product and member growth teams. Formulate hypotheses, build cohort retention models, and build automated reporting pipelines.',
    required_skills: ['SQL', 'Python', 'Exploratory Data Analysis', 'Tableau', 'Excel'],
    preferred_skills: ['Power BI', 'Statistics', 'Pandas'],
    posted_date: '2026-09-07',
    match_percentage: 88,
    matching_skills: ['SQL', 'Python', 'Exploratory Data Analysis', 'Statistics', 'Pandas'],
    missing_skills: ['Tableau', 'Excel'],
    why_matched: 'High match on foundational analytics, SQL querying, and data exploration.',
    is_saved: true,
    is_applied: false
  },
  {
    id: 4,
    title: 'AI & GenAI Solutions Engineer',
    company: 'Razorpay',
    location: 'Bangalore, India (Hybrid)',
    job_type: 'Full-time',
    experience_level: 'Entry Level (0-2 yrs)',
    salary_range: '₹15,00,000 - ₹20,00,000',
    description: 'Join our AI Innovation Lab building autonomous support agents, merchant onboarding intelligence, and document understanding pipelines using modern LLMs and vector search.',
    required_skills: ['Python', 'FastAPI', 'Large Language Models', 'LangChain', 'Git'],
    preferred_skills: ['Docker', 'Vector Databases', 'SQL'],
    posted_date: '2026-09-08',
    match_percentage: 78,
    matching_skills: ['Python', 'FastAPI', 'Git', 'SQL'],
    missing_skills: ['Large Language Models', 'LangChain', 'Docker'],
    why_matched: 'Great backend foundation with Python and FastAPI; check the GenAI roadmap module to bridge gaps.',
    is_saved: false,
    is_applied: false
  },
  {
    id: 5,
    title: 'Software Development Engineer - Backend',
    company: 'Zomato',
    location: 'Gurgaon, India (Hybrid)',
    job_type: 'Full-time',
    experience_level: 'Fresher (0-1 yrs)',
    salary_range: '₹14,00,000 - ₹19,00,000',
    description: 'Design and develop scalable microservices powering order routing and restaurant partner systems. Write clean, maintainable code with high test coverage.',
    required_skills: ['Python', 'Data Structures', 'Algorithms', 'SQL', 'Git'],
    preferred_skills: ['FastAPI', 'PostgreSQL', 'Docker'],
    posted_date: '2026-09-01',
    match_percentage: 81,
    matching_skills: ['Python', 'SQL', 'Git', 'FastAPI'],
    missing_skills: ['Data Structures', 'Algorithms', 'PostgreSQL'],
    why_matched: 'Solid web and database abilities, needs standard placement DSA review.',
    is_saved: false,
    is_applied: false
  },
  {
    id: 6,
    title: 'Computer Vision & Deep Learning Intern / Trainee',
    company: 'Ola Electric',
    location: 'Bangalore, India (On-site)',
    job_type: 'Internship to FTE',
    experience_level: 'Fresher (0-1 yrs)',
    salary_range: '₹10,00,000 - ₹14,00,000',
    description: 'Work on active safety ADAS and automated defect inspection pipelines. Train lightweight CNN and vision transformer models for edge deployment.',
    required_skills: ['Python', 'PyTorch', 'Computer Vision', 'OpenCV'],
    preferred_skills: ['NumPy', 'TensorFlow', 'Git'],
    posted_date: '2026-09-04',
    match_percentage: 67,
    matching_skills: ['Python', 'NumPy', 'Git'],
    missing_skills: ['PyTorch', 'Computer Vision', 'OpenCV'],
    why_matched: 'Good mathematical and Python core; recommend practicing PyTorch and OpenCV vision tracks.',
    is_saved: false,
    is_applied: false
  }
];

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  user_name: 'Aditi Rao',
  career_goal: 'Data Scientist',
  resume_score: 78,
  career_readiness: 72,
  skills_matched_count: 10,
  total_skills_required: 14,
  interview_progress_count: 6,
  total_interview_target: 15,
  top_recommended_jobs: MOCK_JOBS.slice(0, 3),
  high_priority_gaps: ['Docker', 'PyTorch', 'Exploratory Data Analysis', 'MLOps'],
  recent_activities: [
    {
      id: 'act-1',
      title: 'Scored 85/100 on Mock Interview',
      description: 'Supervised Learning Bias-Variance Tradeoff Question',
      timestamp: '2 hours ago',
      icon: 'MessageSquareCode',
      color: 'emerald'
    },
    {
      id: 'act-2',
      title: 'Saved PhonePe Data Scientist Opening',
      description: 'Role match rated at 92%',
      timestamp: 'Yesterday',
      icon: 'Bookmark',
      color: 'blue'
    },
    {
      id: 'act-3',
      title: 'Resume Analyzed & Scored',
      description: 'Rubric ATS score evaluated at 78 / 100',
      timestamp: '2 days ago',
      icon: 'FileText',
      color: 'indigo'
    }
  ]
};

export const MOCK_SKILL_GAP: Record<string, SkillGapData> = {
  'Data Scientist': {
    career_goal: 'Data Scientist',
    description: 'Extract actionable intelligence, train statistical models, and communicate insights to leadership.',
    avg_salary: '₹12,00,000 - ₹20,00,000',
    readiness_score: 72,
    matched_skills_count: 10,
    total_skills_count: 14,
    mastered_skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'Machine Learning', 'Statistics', 'Git', 'FastAPI'],
    missing_high_priority: [
      {
        name: 'Docker',
        category: 'Deployment & DevOps',
        importance: 'High Priority',
        level: 'Intermediate',
        is_mastered: false,
        status: 'learning',
        resources: [
          { title: 'Docker for Data Science & ML Complete Tutorial', type: 'Course', platform: 'freeCodeCamp', url: 'https://youtube.com' },
          { title: 'Containerizing Machine Learning Models with FastAPI', type: 'Guide', platform: 'Medium / Toward Data Science', url: 'https://towardsdatascience.com' }
        ]
      },
      {
        name: 'PyTorch',
        category: 'Deep Learning',
        importance: 'High Priority',
        level: 'Intermediate',
        is_mastered: false,
        status: 'not_started',
        resources: [
          { title: 'PyTorch for Deep Learning in 60 Minutes', type: 'Official Tutorial', platform: 'PyTorch.org', url: 'https://pytorch.org' }
        ]
      }
    ],
    missing_secondary: [
      {
        name: 'Tableau',
        category: 'Business Intelligence',
        importance: 'Secondary',
        level: 'Beginner',
        is_mastered: false,
        status: 'not_started',
        resources: [
          { title: 'Tableau Free Certification Training for Students', type: 'Course', platform: 'Tableau Academic', url: 'https://tableau.com' }
        ]
      },
      {
        name: 'MLOps & Experiment Tracking',
        category: 'Engineering',
        importance: 'Secondary',
        level: 'Intermediate',
        is_mastered: false,
        status: 'not_started',
        resources: [
          { title: 'MLflow & Weights and Biases Essentials', type: 'Documentation', platform: 'Weights & Biases', url: 'https://wandb.ai' }
        ]
      }
    ],
    ordered_learning_path: [
      {
        order: 1,
        name: 'Docker for Machine Learning',
        importance: 'High Priority',
        level: 'Intermediate',
        category: 'MLOps',
        status: 'in_progress',
        resources: [
          { title: 'Docker for Data Science', type: 'Video', platform: 'freeCodeCamp', url: 'https://youtube.com' }
        ]
      },
      {
        order: 2,
        name: 'Deep Learning with PyTorch',
        importance: 'High Priority',
        level: 'Intermediate',
        category: 'Deep Learning',
        status: 'upcoming',
        resources: [
          { title: 'Zero to GANs PyTorch Course', type: 'Interactive Course', platform: 'Jovian', url: 'https://jovian.ai' }
        ]
      },
      {
        order: 3,
        name: 'Tableau Executive Dashboards',
        importance: 'Secondary',
        level: 'Beginner',
        category: 'Analytics',
        status: 'upcoming',
        resources: [
          { title: 'Tableau for Students', type: 'Tutorial', platform: 'Coursera Free', url: 'https://coursera.org' }
        ]
      }
    ],
    radar_data: [
      { subject: 'Programming (Python)', user_score: 95, required_score: 90 },
      { subject: 'Databases & SQL', user_score: 88, required_score: 85 },
      { subject: 'Machine Learning', user_score: 82, required_score: 85 },
      { subject: 'Statistics & Math', user_score: 80, required_score: 85 },
      { subject: 'Deep Learning', user_score: 45, required_score: 75 },
      { subject: 'MLOps & DevOps', user_score: 35, required_score: 70 }
    ]
  }
};

export const MOCK_ROADMAP: CareerRoadmapData = {
  role_name: 'Data Scientist',
  target_role: 'Data Scientist',
  overall_progress: 68,
  phases: [
    {
      phase_number: 1,
      phase_title: 'Foundational Programming & Mathematics',
      duration: 'Weeks 1 - 4',
      milestones: [
        {
          id: 'm1',
          title: 'Advanced Python for Data Science',
          description: 'Master list comprehensions, generators, object-oriented concepts, and memory optimization.',
          skills: ['Python', 'Object-Oriented Programming', 'Clean Code'],
          status: 'completed',
          resources: [{ title: 'Python for Engineers', type: 'Interactive', platform: 'RealPython', url: 'https://realpython.com' }]
        },
        {
          id: 'm2',
          title: 'Applied Linear Algebra & Inferential Statistics',
          description: 'Hypothesis testing, p-values, Bayes theorem, eigenvalues, and distribution analysis.',
          skills: ['Statistics', 'Probability', 'Linear Algebra'],
          status: 'completed',
          resources: [{ title: 'StatQuest with Josh Starmer', type: 'Video Series', platform: 'YouTube', url: 'https://youtube.com' }]
        }
      ]
    },
    {
      phase_number: 2,
      phase_title: 'Data Wrangling, SQL & Classical ML',
      duration: 'Weeks 5 - 10',
      milestones: [
        {
          id: 'm3',
          title: 'Relational Database Design & Complex SQL',
          description: 'Window functions, CTEs, indexing, and aggregation across millions of rows.',
          skills: ['SQL', 'PostgreSQL', 'Query Optimization'],
          status: 'completed',
          resources: [{ title: 'SQLZoo Advanced Practicum', type: 'Practice', platform: 'SQLZoo', url: 'https://sqlzoo.net' }]
        },
        {
          id: 'm4',
          title: 'Supervised & Unsupervised Machine Learning',
          description: 'Linear/Logistic regression, Trees, Ensembles, Random Forests, XGBoost, and Clustering.',
          skills: ['Scikit-learn', 'Machine Learning', 'Feature Engineering'],
          status: 'in_progress',
          resources: [{ title: 'Hands-On Machine Learning', type: 'Book', platform: 'O\'Reilly', url: 'https://oreilly.com' }]
        }
      ]
    },
    {
      phase_number: 3,
      phase_title: 'Deep Learning, NLP & Generative AI',
      duration: 'Weeks 11 - 16',
      milestones: [
        {
          id: 'm5',
          title: 'PyTorch Tensors, Neural Networks & CNNs',
          description: 'Backpropagation from scratch, loss curves, regularization, and vision models.',
          skills: ['PyTorch', 'Deep Learning', 'Computer Vision'],
          status: 'upcoming',
          resources: [{ title: 'Deep Learning Specialization', type: 'Course', platform: 'deeplearning.ai', url: 'https://deeplearning.ai' }]
        },
        {
          id: 'm6',
          title: 'Transformers, Embeddings & LLM Integration',
          description: 'BERT, GPT architectures, retrieval-augmented generation (RAG), and vector embeddings.',
          skills: ['Transformers', 'NLP', 'Large Language Models'],
          status: 'upcoming',
          resources: [{ title: 'Hugging Face NLP Course', type: 'Course', platform: 'Hugging Face', url: 'https://huggingface.co/learn' }]
        }
      ]
    },
    {
      phase_number: 4,
      phase_title: 'Model Deployment, MLOps & Placement Readiness',
      duration: 'Weeks 17 - 20',
      milestones: [
        {
          id: 'm7',
          title: 'Containerization & API Serving with FastAPI + Docker',
          description: 'Build fast async microservices with health checks, Docker containers, and test suites.',
          skills: ['FastAPI', 'Docker', 'REST APIs'],
          status: 'upcoming',
          resources: [{ title: 'Fullstack ML Deployment Guide', type: 'Interactive', platform: 'GitHub', url: 'https://github.com' }]
        },
        {
          id: 'm8',
          title: 'Placement Mock Interviews & System Design',
          description: 'Solve real company assessment questions and practice technical interviews.',
          skills: ['System Design', 'Mock Interview', 'Communication'],
          status: 'upcoming',
          resources: [{ title: 'CareerCompass AI Mock Coach', type: 'Practice', platform: 'In-App', url: '/app/interview' }]
        }
      ]
    }
  ]
};

export const MOCK_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    role: 'Data Scientist',
    category: 'technical',
    difficulty: 'intermediate',
    question: 'Explain the Bias-Variance Tradeoff and how regularization techniques (L1/L2) help mitigate overfitting.',
    key_points: [
      'Bias represents errors from overly simplistic model assumptions (underfitting)',
      'Variance represents sensitivity to small fluctuations/noise in training data (overfitting)',
      'Total Error = Bias^2 + Variance + Irreducible Error',
      'L1 (Lasso) adds absolute magnitude penalty causing coefficient sparsity (feature selection)',
      'L2 (Ridge) adds squared magnitude penalty shrinking weights smoothly towards zero'
    ],
    sample_good_answer: 'The Bias-Variance tradeoff is a foundational constraint in supervised ML. High bias occurs when the model makes assumptions that are too rigid, failing to capture the underlying pattern and causing underfitting. High variance occurs when the model memorizes noise in the training set, causing poor generalization on unseen test data. Regularization modifies the loss function by adding a penalty term on weight coefficients. L1 regularization adds the sum of absolute values of coefficients, pushing uninformative features exactly to zero for feature selection. L2 regularization adds squared weights, shrinking parameters proportionally without zeroing them out, reducing model variance.',
    tips: 'Mention the mathematical formula (Total Error = Bias^2 + Variance + Irreducible Error) and provide concrete differences between Lasso (L1) and Ridge (L2).'
  },
  {
    id: 2,
    role: 'Data Scientist',
    category: 'technical',
    difficulty: 'intermediate',
    question: 'How do you address severely imbalanced datasets when training a classification model?',
    key_points: [
      'Resampling strategies: SMOTE oversampling for minority class, undersampling majority class',
      'Metric selection: Use Precision-Recall AUC or F1-Score instead of misleading accuracy',
      'Algorithmic adjustments: class_weight="balanced" or focal loss penalties',
      'Threshold tuning: optimizing the classification decision boundary via ROC curve'
    ],
    sample_good_answer: 'When handling imbalanced datasets (e.g. 99% negative, 1% positive), standard accuracy is a misleading metric. First, I switch evaluation to Precision-Recall AUC, PR curves, and F1-Score. Second, at the data level, we can use SMOTE (Synthetic Minority Over-sampling Technique) to generate synthetic minority samples. Third, at the algorithm level, we can utilize cost-sensitive training by setting class weights proportionally in models like XGBoost or Scikit-learn.',
    tips: 'Always mention that accuracy is deceptive in imbalanced data, and propose both data-level (SMOTE) and algorithm-level (class_weight) solutions.'
  },
  {
    id: 3,
    role: 'Data Scientist',
    category: 'hr',
    difficulty: 'beginner',
    question: 'Describe a challenging technical obstacle you faced in a university or personal project and how you solved it.',
    key_points: [
      'STAR method: Situation, Task, Action, Result',
      'Concrete explanation of the technical bug or bottleneck',
      'Analytical problem-solving process',
      'Quantified outcome or learning insight'
    ],
    sample_good_answer: 'In our final year capstone project, our neural network inference took over 4 seconds per transaction on edge hardware. As the lead ML developer, I profiled the bottleneck using PyTorch profilers and discovered redundant full-precision tensor conversions. I implemented INT8 post-training quantization and vectorized data pre-processing using NumPy. This slashed latency to 280ms without degrading accuracy, allowing our system to hit the live submission deadline smoothly.',
    tips: 'Structure your answer cleanly using the STAR framework and quantify the improvement (e.g. 4s -> 280ms).'
  }
];

export const MOCK_SAMPLE_RESUME: ResumeAnalysisResult = {
  id: 1,
  filename: 'Aditi_Rao_Resume_2026.pdf',
  score: 78,
  score_breakdown: {
    sections: 95,
    skills: 85,
    impact: 70,
    formatting: 80
  },
  extracted_contact: {
    email: 'aditi.rao@student.univ.edu',
    phone: '+91 98765 43210',
    linkedin: 'linkedin.com/in/aditi-rao-ds',
    github: 'github.com/aditi-rao-dev'
  },
  extracted_skills: [
    'Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn',
    'Machine Learning', 'Exploratory Data Analysis', 'FastAPI', 'Git', 'Data Structures', 'Statistics'
  ],
  sections_detected: {
    education: true,
    experience: true,
    projects: true,
    skills: true,
    certifications: true
  },
  strengths: [
    'Comprehensive tech stack clearly outlined with modern libraries (Python, Scikit-learn, FastAPI).',
    'All five critical placement resume sections detected with consistent hierarchical headers.',
    'Contact information includes both verified LinkedIn and active GitHub portfolio links.'
  ],
  areas_to_improve: [
    'Increase quantified impact metrics (e.g., "improved accuracy by 14%" instead of "worked on model").',
    'Add deployment credentials such as Docker, cloud hosting (AWS/GCP), or containerization.',
    'Strengthen bullet action verbs: replace "helped build" with "architected", "engineered", or "benchmarked".'
  ],
  quantified_bullet_count: 5,
  action_verb_count: 12
};
