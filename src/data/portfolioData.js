/**
 * ============================================================================
 * PORTFOLIO DATA — NGUYEN GIA KHOI
 * ============================================================================
 * Centralized data management for all portfolio sections.
 * Comments marked with `// TODO:` indicate areas where you can supply live URLs or assets.
 */

export const personalInfo = {
  name: 'Nguyễn Gia Khôi',
  title: 'Junior Backend Engineer',
  roleTagline: 'Backend Engineer | Distributed Systems & AI Architectures',
  email: 'giakhoi2004@gmail.com',
  phone: '0944027440',
  github: 'https://github.com/nguyen-gia-khoi',
  linkedin: 'https://www.linkedin.com/in/nguyen-gia-khoi',
  resumeUrl: '/Nguyen-Gia-Khoi-CV.pdf', // CV PDF in public/ folder
  summary:
    'Junior Backend Engineer with a solid foundation in building scalable APIs, distributed data pipelines, multi agent systems and GraphRAG systems. Hands-on experience optimizing PostgreSQL query execution from ~15s to sub-second latency, implementing Redis distributed locking for high-concurrency consistency, multi-model AI systems for AI-based dermatological diagnosis with a Vietnamese knowledge layer and engineering domain-grounded LLM retrieval pipelines using FastAPI, Neo4j, and LangGraph. Co-author of 2 published scientific papers in applied AI.',
};

export const education = {
  degree: 'Bachelor of Information Technology',
  institution: 'University of Foreign Languages - Information Technology (HUFLIT)',
  period: '2022 – 2026',
  gpa: '3.25 / 4.0',
  ielts: '6.5',
  highlights: [
    'Major in Software Engineering & Information Systems.',
    'Undergraduate AI research in dermatology diagnosis with 2 published scientific papers.',
  ],
};

export const publications = [
  {
    id: 'paper-1',
    title:
      'Evaluating Embedding Spaces of Foundation Models for Infectious Dermatological Images to Guide Backbone Selection for Pipeline Fine-Tuning',
    venue: 'HUFLIT Journal of Science, Vol. 10, No. 4 (2026), pp. 12–36',
    year: '09/2026',
    authors: 'Pham Thi Anh Thu*, Nguyen Gia Khoi, Tran Trung Hieu, Tran Anh Duc, Bui Thi Thanh Tu',
    status: 'Published',
    doi: 'https://hjs.huflit.edu.vn/index.php/hjs/article/view/398',
    doiLabel: 'Read Article',
    pdfLink: 'https://hjs.huflit.edu.vn/index.php/hjs/article/download/398/240',
    badges: ['Co-Author (2nd Author)', 'HUFLIT Journal of Science'],
    abstract:
      'Across 1,300 images spanning 13 infectious dermatological conditions, dermatology-specific foundation models demonstrated more stable and clinically aligned embedding spaces, serving as optimal backbones for downstream fine-tuning pipelines.',
    bibtex: `@article{thu2026evaluating,
  title={Evaluating Embedding Spaces of Foundation Models for Infectious Dermatological Images to Guide Backbone Selection for Pipeline Fine-Tuning},
  author={Pham, Thi Anh Thu and Nguyen, Gia Khoi and Tran, Trung Hieu and Tran, Anh Duc and Bui, Thi Thanh Tu},
  journal={HUFLIT Journal of Science},
  volume={10},
  number={4},
  pages={12--36},
  year={2026},
  issn={2354-113X},
  url={https://hjs.huflit.edu.vn/index.php/hjs/article/view/398}
}`,
  },
  {
    id: 'paper-2',
    title: 'DERMAFUSION-GRAG: A MULTIMODAL AI FRAMEWORK FOR DERMATOLOGY DIAGNOSIS',
    venue:
      '11th EAI International Conference on Smart Objects and Technologies for Social Good (GOODTECHS 2025), Rach Gia, Dec 18–20, 2025. LNICST vol. 708, Springer',
    year: '12/2025',
    authors: 'Bui Thi Thanh Tu, Pham Thi Anh Thu, Nguyen Gia Khoi, Tran Trung Hieu',
    status: 'Published',
    doi: 'https://link.springer.com/book/9783032340542',
    doiLabel: 'Springer',
    badges: ['Co-Author', '103/264 Accepted Papers', 'Springer LNICST'],
    abstract:
      'Integrates image preprocessing, heatmap-based lesion localization, Graph-RAG retrieval, and LLM clinical reasoning: achieved 97.04% F1-score and 97.63% Recall, delivering improved diagnostic fairness for data-scarce infectious dermatological classes.',
    bibtex: `@inproceedings{tu2025dermafusion,
  title={DermaFusion-GRAG: A Multimodal AI Framework for Dermatology Diagnosis},
  author={Bui, Thi Thanh Tu and Pham, Thi Anh Thu and Nguyen, Gia Khoi and Tran, Trung Hieu},
  booktitle={Smart Objects and Technologies for Social Good - 11th EAI International Conference, GOODTECHS 2025},
  series={LNICST},
  volume={708},
  publisher={Springer},
  year={2025},
  url={https://link.springer.com/book/9783032340542}
}`,
  },
];

export const skills = {
  Languages: ['Python', 'JavaScript (Node.js)', 'SQL', 'Cypher (Neo4j)'],
  Backend: [
    'FastAPI',
    'Express.js',
    'RESTful API Design',
    'Asynchronous Programming',
  ],
  'Databases & Caching': [
    'PostgreSQL',
    'MongoDB',
    'Redis (Distributed Locking & Caching)',
    'Neo4j (Graph DB)',
  ],
  'AI & LLM Systems': [
    'GraphRAG',
    'LangGraph',
    'RAG',
    'OpenAI API',
    'Prompt Engineering & Guardrails',
  ],
  'DevOps & Infrastructure': [
    'Docker',
    'Grafana (Monitoring & Metrics)',
    'Git',
    'Postman',
    'Linux',
    'Ubuntu Server',
  ],
};

export const experience = [
  {
    role: 'Backend Engineer',
    company: 'ETECHS Educational Technology Solutions JSC',
    companyUrl: 'https://etechs.vn/',
    period: '08/2026 – Present',
    type: 'Full-time',
    logTitle: 'etechs-edutech-solutions',
    bullets: [
      'Lead and mentor the backend development team, organizing sprint backlogs and establishing code review standards for the core digital learning content platform.',
      'Analyze business requirements and architect high-performance, modular backend services to handle digital learning materials, multimedia assets, and multi-tenant school access.',
      'Plan technical roadmaps and design scalable RESTful APIs, database schemas, and microservice workflows to support continuous delivery and digital curriculum expansion.',
      'Optimize data caching and retrieval workflows to ensure low latency, high availability, and secure role-based access for students, teachers, reviewers, and administrators.',
    ],
  },
  {
    role: 'Backend Engineer Intern',
    company: 'Phuong Quan Trading Service',
    period: '09/2025 – 01/2026',
    type: 'Internship',
    logTitle: 'phuong-quan-trading-service',
    bullets: [
      'Consolidated fragmented data architectures from 3 legacy internal systems into a unified backend service, slashing end-to-end API response latency from 10–15 seconds to sub-second execution.',
      'Optimized complex PostgreSQL queries and index structures, restructuring execution plans to reduce query runtime from ~15s to under 300ms for high-volume transactions.',
      'Architected a distributed locking mechanism using Redis to eliminate race conditions during concurrent multi-source synchronization of 1M+ records, guaranteeing strict transactional data consistency.',
      'Used Grafana for monitoring dashboards and centralized log analysis to track production throughput, detect bottlenecks, and accelerate root-cause debugging for critical backend workflows.',
    ],
  },
];

export const projects = [
  {
    id: 'tasttymind',
    title: 'TasttyMind — Graph RAG-powered Nutrition Chatbot',
    role: 'Team Lead',
    tag: 'Team Lead & AI Architect',
    color: 'green',
    // TODO: Update live demo URL or repo when available:
    link: null, // e.g.: "https://tasttymind.example.com"
    github: null, // e.g.: "https://github.com/nguyen-gia-khoi/tasttymind"
    tech: ['FastAPI', 'Neo4j', 'LangGraph', 'Express.js', 'LLMs', 'Cypher'],
    architecture: {
      type: 'GraphRAG Pipeline',
      summary:
        'Client Request → FastAPI Microservice → LangGraph State Machine → Neo4j Cypher Traversal (~650 nodes, 1,700 rels) + Vector Search → LLM Re-ranking & Validation Guardrails → Streaming Response',
      // TODO: Architecture diagram image path (put image in public/):
      diagramImage: null, // e.g.: "/diagrams/tasttymind-arch.png"
    },
    bullets: [
      'Engineered an end-to-end GraphRAG pipeline with LangGraph and FastAPI for clinical dietary recommendation.',
      'Modeled a hierarchical Neo4j Knowledge Graph (~650 nodes, 1,700 rels) linking contraindications, nutrients, and food sources.',
      'Built hybrid retrieval combining Cypher graph traversal, vector search, LLM re-ranking, and defensive guardrails.',
    ],
  },
  {
    id: 'ailusion-journey',
    title: 'Ailusion Journey — Multi-Agent Travel Itinerary Assistant',
    role: 'Business Analyst & DevOps Engineer',
    tag: 'BA & DevOps Engineer',
    badge: '🏆 Top 12 Finalist — MLAI Hackathon 2026',
    color: 'purple',
    image: '/ailusion-preview.png',
    github: [
      {
        label: 'LLM Agents',
        url: 'https://github.com/thuphamfintechtai/ailusion-journey-llm',
      },
      {
        label: 'Frontend',
        url: 'https://github.com/thuphamfintechtai/ailusion-journey-fe',
      },
    ],
    link: 'http://journey.ailusion.io.vn/',
    tech: [
      'LangGraph',
      'Multi-Agent Systems',
      'MCP',
      'FastAPI',
      'Next.js',
      'PostgreSQL',
      'Apache Airflow',
      'Docker',
    ],
    architecture: {
      type: '17-Step Multi-Agent Orchestration Engine',
      summary:
        'Conversational User Dialogue → Dynamic Form Slot-Filling → 17-Step LangGraph Orchestrator (5 LLM Agents: Intake, Experience, Budget, Scheduler, Decision) ↔ MCP Servers (Geo, Accommodation, Weather, Routing) ↔ Apache Airflow ETL & PostgreSQL → Top 3 Optimized Itineraries',
      diagramImage: null,
    },
    bullets: [
      'Conversational AI travel assistant that auto-extracts trip intent & parameters (destination, duration, budget, preferences) directly from dialogue into booking forms.',
      'Architected a 17-step LangGraph orchestration pipeline with 5 collaborative LLM agents (Intake, Experience, Budget, Scheduler, Decision) returning up to 3 optimal itineraries.',
      'Integrated Model Context Protocol (MCP) servers for live geographic locations, accommodations, weather, and routing data, powered by Apache Airflow ETL data pipelines into PostgreSQL.',
      'Served as Team Lead, Business Analyst & DevOps Engineer: led team into Top 12 Finalists at MLAI Hackathon 2026, streamlined requirement specs, and established containerized microservices deployment.',
    ],
  },
  {
    id: 'globetrek',
    title: 'Tour Booking Web Application (GlobeTrek)',
    role: 'Fullstack / Backend Lead',
    tag: 'Fullstack / Backend Lead',
    color: 'orange',
    image: '/globetrek-preview.png',
    github: [
      {
        label: 'GlobeTrek-FE',
        url: 'https://github.com/nguyen-gia-khoi/GlobeTrek-FE',
      },
      {
        label: 'GlobeTrek',
        url: 'https://github.com/nguyen-gia-khoi/GlobeTrek',
      },
    ],
    link: 'https://globetrek.nguyengiakhoi.io.vn/',
    tech: ['React', 'Node.js', 'Express', 'EJS', 'minIO', 'MongoDB', 'Redis', 'PayPal', 'RBAC'],
    architecture: {
      type: 'Distributed Concurrency Engine',
      summary:
        'Customer Booking (React FE) / Admin & Partner Operations (Express + EJS) → Redis Distributed Lock (Seat Reservation) → MongoDB Transactions & RBAC Engine → PayPal Payment Webhook & 70/30 Revenue Split Engine → Excel Automated Reporting',
      // TODO: Architecture diagram image path (put image in public/):
      diagramImage: null, // e.g.: "/diagrams/globetrek-arch.png"
    },
    bullets: [
      'GlobeTrek is a tour operations platform for three roles: customers book tours on GlobeTrek-FE (React), while admins and partners use the GlobeTrek management portal (Node.js, Express, EJS).',
      'Partners register, get approved by an admin, then create tours in three steps (pricing, itinerary, photos and departure dates), track seat availability, and request tour removal. Admins approve tours and manage destinations, countries, regions, tour types, customers, and partners.',
      'Customers browse and filter tours, book seats, apply discount codes or automatic offers, and pay with PayPal. Their account includes order history, saved passengers, and a wishlist.',
      'Paid-order revenue is split 30% to the platform and 70% to the partner, with reports by day, week, month, and year, plus tour performance reports that can be exported to Excel.',
    ],
  },
  {
    id: 'document-system',
    title: 'Web-based Document Management System',
    client: 'Nam Saigon Polytechnic College',
    role: 'Backend Developer',
    tag: 'Client / Enterprise Project',
    color: 'cyan',
    image: '/document-system-preview.png',
    isPrivate: true, // Client institutional project, source code private under NDA
    privateNotice:
      'Internal institutional system — code & live preview are confidential under client NDA.',
    link: null,
    github: null,
    tech: ['Node.js', 'Express', 'MongoDB', 'Google Drive API', 'JWT', 'RBAC', 'Excel Export'],
    architecture: {
      type: 'Cloud Object Storage & Document Workflow Engine',
      summary:
        'Incoming/Outgoing Document Upload → Express REST API & JWT/RBAC Authorization → Google Drive Cloud Storage → Multi-Stage Approval State Engine → MongoDB Lifecycle & Audit Trails → Excel Analytics Export',
      diagramImage: null, // TODO: Architecture diagram image path if available
    },
    bullets: [
      'Engineered a web application managing incoming and outgoing official documents with full lifecycle tracking: document ID, document type, urgency level, processing deadlines, signatories, assigned departments, and handling personnel.',
      'Integrated Google Drive API for automated cloud attachment storage, providing real-time tracking for document status: read, received, processed early, on-time, or overdue.',
      'Designed document dispatch and formal multi-stage approval workflows (pending, under review, approved, or rejected) with automated progress synchronization back to original documents.',
      'Implemented granular Role-Based Access Control (RBAC) across Staff, Managers, and Admins; delivered administration modules for managing departments, job positions, document types, accounts, and official document issuance.',
      'Implemented secure JWT authentication and email-based password recovery, alongside statistical reporting APIs with Excel export to monitor institutional document volume and SLA progress.',
    ],
  },
];
