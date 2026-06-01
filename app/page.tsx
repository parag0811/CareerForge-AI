"use client";

import { useState, useEffect, useRef } from "react";
import type {
  CSSProperties,
  Dispatch,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
} from "react";

/* ─── Design tokens ────────────────────────────────────────────────────────── */
const T = {
  light: {
    bg:          "#F7F6F3",
    surface:     "#FFFFFF",
    surfaceAlt:  "#F0EEE9",
    border:      "rgba(0,0,0,0.10)",
    borderStrong:"rgba(0,0,0,0.18)",
    text:        "#111110",
    textMid:     "#5C5A55",
    textFaint:   "#9A9891",
    accent:      "#D95F2B",
    accentBg:    "#FBF0EB",
    accentText:  "#A33F15",
    gold:        "#B87C12",
    goldBg:      "#FDF7E8",
    goldText:    "#7A5009",
    green:       "#2A7A4F",
    greenBg:     "#EBF5EF",
    greenText:   "#1A5435",
    blue:        "#1B6BB5",
    blueBg:      "#EBF3FC",
    blueText:    "#0E4A82",
    purple:      "#5C3FB0",
    purpleBg:    "#F0EBFC",
    purpleText:  "#3D2880",
    danger:      "#C0392B",
    dangerBg:    "#FDECEA",
  },
  dark: {
    bg:          "#111110",
    surface:     "#1C1B19",
    surfaceAlt:  "#252320",
    border:      "rgba(255,255,255,0.09)",
    borderStrong:"rgba(255,255,255,0.18)",
    text:        "#EFEDE8",
    textMid:     "#A09D98",
    textFaint:   "#6B6865",
    accent:      "#E8724A",
    accentBg:    "#2A1810",
    accentText:  "#F0956D",
    gold:        "#D4A030",
    goldBg:      "#251D0A",
    goldText:    "#EAC050",
    green:       "#3CA367",
    greenBg:     "#0E2018",
    greenText:   "#5EC286",
    blue:        "#4D9BE0",
    blueBg:      "#0C1D2E",
    blueText:    "#7BBFF0",
    purple:      "#8B6CE0",
    purpleBg:    "#1C1430",
    purpleText:  "#B09AF0",
    danger:      "#E05A4A",
    dangerBg:    "#2A1010",
  },
};

type Theme = typeof T.light;
type Screen = "landing" | "onboarding" | "analysis" | "roadmap" | "interview" | "dashboard";
type BadgeColor = "accent" | "gold" | "green" | "blue" | "purple" | "gray";
type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
type BtnSize = "sm" | "md" | "lg";
type GapPriority = "Critical" | "High" | "Medium" | "Low";
type TaskType = "learn" | "code" | "build";

type DividerProps = {
  t: Theme;
};

type LabelProps = {
  children: ReactNode;
  t: Theme;
};

type NavbarProps = {
  screen: Screen;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  t: Theme;
};

type LandingProps = {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  t: Theme;
};

type OnboardingProps = {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  t: Theme;
};

type AnalysisProps = {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  t: Theme;
};

type RoadmapProps = {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  t: Theme;
};

type InterviewProps = {
  t: Theme;
};

type DashboardProps = {
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
  t: Theme;
};

/* ─── Global styles injected once ─────────────────────────────────────────── */
const GlobalStyles = ({ t }: { t: Theme }) => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .cf-app { background: ${t.bg}; color: ${t.text}; min-height: 100vh; transition: background .25s, color .25s; }
    button { cursor: pointer; font-family: inherit; }
    input, textarea, select { font-family: inherit; }
    input[type="text"], input[type="email"], textarea {
      background: ${t.surfaceAlt}; color: ${t.text};
      border: 1px solid ${t.border}; border-radius: 8px;
      padding: 10px 14px; font-size: 14px; width: 100%; outline: none;
      transition: border-color .15s;
    }
    input[type="text"]:focus, input[type="email"]:focus, textarea:focus {
      border-color: ${t.accent};
    }
    input::placeholder { color: ${t.textFaint}; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${t.border}; border-radius: 3px; }

    /* Responsive layout helpers */
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    @media (max-width: 900px) {
      .grid-4 { grid-template-columns: repeat(2, 1fr); }
      .grid-3 { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 640px) {
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    }
    .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
    @media (max-width: 800px) { .hero-grid { grid-template-columns: 1fr; } .hero-visual { display: none; } }
    .two-col { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
    @media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
    .interview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 640px) { .interview-grid { grid-template-columns: 1fr; } }
    .scores-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 640px) { .scores-grid { grid-template-columns: 1fr; } }
    .onboard-roles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    @media (max-width: 500px) { .onboard-roles { grid-template-columns: 1fr; } }
    .page-pad { padding: 32px; max-width: 1080px; margin: 0 auto; }
    @media (max-width: 640px) { .page-pad { padding: 16px; } }
  `}</style>
);

/* ─── Primitive components ─────────────────────────────────────────────────── */
const Card = ({ children, style, onClick }: {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) => (
  <div style={{
    background: "var(--cf-surface)",
    border: "1px solid var(--cf-border)",
    borderRadius: 12, padding: 20,
    ...style,
  }} onClick={onClick}>{children}</div>
);

const Badge = ({ children, color = "accent", t, style }: {
  children: ReactNode;
  color?: BadgeColor;
  t: Theme;
  style?: CSSProperties;
}) => {
  const map: Record<BadgeColor, { bg: string; color: string }> = {
    accent: { bg: t.accentBg, color: t.accentText },
    gold:   { bg: t.goldBg,   color: t.goldText },
    green:  { bg: t.greenBg,  color: t.greenText },
    blue:   { bg: t.blueBg,   color: t.blueText },
    purple: { bg: t.purpleBg, color: t.purpleText },
    gray:   { bg: t.surfaceAlt, color: t.textMid },
  };
  const s = map[color] || map.gray;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: .3,
      textTransform: "uppercase",
      ...style,
    }}>{children}</span>
  );
};

const Pill = ({ children, selected, t, onClick, color }: {
  children: ReactNode;
  selected: boolean;
  t: Theme;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  color?: string;
}) => (
  <button onClick={onClick} style={{
    padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500,
    border: `1.5px solid ${selected ? (color || t.accent) : t.border}`,
    background: selected ? (color ? color + "18" : t.accentBg) : "transparent",
    color: selected ? (color || t.accentText) : t.textMid,
    transition: "all .15s",
  }}>{children}</button>
);

const Btn = ({ children, onClick, variant = "primary", t, icon, size = "md", style, sx, disabled }: {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: BtnVariant;
  t: Theme;
  icon?: ReactNode;
  size?: BtnSize;
  style?: CSSProperties;
  sx?: CSSProperties;
  disabled?: boolean;
}) => {
  const [hov, setHov] = useState(false);
  const pad = size === "sm" ? "8px 16px" : size === "lg" ? "14px 28px" : "11px 22px";
  const fs  = size === "sm" ? 13 : size === "lg" ? 16 : 14;
  const styles: Record<BtnVariant, CSSProperties> = {
    primary:   { background: hov ? t.accentText : t.accent, color: "#fff", border: "none" },
    secondary: { background: hov ? t.surfaceAlt : "transparent", color: t.text, border: `1px solid ${t.borderStrong}` },
    ghost:     { background: hov ? t.surfaceAlt : "transparent", color: t.textMid, border: "none" },
    danger:    { background: hov ? t.danger : t.dangerBg, color: hov ? "#fff" : t.danger, border: `1px solid ${t.danger}44` },
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: pad, borderRadius: 8, fontSize: fs, fontWeight: 500,
        transition: "all .15s", opacity: disabled ? .5 : 1,
        ...styles[variant], ...sx, ...style,
      }}
    >
      {icon && <span style={{ fontSize: fs }}>{icon}</span>}
      {children}
    </button>
  );
};

const ProgressBar = ({ value, color, bg, h = 6 }: {
  value: number;
  color: string;
  bg: string;
  h?: number;
}) => (
  <div style={{ background: bg, borderRadius: 99, height: h, overflow: "hidden" }}>
    <div style={{ width: `${Math.min(100, value)}%`, height: "100%", background: color, borderRadius: 99, transition: "width .8s cubic-bezier(.4,0,.2,1)" }} />
  </div>
);

const Divider = ({ t }: { t: Theme }) => (
  <div style={{ height: 1, background: t.border, margin: "20px 0" }} />
);

const Label = ({ children, t }: { children: ReactNode; t: Theme }) => (
  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.textMid, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>
    {children}
  </label>
);

/* ─── Navbar ───────────────────────────────────────────────────────────────── */
const Navbar = ({ screen, setScreen, dark, setDark, t }: {
  screen: Screen;
  setScreen: Dispatch<SetStateAction<Screen>>;
  dark: boolean;
  setDark: Dispatch<SetStateAction<boolean>>;
  t: Theme;
}) => {
  const [open, setOpen] = useState(false);
  const navLinks: { id: Screen; label: string }[] = [
    { id: "analysis",  label: "Career AI" },
    { id: "roadmap",   label: "Roadmap" },
    { id: "interview", label: "Mock Interview" },
    { id: "dashboard", label: "Dashboard" },
  ];
  return (
    <nav style={{
      background: t.surface, borderBottom: `1px solid ${t.border}`,
      position: "sticky", top: 0, zIndex: 200,
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setScreen("landing")} style={{ display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 14 }}>⚡</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: t.text }}>
            CareerForge<span style={{ color: t.accent }}>AI</span>
          </span>
        </button>
        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="desktop-nav">
          <style>{`@media(max-width:700px){.desktop-nav{display:none!important}}.mobile-nav-btn{display:none}@media(max-width:700px){.mobile-nav-btn{display:flex!important}}`}</style>
          {navLinks.map(l => (
            <button key={l.id} onClick={() => setScreen(l.id)} style={{
              padding: "6px 13px", borderRadius: 7, fontSize: 13, fontWeight: 500,
              background: screen === l.id ? t.accentBg : "transparent",
              color: screen === l.id ? t.accentText : t.textMid,
              border: "none", transition: "all .15s",
            }}>{l.label}</button>
          ))}
          <div style={{ width: 1, height: 20, background: t.border, margin: "0 8px" }} />
          <button onClick={() => setDark(!dark)} style={{
            width: 32, height: 32, borderRadius: 7, border: `1px solid ${t.border}`,
            background: "transparent", color: t.textMid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
          }}>{dark ? "☀" : "◐"}</button>
        </div>
        {/* Mobile hamburger */}
        <button className="mobile-nav-btn" onClick={() => setOpen(!open)} style={{
          display: "none", width: 32, height: 32, borderRadius: 7, border: `1px solid ${t.border}`,
          background: "transparent", color: t.textMid, alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>☰</button>
      </div>
      {/* Mobile dropdown */}
      {open && (
        <div style={{ background: t.surface, borderTop: `1px solid ${t.border}`, padding: "8px 16px 12px" }}>
          {navLinks.map(l => (
            <button key={l.id} onClick={() => { setScreen(l.id); setOpen(false); }} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "10px 12px", borderRadius: 7, fontSize: 14, fontWeight: 500,
              background: screen === l.id ? t.accentBg : "transparent",
              color: screen === l.id ? t.accentText : t.text,
              border: "none", marginBottom: 2,
            }}>{l.label}</button>
          ))}
          <div style={{ marginTop: 8 }}>
            <button onClick={() => setDark(!dark)} style={{
              padding: "8px 12px", borderRadius: 7, border: `1px solid ${t.border}`,
              background: "transparent", color: t.textMid, fontSize: 13, fontWeight: 500,
            }}>{dark ? "Light mode" : "Dark mode"}</button>
          </div>
        </div>
      )}
    </nav>
  );
};

/* ─── Landing ──────────────────────────────────────────────────────────────── */
const Landing = ({ setScreen, t }: {
  setScreen: Dispatch<SetStateAction<Screen>>;
  t: Theme;
}) => {
  const features = [
    { icon: "🧠", title: "Career analyzer", desc: "Upload your resume for instant AI-powered career path recommendations with real salary data.", color: t.accent },
    { icon: "🎯", title: "Skill gap detector", desc: "Know exactly what's missing between your current profile and your target role.", color: t.gold },
    { icon: "🗺", title: "Personalized roadmap", desc: "30 / 90 / 180-day learning plans built around your schedule and learning style.", color: t.green },
    { icon: "🎤", title: "Mock interviews", desc: "Practice HR and technical rounds with AI feedback and scoring after every session.", color: t.blue },
    { icon: "🌐", title: "Regional language support", desc: "Hindi, Tamil, Marathi, Punjabi and more — learn and practice in your mother tongue.", color: t.purple },
    { icon: "📊", title: "Progress dashboard", desc: "Streaks, skill growth charts, and a placement-readiness score updated daily.", color: t.accent },
  ];
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ padding: "64px 32px 56px", maxWidth: 1080, margin: "0 auto" }}>
        <div className="hero-grid">
          <div>
            <Badge color="accent" t={t}>India's #1 AI career platform</Badge>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: t.text, lineHeight: 1.15, margin: "16px 0 18px" }}>
              Your career,<br />
              <span style={{ color: t.accent }}>powered by AI.</span>
            </h1>
            <p style={{ fontSize: 17, color: t.textMid, lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
              From resume to placement — CareerForge AI builds your personalised learning roadmap, detects skill gaps, and prepares you for interviews in your own language.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn t={t} size="lg" onClick={() => setScreen("onboarding")} icon="→">Start for free</Btn>
              <Btn t={t} size="lg" variant="secondary" onClick={() => setScreen("dashboard")} icon="📊">View demo</Btn>
            </div>
            {/* Stats */}
            <div style={{ display: "flex", gap: 36, marginTop: 40, flexWrap: "wrap" }}>
              {[["50K+","Students placed"],["92%","Placement rate"],["8","Languages"],["4.9","Student rating"]].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: t.text }}>{n}</div>
                  <div style={{ fontSize: 12, color: t.textFaint }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Hero card – hidden on mobile */}
          <div className="hero-visual">
            <Card style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: t.accentBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧠</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Analysis complete</div>
                  <div style={{ fontSize: 12, color: t.textFaint }}>Rahul Sharma · B.Tech CSE · 3rd Year</div>
                </div>
                <Badge color="green" t={t} style={{ marginLeft: "auto" }}>Ready</Badge>
              </div>
              {[
                { label: "Python", val: 75, color: t.accent },
                { label: "Machine learning", val: 45, color: t.gold },
                { label: "SQL", val: 30, color: t.blue },
                { label: "Communication", val: 60, color: t.green },
              ].map(s => (
                <div key={s.label} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: t.text }}>{s.label}</span>
                    <span style={{ fontSize: 12, color: s.color, fontWeight: 600, fontFamily: "monospace" }}>{s.val}%</span>
                  </div>
                  <ProgressBar value={s.val} color={s.color} bg={t.surfaceAlt} />
                </div>
              ))}
              <div style={{ marginTop: 18, background: t.accentBg, borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: t.accentText, marginBottom: 4, textTransform: "uppercase", letterSpacing: .3 }}>Top career match</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: t.text }}>AI/ML Engineer</div>
                <div style={{ fontSize: 12, color: t.textMid }}>₹12–28 LPA · Very high demand · 94% match</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 32px 64px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 8 }}>Everything you need to get placed</h2>
          <p style={{ fontSize: 15, color: t.textMid }}>One platform. Six AI-powered tools. No confusion.</p>
        </div>
        <div className="grid-3">
          {features.map((f, i) => (
            <Card key={i} style={{ transition: "border-color .2s" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: f.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 7 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: t.textMid, lineHeight: 1.6 }}>{f.desc}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section style={{ padding: "0 32px 64px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", background: t.accent, borderRadius: 16, padding: "44px 36px", textAlign: "center" }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Ready to forge your career?</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", marginBottom: 28 }}>Join 50,000+ students who found their path with AI</p>
          <Btn t={t} size="lg" onClick={() => setScreen("onboarding")}
            sx={{ background: "#fff", color: t.accent }} icon="→"
            style={{ background: "#fff", color: t.accent, border: "none" }}>
            Get started — it's free
          </Btn>
        </div>
      </section>
    </div>
  );
};

/* ─── Onboarding ───────────────────────────────────────────────────────────── */
type OnboardingForm = {
  name: string;
  year: string;
  lang: string;
  role: string;
  skills: string[];
};

type OnboardingErrors = Partial<Record<"name" | "year" | "role", string>>;

const Onboarding = ({ setScreen, t }: {
  setScreen: Dispatch<SetStateAction<Screen>>;
  t: Theme;
}) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingForm>({ name: "", year: "", lang: "English", role: "", skills: [] });
  const [uploaded, setUploaded] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<OnboardingErrors>({});

  const years = ["1st year","2nd year","3rd year","4th year","Graduate"];
  const langs = ["English","Hindi","Tamil","Marathi","Punjabi","Bengali","Telugu"];
  const roles = ["Software engineer","Data scientist","AI/ML engineer","Product manager","Full stack developer","Cybersecurity analyst"];
  const skills = ["Python","JavaScript","React","Node.js","SQL","Machine learning","Data analysis","Communication","Leadership","Git"];

  const validate = () => {
    const e: OnboardingErrors = {};
    if (step === 0 && !form.name.trim()) e.name = "Please enter your name";
    if (step === 0 && !form.year) e.year = "Please select your year";
    if (step === 2 && !form.role) e.role = "Please select or type a role";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step < 3) setStep(s => s + 1);
    else setScreen("analysis");
  };

  const stepLabels = ["Profile","Resume","Target role","Skills"];

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 32, gap: 0 }}>
          {stepLabels.map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: i < step ? t.green : i === step ? t.accent : t.surfaceAlt,
                  fontSize: 12, fontWeight: 600,
                  color: i <= step ? "#fff" : t.textFaint,
                  border: `2px solid ${i < step ? t.green : i === step ? t.accent : t.border}`,
                  transition: "all .3s",
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 10, color: i === step ? t.accent : t.textFaint, fontWeight: i === step ? 600 : 400, whiteSpace: "nowrap" }}>{l}</span>
              </div>
              {i < 3 && <div style={{ flex: 1, height: 2, background: i < step ? t.green : t.border, margin: "0 4px", marginBottom: 18, transition: "background .3s" }} />}
            </div>
          ))}
        </div>

        <Card style={{ padding: 28 }}>
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 6 }}>Let's get to know you</h2>
              <p style={{ fontSize: 13, color: t.textMid, marginBottom: 24 }}>Helps our AI personalise your experience</p>
              <div style={{ marginBottom: 18 }}>
                <Label t={t}>Full name</Label>
                <input type="text" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors({}); }} placeholder="e.g. Priya Sharma" />
                {errors.name && <div style={{ fontSize: 12, color: t.danger, marginTop: 4 }}>{errors.name}</div>}
              </div>
              <div style={{ marginBottom: 18 }}>
                <Label t={t}>College year</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {years.map(y => <Pill key={y} t={t} selected={form.year === y} onClick={() => { setForm({ ...form, year: y }); setErrors({}); }}>{y}</Pill>)}
                </div>
                {errors.year && <div style={{ fontSize: 12, color: t.danger, marginTop: 6 }}>{errors.year}</div>}
              </div>
              <div>
                <Label t={t}>Preferred language</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {langs.map(l => <Pill key={l} t={t} selected={form.lang === l} color={t.purple} onClick={() => setForm({ ...form, lang: l })}>{l}</Pill>)}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 6 }}>Upload your resume</h2>
              <p style={{ fontSize: 13, color: t.textMid, marginBottom: 24 }}>AI extracts your skills and experience automatically</p>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={() => { setDragging(false); setUploaded(true); }}
                onClick={() => setUploaded(v => !v)}
                style={{
                  border: `2px dashed ${dragging ? t.accent : uploaded ? t.green : t.border}`,
                  borderRadius: 12, padding: "40px 20px", textAlign: "center",
                  background: dragging ? t.accentBg : uploaded ? t.greenBg : t.surfaceAlt,
                  cursor: "pointer", transition: "all .2s", marginBottom: 20,
                }}
              >
                {uploaded ? (
                  <>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.green }}>resume_priya_sharma.pdf</div>
                    <div style={{ fontSize: 12, color: t.textFaint }}>142 KB · Click to remove</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Drag and drop your resume</div>
                    <div style={{ fontSize: 12, color: t.textFaint, marginTop: 4 }}>PDF or DOCX, up to 5 MB</div>
                  </>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: t.border }} />
                <span style={{ fontSize: 12, color: t.textFaint }}>or</span>
                <div style={{ flex: 1, height: 1, background: t.border }} />
              </div>
              <Btn t={t} variant="secondary" onClick={() => setUploaded(true)} style={{ width: "100%", justifyContent: "center" }}>Fill manually instead</Btn>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 6 }}>What's your target role?</h2>
              <p style={{ fontSize: 13, color: t.textMid, marginBottom: 24 }}>We'll build the exact path to get you there</p>
              <div className="onboard-roles" style={{ marginBottom: 16 }}>
                {roles.map(r => (
                  <button key={r} onClick={() => { setForm({ ...form, role: r }); setErrors({}); }} style={{
                    padding: "12px 14px", borderRadius: 9, textAlign: "left",
                    border: `1.5px solid ${form.role === r ? t.accent : t.border}`,
                    background: form.role === r ? t.accentBg : "transparent",
                    color: form.role === r ? t.accentText : t.text,
                    fontSize: 13, fontWeight: form.role === r ? 600 : 400,
                    transition: "all .15s",
                  }}>{r}</button>
                ))}
              </div>
              <div>
                <Label t={t}>Or type your own role</Label>
                <input type="text" value={form.role} onChange={e => { setForm({ ...form, role: e.target.value }); setErrors({}); }} placeholder="e.g. Blockchain developer" />
                {errors.role && <div style={{ fontSize: 12, color: t.danger, marginTop: 4 }}>{errors.role}</div>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 6 }}>Rate your skills</h2>
              <p style={{ fontSize: 13, color: t.textMid, marginBottom: 24 }}>Select everything you're comfortable with</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {skills.map(s => {
                  const sel = form.skills.includes(s);
                  return (
                    <Pill key={s} t={t} selected={sel} color={t.green} onClick={() => setForm({ ...form, skills: sel ? form.skills.filter(x => x !== s) : [...form.skills, s] })}>
                      {sel ? "✓ " : ""}{s}
                    </Pill>
                  );
                })}
              </div>
              <div style={{ background: t.goldBg, borderRadius: 10, padding: 14, border: `1px solid ${t.gold}33` }}>
                <div style={{ fontSize: 12, color: t.goldText, fontWeight: 600, marginBottom: 3 }}>💡 AI will detect more skills from your resume</div>
                <div style={{ fontSize: 12, color: t.textMid }}>Selected {form.skills.length} of {skills.length} skills</div>
              </div>
            </div>
          )}

          <Divider t={t} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {step > 0
              ? <Btn t={t} variant="secondary" onClick={() => setStep(s => s - 1)} icon="←">Back</Btn>
              : <div />
            }
            <Btn t={t} onClick={next} icon={step < 3 ? "→" : "🧠"}>
              {step < 3 ? "Continue" : "Analyze my profile"}
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ─── Analysis ─────────────────────────────────────────────────────────────── */
const Analysis = ({ setScreen, t }: {
  setScreen: Dispatch<SetStateAction<Screen>>;
  t: Theme;
}) => {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview",  label: "Overview" },
    { id: "gaps",      label: "Skill gaps" },
    { id: "careers",   label: "Career paths" },
    { id: "strengths", label: "Strengths" },
  ];
  const gaps: { skill: string; priority: GapPriority; reason: string; color: string }[] = [
    { skill: "Python (advanced)", priority: "Critical", reason: "Required for 9/10 ML roles", color: t.danger },
    { skill: "SQL & databases", priority: "High", reason: "Data querying is a baseline requirement", color: t.accent },
    { skill: "Git & version control", priority: "High", reason: "Used in every team environment", color: t.accent },
    { skill: "ML frameworks (TF / PyTorch)", priority: "Medium", reason: "For specialised ML positions", color: t.gold },
    { skill: "Cloud basics (AWS / GCP)", priority: "Medium", reason: "Modern deployment expectations", color: t.blue },
    { skill: "System design basics", priority: "Low", reason: "Senior-level but smart to start early", color: t.green },
  ];
  const careers = [
    { title: "AI/ML Engineer", match: 94, salary: "₹12–28 LPA", demand: "Very high", icon: "🧠", color: t.accent },
    { title: "Data scientist", match: 87, salary: "₹10–22 LPA", demand: "High", icon: "📊", color: t.blue },
    { title: "Full stack developer", match: 72, salary: "₹8–18 LPA", demand: "High", icon: "⚡", color: t.green },
  ];
  const priorityColor: Record<GapPriority, string> = { Critical: t.danger, High: t.accent, Medium: t.gold, Low: t.green };
  const priorityBadge: Record<GapPriority, BadgeColor> = { Critical: "accent", High: "accent", Medium: "gold", Low: "green" };

  return (
    <div className="page-pad">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 4 }}>Career analysis</h1>
          <p style={{ fontSize: 13, color: t.textMid }}>Priya Sharma · B.Tech CSE · 3rd Year · Resume analyzed</p>
        </div>
        <Btn t={t} onClick={() => setScreen("roadmap")} icon="🗺">Generate roadmap</Btn>
      </div>

      {/* Score row */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: "Career match", val: "94%", icon: "🎯", color: t.accent, bg: t.accentBg },
          { label: "Skill score", val: "62/100", icon: "⭐", color: t.gold, bg: t.goldBg },
          { label: "Gaps to fill", val: "6 skills", icon: "⚡", color: t.blue, bg: t.blueBg },
          { label: "Market demand", val: "Very high", icon: "📈", color: t.green, bg: t.greenBg },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: 16, border: `1px solid ${s.color}22` }}>
            <div style={{ fontSize: 11, color: t.textMid, marginBottom: 4, textTransform: "uppercase", letterSpacing: .3 }}>{s.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, background: t.surfaceAlt, padding: 4, borderRadius: 10, width: "fit-content", marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            padding: "7px 16px", borderRadius: 7, fontSize: 13, fontWeight: 500,
            background: tab === tb.id ? t.surface : "transparent",
            color: tab === tb.id ? t.text : t.textMid,
            border: tab === tb.id ? `1px solid ${t.border}` : "none",
            transition: "all .15s",
          }}>{tb.label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid-2">
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 18 }}>Skill breakdown</h3>
            {[
              { label: "Python", val: 55, color: t.accent },
              { label: "ML knowledge", val: 30, color: t.purple },
              { label: "JavaScript / React", val: 80, color: t.blue },
              { label: "SQL", val: 25, color: t.gold },
              { label: "Communication", val: 70, color: t.green },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: t.text }}>{s.label}</span>
                  <span style={{ fontSize: 12, color: s.color, fontWeight: 600, fontFamily: "monospace" }}>{s.val}%</span>
                </div>
                <ProgressBar value={s.val} color={s.color} bg={t.surfaceAlt} />
              </div>
            ))}
          </Card>
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 18 }}>AI recommendation</h3>
            <div style={{ background: t.accentBg, borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: t.accentText, textTransform: "uppercase", letterSpacing: .3, marginBottom: 4 }}>Best career match</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 4 }}>AI/ML Engineer</div>
              <div style={{ fontSize: 12, color: t.textMid }}>94% match based on your skills, interests, and market demand</div>
            </div>
            <p style={{ fontSize: 13, color: t.textMid, lineHeight: 1.7, marginBottom: 16 }}>
              You have a strong foundation in React and JavaScript. With focused effort on Python, ML frameworks, and SQL over the next 6 months, you can transition into an AI/ML role at top tech companies.
            </p>
            <Btn t={t} size="sm" onClick={() => setScreen("roadmap")} icon="🗺">Create my roadmap</Btn>
          </Card>
        </div>
      )}

      {tab === "gaps" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {gaps.map((g, i) => (
            <Card key={i} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: priorityColor[g.priority] + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🔒</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{g.skill}</div>
                    <div style={{ fontSize: 12, color: t.textMid }}>{g.reason}</div>
                  </div>
                </div>
                <Badge color={priorityBadge[g.priority]} t={t}>{g.priority}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "careers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {careers.map((c, i) => (
            <Card key={i} style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: c.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{ fontSize: 16, fontWeight: 600, color: t.text }}>{c.title}</span>
                    <Badge color={i === 0 ? "accent" : "gray"} t={t}>{c.match}% match</Badge>
                    {i === 0 && <Badge color="gold" t={t}>Recommended</Badge>}
                  </div>
                  <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 12 }}>
                    {[["Salary range", c.salary, t.text], ["Market demand", c.demand, t.green], ["Time to ready", ["6 months","8 months","4 months"][i], t.text]].map(([l, v, vc]) => (
                      <div key={l}>
                        <div style={{ fontSize: 11, color: t.textFaint }}>{l}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: vc }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <ProgressBar value={c.match} color={c.color} bg={t.surfaceAlt} h={5} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "strengths" && (
        <div className="grid-2">
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 16 }}>Current strengths</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["JavaScript","React","Communication","Problem solving","HTML/CSS"].map(s => (
                <span key={s} style={{ background: t.greenBg, color: t.greenText, padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500 }}>✓ {s}</span>
              ))}
            </div>
          </Card>
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 16 }}>Extracted from resume</h3>
            <p style={{ fontSize: 13, color: t.textMid, lineHeight: 1.7, marginBottom: 14 }}>
              AI detected 2 internships, 3 projects (React e-commerce app, portfolio site, Node.js API) and proficiency in English and Hindi.
            </p>
            <div style={{ background: t.surfaceAlt, borderRadius: 9, padding: 12 }}>
              {[["Projects found","3"], ["Internships","2"], ["Certifications","1"], ["Languages","English, Hindi"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: t.textMid }}>{k}</span>
                  <span style={{ color: t.text, fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

/* ─── Roadmap ───────────────────────────────────────────────────────────────── */
const Roadmap = ({ setScreen, t }: {
  setScreen: Dispatch<SetStateAction<Screen>>;
  t: Theme;
}) => {
  const [timeline, setTimeline] = useState("30");
  const [expanded, setExpanded] = useState(0);

  const weeks: { range: string; title: string; status: "current" | "next" | "locked"; tasks: { day: string; label: string; type: TaskType; done: boolean }[] }[] = [
    {
      range: "Week 1–2", title: "Python foundations", status: "current",
      tasks: [
        { day: "Mon", label: "Python syntax, variables, loops", type: "learn", done: true },
        { day: "Tue", label: "Functions and OOP basics", type: "learn", done: true },
        { day: "Wed", label: "Practice: 10 LeetCode Easy in Python", type: "code", done: true },
        { day: "Thu", label: "File I/O and error handling", type: "learn", done: false },
        { day: "Fri", label: "Build: Number guessing game", type: "build", done: false },
        { day: "Sat", label: "Review + Git basics", type: "learn", done: false },
      ],
    },
    {
      range: "Week 3–4", title: "Data & SQL basics", status: "next",
      tasks: [
        { day: "Mon", label: "SQL SELECT, WHERE, JOIN", type: "learn", done: false },
        { day: "Tue", label: "NumPy & Pandas fundamentals", type: "learn", done: false },
        { day: "Wed", label: "Practice: SQL on real datasets", type: "code", done: false },
        { day: "Thu", label: "Data cleaning with Pandas", type: "learn", done: false },
        { day: "Fri", label: "Build: Mini data analysis project", type: "build", done: false },
      ],
    },
    {
      range: "Week 5–6", title: "ML fundamentals", status: "locked",
      tasks: [
        { day: "Mon", label: "Intro to ML: supervised learning", type: "learn", done: false },
        { day: "Tue", label: "Scikit-learn regression models", type: "code", done: false },
        { day: "Thu", label: "Build: House price predictor", type: "build", done: false },
      ],
    },
  ];

  const typeStyle: Record<TaskType, { bg: string; color: string; label: string }> = {
    learn: { bg: t.blueBg,   color: t.blueText,   label: "Learn" },
    code:  { bg: t.accentBg, color: t.accentText,  label: "Code" },
    build: { bg: t.greenBg,  color: t.greenText,   label: "Build" },
  };

  return (
    <div className="page-pad">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 4 }}>Your roadmap</h1>
          <p style={{ fontSize: 13, color: t.textMid }}>AI/ML Engineer path · Generated by CareerForge AI</p>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["30","90","180"].map(d => (
            <button key={d} onClick={() => setTimeline(d)} style={{
              padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
              border: `1px solid ${timeline === d ? t.accent : t.border}`,
              background: timeline === d ? t.accentBg : "transparent",
              color: timeline === d ? t.accentText : t.textMid, transition: "all .15s",
            }}>{d}-day plan</button>
          ))}
        </div>
      </div>

      {/* Progress summary */}
      <Card style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Overall progress</span>
          <span style={{ fontSize: 12, color: t.accent, fontWeight: 600, fontFamily: "monospace" }}>Day 9 of {timeline}</span>
        </div>
        <ProgressBar value={timeline === "30" ? 30 : timeline === "90" ? 10 : 5} color={t.accent} bg={t.surfaceAlt} h={8} />
        <div style={{ display: "flex", gap: 32, marginTop: 14, flexWrap: "wrap" }}>
          {[["Tasks done","18/60"], ["Current streak","🔥 9 days"], ["Skills completed","2/8"]].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 11, color: t.textFaint }}>{l}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Week cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {weeks.map((w, wi) => (
          <Card key={wi} style={{ padding: 0, overflow: "hidden" }}>
            <button
              onClick={() => setExpanded(expanded === wi ? -1 : wi)}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", background: w.status === "current" ? t.accentBg : "transparent",
                border: "none", cursor: "pointer", gap: 12, flexWrap: "wrap", textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                  background: w.status === "current" ? t.accent : w.status === "next" ? t.gold : t.border,
                  boxShadow: w.status === "current" ? `0 0 0 3px ${t.accent}30` : "none",
                }} />
                <div>
                  <div style={{ fontSize: 11, color: t.textFaint }}>{w.range}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{w.title}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {w.status === "locked" && <span style={{ fontSize: 12, color: t.textFaint }}>🔒</span>}
                <Badge color={w.status === "current" ? "accent" : w.status === "next" ? "gold" : "gray"} t={t}>
                  {w.status === "current" ? "In progress" : w.status === "next" ? "Next up" : "Locked"}
                </Badge>
                <span style={{ color: t.textFaint, fontSize: 16 }}>{expanded === wi ? "−" : "+"}</span>
              </div>
            </button>

            {expanded === wi && w.status !== "locked" && (
              <div style={{ padding: "0 20px 18px", borderTop: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 14 }}>
                  {w.tasks.map((task, ti) => (
                    <div key={ti} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                      borderRadius: 9, background: task.done ? t.greenBg : t.surfaceAlt,
                      border: `1px solid ${task.done ? t.green + "44" : t.border}`,
                      flexWrap: "wrap",
                    }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                        background: task.done ? t.green : t.surface,
                        border: `2px solid ${task.done ? t.green : t.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
                      }}>{task.done ? "✓" : ""}</div>
                      <span style={{ fontSize: 11, color: t.textFaint, width: 28 }}>{task.day}</span>
                      <span style={{ fontSize: 13, color: task.done ? t.textMid : t.text, flex: 1, textDecoration: task.done ? "line-through" : "none", minWidth: 120 }}>{task.label}</span>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: typeStyle[task.type].bg, color: typeStyle[task.type].color }}>{typeStyle[task.type].label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 28 }}>
        <Btn t={t} size="lg" onClick={() => setScreen("interview")} icon="🎤">Ready? Take a mock interview</Btn>
      </div>
    </div>
  );
};

/* ─── Mock Interview ───────────────────────────────────────────────────────── */
type ChatMessage = { role: "ai" | "user"; text: string };

const Interview = ({ t }: { t: Theme }) => {
  const [phase, setPhase] = useState("setup");
  const [round, setRound] = useState("HR");
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [qIdx, setQIdx] = useState(0);
  const chatRef = useRef<HTMLDivElement | null>(null);

  const hrQs = [
    "Tell me about yourself and your career goals.",
    "Why do you want to become an AI/ML Engineer?",
    "Describe a challenging project and how you overcame it.",
    "Where do you see yourself in 5 years?",
    "What is your biggest weakness?",
  ];
  const techQs = [
    "Explain the difference between supervised and unsupervised learning.",
    "What is overfitting and how do you prevent it?",
    "Write a function to reverse a linked list.",
    "Explain the bias-variance tradeoff.",
    "What are the differences between L1 and L2 regularisation?",
  ];
  const questions = round === "HR" ? hrQs : techQs;

  const startInterview = () => {
    setMsgs([{ role: "ai", text: `Welcome to your ${round} round. I'm your AI interviewer.\n\n${questions[0]}` }]);
    setQIdx(0);
    setPhase("interview");
  };

  const send = () => {
    if (!input.trim()) return;
    const updated: ChatMessage[] = [...msgs, { role: "user", text: input }];
    setInput("");
    setMsgs(updated);
    const next = qIdx + 1;
    if (next < questions.length) {
      setTimeout(() => {
        setMsgs(m => [...m, { role: "ai", text: `Good answer. Let me continue.\n\n${questions[next]}` }]);
        setQIdx(next);
      }, 700);
    } else {
      setTimeout(() => {
        setMsgs(m => [...m, { role: "ai", text: "Great work! That was the final question. Generating your performance report now…" }]);
        setTimeout(() => setPhase("results"), 1200);
      }, 700);
    }
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs]);

  const scores = [
    { label: "Communication", score: 8.2, color: t.accent },
    { label: "Technical accuracy", score: 7.5, color: t.blue },
    { label: "Confidence", score: 8.8, color: t.green },
    { label: "Structure & clarity", score: 7.9, color: t.gold },
  ];

  return (
    <div className="page-pad">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 4 }}>AI mock interview</h1>
      <p style={{ fontSize: 13, color: t.textMid, marginBottom: 28 }}>Practice makes placement — realistic, scored AI interviews</p>

      {phase === "setup" && (
        <div>
          <div className="interview-grid" style={{ marginBottom: 20 }}>
            {["HR","Technical"].map(r => (
              <Card key={r} onClick={() => setRound(r)} style={{
                cursor: "pointer", textAlign: "center", padding: 28,
                border: `2px solid ${round === r ? t.accent : t.border}`,
                background: round === r ? t.accentBg : t.surface,
                transition: "all .15s",
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{r === "HR" ? "🎤" : "🧠"}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 8 }}>{r} round</div>
                <div style={{ fontSize: 13, color: t.textMid, marginBottom: 14, lineHeight: 1.5 }}>
                  {r === "HR" ? "Behavioural and situational questions" : "DSA, ML concepts, system design"}
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                  <Badge color="gray" t={t}>5 questions</Badge>
                  <Badge color="gray" t={t}>~15 min</Badge>
                </div>
              </Card>
            ))}
          </div>
          <Card style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 10 }}>Tips for success</div>
            <div className="grid-2" style={{ gap: 8 }}>
              {["Use the STAR format for HR answers","Write clearly and completely","Reference your own projects","Don't abbreviate your answers"].map(tip => (
                <div key={tip} style={{ fontSize: 13, color: t.textMid, display: "flex", gap: 8 }}>
                  <span style={{ color: t.green }}>✓</span>{tip}
                </div>
              ))}
            </div>
          </Card>
          <Btn t={t} size="lg" onClick={startInterview} icon="🎤">Start {round} round</Btn>
        </div>
      )}

      {phase === "interview" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: t.textMid, flexShrink: 0 }}>Question {qIdx + 1} of {questions.length}</span>
            <div style={{ flex: 1 }}><ProgressBar value={((qIdx + 1) / questions.length) * 100} color={t.accent} bg={t.surfaceAlt} h={5} /></div>
            <span style={{ fontSize: 12, color: t.accent, fontWeight: 600, fontFamily: "monospace", flexShrink: 0 }}>{Math.round(((qIdx + 1) / questions.length) * 100)}%</span>
          </div>
          <Card style={{ padding: 0, display: "flex", flexDirection: "column", height: 460 }}>
            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: m.role === "ai" ? t.accentBg : t.blueBg,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                  }}>{m.role === "ai" ? "🧠" : "👤"}</div>
                  <div style={{
                    maxWidth: "75%", padding: "12px 16px", borderRadius: 12, fontSize: 13, lineHeight: 1.6,
                    background: m.role === "ai" ? t.surfaceAlt : t.accent,
                    color: m.role === "ai" ? t.text : "#fff",
                    borderBottomLeftRadius: m.role === "ai" ? 4 : 12,
                    borderBottomRightRadius: m.role === "user" ? 4 : 12,
                    whiteSpace: "pre-wrap",
                  }}>{m.text}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 16px", borderTop: `1px solid ${t.border}`, display: "flex", gap: 8 }}>
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                placeholder="Type your answer and press Enter…"
                style={{ flex: 1, borderRadius: 8, padding: "10px 14px", fontSize: 13 }}
              />
              <button onClick={send} style={{
                width: 40, height: 40, borderRadius: 8, background: t.accent, border: "none",
                color: "#fff", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
              }}>→</button>
            </div>
          </Card>
        </div>
      )}

      {phase === "results" && (
        <div>
          <Card style={{ textAlign: "center", padding: 36, marginBottom: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 8 }}>Interview complete!</h2>
            <div style={{ fontSize: 44, fontWeight: 700, color: t.accent }}>8.1<span style={{ fontSize: 20, color: t.textMid }}>/10</span></div>
            <div style={{ fontSize: 13, color: t.textMid }}>Overall score · {round} round</div>
          </Card>
          <div className="scores-grid" style={{ marginBottom: 20 }}>
            {scores.map((s, i) => (
              <Card key={i} style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{s.label}</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.score}</span>
                </div>
                <ProgressBar value={s.score * 10} color={s.color} bg={t.surfaceAlt} h={5} />
              </Card>
            ))}
          </div>
          <Card style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 14 }}>Improvement tips</h3>
            {[
              "Use specific examples from your projects when answering behavioural questions.",
              "Expand on ML concepts — mention algorithm names and tradeoffs.",
              "Practice the STAR method (Situation, Task, Action, Result) for HR rounds.",
            ].map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: t.accentBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: t.accent, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 13, color: t.textMid, lineHeight: 1.6 }}>{tip}</span>
              </div>
            ))}
          </Card>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn t={t} variant="secondary" onClick={() => { setPhase("setup"); setMsgs([]); }}>Retry interview</Btn>
            <Btn t={t} icon="📊">View full report</Btn>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Dashboard ─────────────────────────────────────────────────────────────── */
const Dashboard = ({ setScreen, t }: {
  setScreen: Dispatch<SetStateAction<Screen>>;
  t: Theme;
}) => {
  const [done, setDone] = useState([true, true, false, false]);
  const today: { label: string; type: TaskType; time: string }[] = [
    { label: "Watch: Python OOP tutorial (45 min)", type: "learn", time: "45 min" },
    { label: "Solve 5 LeetCode Easy in Python", type: "code", time: "30 min" },
    { label: "Read: ML basics — regression", type: "learn", time: "20 min" },
    { label: "Build: Add authentication to your project", type: "build", time: "60 min" },
  ];
  const skills = [
    { name: "Python", val: 55, target: 90, color: t.accent },
    { name: "SQL", val: 30, target: 75, color: t.blue },
    { name: "ML basics", val: 25, target: 80, color: t.purple },
    { name: "Git", val: 60, target: 85, color: t.green },
    { name: "Communication", val: 70, target: 85, color: t.gold },
  ];
  const typeStyle: Record<TaskType, { bg: string; color: string; label: string }> = {
    learn: { bg: t.blueBg, color: t.blueText, label: "Learn" },
    code:  { bg: t.accentBg, color: t.accentText, label: "Code" },
    build: { bg: t.greenBg, color: t.greenText, label: "Build" },
  };
  const weekAct = [40, 100, 75, 100, 60, 100, 80];
  const days = ["M","T","W","T","F","S","S"];
  const readiness: Array<[string, number]> = [["Skills", 45], ["Projects", 30], ["Interviews", 55]];

  return (
    <div className="page-pad">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginBottom: 4 }}>Good morning, Priya 👋</h1>
          <p style={{ fontSize: 13, color: t.textMid }}>Day 9 of your AI/ML Engineer journey — keep going!</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Btn t={t} size="sm" variant="secondary" onClick={() => setScreen("interview")} icon="🎤">Mock interview</Btn>
          <Btn t={t} size="sm" onClick={() => setScreen("roadmap")} icon="🗺">Roadmap</Btn>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Day streak", val: "🔥 9", bg: t.accentBg, color: t.accentText },
          { label: "Tasks today", val: `${done.filter(Boolean).length}/4`, bg: t.blueBg, color: t.blueText },
          { label: "Skills leveled", val: "12", bg: t.greenBg, color: t.greenText },
          { label: "Interview score", val: "8.1", bg: t.goldBg, color: t.goldText },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 11, color: t.textMid, textTransform: "uppercase", letterSpacing: .3, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Today's tasks */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Today's tasks</h3>
              <span style={{ fontSize: 12, color: t.textFaint, fontFamily: "monospace" }}>{done.filter(Boolean).length}/{done.length} done</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {today.map((task, i) => (
                <div key={i} onClick={() => setDone(d => { const n = [...d]; n[i] = !n[i]; return n; })} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                  borderRadius: 9, cursor: "pointer", transition: "all .15s",
                  background: done[i] ? t.greenBg : t.surfaceAlt,
                  border: `1px solid ${done[i] ? t.green + "44" : t.border}`,
                  flexWrap: "wrap",
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: done[i] ? t.green : t.surface,
                    border: `2px solid ${done[i] ? t.green : t.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff",
                    transition: "all .2s",
                  }}>{done[i] ? "✓" : ""}</div>
                  <div style={{ flex: 1, minWidth: 100 }}>
                    <div style={{ fontSize: 13, color: done[i] ? t.textMid : t.text, textDecoration: done[i] ? "line-through" : "none" }}>{task.label}</div>
                    <div style={{ fontSize: 11, color: t.textFaint }}>{task.time}</div>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: typeStyle[task.type].bg, color: typeStyle[task.type].color, flexShrink: 0 }}>{typeStyle[task.type].label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Skill progress */}
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 18 }}>Skill progress</h3>
            {skills.map(s => (
              <div key={s.name} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, flexWrap: "wrap", gap: 4 }}>
                  <span style={{ fontSize: 13, color: t.text }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: t.textFaint, fontFamily: "monospace" }}>{s.val}% → <span style={{ color: s.color }}>{s.target}%</span></span>
                </div>
                <div style={{ position: "relative", background: t.surfaceAlt, borderRadius: 99, height: 7 }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: `${s.target}%`, height: "100%", background: s.color + "28", borderRadius: 99 }} />
                  <div style={{ position: "absolute", top: 0, left: 0, width: `${s.val}%`, height: "100%", background: s.color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Weekly activity */}
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 14 }}>This week</h3>
            <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 72 }}>
              {weekAct.map((a, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <div style={{ width: "100%", minHeight: 4, borderRadius: 4, background: a === 100 ? t.accent : a > 60 ? t.accent + "55" : t.surfaceAlt, height: `${a * 0.55}px`, transition: "height .5s" }} />
                  <span style={{ fontSize: 10, color: i === 6 ? t.accent : t.textFaint, fontWeight: i === 6 ? 600 : 400 }}>{days[i]}</span>
                </div>
              ))}
            </div>
            <Divider t={t} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: t.textMid }}>5 of 7 days active</span>
              <span style={{ fontSize: 12, color: t.green, fontWeight: 500 }}>↑ 20% vs last week</span>
            </div>
          </Card>

          {/* Readiness gauge */}
          <Card style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 16 }}>Placement readiness</h3>
            <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto 14px" }}>
              <svg viewBox="0 0 110 110" width="110" height="110">
                <circle cx="55" cy="55" r="46" fill="none" stroke={t.surfaceAlt} strokeWidth="10" />
                <circle cx="55" cy="55" r="46" fill="none" stroke={t.accent} strokeWidth="10"
                  strokeDasharray="289" strokeDashoffset={289 * (1 - 0.42)}
                  strokeLinecap="round" transform="rotate(-90 55 55)" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>42%</div>
                <div style={{ fontSize: 10, color: t.textFaint }}>ready</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: t.textMid, marginBottom: 14 }}>~4 months to placement ready</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {readiness.map((item) => {
                const [label, value] = item;
                return (
                  <div key={label} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: t.textMid, width: 64, textAlign: "left" }}>{label}</span>
                    <div style={{ flex: 1 }}><ProgressBar value={value} color={t.accent} bg={t.surfaceAlt} h={4} /></div>
                    <span style={{ fontSize: 11, color: t.textFaint, width: 28, textAlign: "right", fontFamily: "monospace" }}>{value}%</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick actions */}
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 10 }}>Quick actions</h3>
            {([
              { label: "Retake skill assessment", icon: "🎯", screen: "analysis" },
              { label: "Start mock interview", icon: "🎤", screen: "interview" },
              { label: "View full roadmap", icon: "🗺", screen: "roadmap" },
            ] as { label: string; icon: string; screen: Screen }[]).map((a, i) => (
              <button key={i} onClick={() => setScreen(a.screen)} style={{
                display: "flex", alignItems: "center", gap: 11, width: "100%",
                padding: "9px 10px", borderRadius: 8, border: "none", background: "transparent",
                cursor: "pointer", marginBottom: 2, transition: "background .12s", color: t.text,
              }}
                onMouseEnter={e => e.currentTarget.style.background = t.surfaceAlt}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ width: 30, height: 30, borderRadius: 7, background: t.accentBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{a.icon}</div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</span>
                <span style={{ marginLeft: "auto", color: t.textFaint }}>→</span>
              </button>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ─── Root ──────────────────────────────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(false);
  const [screen, setScreen] = useState<Screen>("landing");
  const t = T[dark ? "dark" : "light"];

  const cssVars: CSSProperties & Record<string, string> = {
    "--cf-surface": t.surface,
    "--cf-border":  t.border,
    "--cf-text":    t.text,
    "--cf-muted":   t.textMid,
  };

  return (
    <div className="cf-app" style={cssVars}>
      <GlobalStyles t={t} />
      <Navbar screen={screen} setScreen={setScreen} dark={dark} setDark={setDark} t={t} />
      <main key={screen} style={{ animation: "cfFadeIn .2s ease" }}>
        {screen === "landing"    && <Landing    setScreen={setScreen} t={t} />}
        {screen === "onboarding" && <Onboarding setScreen={setScreen} t={t} />}
        {screen === "analysis"   && <Analysis   setScreen={setScreen} t={t} />}
        {screen === "roadmap"    && <Roadmap    setScreen={setScreen} t={t} />}
        {screen === "interview"  && <Interview t={t} />}
        {screen === "dashboard"  && <Dashboard  setScreen={setScreen} t={t} />}
      </main>
      <style>{`@keyframes cfFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}