import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import './App.css';

// Context
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';

// Hooks
import { useDebounce } from './hooks/useDebounce';
import { useActiveSection } from './hooks/useActiveSection';
import { useClipboard } from './hooks/useClipboard';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useKeyPress } from './hooks/useKeyPress';

// Components
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollProgress } from './components/ScrollProgress';
import { BackToTop } from './components/BackToTop';
import { ToastContainer } from './components/Toast';
import { CommandPalette } from './components/CommandPalette';

// Centralized Data
import {
  personalInfo,
  education,
  publications,
  skills,
  experience,
  projects,
} from './data/portfolioData';

// ─── Constants ───────────────────────────────────────────────────────────────

const SECTION_IDS = ['hero', 'about', 'skills', 'experience', 'projects', 'publications', 'contact'];

// ─── Particle Canvas ─────────────────────────────────────────────────────────

const ParticleCanvas = memo(function ParticleCanvas() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 55;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.6,
    }));

    const isLight = theme === 'light';
    const fillStyle = isLight ? 'rgba(5, 150, 105, 0.25)' : 'rgba(0, 255, 136, 0.45)';
    const strokeBase = isLight ? '2, 132, 199' : '0, 212, 255';
    const strokeAlpha = isLight ? 0.08 : 0.12;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = fillStyle;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${strokeBase}, ${strokeAlpha * (1 - dist / 110)})`;
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
  }, [theme]);

  return <canvas ref={canvasRef} className="particle-canvas" />;
});

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useTypingEffect(text, speed = 45, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeout;
    let i = 0;
    timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  return { displayed, done, forceComplete: () => { setDisplayed(text); setDone(true); } };
}

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Shared Components ───────────────────────────────────────────────────────

const SectionTitle = memo(function SectionTitle({ children, command, description }) {
  return (
    <div className="section-title">
      <span className="section-prompt">$ </span>
      <span className="section-command">{command}</span>
      <h2>{children}</h2>
      {description && <p className="section-desc">{description}</p>}
    </div>
  );
});

const TerminalWindow = memo(function TerminalWindow({
  title = 'bash',
  children,
  className = '',
  rightAction = null,
}) {
  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-bar">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
          <span className="terminal-title">{title}</span>
        </div>
        {rightAction && <div className="terminal-bar-action">{rightAction}</div>}
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
});

// ─── Sections ────────────────────────────────────────────────────────────────

function Navbar({ onOpenPalette }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const activeId = useActiveSection(SECTION_IDS);
  const links = SECTION_IDS.filter((l) => l !== 'hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        {/* CV Download button */}
        <a
          href={personalInfo.resumeUrl}
          download="Nguyen-Gia-Khoi-CV.pdf"
          className="nav-cv-btn"
          title="Download CV (PDF)"
          onClick={() => toast.success('Downloading Nguyen-Gia-Khoi-CV.pdf...')}
        >
          <span className="cv-icon">↓</span>
          <span>CV</span>
        </a>

        {/* Command palette trigger */}
        <button
          className="nav-cmd-btn"
          onClick={onOpenPalette}
          title={isMobile ? 'Quick navigation' : 'Ctrl+K'}
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
          <span />
          <span />
          <span />
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
  const { toast } = useToast();
  const [skipped, setSkipped] = useState(false);

  const t1 = useTypingEffect('whoami', 50, 200);
  const t2 = useTypingEffect(personalInfo.name, 40, 700);
  const t3 = useTypingEffect('role', 50, 1300);
  const t4 = useTypingEffect(`${personalInfo.title} — Distributed Systems & AI Architectures`, 30, 1800);
  const t5 = useTypingEffect('status', 50, 2600);
  const t6 = useTypingEffect(
    'Optimizing backend query latency, implementing Redis distributed locking, and engineering domain-grounded GraphRAG pipelines.',
    20,
    3100,
  );

  const handleSkip = () => {
    setSkipped(true);
    t1.forceComplete();
    t2.forceComplete();
    t3.forceComplete();
    t4.forceComplete();
    t5.forceComplete();
    t6.forceComplete();
  };

  const isDone = skipped || t6.done;

  return (
    <section id="hero" className="hero-section">
      <ParticleCanvas />
      <div className="hero-bg-grid" />
      <div className="hero-glow" />

      <div className="hero-content">
        <TerminalWindow
          title="~/nguyengiakhoi — bash"
          className="hero-terminal"
          rightAction={
            !isDone ? (
              <button className="terminal-skip-btn" onClick={handleSkip} title="Skip typing animation">
                ⚡ Skip
              </button>
            ) : (
              <span className="terminal-status-pill">● Online</span>
            )
          }
        >
          <div className="hero-lines" onClick={!isDone ? handleSkip : undefined}>
            {/* Line 1: whoami */}
            <div className="tline">
              <span className="prompt">❯ </span>
              <span className="cmd">{skipped ? 'whoami' : t1.displayed}</span>
              {!skipped && !t1.done && <span className="blink-cursor" />}
            </div>

            {(skipped || t1.done) && (
              <div className="tline output">
                <span className={`output-green${skipped || t2.done ? ' glitch' : ''}`} data-text={personalInfo.name}>
                  {skipped ? personalInfo.name : t2.displayed}
                </span>
                {!skipped && !t2.done && <span className="blink-cursor" />}
              </div>
            )}

            {/* Line 2: role */}
            {(skipped || t2.done) && (
              <div className="tline mt-sm">
                <span className="prompt">❯ </span>
                <span className="cmd">{skipped ? 'role' : t3.displayed}</span>
                {!skipped && !t3.done && <span className="blink-cursor" />}
              </div>
            )}

            {(skipped || t3.done) && (
              <div className="tline output">
                <span className="output-cyan">
                  {skipped ? `${personalInfo.title} — Distributed Systems & AI Architectures` : t4.displayed}
                </span>
                {!skipped && !t4.done && <span className="blink-cursor" />}
              </div>
            )}

            {/* Line 3: status */}
            {(skipped || t4.done) && (
              <div className="tline mt-sm">
                <span className="prompt">❯ </span>
                <span className="cmd">{skipped ? 'status' : t5.displayed}</span>
                {!skipped && !t5.done && <span className="blink-cursor" />}
              </div>
            )}

            {(skipped || t5.done) && (
              <div className="tline output">
                <span className="output-dim">
                  {skipped
                    ? 'Optimizing backend query latency, implementing Redis distributed locking, and engineering domain-grounded GraphRAG pipelines.'
                    : t6.displayed}
                </span>
                {!skipped && !t6.done && <span className="blink-cursor" />}
              </div>
            )}

            {(skipped || t6.done) && (
              <div className="tline mt-sm">
                <span className="prompt">❯ </span>
                <span className="blink-cursor" />
              </div>
            )}
          </div>
        </TerminalWindow>

        <div className="hero-cta">
          <a href="#projects" className="btn btn-primary">
            <span className="btn-icon">⚡</span> View Projects
          </a>
          <a
            href={personalInfo.resumeUrl}
            download="Nguyen-Gia-Khoi-CV.pdf"
            className="btn btn-cv"
            onClick={() => toast.success('Downloading Nguyen-Gia-Khoi-CV.pdf...')}
          >
            <span className="btn-icon">↓</span> Download CV
          </a>
          <a href="#contact" className="btn btn-secondary">
            Get in Touch
          </a>
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

        <div className="about-wrapper">
          <TerminalWindow title="summary.md" className="about-terminal">
            <div className="about-text-full">
              <p className="about-lead">
                <span className="prompt-inline">❯ </span>
                {personalInfo.summary}
              </p>
            </div>
          </TerminalWindow>

          {/* Education Card */}
          <div className="education-card">
            <div className="edu-header">
              <div className="edu-badge">🎓 Education</div>
              <span className="edu-period">{education.period}</span>
            </div>
            <h3 className="edu-degree">{education.degree}</h3>
            <p className="edu-school">{education.institution}</p>
            <div className="edu-meta">
              <span className="edu-tag">GPA: <strong>{education.gpa}</strong></span>
              <span className="edu-tag">IELTS: <strong>{education.ielts}</strong></span>
            </div>
            <ul className="edu-highlights">
              {education.highlights.map((h, i) => (
                <li key={i}>
                  <span className="bullet-arrow">→</span> {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const { ref, inView } = useInView();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 180);

  const categoryColors = {
    Languages: 'green',
    Backend: 'cyan',
    'Databases & Caching': 'purple',
    'AI & LLM Systems': 'green',
    'DevOps & Infrastructure': 'orange',
  };

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

        <div className="skills-search-wrapper">
          <span className="skills-search-icon">❯</span>
          <input
            className="skills-search"
            type="text"
            placeholder="filter skills (e.g. redis, neo4j, fastAPI, postgres)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
          />
          {query && (
            <button className="skills-search-clear" onClick={() => setQuery('')}>
              ×
            </button>
          )}
          {query && <span className="skills-count">{totalVisible} results</span>}
        </div>

        {Object.keys(filteredSkills).length === 0 ? (
          <p className="skills-empty">No skills match "{debouncedQuery}"</p>
        ) : (
          <div className="skills-grid">
            {Object.entries(filteredSkills).map(([cat, items]) => (
              <div key={cat} className="skill-card">
                <div className="skill-card-header">
                  <span className={`skill-dot skill-dot--${categoryColors[cat] || 'green'}`} />
                  <span className="skill-cat">{cat}</span>
                </div>
                <ul className="skill-tags">
                  {items.map((item, idx) => (
                    <li
                      key={item}
                      className={`skill-tag skill-tag--${categoryColors[cat] || 'green'}${
                        inView ? ' tag-visible' : ''
                      }`}
                      style={{ animationDelay: `${idx * 45}ms` }}
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
        <SectionTitle command="history --work">Work Experience</SectionTitle>
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

function ArchitectureModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="arch-modal-backdrop" onClick={onClose}>
      <div className="arch-modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="arch-modal-header">
          <div className="arch-modal-title-group">
            <span className={`project-tag project-tag--${project.color}`}>
              {project.architecture.type}
            </span>
            <h3 className="arch-modal-title">{project.title}</h3>
          </div>
          <button className="arch-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="arch-modal-body">
          {project.architecture.diagramImage ? (
            <div className="arch-modal-img-wrapper">
              <img
                src={project.architecture.diagramImage}
                alt={`${project.title} Architecture Diagram`}
                className="arch-modal-img"
              />
            </div>
          ) : (
            <div className="arch-modal-placeholder">
              <div className="arch-placeholder-blueprint">
                <span className="arch-blueprint-badge">System Architecture & Pipeline Flow</span>
                <div className="arch-blueprint-flow">
                  <span className="arch-blueprint-label">Processing Pipeline Sequence:</span>
                  <div className="arch-flow-sequence">
                    {project.architecture.summary}
                  </div>
                </div>

                <div className="arch-blueprint-box">
                  <span className="arch-blueprint-icon">📐</span>
                  <p className="arch-blueprint-main">
                    Interactive Diagram Viewport
                  </p>
                  <p className="arch-blueprint-hint">
                    Ready to display high-resolution architectural diagram graphic.
                  </p>
                  <span className="arch-blueprint-code">
                    public/diagrams/{project.id}-architecture.png
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="arch-modal-footer">
          <span className="arch-modal-tech-label">Architecture Core Stack:</span>
          <div className="arch-modal-tech-list">
            {project.tech.map((t) => (
              <span key={t} className="tech-badge">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const { ref, inView } = useInView();
  const { toast } = useToast();
  const [selectedArchProject, setSelectedArchProject] = useState(null);

  const handlePendingDemo = (title) => {
    toast.info(`${title}: Live demo link will be attached soon!`);
  };

  return (
    <section id="projects" className="section section-alt" ref={ref}>
      <div className={`container fade-in ${inView ? 'visible' : ''}`}>
        <SectionTitle
          command="ls -la ./featured-projects"
          description="Featured engineering systems, GraphRAG architectures, and distributed backend services."
        >
          Featured Projects
        </SectionTitle>

        <div className="projects-grid">
          {projects.map((p) => (
            <div key={p.id} className={`project-card project-card--${p.color}`}>
              <div className="project-header">
                <div className="project-header-top">
                  <span className={`project-tag project-tag--${p.color}`}>{p.tag}</span>
                  {p.isPrivate && (
                    <span className="project-confidential-badge">
                      🔒 Enterprise Client Project
                    </span>
                  )}
                </div>

                <h3 className="project-title">{p.title}</h3>

                <div className="project-tech">
                  {p.tech.map((t) => (
                    <span key={t} className="tech-badge">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bullets terminal */}
              <TerminalWindow title="system_specs.log">
                {p.privateNotice && (
                  <div className="project-nda-notice">
                    <span className="nda-icon">ℹ</span> {p.privateNotice}
                  </div>
                )}
                <ul className="project-bullets">
                  {p.bullets.map((b, j) => (
                    <li key={j} className="project-bullet">
                      <span className="bullet-dash">-</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </TerminalWindow>

              {/* Action links */}
              <div className="project-links">
                <button
                  className={`project-link-btn project-link-btn--arch project-link-btn--${p.color}`}
                  onClick={() => setSelectedArchProject(p)}
                  title="View System Architecture & Flow"
                >
                  <span className="link-icon">📐</span> Architecture
                </button>

                {p.github ? (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link-btn project-link-btn--github"
                  >
                    <span className="link-icon">⌥</span> GitHub Repo
                  </a>
                ) : p.isPrivate ? (
                  <span
                    className="project-link-btn project-link-btn--disabled"
                    title="Code is confidential under client NDA"
                  >
                    <span className="link-icon">🔒</span> Confidential
                  </span>
                ) : (
                  <button
                    className="project-link-btn project-link-btn--soon"
                    onClick={() => handlePendingDemo(p.title)}
                    title="Repository link will be updated soon"
                  >
                    <span className="link-icon">⌥</span> Repo Pending
                  </button>
                )}

                {p.link ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`project-link-btn project-link-btn--${p.color}`}
                  >
                    <span className="link-icon">↗</span> Live Demo
                  </a>
                ) : (
                  <button
                    className="project-link-btn project-link-btn--soon"
                    onClick={() => handlePendingDemo(p.title)}
                    title="Demo URL will be provided soon"
                  >
                    <span className="link-icon">⏳</span> Demo Pending
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Modal */}
      <ArchitectureModal
        project={selectedArchProject}
        onClose={() => setSelectedArchProject(null)}
      />
    </section>
  );
}

function PublicationsSection() {
  const { ref, inView } = useInView();
  const { copy } = useClipboard();
  const { toast } = useToast();
  const [expandedBib, setExpandedBib] = useState({});

  const toggleBib = (id) => {
    setExpandedBib((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyBib = async (bibtex) => {
    await copy(bibtex);
    toast.success('BibTeX citation copied to clipboard!');
  };

  const handlePendingPaper = () => {
    toast.info('Paper link/DOI is pending indexing and will be updated shortly.');
  };

  return (
    <section id="publications" className="section" ref={ref}>
      <div className={`container fade-in ${inView ? 'visible' : ''}`}>
        <SectionTitle
          command="cat publications.bib"
          description="Co-authored peer-reviewed applied AI research papers focusing on automated dermatology diagnosis."
        >
          Research & Publications
        </SectionTitle>

        <div className="publications-grid">
          {publications.map((paper, idx) => (
            <div key={paper.id} className="publication-card">
              <div className="pub-card-top">
                <div className="pub-badge-row">
                  <span className="pub-status-badge">● {paper.status}</span>
                  <span className="pub-year-badge">{paper.year}</span>
                </div>
                <span className="pub-index">Paper #{idx + 1}</span>
              </div>

              <h3 className="pub-title">{paper.title}</h3>
              <p className="pub-venue">
                <span className="pub-venue-icon">🏛</span> {paper.venue}
              </p>
              <p className="pub-authors">
                <span className="pub-authors-label">Authors:</span> {paper.authors}
              </p>

              <p className="pub-abstract">{paper.abstract}</p>

              <div className="pub-actions">
                {paper.doi ? (
                  <a
                    href={paper.doi}
                    target="_blank"
                    rel="noreferrer"
                    className="pub-btn pub-btn--primary"
                  >
                    <span className="btn-icon">📄</span> View Paper (DOI)
                  </a>
                ) : (
                  <button
                    className="pub-btn pub-btn--pending"
                    onClick={handlePendingPaper}
                    title="Paper DOI link placeholder"
                  >
                    <span className="btn-icon">📄</span> DOI / Paper Pending
                  </button>
                )}

                <button
                  className="pub-btn pub-btn--bib"
                  onClick={() => toggleBib(paper.id)}
                >
                  {expandedBib[paper.id] ? 'Hide BibTeX' : 'Show BibTeX'}
                </button>

                <button
                  className="pub-btn pub-btn--copy"
                  onClick={() => handleCopyBib(paper.bibtex)}
                  title="Copy BibTeX Citation"
                >
                  ⧉ Copy BibTeX
                </button>
              </div>

              {expandedBib[paper.id] && (
                <TerminalWindow title={`citation_${idx + 1}.bib`} className="bibtex-terminal">
                  <pre className="bibtex-pre">{paper.bibtex}</pre>
                </TerminalWindow>
              )}
            </div>
          ))}
        </div>

        <div className="pub-footer-note">
          <span className="prompt-inline">❯ </span>
          <span>
            Note: Research was conducted as part of AI applied dermatology studies. Full citations and index links can be verified upon request.
          </span>
        </div>
      </div>
    </section>
  );
}

function ContactItem({ label, value, href, colorClass, isCopyable = true }) {
  const { copied, copy } = useClipboard();
  const { toast } = useToast();

  const handleCopy = useCallback(async () => {
    await copy(value);
    toast.success(`Copied: ${value}`);
  }, [copy, value, toast]);

  return (
    <div className="contact-item">
      <span className="contact-label">{label}</span>
      <div className="contact-value-row">
        {href ? (
          <a
            href={href}
            target={href.startsWith('mailto') || href.startsWith('tel') ? undefined : '_blank'}
            rel="noreferrer"
            className={`contact-value ${colorClass}`}
          >
            {value}
          </a>
        ) : (
          <span className={`contact-value ${colorClass}`}>{value}</span>
        )}
        {isCopyable && (
          <button
            className={`copy-btn ${copied ? 'copy-btn--copied' : ''}`}
            onClick={handleCopy}
            title="Copy to clipboard"
            aria-label={`Copy ${label}`}
          >
            {copied ? '✔' : '⧉'}
          </button>
        )}
      </div>
    </div>
  );
}

function ContactSection() {
  const { ref, inView } = useInView();

  return (
    <section id="contact" className="section section-alt" ref={ref}>
      <div className={`container fade-in ${inView ? 'visible' : ''}`}>
        <SectionTitle command="contact --info">Get in Touch</SectionTitle>
        <div className="contact-wrapper">
          <TerminalWindow title="contact.sh" className="contact-terminal">
            <div className="contact-lines">
              <div className="tline">
                <span className="prompt">❯ </span>
                <span className="cmd">contact --info</span>
              </div>
              <div className="contact-items">
                <ContactItem
                  label="Email"
                  value={personalInfo.email}
                  href={`mailto:${personalInfo.email}`}
                  colorClass="contact-value--green"
                />
                <ContactItem
                  label="Phone / Zalo"
                  value={personalInfo.phone}
                  href={`tel:${personalInfo.phone}`}
                  colorClass="contact-value--yellow"
                />
                <ContactItem
                  label="LinkedIn"
                  value="linkedin.com/in/nguyen-gia-khoi"
                  href={personalInfo.linkedin}
                  colorClass="contact-value--cyan"
                />
                <ContactItem
                  label="GitHub"
                  value="github.com/nguyen-gia-khoi"
                  href={personalInfo.github}
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
          {personalInfo.name} © {new Date().getFullYear()} — {personalInfo.title}
        </span>
        <span className="footer-mono footer-dim">Built with React 19 + Vite</span>
      </div>
    </footer>
  );
});

// ─── App ─────────────────────────────────────────────────────────────────────

function AppContent() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useKeyPress('k', openPalette, { ctrl: true });
  useKeyPress('k', openPalette, { meta: true });

  return (
    <>
      <ScrollProgress />
      <Navbar onOpenPalette={openPalette} />

      <ErrorBoundary>
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ExperienceSection />
          <ProjectsSection />
          <PublicationsSection />
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
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}
