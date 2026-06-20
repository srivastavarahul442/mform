"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/fe/store/AuthContext";
import Link from "next/link";

// ── Icons (inline SVG to avoid extra deps) ─────────────────────────────────
const IconZap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);
const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconBarChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
);
const IconLink = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
);
const IconMail = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
);
const IconUsers = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const IconChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);
const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);
const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);

// ── Data ────────────────────────────────────────────────────────────────────
const features = [
  { icon: <IconZap />, title: "Instant Form Builder", desc: "Create beautiful, smart forms in minutes. No coding required — drag, drop, publish.", color: "#6366f1" },
  { icon: <IconLink />, title: "Shareable Invite Links", desc: "Send personalised form links via WhatsApp or email with one click. Auto-filled for your contacts.", color: "#8b5cf6" },
  { icon: <IconBarChart />, title: "Real-Time Analytics", desc: "Track responses the moment they come in. Visualise trends, completion rates, and insights.", color: "#06b6d4" },
  { icon: <IconShield />, title: "Enterprise Security", desc: "API key auth, role-based access, encrypted storage. Your data never leaves your company.", color: "#10b981" },
  { icon: <IconUsers />, title: "CRM Integration", desc: "Native integration with your CRM. Auto-send feedback forms after site visits or calls.", color: "#f59e0b" },
  { icon: <IconMail />, title: "Multi-Channel Notify", desc: "Notify respondents via WhatsApp and email simultaneously. Built-in delivery tracking.", color: "#ef4444" },
];

const steps = [
  { num: "01", title: "Create Your Form", desc: "Use our visual builder to design your form. Add fields, logic, and branding in minutes." },
  { num: "02", title: "Share via Invite Link", desc: "Generate personalised links for each recipient. Send via WhatsApp, email, or embed anywhere." },
  { num: "03", title: "Collect Responses", desc: "Recipients fill the form on any device. Their identity is auto-populated from the invite." },
  { num: "04", title: "Analyse & Act", desc: "View real-time submissions in your dashboard. Export, integrate with your CRM, or trigger automations." },
];

const plans = [
  {
    name: "Starter", price: "Free", period: "", highlight: false,
    desc: "Perfect for individuals and small teams getting started.",
    features: ["3 Active Forms", "100 Responses/month", "Basic Analytics", "Email Notifications", "Public Form Links"],
  },
  {
    name: "Pro", price: "₹999", period: "/month", highlight: true,
    desc: "For growing businesses that need power and flexibility.",
    features: ["Unlimited Forms", "5,000 Responses/month", "Advanced Analytics", "WhatsApp + Email Notify", "API Access & Invite Links", "CRM Webhooks", "Priority Support"],
  },
  {
    name: "Enterprise", price: "Custom", period: "", highlight: false,
    desc: "Tailored for large teams with security and compliance needs.",
    features: ["Unlimited Everything", "Dedicated Infrastructure", "SSO & Role-Based Access", "Custom Integrations", "SLA Guarantee", "Dedicated Account Manager"],
  },
];

const faqs = [
  { q: "What is MForm?", a: "MForm is a SaaS form builder designed for businesses. It lets you create smart forms, share personalised invite links, collect responses, and integrate directly with your CRM — all in one platform." },
  { q: "How does the invite link feature work?", a: "When you send an invite to a contact, MForm generates a unique, pre-filled URL. When your contact opens it, their name, phone, and email are already populated — making submission effortless." },
  { q: "Can I integrate MForm with my existing CRM?", a: "Yes. MForm provides a REST API with API key authentication. You can trigger invite creation, fetch responses, and receive webhooks on form completion." },
  { q: "Is my data secure?", a: "Absolutely. All data is encrypted at rest and in transit. API keys are hashed and never stored in plain text. You control who has access to each form." },
  { q: "Do respondents need to create an account?", a: "No. Respondents simply open their invite link and submit — no sign-up required. Accounts are only needed for form creators and admins." },
  { q: "Can I send forms via WhatsApp?", a: "Yes. MForm integrates with WhatsApp Business API (via Twilio) to send invite links directly to your contacts' WhatsApp." },
];

const stats = [
  { value: "10K+", label: "Forms Created" },
  { value: "500K+", label: "Responses Collected" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 300ms", label: "Avg. Response Time" },
];

// ── Components ──────────────────────────────────────────────────────────────
function Navbar({ scrolled, mobileOpen, setMobileOpen }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? "rgba(10,10,20,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
      transition: "all 0.3s ease",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 18, fontFamily: "monospace" }}>M</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: "-0.02em" }}>MForm</span>
        </div>

        {/* Desktop Nav Links — hidden on mobile */}
        <div className="desktop-nav" style={{ alignItems: "center", gap: 32 }}>
          {["Features", "How It Works", "Pricing", "FAQ"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.7)"}>
              {item}
            </a>
          ))}
        </div>

        {/* CTA Buttons — shown on desktop only */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Login + Get Started: desktop only */}
          <Link href="/login" className="nav-cta-btn" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "8px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", transition: "all 0.2s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}>
            Log in
          </Link>
          <Link href="/register" className="nav-cta-btn" style={{ color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700, padding: "8px 20px", borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", transition: "all 0.2s", boxShadow: "0 4px 15px rgba(99,102,241,0.4)", whiteSpace: "nowrap" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            Get Started
          </Link>
          {/* Hamburger: mobile only */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-menu-btn" style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <div style={{ background: "rgba(10,10,20,0.98)", backdropFilter: "blur(20px)", padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {["Features", "How It Works", "Pricing", "FAQ"].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setMobileOpen(false)}
              style={{ display: "block", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 15, fontWeight: 500, padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {item}
            </a>
          ))}
          {/* CTA inside mobile menu */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
            <Link href="/login" onClick={() => setMobileOpen(false)} style={{ display: "block", textAlign: "center", textDecoration: "none", color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 600, padding: "12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.04)" }}>
              Log in
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)} style={{ display: "block", textAlign: "center", textDecoration: "none", color: "#fff", fontSize: 15, fontWeight: 700, padding: "12px", borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 4px 15px rgba(99,102,241,0.4)" }}>
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "22px 0",
        fontSize: 16, fontWeight: 600, textAlign: "left", gap: 16,
      }}>
        {q}
        <span style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s", flexShrink: 0, color: "#6366f1" }}>
          <IconChevronDown />
        </span>
      </button>
      <div style={{
        maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height 0.4s ease",
      }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.7, paddingBottom: 22, margin: 0 }}>{a}</p>
      </div>
    </div>
  );
}

// ── Main Landing Page ───────────────────────────────────────────────────────
export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Redirect logged-in users straight to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard/forms");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading || user) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#08080f" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(99,102,241,0.3)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ background: "#08080f", color: "#fff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes pulse { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:0.8; transform:scale(1.05); } }
        @keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .float { animation: float 4s ease-in-out infinite; }
        .feature-card:hover { transform: translateY(-6px) !important; box-shadow: 0 24px 48px rgba(0,0,0,0.4) !important; }
        .plan-card:hover { transform: translateY(-4px) !important; }
        .step-card:hover .step-num { background: linear-gradient(135deg, #6366f1, #8b5cf6) !important; -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-fill-color: transparent !important; }
        a { color: inherit; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; } 
        ::-webkit-scrollbar-track { background: #0d0d1a; }
        ::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 3px; }
        /* Mobile defaults */
        .desktop-nav { display: none; }
        .nav-cta-btn { display: none !important; }
        .mobile-menu-btn { display: flex !important; }
        /* Desktop overrides */
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .nav-cta-btn { display: inline-flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      <Navbar scrolled={scrolled} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 80 }}>
        {/* Background orbs */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", right: "20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Grid overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            {/* Badge */}
            <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 99, padding: "6px 16px", marginBottom: 32 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc" }}>Now with WhatsApp + Email Notifications</span>
            </div>

            <h1 className="fade-up" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: "-0.03em", animationDelay: "0.1s" }}>
              The Smartest Way to{" "}
              <span style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Collect Feedback
              </span>
            </h1>

            <p className="fade-up" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: 48, animationDelay: "0.2s" }}>
              MForm helps businesses create beautiful forms, send personalised invite links via WhatsApp & email, and collect responses — all integrated with your CRM.
            </p>

            <div className="fade-up" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", animationDelay: "0.3s" }}>
              <Link href="/register" style={{
                display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
                padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700,
                boxShadow: "0 8px 30px rgba(99,102,241,0.4)", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.55)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(99,102,241,0.4)"; }}>
                Start for Free <IconArrowRight />
              </Link>
              <Link href="/login" style={{
                display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none",
                color: "rgba(255,255,255,0.85)", padding: "14px 32px", borderRadius: 12,
                fontSize: 16, fontWeight: 600, border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.04)", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}>
                Log In
              </Link>
            </div>

            {/* Social proof */}
            <div className="fade-up" style={{ marginTop: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, animationDelay: "0.4s" }}>
              <div style={{ display: "flex" }}>
                {["#f472b6","#60a5fa","#34d399","#fbbf24"].map((c, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: "2px solid #08080f", marginLeft: i > 0 ? -10 : 0 }} />
                ))}
              </div>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Trusted by <strong style={{ color: "rgba(255,255,255,0.85)" }}>500+</strong> businesses</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="float" style={{ marginTop: 72, position: "relative", maxWidth: 900, margin: "72px auto 0" }}>
            {/* Dashboard mockup */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, overflow: "hidden", backdropFilter: "blur(10px)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
              {/* Browser bar */}
              <div style={{ background: "rgba(255,255,255,0.06)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["#ff5f57","#ffbd2e","#28c840"].map(c => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                ))}
                <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 6, height: 24, marginLeft: 12, maxWidth: 360, display: "flex", alignItems: "center", paddingLeft: 12 }}>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>mform.app/dashboard/forms</span>
                </div>
              </div>
              {/* Dashboard content */}
              <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, minHeight: 220 }}>
                {[
                  { label: "Total Forms", value: "24", color: "#6366f1" },
                  { label: "Responses", value: "1,840", color: "#8b5cf6" },
                  { label: "Completion Rate", value: "87%", color: "#06b6d4" },
                ].map(stat => (
                  <div key={stat.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "20px 16px", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{stat.label}</div>
                  </div>
                ))}
                {/* Form cards */}
                {[
                  { title: "Site Visit Feedback", status: "Live", responses: 142 },
                  { title: "Lead Qualification", status: "Live", responses: 89 },
                  { title: "Employee Survey", status: "Draft", responses: 0 },
                ].map(form => (
                  <div key={form.title} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)", gridColumn: "span 1" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>{form.title}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: form.status === "Live" ? "#10b981" : "#94a3b8", background: form.status === "Live" ? "rgba(16,185,129,0.1)" : "rgba(148,163,184,0.1)", padding: "2px 8px", borderRadius: 99 }}>{form.status}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{form.responses} resp.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating badge */}
            <div style={{ position: "absolute", top: -20, right: -20, background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 12, padding: "10px 16px", boxShadow: "0 8px 24px rgba(16,185,129,0.4)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>✓ Response received</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>Rahul — Site Visit Form</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <section style={{ padding: "60px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32 }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, fontWeight: 500, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em" }}>Features</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>Everything you need to run<br />smarter forms</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, maxWidth: 540, margin: "0 auto" }}>Built for teams that collect data at scale — from single feedback forms to full CRM workflows.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "32px", transition: "all 0.3s ease", cursor: "default" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}18`, border: `1px solid ${f.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 20 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 10px", color: "#fff" }}>{f.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0, fontSize: 14 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "100px 24px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.1em" }}>How It Works</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>Up and running in minutes</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, maxWidth: 480, margin: "0 auto" }}>Four simple steps from creating your first form to getting actionable data.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32, position: "relative" }}>
            {steps.map((step, i) => (
              <div key={i} className="step-card" style={{ position: "relative" }}>
                <div style={{ marginBottom: 20 }}>
                  <span className="step-num" style={{ fontSize: 56, fontWeight: 900, color: "rgba(99,102,241,0.15)", lineHeight: 1, transition: "all 0.3s", fontVariantNumeric: "tabular-nums" }}>{step.num}</span>
                </div>
                <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 2, marginBottom: 20 }} />
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 12px" }}>{step.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.65, margin: 0, fontSize: 14 }}>{step.desc}</p>
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", top: 28, right: -16, color: "rgba(255,255,255,0.1)", display: "none" }} className="step-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.1em" }}>Pricing</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>Simple, transparent pricing</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 17, maxWidth: 460, margin: "0 auto" }}>Start free, scale as you grow. No surprise charges.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "stretch" }}>
            {plans.map((plan, i) => (
              <div key={i} className="plan-card" style={{
                borderRadius: 24, padding: "40px 32px",
                background: plan.highlight ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))" : "rgba(255,255,255,0.03)",
                border: plan.highlight ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)",
                position: "relative", overflow: "hidden", transition: "all 0.3s ease",
                boxShadow: plan.highlight ? "0 0 60px rgba(99,102,241,0.15)" : "none",
              }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: 20, right: 20, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 99, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.05em" }}>Most Popular</div>
                )}
                <div style={{ fontSize: 16, fontWeight: 700, color: plan.highlight ? "#a5b4fc" : "rgba(255,255,255,0.5)", marginBottom: 16 }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{plan.price}</span>
                  {plan.period && <span style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{plan.period}</span>}
                </div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>{plan.desc}</p>

                <Link href="/register" style={{
                  display: "block", textAlign: "center", textDecoration: "none", padding: "13px 24px", borderRadius: 10, fontSize: 15, fontWeight: 700, marginBottom: 32, transition: "all 0.2s",
                  background: plan.highlight ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.06)",
                  color: "#fff", border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.12)",
                  boxShadow: plan.highlight ? "0 6px 20px rgba(99,102,241,0.4)" : "none",
                }}>
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Link>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {plan.features.map((feat, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: plan.highlight ? "#6366f1" : "#10b981", flexShrink: 0 }}><IconCheck /></span>
                      <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: "100px 24px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.1em" }}>FAQ</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>Frequently asked questions</h2>
          </div>
          <div>
            {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── ABOUT / CTA ──────────────────────────────────────────────── */}
      <section id="about" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 28, padding: "72px 48px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: "0.1em" }}>About MForm</span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, margin: "16px 0 20px", letterSpacing: "-0.02em" }}>Built for modern businesses</h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, lineHeight: 1.75, maxWidth: 600, margin: "0 auto 40px" }}>
              MForm was created to solve a real problem — collecting feedback from leads, clients, and employees in a way that's personal, trackable, and integrated with your existing workflow. We&apos;re obsessed with simplicity, speed, and privacy.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/register" style={{
                display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
                padding: "14px 36px", borderRadius: 12, fontSize: 16, fontWeight: 700,
                boxShadow: "0 8px 30px rgba(99,102,241,0.4)", transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                Start Building Free <IconArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────── */}
      <section id="contact" style={{ padding: "80px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.1em" }}>Contact</span>
          <h2 style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 900, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>Get in touch</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, marginBottom: 40 }}>Have questions or need a custom plan? We&apos;d love to hear from you.</p>
          <a href="mailto:hello@mform.app" style={{
            display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none",
            color: "#fff", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
            padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}>
            <IconMail /> hello@mform.app
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 16, fontFamily: "monospace" }}>M</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 16 }}>MForm</span>
          </div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {["Features", "How It Works", "Pricing", "FAQ", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>
                {item}
              </a>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, margin: 0 }}>© {new Date().getFullYear()} MForm. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}