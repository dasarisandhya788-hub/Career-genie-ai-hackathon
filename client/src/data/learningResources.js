// Career-Specific Learning Resources & Project Ideas Database

export const CAREER_LEARNING_RESOURCES = {
  "software-engineer": {
    category: "Technology",
    freeCourses: [
      { title: "freeCodeCamp - Scientific Computing & Web Dev", provider: "freeCodeCamp", url: "https://www.freecodecamp.org" },
      { title: "CS50: Introduction to Computer Science", provider: "Harvard / edX", url: "https://cs50.harvard.edu" },
      { title: "Full Stack Open (Modern Web Dev)", provider: "University of Helsinki", url: "https://fullstackopen.com" }
    ],
    youtubePlaylists: [
      { title: "Traversy Media - Web Development & JavaScript Crash Courses", channel: "Traversy Media" },
      { title: "freeCodeCamp.org - Full Stack Software Engineering", channel: "freeCodeCamp" },
      { title: "NeetCode - Data Structures & Algorithms Solutions", channel: "NeetCode" }
    ],
    practicePlatforms: [
      { name: "LeetCode", focus: "Data Structures & Algorithms Interview Prep", url: "https://leetcode.com" },
      { name: "HackerRank", focus: "Problem Solving & Core Language Proficiency", url: "https://hackerrank.com" },
      { name: "Frontend Mentor", focus: "Real-world HTML/CSS/JS UI Challenges", url: "https://www.frontendmentor.io" }
    ],
    officialDocs: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
      { name: "Python Official Documentation", url: "https://docs.python.org/3/" },
      { name: "React Official Docs", url: "https://react.dev" }
    ],
    projects: {
      beginner: [
        "Personal Portfolio & Resume Website with Responsive CSS",
        "Interactive Weather App using OpenWeather API",
        "Command-Line Task & Expense Manager CLI"
      ],
      intermediate: [
        "Full-Stack E-Commerce Web Store with Stripe Payments",
        "Real-Time Chat & Collaboration App using Socket.io",
        "RESTful API Backend with JWT Auth & Database ORM"
      ],
      advanced: [
        "Microservices-based Distributed E-Commerce Architecture",
        "Custom Markdown Compiler & Live Code Editor",
        "High-Performance In-Memory Key-Value Caching Server"
      ]
    }
  },

  "ai-engineer": {
    category: "AI & Data Science",
    freeCourses: [
      { title: "AI for Everyone & Machine Learning Specialization", provider: "DeepLearning.AI / Coursera", url: "https://www.coursera.org/learn/ai-for-everyone" },
      { title: "Practical Deep Learning for Coders", provider: "fast.ai", url: "https://www.fast.ai" },
      { title: "Elements of AI", provider: "University of Helsinki", url: "https://www.elementsofai.com" }
    ],
    youtubePlaylists: [
      { title: "StatQuest with Josh Starmer - Machine Learning & Statistics", channel: "StatQuest" },
      { title: "3Blue1Brown - Neural Networks & Linear Algebra Visualized", channel: "3Blue1Brown" },
      { title: "Andreathy Karpathy - Zero to Hero Neural Nets", channel: "Andrej Karpathy" }
    ],
    practicePlatforms: [
      { name: "Kaggle", focus: "Machine Learning Competitions & Notebooks", url: "https://www.kaggle.com" },
      { name: "Hugging Face Spaces", focus: "Deploying & Fine-tuning LLMs", url: "https://huggingface.co" },
      { name: "Papers with Code", focus: "State-of-the-Art Research Implementation", url: "https://paperswithcode.com" }
    ],
    officialDocs: [
      { name: "PyTorch Documentation", url: "https://pytorch.org/docs/stable/index.html" },
      { name: "Scikit-Learn User Guide", url: "https://scikit-learn.org/stable/" },
      { name: "OpenAI API Documentation", url: "https://platform.openai.com/docs" }
    ],
    projects: {
      beginner: [
        "Spam Email Classifier using Naive Bayes & Scikit-Learn",
        "Handwritten Digit Recognizer using PyTorch CNN",
        "Sentiment Analyzer for Twitter/X Posts"
      ],
      intermediate: [
        "RAG (Retrieval-Augmented Generation) Chatbot for PDF Documents",
        "Real-Time Object Detection System using YOLO and OpenCV",
        "Customer Churn Prediction Model with Streamlit Dashboard"
      ],
      advanced: [
        "Fine-Tuned Open-Source LLM (Llama 3 / Mistral) for Medical Q&A",
        "Autonomous AI Agent Swarm for Automated Market Research",
        "End-to-End MLOps Pipeline with MLflow & Automated Model Retraining"
      ]
    }
  },

  "data-scientist": {
    category: "AI & Data Science",
    freeCourses: [
      { title: "Google Data Analytics Professional Certificate", provider: "Coursera / Google", url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
      { title: "Introduction to Computational Thinking and Data Science", provider: "MIT OpenCourseWare", url: "https://ocw.mit.edu" },
      { title: "Python for Data Science & Machine Learning", provider: "freeCodeCamp", url: "https://www.freecodecamp.org" }
    ],
    youtubePlaylists: [
      { title: "Ken Jee - Data Science Projects & Career Roadmaps", channel: "Ken Jee" },
      { title: "Luke Barousse - Data Analyst & SQL Power BI Guides", channel: "Luke Barousse" },
      { title: "StatQuest - Statistics & Regression Analysis", channel: "StatQuest" }
    ],
    practicePlatforms: [
      { name: "Kaggle Datasets", focus: "Exploratory Data Analysis (EDA) & Modeling", url: "https://www.kaggle.com/datasets" },
      { name: "StrataScratch", focus: "SQL & Data Science Interview Questions", url: "https://www.stratascratch.com" },
      { name: "DataCamp", focus: "Interactive Python/R Data Science Labs", url: "https://www.datacamp.com" }
    ],
    officialDocs: [
      { name: "Pandas User Guide", url: "https://pandas.pydata.org/docs/user_guide/index.html" },
      { name: "NumPy Documentation", url: "https://numpy.org/doc/stable/" },
      { name: "Seaborn Visualization Guide", url: "https://seaborn.pydata.org/" }
    ],
    projects: {
      beginner: [
        "Exploratory Data Analysis (EDA) on COVID-19 Dataset",
        "Interactive Sales Analysis Dashboard on Power BI / Tableau",
        "Movie Recommendation Engine using Collaborative Filtering"
      ],
      intermediate: [
        "House Price Prediction Model using Gradient Boosting (XGBoost)",
        "Customer Segmentation & RFM Analysis for Retail Stores",
        "Stock Market Trend & Time Series Forecasting App"
      ],
      advanced: [
        "Real-Time Fraud Detection Engine on High-Volume Credit Card Transactions",
        "Automated A/B Testing & Experimentation Framework",
        "End-to-End Data Pipeline with Apache Airflow and Snowflake"
      ]
    }
  },

  "cybersecurity-analyst": {
    category: "Security",
    freeCourses: [
      { title: "Google Cybersecurity Professional Certificate", provider: "Coursera / Google", url: "https://www.coursera.org/professional-certificates/google-cybersecurity" },
      { title: "Intro to Cybersecurity & Networking", provider: "Cisco Networking Academy", url: "https://www.netacad.com" },
      { title: "Ethical Hacking for Beginners", provider: "freeCodeCamp", url: "https://www.freecodecamp.org" }
    ],
    youtubePlaylists: [
      { title: "NetworkChuck - Networking, Linux & Hacking Tutorials", channel: "NetworkChuck" },
      { title: "Professor Messer - CompTIA Security+ Training", channel: "Professor Messer" },
      { title: "The Cyber Mentor - Practical Ethical Hacking", channel: "The Cyber Mentor" }
    ],
    practicePlatforms: [
      { name: "TryHackMe", focus: "Hands-on Cyber Security & Hacking Rooms", url: "https://tryhackme.com" },
      { name: "Hack The Box", focus: "Advanced Penetration Testing & CTF Labs", url: "https://www.hackthebox.com" },
      { name: "OverTheWire (Bandit)", focus: "Linux CLI & Security Fundamentals", url: "https://overthewire.org" }
    ],
    officialDocs: [
      { name: "OWASP Top 10 Security Risks", url: "https://owasp.org/www-project-top-ten/" },
      { name: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework" },
      { name: "Wireshark User Documentation", url: "https://www.wireshark.org/docs/" }
    ],
    projects: {
      beginner: [
        "Port Scanner CLI in Python with Socket Library",
        "Wireshark Packet Analysis Case Study on Network Traffic",
        "Password Security & Hash Strength Checker"
      ],
      intermediate: [
        "Vulnerability Assessment & OWASP Audit of Web Applications",
        "SIEM Lab Configuration with Splunk / Elastic Security",
        "Phishing Email Detection & Analysis Pipeline"
      ],
      advanced: [
        "Automated Penetration Testing & Exploitation Framework",
        "Malware Analysis Sandbox & Reverse Engineering Lab",
        "Zero-Trust Architecture & Cloud Access Security Audit"
      ]
    }
  },

  "cloud-engineer": {
    category: "Cloud & Infrastructure",
    freeCourses: [
      { title: "AWS Cloud Practitioner & Solutions Architect Prep", provider: "AWS Skill Builder", url: "https://explore.skillbuilder.aws" },
      { title: "Microsoft Learn - Azure Fundamentals (AZ-900)", provider: "Microsoft Learn", url: "https://learn.microsoft.com" },
      { title: "Google Cloud Computing Foundations", provider: "Google Cloud Skills Boost", url: "https://www.cloudskillsboost.google" }
    ],
    youtubePlaylists: [
      { title: "TechWorld with Nana - Cloud, DevOps & Kubernetes", channel: "TechWorld with Nana" },
      { title: "freeCodeCamp - AWS Certified Solutions Architect Associate", channel: "freeCodeCamp" },
      { title: "Stephane Maarek - AWS & Cloud Architecture", channel: "Stephane Maarek" }
    ],
    practicePlatforms: [
      { name: "CloudResumeChallenge", focus: "Serverless Cloud Infrastructure Project", url: "https://cloudresumechallenge.dev" },
      { name: "AWS Workshops", focus: "Step-by-step Official AWS Guided Labs", url: "https://workshops.aws" },
      { name: "KodeKloud", focus: "Hands-on Labs for Docker, Terraform & AWS", url: "https://kodekloud.com" }
    ],
    officialDocs: [
      { name: "AWS Documentation Portal", url: "https://docs.aws.amazon.com" },
      { name: "Terraform Documentation", url: "https://developer.hashicorp.com/terraform/docs" },
      { name: "Kubernetes Documentation", url: "https://kubernetes.io/docs/home/" }
    ],
    projects: {
      beginner: [
        "Static Website Hosted on AWS S3 & CloudFront with SSL",
        "Automated EC2 Instance Scheduler using Python Lambda Function",
        "Basic VPC Network with Public and Private Subnets"
      ],
      intermediate: [
        "Serverless Web API using AWS Lambda, API Gateway & DynamoDB",
        "Infrastructure as Code (IaC) Deployment using Terraform",
        "Containerized Application Deployed on AWS ECS / Fargate"
      ],
      advanced: [
        "Multi-Region High Availability & Disaster Recovery Architecture",
        "Kubernetes Cluster Deployment with GitOps (ArgoCD)",
        "Zero-Downtime Infrastructure Migration to Cloud with CI/CD"
      ]
    }
  },

  "devops-engineer": {
    category: "Cloud & Infrastructure",
    freeCourses: [
      { title: "DevOps Engineering Course", provider: "freeCodeCamp", url: "https://www.freecodecamp.org" },
      { title: "Docker & Kubernetes Training", provider: "KodeKloud", url: "https://kodekloud.com" },
      { title: "Linux Command Line Basics", provider: "Linux Foundation / edX", url: "https://www.edx.org" }
    ],
    youtubePlaylists: [
      { title: "TechWorld with Nana - Complete DevOps Roadmap", channel: "TechWorld with Nana" },
      { title: "DevOps Directive - CI/CD & Cloud Infrastructure", channel: "DevOps Directive" },
      { title: "Kubesimplified - Cloud Native & Kubernetes", channel: "Kubesimplified" }
    ],
    practicePlatforms: [
      { name: "KodeKloud Playground", focus: "Docker, Kubernetes & Ansible Labs", url: "https://kodekloud.com" },
      { name: "Play with Docker", focus: "Instant Browser Docker Labs", url: "https://labs.play-with-docker.com" },
      { name: "Killercoda", focus: "Interactive Linux & Kubernetes Scenarios", url: "https://killercoda.com" }
    ],
    officialDocs: [
      { name: "Docker Documentation", url: "https://docs.docker.com" },
      { name: "GitHub Actions Docs", url: "https://docs.github.com/en/actions" },
      { name: "Ansible Official Docs", url: "https://docs.ansible.com" }
    ],
    projects: {
      beginner: [
        "Containerize Node.js/Python App with Docker & Docker Compose",
        "Automate Testing & Linting with GitHub Actions CI Pipeline",
        "Server Monitoring & Alerting Setup using Prometheus & Grafana"
      ],
      intermediate: [
        "End-to-End Automated CI/CD Pipeline for Microservices",
        "Infrastructure Provisioning on AWS using Terraform & Ansible",
        "Kubernetes Deployment with Ingress Controller & Auto-scaling"
      ],
      advanced: [
        "GitOps Pipeline with ArgoCD and Helm Charts on Kubernetes",
        "Chaos Engineering Testing with LitmusChaos on Cloud Infra",
        "Zero-Trust Enterprise Service Mesh Implementation with Istio"
      ]
    }
  },

  "uiux-designer": {
    category: "Design",
    freeCourses: [
      { title: "Google UX Design Professional Certificate", provider: "Coursera / Google", url: "https://www.coursera.org/professional-certificates/google-ux-design" },
      { title: "Figma for Beginners & UI Fundamentals", provider: "Figma Learn", url: "https://help.figma.com/hc/en-us" },
      { title: "UX Design Essentials", provider: "freeCodeCamp", url: "https://www.freecodecamp.org" }
    ],
    youtubePlaylists: [
      { title: "DesignCourse - UI/UX Design & Web Layouts", channel: "DesignCourse" },
      { title: "Flux Academy - Web Design & UI Tips", channel: "Flux Academy" },
      { title: "Mizko - Figma Masterclasses & Case Studies", channel: "Mizko" }
    ],
    practicePlatforms: [
      { name: "Daily UI", focus: "100-Day UI Design Prompts", url: "https://www.dailyui.co" },
      { name: "Behance / Dribbble", focus: "Portfolio Case Study Publications", url: "https://www.behance.net" },
      { name: "Sharpen.design", focus: "Open-ended Design Challenge Prompts", url: "https://sharpen.design" }
    ],
    officialDocs: [
      { name: "Figma Community Guidelines", url: "https://www.figma.com/best-practices/" },
      { name: "Apple Human Interface Guidelines", url: "https://developer.apple.com/design/human-interface-guidelines/" },
      { name: "Google Material Design 3", url: "https://m3.material.io" }
    ],
    projects: {
      beginner: [
        "Redesign of a Popular Local Business Website Layout",
        "Mobile Food Delivery App Wireframe & Low-Fidelity Prototype",
        "UI Design System with Typography & Color Tokens in Figma"
      ],
      intermediate: [
        "End-to-End Fintech Mobile Wallet App Case Study (Research to High-Fi)",
        "Interactive E-Learning Dashboard with Auto-Layout Components",
        "Usability Testing & Accessibility Audit of an Existing E-Commerce Site"
      ],
      advanced: [
        "Complete Healthcare Telemedicine Platform Design System & Prototype",
        "Multi-Platform Smart Home Control Dashboard (Mobile, Tablet, Watch)",
        "AR/VR Immersive Interface Design Concept Case Study"
      ]
    }
  },

  "product-manager": {
    category: "Business & Management",
    freeCourses: [
      { title: "Becoming a Product Manager", provider: "Product School", url: "https://productschool.com" },
      { title: "Agile with Atlassian Jira", provider: "Coursera / Atlassian", url: "https://www.coursera.org" },
      { title: "Product Analytics Fundamentals", provider: "Mixpanel University", url: "https://mixpanel.com" }
    ],
    youtubePlaylists: [
      { title: "Product School - Product Manager Speaker Series", channel: "Product School" },
      { title: "Exponent - Product Management Mock Interviews", channel: "Exponent" },
      { title: "Dan Olsen - The Lean Product Playbook", channel: "Lean Product" }
    ],
    practicePlatforms: [
      { name: "Product Alliance", focus: "Product Strategy & Teardown Cases", url: "https://www.productalliance.com" },
      { name: "Product Hunt", focus: "Analyzing Daily Tech Launches & Metrics", url: "https://www.producthunt.com" },
      { name: "Pragmatic Institute", focus: "Product Management Frameworks", url: "https://www.pragmaticinstitute.com" }
    ],
    officialDocs: [
      { name: "Atlassian Agile Coach Guide", url: "https://www.atlassian.com/agile" },
      { name: "Product Requirement Document (PRD) Templates", url: "https://coda.io/templates/prd" },
      { name: "Mixpanel Documentation", url: "https://docs.mixpanel.com" }
    ],
    projects: {
      beginner: [
        "Product Teardown Case Study of WhatsApp/Spotify",
        "User Interview & Persona Discovery Document for a Campus App",
        "Product Requirement Document (PRD) for a New Feature"
      ],
      intermediate: [
        "Comprehensive Competitor Analysis & Feature Prioritization Matrix",
        "User Onboarding Funnel Optimization Plan using Mixpanel Data",
        "Agile Sprint Planning & Roadmap Roadmap on Jira"
      ],
      advanced: [
        "0 to 1 New Product Launch Strategy (Market Size, GTM, Pricing)",
        "A/B Test Design & Conversion Rate Optimization Case Study",
        "AI Feature Integration Business Case & Monetization Model"
      ]
    }
  },

  "upsc": {
    category: "Government Services",
    freeCourses: [
      { title: "NCERT Official E-Learning Modules", provider: "NCERT / DIKSHA", url: "https://diksha.gov.in" },
      { title: "Press Information Bureau (PIB) Daily Analysis", provider: "Govt of India", url: "https://pib.gov.in" },
      { title: "NPTEL Humanities & Social Sciences", provider: "IITs / NPTEL", url: "https://nptel.ac.in" }
    ],
    youtubePlaylists: [
      { title: "Unacademy IAS - UPSC Preparation & Current Affairs", channel: "Unacademy IAS" },
      { title: "Drishti IAS - Mains Answer Writing & Topper Talks", channel: "Drishti IAS" },
      { title: "StudyIQ Education - Daily News Analysis (DNA)", channel: "StudyIQ" }
    ],
    practicePlatforms: [
      { name: "InsightsIAS", focus: "Daily Current Affairs & Answer Writing Challenge", url: "https://www.insightsonindia.com" },
      { name: "ClearIAS", focus: "UPSC Prelims Mock Test Series", url: "https://www.clearias.com" },
      { name: "VisionIAS", focus: "Mains Test Series & Monthly Magazines", url: "https://www.visionias.in" }
    ],
    officialDocs: [
      { name: "UPSC Official Examination Syllabus", url: "https://upsc.gov.in" },
      { name: "India Year Book & Economic Survey", url: "https://www.indiabudget.gov.in" },
      { name: "Constitution of India Text", url: "https://legislative.gov.in/constitution-of-india" }
    ],
    projects: {
      beginner: [
        "Comprehensive Summary Notes of 6th-12th NCERT History & Polity",
        "Daily Editorial Summary Notebook (30 Consecutive Days)",
        "Prelims Previous Year Question (PYQ) Topic-wise Analysis"
      ],
      intermediate: [
        "GS Mains Answer Writing Practice (100 Essays & Model Answers)",
        "District Administration Case Study & Policy Evaluation Paper",
        "Ethics (GS Paper 4) Case Studies Framework Matrix"
      ],
      advanced: [
        "Full-Length Prelims Mock Test Series Analysis & Error Log",
        "Optional Subject Comprehensive Answer Repository",
        "Simulated UPSC Personality Test & Mock Interview Preparation"
      ]
    }
  },

  "web-developer": {
    category: "Technology",
    freeCourses: [
      { title: "freeCodeCamp - Responsive Web Design & JS", provider: "freeCodeCamp", url: "https://www.freecodecamp.org" },
      { title: "The Odin Project - Full Stack Web Development", provider: "The Odin Project", url: "https://www.theodinproject.com" },
      { title: "Modern HTML & CSS Course", provider: "Scrimba", url: "https://scrimba.com" }
    ],
    youtubePlaylists: [
      { title: "Kevin Powell - CSS Wizardry & Responsive Layouts", channel: "Kevin Powell" },
      { title: "Traversy Media - Modern JavaScript & Web Dev", channel: "Traversy Media" },
      { title: "Web Dev Simplified - React, Node & Web Tech", channel: "Web Dev Simplified" }
    ],
    practicePlatforms: [
      { name: "Frontend Mentor", focus: "Real-world HTML/CSS/JS UI Challenges", url: "https://www.frontendmentor.io" },
      { name: "Codewars", focus: "JavaScript Kata & Logic Challenges", url: "https://www.codewars.com" },
      { name: "CodePen", focus: "Interactive Web Playground & Inspiration", url: "https://codepen.io" }
    ],
    officialDocs: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org" },
      { name: "Tailwind CSS Documentation", url: "https://tailwindcss.com/docs" },
      { name: "React Official Documentation", url: "https://react.dev" }
    ],
    projects: {
      beginner: [
        "Responsive Restaurant Landing Page with CSS Flexbox & Grid",
        "Interactive Quiz App with JavaScript DOM Manipulation",
        "Personal Linktree Alternative Profile Page"
      ],
      intermediate: [
        "E-Commerce Product Page with Cart State Management",
        "Recipe Search Application using External REST API",
        "Markdown Blog with Next.js & Tailwind CSS"
      ],
      advanced: [
        "Real-Time Collaborative Web Whiteboard",
        "Full-Stack SaaS Dashboard with Authentication & Stripe Integration",
        "Headless CMS Integration for Custom E-Commerce Engine"
      ]
    }
  }
};

// Default fallback resources for any career not explicitly listed above
export const DEFAULT_LEARNING_RESOURCES = {
  freeCourses: [
    { title: "freeCodeCamp Tech & Skills Catalog", provider: "freeCodeCamp", url: "https://www.freecodecamp.org" },
    { title: "Coursera Free University Audit Courses", provider: "Coursera", url: "https://www.coursera.org" },
    { title: "edX Free Professional Courses", provider: "edX", url: "https://www.edx.org" }
  ],
  youtubePlaylists: [
    { title: "CrashCourse - General Science & Technology Overview", channel: "CrashCourse" },
    { title: "MIT OpenCourseWare - Foundations", channel: "MIT OCW" },
    { title: "TED-Ed - Career Insights & Innovation", channel: "TED-Ed" }
  ],
  practicePlatforms: [
    { name: "Kaggle / LeetCode", focus: "Skill Development & Practice", url: "https://www.kaggle.com" },
    { name: "GitHub", focus: "Open Source Collaboration", url: "https://github.com" },
    { name: "Stack Overflow", focus: "Community Q&A & Problem Solving", url: "https://stackoverflow.com" }
  ],
  officialDocs: [
    { name: "Wikipedia Knowledge Base", url: "https://www.wikipedia.org" },
    { name: "NPTEL Course Portal", url: "https://nptel.ac.in" }
  ],
  projects: {
    beginner: [
      "Foundational Skill Summary & Digital Notes Repository",
      "Introductory Hands-on Practice Exercise",
      "Personal Career Goal Tracking Dashboard"
    ],
    intermediate: [
      "Mid-level Portfolio Project demonstrating core concepts",
      "Case Study & Applied Industry Analysis",
      "Interactive Skill Demonstration Application"
    ],
    advanced: [
      "End-to-End Capstone Project with Real-World Data",
      "Open-Source Contribution to Industry Repositories",
      "Comprehensive Professional Portfolio & Case Study Presentation"
    ]
  }
};

// Helper function to resolve resources for any career string or ID
export function getLearningResources(careerNameOrId) {
  if (!careerNameOrId) return DEFAULT_LEARNING_RESOURCES;

  const key = careerNameOrId.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  
  if (CAREER_LEARNING_RESOURCES[key]) {
    return CAREER_LEARNING_RESOURCES[key];
  }

  // Partial match checks
  if (key.includes("software") || key.includes("developer") || key.includes("coder")) {
    return CAREER_LEARNING_RESOURCES["software-engineer"];
  }
  if (key.includes("ai") || key.includes("machine-learning") || key.includes("intelligence")) {
    return CAREER_LEARNING_RESOURCES["ai-engineer"];
  }
  if (key.includes("data") || key.includes("analytics") || key.includes("statistician")) {
    return CAREER_LEARNING_RESOURCES["data-scientist"];
  }
  if (key.includes("security") || key.includes("cyber") || key.includes("hacking")) {
    return CAREER_LEARNING_RESOURCES["cybersecurity-analyst"];
  }
  if (key.includes("cloud") || key.includes("aws") || key.includes("azure")) {
    return CAREER_LEARNING_RESOURCES["cloud-engineer"];
  }
  if (key.includes("devops") || key.includes("infrastructure") || key.includes("sre")) {
    return CAREER_LEARNING_RESOURCES["devops-engineer"];
  }
  if (key.includes("ui") || key.includes("ux") || key.includes("design")) {
    return CAREER_LEARNING_RESOURCES["uiux-designer"];
  }
  if (key.includes("product") || key.includes("manager") || key.includes("management")) {
    return CAREER_LEARNING_RESOURCES["product-manager"];
  }
  if (key.includes("upsc") || key.includes("ias") || key.includes("civil") || key.includes("ssc") || key.includes("govt") || key.includes("bank")) {
    return CAREER_LEARNING_RESOURCES["upsc"];
  }

  return DEFAULT_LEARNING_RESOURCES;
}
