export const experience = [
  {
    title: 'Software Development Engineer',
    company: 'SBI General Insurance',
    dates: 'June 2025 — Present · Thane, India',
    points: [
      'Architected and delivered 7 enterprise-grade in-house platforms (4 built from scratch), maintaining 99.9% uptime and earning formal commendation from the CIO.',
      'Designed resilient, microservices-driven RESTful architectures within an Agile Scrum framework, boosting system scalability by 30%.',
      'Engineered in-house deployment automation and CI/CD pipelines (tejCD), streamlining release rollouts across Oracle WebLogic servers, Docker containers, and hybrid environments.',
      'Enforced enterprise-level Information Security compliance across all releases, achieving a flawless record of zero audit vulnerabilities.',
      'Maintained 5 mission-critical production platforms (NCB, IIB, MCRS, EMS, Vehicle Inspection), resolving 200+ P1/P2 operational incidents with a 100% SLA resolution rate.'
    ]
  },
  {
    title: 'Integration Engineer Intern',
    company: 'Hyperverge',
    dates: 'Jan 2025 — June 2025 · Mumbai, India',
    points: [
      'Spearheaded enterprise KYC REST API integrations for tier-1 financial clients (SBI Life, HDFC Pension), driving a 25% uplift in B2B data throughput.',
      'Diagnosed and eliminated cross-functional technical bottlenecks, slashing client onboarding turnaround time by 30%.'
    ]
  }
];

export const projects = [


  {
    name: 'Partner Service Hub',
    stack: 'React · Redux · Spring Boot · Redis · Spring Security · JWT · Oracle DB',
    desc: 'Architected a centralized, high-throughput B2B partner portal enabling thousands of insurance agents to execute seamless policy renewals, instant document downloads, and real-time endorsements. Built deep integrations into SBI General core modules backed by Redis caching and JWT role-based access control, scaling system traffic capacity by 120%.',
    link: 'https://secure.sbigeneral.in/PHS#/auth'
  },
  {
    name: 'Customer Health Claim Intimation Portal',
    stack: 'Angular · Spring Boot · AWS Bedrock · Multithreading',
    desc: 'Built a high-traffic, customer-facing portal handling 1,000+ daily users, providing instant claim intimation ID generation and real-time claim lifecycle tracking. Engineered an intelligent health document triage engine utilizing AWS Bedrock and multithreaded TF-IDF text extraction to accurately classify medical records on upload.',
    link: 'https://www.sbigeneral.in/claim/claims-status-and-intimation'
  },

  {
    name: 'Commercial Claim Management System',
    stack: 'React · Redux · Spring Boot · STOMP WebSockets · Oracle DB',
    desc: 'Engineered an end-to-end commercial claims engine from scratch featuring real-time STOMP WebSocket distributed record-locking to eliminate race conditions and guarantee 100% transactional data integrity. Designed an intuitive, component-driven UI with lazy loading and Redux state management—improving frontend responsiveness by 60%. Integrated complete multi-tier RBAC, an agent settlement/payment pipeline, and dynamic MIS reporting.'
  },

  {
    name: 'tejCD — Custom CI/CD & Deployment Engine',
    stack: 'Node.js · WebSockets · Docker · Bash · Oracle WebLogic · Git · SVN',
    desc: 'Engineered a lightweight, proprietary CI/CD orchestration engine from scratch to automate end-to-end multi-tier deployments across Oracle WebLogic application servers and container runtimes. Features real-time build log streaming via WebSockets, automated artifact versioning, zero-downtime rolling restart triggers, and integrated webhook/polling support across both Git and legacy SVN repositories.'
  },

  {
    name: 'Biometric Vendor Attendance & CR Tracker',
    stack: 'FastAPI · Python · FaceNet-512 · Cosine Similarity · Spring Boot · React · SQL',
    desc: 'Created a proprietary enterprise governance platform automating internal and third-party vendor onboarding, geo-fenced biometric tracking, and change-request workflows. Integrated FaceNet-512 facial embeddings with cosine similarity checks and GPS coordinate verification to eradicate buddy-punching, cutting fraudulent check-ins by 99%.'
  },
  {
    name: 'VisionAid Exam System',
    stack: 'React · Node.js · Raspberry Pi · MySQL · Hardware Integration',
    desc: 'Designed an assistive MCQ testing ecosystem for visually impaired candidates, pairing custom 6-key tactile hardware with real-time text-to-speech synthesis to cut evaluation overhead by 40%. Awarded Best Software Project out of 400+ competitive submissions and presented directly to Hon. Sharad Pawar.',
    link: 'https://github.com/tejasrocks'
  }
];

export const skills = {
  Languages: ['Java', 'JavaScript', 'Python', 'C++', 'SQL', 'HTML5/CSS3'],
  Frameworks: ['React.js', 'Angular', 'Spring Boot', 'FastAPI', 'Node.js', 'Express.js', 'Redux'],
  Databases: ['Oracle SQL', 'MySQL', 'MongoDB', 'Firebase'],
  'Cloud, DevOps & Tools': [
    'Docker',
    'Kubernetes',
    'AWS',
    'Git',
    'GitLab',
    'SVN',
    'Oracle WebLogic',
    'WinSCP',
    'Redis',
    'tejCD (In-house CI/CD)'
  ],
  Practices: [
    'System Design (HLD/LLD)',
    'Distributed Systems',
    'Microservices Architecture',
    'Scalable REST APIs',
    'Data Structures & Algorithms',
    'Concurrency & Locking',
    'Information Security & JWT',
    'Agile Scrum'
  ]
};

export const education = {
  school: 'Sardar Patel Institute of Technology',
  degree: 'B.Tech, Computer Science (AI & ML)',
  dates: 'June 2021 — March 2025 · CGPA 8.21'
};

export const contact = {
  email: 'tejasmundhe07@gmail.com',
  phone: '+91 7720998676',
  linkedin: 'https://www.linkedin.com/in/tejas-mundhe-578bb6232/',
  leetcode: 'https://leetcode.com/u/tejasmundhe123/'
};