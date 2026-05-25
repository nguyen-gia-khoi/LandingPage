import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import './App.css';

// Context
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';

// Hooks
import { useDebounce }      from './hooks/useDebounce';
import { useActiveSection } from './hooks/useActiveSection';
import { useClipboard }     from './hooks/useClipboard';
import { useMediaQuery }    from './hooks/useMediaQuery';
import { useKeyPress }      from './hooks/useKeyPress';

// Components
import { ErrorBoundary }   from './components/ErrorBoundary';
import { ScrollProgress }  from './components/ScrollProgress';
import { BackToTop }       from './components/BackToTop';
import { ToastContainer }  from './components/Toast';
import { CommandPalette }  from './components/CommandPalette';

// ─── Data ───────────────────────────────────────────────────────────────────

const SECTION_IDS = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];

const skills = {
  Languages:                ['JavaScript (Node.js)', 'C#', 'Python'],
  Backend:                  ['Express.js', 'Sails.js', 'ASP.NET Web API', 'RESTful API Design'],
  'Databases & Caching':    ['MongoDB', 'PostgreSQL', 'Neo4j', 'SQL Server', 'Redis'],
  Frontend:                 ['ReactJS', 'HTML', 'CSS'],
  'AI / LLM':               ['RAG', 'Graph RAG', 'LangGraph', 'OpenAI API'],
  Architecture:             ['Microservices', 'Monolithic', 'System Design', 'API Design', 'Database Design', 'Distributed Systems'],
  'DevOps & Tools':         ['Git', 'Docker', 'Grafana', 'Postman', 'GitHub Copilot', 'Cursor', 'VS Code'],
  Deployment:               ['Vercel', 'Render', 'Linux', 'Nginx', 'Cloudflare', 'VPS'],
};

const experience = [
  {
    role: 'Backend Intern',
    company: 'Phuong Quan Trading Service',
    period: '09/2025 – 01/2026',
    bullets: [
      'Developed a data pipeline to ingest, process, and unify data from three separate systems into a centralized service for internal use.',
      'Reduced average response time from 10–15 seconds to a few hundred milliseconds.',
      'Optimized PostgreSQL queries and indexing, improving execution time from ~15 seconds to sub-second latency.',
      'Implemented Redis-based distributed locking to prevent race conditions during concurrent synchronization.',
      'Eliminated duplicate records and ensured data consistency across millions of records.',
      'Used Grafana for monitoring, debugging, and log analysis.',
    ],
  },
];

const projects = [
  {
    title: 'Web-based Document Management System',
    tag: 'Freelance',
    color: 'cyan',
    link: null,   // TODO: thêm link sau khi deploy
    github: null,
    tech: ['Node.js', 'Express', 'MongoDB', 'Google Drive API'],
    bullets: [
      'Developed an internal document management system.',
      'Worked directly with stakeholders to analyze requirements and design business workflows.',
      'Built RESTful APIs using Node.js/Express and MongoDB.',
      'Implemented multi-role permission management.',
      'Proposed Google Drive-based document storage for scalability and cost efficiency.',
      'Acted as a bridge between frontend, backend, and clients.',
    ],
  },
  {
    title: 'TastyMind — Graph RAG-powered Nutrition Chatbot',
    tag: 'Team Lead',
    color: 'green',
    link: null,
    github: null,
    tech: ['Neo4j', 'FastAPI', 'Node.js', 'LangGraph', 'LLMs'],
    bullets: [
      'Built a Graph RAG-powered nutrition chatbot for chronic disease support.',
      'Designed a medical knowledge graph using Neo4j (~650 nodes, 1700 relationships).',
      'Developed retrieval-generation pipelines using Cypher query, LangGraph, and LLM re-ranking.',
      'Reduced hallucinations through prompt engineering and graph-grounded responses.',
    ],
  },
  {
    title: 'Clothing E-commerce Web Application',
    tag: 'Team Lead & Backend Developer',
    color: 'purple',
    link: null,
    github: null,
    tech: ['ASP.NET Web API', 'ReactJS', 'MongoDB', 'PayPal API'],
    bullets: [
      'Developed a full-stack e-commerce platform.',
      'Implemented product management, shopping cart, order processing, and mock PayPal payment integration.',
      'Built RESTful APIs with ASP.NET Web API and frontend using ReactJS.',
      'Implemented authentication, role-based authorization, and inventory management.',
      'Designed scalable MongoDB-based monolithic architecture.',
    ],
  },
  {
    title: 'Tour Booking Web Application',
    tag: 'Team Lead & Backend Developer',
    color: 'orange',
    link: null,
    github: null,
    tech: ['Node.js', 'Express', 'ReactJS', 'Redis', 'Vercel', 'Render'],
    bullets: [
      'Built a full-stack tour booking system for users, partners, and administrators.',
      'Implemented Redis-based 15-minute reservation locking to prevent overbooking.',
      'Developed backend APIs using Node.js/Express and frontend with ReactJS.',
      'Added search and filtering by destination, date, and price.',
      'Deployed services using Vercel and Render.',
    ],
  },
];

// ─── Particle Canvas ─────────────────────────────────────────────────────────

// memo: component không có prop → không bao giờ cần re-render từ parent
const ParticleCanvas = memo(function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 60;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,255,136,0.5)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
});

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useTypingEffect(text, speed = 60, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout;
    let i = 0;
    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Shared Components ───────────────────────────────────────────────────────

// memo: re-render chỉ khi children hoặc command thay đổi
const SectionTitle = memo(function SectionTitle({ children, command }) {
  return (
    <div className="section-title">
      <span className="section-prompt">$ </span>
      <span className="section-command">{command}</span>
      <h2>{children}</h2>
    </div>
  );
});

// memo: TerminalWindow là UI thuần, không có state nội bộ
const TerminalWindow = memo(function TerminalWindow({ title = 'bash', children, className = '' }) {
  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-bar">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
        <span className="terminal-title">{title}</span>
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
});

// ─── Sections ────────────────────────────────────────────────────────────────

function Navbar({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { theme, toggle }       = useTheme();
  const isMobile                = useMediaQuery('(max-width: 680px)');

  // useActiveSection: highlight nav link ứng với section đang xem
  const activeId = useActiveSection(SECTION_IDS);

  const links = SECTION_IDS.filter((l) => l !== 'hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // useCallback: hàm đóng menu không thay đổi reference
  const closeMenu = useCallback(() => setOpen(false), []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <a href="#hero" className="navbar-logo">
        <span className="logo-bracket">[</span>
        <span className="logo-name">ngk</span>
        <span className="logo-bracket">]</span>
        <span className="logo-cursor">▌</span>
      </a>

      <div className="nav-right">
        {/* Command palette trigger */}
        <button
          className="nav-cmd-btn"
          onClick={onOpenPalette}
          title={`${isMobile ? '' : 'Ctrl+K'}`}
          aria-label="Open command palette"
        >
          <span className="cmd-icon">⌘</span>
          {!isMobile && <span className="cmd-label">K</span>}
        </button>

        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={toggle}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀' : '◑'}
        </button>

        <button className="nav-hamburger" onClick={() => setOpen((o) => !o)} aria-label="menu">
          <span /><span /><span />
        </button>

        <ul className={`nav-links ${open ? 'nav-links--open' : ''}`}>
          {links.map((l) => (
            <li key={l}>
              <a
                href={`#${l}`}
                onClick={closeMenu}
                className={activeId === l ? 'nav-link--active' : ''}
              >
                <span className="nav-tilde">~</span>/{l}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function HeroSection() {
  const line1 = useTypingEffect('whoami', 80, 300);
  const line2 = useTypingEffect('Nguyễn Gia Khôi', 55, 900);
  const line3 = useTypingEffect('role', 80, 1700);
  const line4 = useTypingEffect('Software Engineer / Backend Developer', 40, 2300);
  const line5 = useTypingEffect('status', 80, 3200);
  const line6 = useTypingEffect('Building scalable backend systems, AI-powered applications, and practical web solutions.', 25, 3800);

  return (
    <section id="hero" className="hero-section">
      <ParticleCanvas />
      <div className="hero-bg-grid" />
      <div className="hero-glow" />
      <div className="hero-content">
        <TerminalWindow title="~/nguyengiakhoi — bash" className="hero-terminal">
          <div className="hero-lines">
            <div className="tline">
              <span className="prompt">❯ </span>
              <span className="cmd">{line1.displayed}</span>
              {!line1.done && <span className="blink-cursor" />}
            </div>
            {line1.done && (
              <div className="tline output">
                <span className={`output-green${line2.done ? ' glitch' : ''}`} data-text={line2.displayed}>
                  {line2.displayed}
                </span>
                {!line2.done && <span className="blink-cursor" />}
              </div>
            )}
            {line2.done && (
              <div className="tline mt-sm">
                <span className="prompt">❯ </span>
                <span className="cmd">{line3.displayed}</span>
                {!line3.done && <span className="blink-cursor" />}
              </div>
            )}
            {line3.done && (
              <div className="tline output">
                <span className="output-cyan">{line4.displayed}</span>
                {!line4.done && <span className="blink-cursor" />}
              </div>
            )}
            {line4.done && (
              <div className="tline mt-sm">
                <span className="prompt">❯ </span>
                <span className="cmd">{line5.displayed}</span>
                {!line5.done && <span className="blink-cursor" />}
              </div>
            )}
            {line5.done && (
              <div className="tline output">
                <span className="output-dim">{line6.displayed}</span>
                {!line6.done && <span className="blink-cursor" />}
              </div>
            )}
            {line6.done && (
              <div className="tline mt-sm">
                <span className="prompt">❯ </span>
                <span className="blink-cursor" />
              </div>
            )}
          </div>
        </TerminalWindow>
        <div className="hero-cta">
          <a href="#projects" className="btn btn-primary">View Projects</a>
          <a href="#contact"  className="btn btn-secondary">Contact Me</a>
        </div>
      </div>
      <div className="scroll-hint">
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

function AboutSection() {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="section" ref={ref}>
      <div className={`container fade-in ${inView ? 'visible' : ''}`}>
        <SectionTitle command="cat about.txt">About Me</SectionTitle>
        <TerminalWindow title="about.txt">
          <div className="about-grid">
            <div className="about-avatar">
              <div className="avatar-ring">
                <div className="avatar-inner">
                  <span className="avatar-initials">NGK</span>
                </div>
              </div>
            </div>
            <div className="about-text">
              {[
                <>Backend Developer experienced in building scalable web applications using <span className="highlight"> Node.js</span>, <span className="highlight"> Express</span>, <span className="highlight"> Sails.js</span>, and <span className="highlight"> ASP.NET MVC</span>.</>,
                <>Proficient with <span className="highlight"> MongoDB</span>, <span className="highlight"> PostgreSQL</span>, <span className="highlight"> Neo4j</span>, and <span className="highlight"> SQL Server</span>.</>,
                <>Engaged in AI research in dermatology diagnosis, with <span className="highlight-gold"> two published scientific papers</span>.</>,
                <>Developed practical projects including a health-based food recommendation chatbot and multiple e-commerce platforms.</>,
              ].map((text, i) => (
                <p key={i} className="about-line">
                  <span className="prompt-inline">{'>'} </span>
                  {text}
                </p>
              ))}
            </div>
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}

function SkillsSection() {
  const { ref, inView }   = useInView();
  const [query, setQuery] = useState('');
  const debouncedQuery    = useDebounce(query, 200);

  const categoryColors = {
    Languages:             'green',
    Backend:               'cyan',
    'Databases & Caching': 'purple',
    Frontend:              'cyan',
    'AI / LLM':            'green',
    Architecture:          'yellow',
    'DevOps & Tools':      'dim',
    Deployment:            'red',
  };

  // useMemo: chỉ tính lại filteredSkills khi debouncedQuery thay đổi
  const filteredSkills = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return skills;
    return Object.fromEntries(
      Object.entries(skills)
        .map(([cat, items]) => [cat, items.filter((s) => s.toLowerCase().includes(q))])
        .filter(([, items]) => items.length > 0),
    );
  }, [debouncedQuery]);

  const totalVisible = useMemo(
    () => Object.values(filteredSkills).reduce((s, arr) => s + arr.length, 0),
    [filteredSkills],
  );

  return (
    <section id="skills" className="section section-alt" ref={ref}>
      <div className={`container fade-in ${inView ? 'visible' : ''}`}>
        <SectionTitle command="skills --list">Technical Skills</SectionTitle>

        {/* Search filter — dùng useDebounce */}
        <div className="skills-search-wrapper">
          <span className="skills-search-icon">❯</span>
          <input
            className="skills-search"
            type="text"
            placeholder="filter skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
          />
          {query && (
            <button className="skills-search-clear" onClick={() => setQuery('')}>×</button>
          )}
          {query && (
            <span className="skills-count">{totalVisible} results</span>
          )}
        </div>

        {Object.keys(filteredSkills).length === 0 ? (
          <p className="skills-empty">No skills match "{debouncedQuery}"</p>
        ) : (
          <div className="skills-grid">
            {Object.entries(filteredSkills).map(([cat, items]) => (
              <div key={cat} className="skill-card">
                <div className="skill-card-header">
                  <span className={`skill-dot skill-dot--${categoryColors[cat]}`} />
                  <span className="skill-cat">{cat}</span>
                </div>
                <ul className="skill-tags">
                  {items.map((item, idx) => (
                    <li
                      key={item}
                      className={`skill-tag skill-tag--${categoryColors[cat]}${inView ? ' tag-visible' : ''}`}
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ExperienceSection() {
  const { ref, inView } = useInView();

  return (
    <section id="experience" className="section" ref={ref}>
      <div className={`container fade-in ${inView ? 'visible' : ''}`}>
        <SectionTitle command="history --work">Experience</SectionTitle>
        {experience.map((exp, i) => (
          <div key={i} className="exp-card">
            <div className="exp-header">
              <div>
                <h3 className="exp-role">{exp.role}</h3>
                <p className="exp-company">{exp.company}</p>
              </div>
              <span className="exp-period">{exp.period}</span>
            </div>
            <TerminalWindow title={`${exp.company.toLowerCase().replace(/ /g, '-')}.log`}>
              <ul className="exp-bullets">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="exp-bullet">
                    <span className="bullet-arrow">→</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </TerminalWindow>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsSection() {
  const { ref, inView } = useInView();

  return (
    <section id="projects" className="section section-alt" ref={ref}>
      <div className={`container fade-in ${inView ? 'visible' : ''}`}>
        <SectionTitle command="ls -la ./projects">Featured Projects</SectionTitle>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div key={i} className={`project-card project-card--${p.color}`}>
              <div className="project-header">
                <div className="project-header-top">
                  <span className={`project-tag project-tag--${p.color}`}>{p.tag}</span>
                </div>
                <h3 className="project-title">{p.title}</h3>
                <div className="project-tech">
                  {p.tech.map((t) => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>
              </div>
              <TerminalWindow title="project_info">
                <ul className="project-bullets">
                  {p.bullets.map((b, j) => (
                    <li key={j} className="project-bullet">
                      <span className="bullet-dash">-</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </TerminalWindow>
              <div className="project-links">
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noreferrer" className={`project-link-btn project-link-btn--${p.color}`}>
                    <span className="link-icon">↗</span> Live Demo
                  </a>
                ) : (
                  <span className="project-link-btn project-link-btn--soon" title="Sẽ cập nhật sau khi deploy">
                    <span className="link-icon">⏳</span> Coming Soon
                  </span>
                )}
                {p.github ? (
                  <a href={p.github} target="_blank" rel="noreferrer" className="project-link-btn project-link-btn--github">
                    <span className="link-icon">⌥</span> GitHub
                  </a>
                ) : (
                  <span className="project-link-btn project-link-btn--soon" title="Sẽ cập nhật sau">
                    <span className="link-icon">⌥</span> GitHub
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ContactItem — tách riêng để dùng useClipboard + useToast độc lập mỗi item
function ContactItem({ label, value, href, colorClass }) {
  const { copied, copy } = useClipboard();
  const { toast }        = useToast();

  // useCallback: handleCopy không thay đổi giữa render
  const handleCopy = useCallback(async () => {
    await copy(value);
    toast.success(`Copied: ${value}`);
  }, [copy, value, toast]);

  return (
    <div className="contact-item">
      <span className="contact-label">{label}</span>
      <div className="contact-value-row">
        {href ? (
          <a href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" className={`contact-value ${colorClass}`}>
            {value}
          </a>
        ) : (
          <span className={`contact-value ${colorClass}`}>{value}</span>
        )}
        <button
          className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
          onClick={handleCopy}
          title="Copy to clipboard"
          aria-label={`Copy ${label}`}
        >
          {copied ? '✔' : '⧉'}
        </button>
      </div>
    </div>
  );
}

function ContactSection() {
  const { ref, inView } = useInView();

  return (
    <section id="contact" className="section" ref={ref}>
      <div className={`container fade-in ${inView ? 'visible' : ''}`}>
        <SectionTitle command="contact --info">Contact</SectionTitle>
        <div className="contact-wrapper">
          <TerminalWindow title="contact.sh" className="contact-terminal">
            <div className="contact-lines">
              <div className="tline">
                <span className="prompt">❯ </span>
                <span className="cmd">contact --info</span>
              </div>
              <div className="contact-items">
                <ContactItem
                  label="Email" value="giakhoi2004@gmail.com"
                  href="mailto:giakhoi2004@gmail.com"
                  colorClass="contact-value--green"
                />
                <ContactItem
                  label="LinkedIn" value="linkedin.com/in/nguyen-gia-khoi"
                  href="https://www.linkedin.com/in/nguyen-gia-khoi"
                  colorClass="contact-value--cyan"
                />
                <ContactItem
                  label="GitHub" value="github.com/nguyen-gia-khoi"
                  href="https://github.com/nguyen-gia-khoi"
                  colorClass="contact-value--purple"
                />
              </div>
              <div className="tline mt-sm">
                <span className="prompt">❯ </span>
                <span className="blink-cursor" />
              </div>
            </div>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
}

const Footer = memo(function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-mono">
          <span className="prompt-inline">❯ </span>
          Nguyễn Gia Khôi © {new Date().getFullYear()}
        </span>
        <span className="footer-mono footer-dim">Built with React + Vite</span>
      </div>
    </footer>
  );
});

// ─── App ─────────────────────────────────────────────────────────────────────

function AppContent() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette  = useCallback(() => setPaletteOpen(true),  []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  // Ctrl+K (Windows) hoặc Cmd+K (Mac) mở command palette
  useKeyPress('k', openPalette, { ctrl: true });
  useKeyPress('k', openPalette, { meta: true });

  return (
    <>
      <ScrollProgress />
      <Navbar onOpenPalette={openPalette} />

      {/* ErrorBoundary bọc main content — nếu section nào crash, trang vẫn hiện */}
      <ErrorBoundary>
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <ProjectsSection />
          <ContactSection />
        </main>
      </ErrorBoundary>

      <Footer />
      <BackToTop />
      <ToastContainer />
      <CommandPalette isOpen={paletteOpen} onClose={closePalette} />
    </>
  );
}

export default function App() {
  return (
    // Provider ngoài cùng: mọi component con đều dùng được context
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
