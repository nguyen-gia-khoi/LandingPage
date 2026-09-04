/**
 * ============================================================================
 * PORTFOLIO DATA — NGUYỄN GIA KHÔI
 * ============================================================================
 * Tất cả thông tin của website được quản lý tập trung tại đây.
 * Chỗ nào có ghi chú `// TODO:` là nơi bạn có thể điền link thật hoặc thông tin sau.
 */

export const personalInfo = {
  name: 'Nguyễn Gia Khôi',
  title: 'Junior Backend Engineer',
  roleTagline: 'Backend Engineer | Distributed Systems & AI Architectures',
  email: 'giakhoi2004@gmail.com',
  phone: '0944027440',
  github: 'https://github.com/nguyen-gia-khoi',
  linkedin: 'https://www.linkedin.com/in/nguyen-gia-khoi',
  resumeUrl: '/Nguyen-Gia-Khoi-CV.pdf', // File CV đặt trong thư mục public/
  summary:
    'Junior Backend Engineer with a solid foundation in building scalable APIs, distributed data pipelines, and GraphRAG systems. Hands-on experience optimizing PostgreSQL query execution from ~15s to sub-second latency, implementing Redis distributed locking for high-concurrency consistency, and engineering domain-grounded LLM retrieval pipelines using FastAPI, Neo4j, and LangGraph. Co-author of 2 published scientific papers in applied AI.',
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
    title: 'Research Paper 1: AI-based Dermatology Diagnosis & Lesion Classification',
    // TODO: Cập nhật tiêu đề bài báo số 1 ở đây khi bạn tìm thấy
    venue: 'Scientific Conference / Journal in Applied AI',
    // TODO: Cập nhật tên hội thảo / tạp chí xuất bản (ví dụ: IEEE / Springer / KSE...)
    year: '2024 – 2025',
    authors: 'Nguyễn Gia Khôi, et al.',
    status: 'Published',
    doi: null, // TODO: Điền link DOI hoặc link bài báo (vd: "https://doi.org/10.xxxx/...")
    pdfLink: null, // TODO: Điền link tải PDF bài báo nếu có
    abstract:
      'Investigation and application of deep learning models and computer vision pipelines for accurate dermatological lesion detection and clinical decision support.',
    bibtex: `@article{khoi2025dermatology1,
  title={AI-based Dermatology Diagnosis & Lesion Classification},
  author={Nguyen, Gia Khoi and colleagues},
  journal={Applied Artificial Intelligence Research},
  year={2025},
  note={Co-author}
}`,
  },
  {
    id: 'paper-2',
    title: 'Research Paper 2: Advanced Feature Extraction in Medical Dermatology Imaging',
    // TODO: Cập nhật tiêu đề bài báo số 2 ở đây khi bạn tìm thấy
    venue: 'Scientific Conference / Journal in Applied AI',
    // TODO: Cập nhật tên hội thảo / tạp chí xuất bản
    year: '2024 – 2025',
    authors: 'Nguyễn Gia Khôi, et al.',
    status: 'Published',
    doi: null, // TODO: Điền link DOI hoặc link bài báo
    pdfLink: null, // TODO: Điền link PDF nếu có
    abstract:
      'Exploration of robust image preprocessing, multimodal feature integration, and validation strategies for dermatology diagnosis to reduce false positive rates.',
    bibtex: `@article{khoi2025dermatology2,
  title={Advanced Feature Extraction in Medical Dermatology Imaging},
  author={Nguyen, Gia Khoi and colleagues},
  journal={Applied Artificial Intelligence Research},
  year={2025},
  note={Co-author}
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
    role: 'Backend Engineer Intern',
    company: 'Phuong Quan Trading Service',
    period: '09/2025 – 01/2026',
    type: 'Internship',
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
    // TODO: Cập nhật đường dẫn live demo hoặc repo khi bạn có:
    link: null, // Điền URL demo ví dụ: "https://tasttymind.example.com"
    github: null, // Điền GitHub repo ví dụ: "https://github.com/nguyen-gia-khoi/tasttymind"
    tech: ['FastAPI', 'Neo4j', 'LangGraph', 'Express.js', 'LLMs', 'Cypher'],
    architecture: {
      type: 'GraphRAG Pipeline',
      summary:
        'Client Request → FastAPI Microservice → LangGraph State Machine → Neo4j Cypher Traversal (~650 nodes, 1,700 rels) + Vector Search → LLM Re-ranking & Validation Guardrails → Streaming Response',
      // TODO: Nếu có ảnh sơ đồ kiến trúc, bỏ ảnh vào public/ và điền đường dẫn vào đây:
      diagramImage: null, // Ví dụ: "/diagrams/tasttymind-arch.png"
    },
    bullets: [
      'Engineered an end-to-end GraphRAG pipeline with LangGraph and FastAPI for clinical dietary recommendation.',
      'Modeled a hierarchical Neo4j Knowledge Graph (~650 nodes, 1,700 rels) linking contraindications, nutrients, and food sources.',
      'Built hybrid retrieval combining Cypher graph traversal, vector search, LLM re-ranking, and defensive guardrails.',
    ],
  },
  {
    id: 'globetrek',
    title: 'Tour Booking Web Application (GlobeTrek)',
    role: 'Fullstack / Backend Lead',
    tag: 'Fullstack / Backend Lead',
    color: 'orange',
    // Link GitHub repo từ CV:
    github: 'https://github.com/nguyen-gia-khoi/GlobeTrek',
    // TODO: Cập nhật link live demo nếu có:
    link: null,
    tech: ['Node.js', 'Express', 'Redis', 'MongoDB', 'ReactJS', 'RBAC'],
    architecture: {
      type: 'Distributed Concurrency Engine',
      summary:
        'User Booking Request → API Gateway → Redis 15-min Distributed Lock (Seat Reservation) → MongoDB Transaction (Dynamic Pricing & Inventory) → Webhook Payment Event → Ticket Issuance Worker',
      // TODO: Nếu có ảnh sơ đồ kiến trúc, bỏ ảnh vào public/ và điền đường dẫn vào đây:
      diagramImage: null, // Ví dụ: "/diagrams/globetrek-arch.png"
    },
    bullets: [
      'Engineered a high-concurrency reservation engine using Redis 15-min distributed locks to eliminate double-booking.',
      'Designed MongoDB schema for dynamic date-based inventory, multi-tier pricing policies, and automated e-ticketing.',
      'Implemented RBAC across multi-tenant user flows (Users, Operators, Admins) with payment webhooks and cached APIs.',
    ],
  },
  {
    id: 'document-system',
    title: 'Web-based Document Management System',
    client: 'Nam Saigon Polytechnic College',
    role: 'Backend Developer',
    tag: 'Client / Enterprise Project',
    color: 'cyan',
    isPrivate: true, // Dự án làm cho khách hàng, không public code
    privateNotice:
      'Internal institutional system — code & live preview are confidential under client NDA.',
    link: null,
    github: null,
    tech: ['Node.js', 'Express', 'MongoDB', 'Google Drive API', 'RBAC'],
    architecture: {
      type: 'Cloud Object Storage & RBAC Engine',
      summary:
        'Client Document Upload → Node.js/Express REST API → Granular RBAC Permission Check → Automated Google Drive API Lifecycle Storage → Normalized MongoDB Metadata & Audit Log Trail',
      diagramImage: null, // TODO: Thêm ảnh sơ đồ kiến trúc nếu có
    },
    bullets: [
      'Built a role-based document workflow platform with granular RBAC permissions for multi-department approval cycles.',
      'Integrated Google Drive API as automated cloud storage layer, minimizing infrastructure overhead and costs.',
      'Designed normalized MongoDB schemas and REST APIs for high-frequency tracking, status transitions, and fast audit logs.',
    ],
  },
];
