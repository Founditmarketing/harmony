import React, { useEffect, useMemo, useRef, useState } from "react";
import heroVideo4k from "../assets/videos/hero-4k.mp4";
import heroVideoPoster from "../assets/images/hero-video-poster.jpg";
import deltaCypress from "../assets/images/delta-cypress.jpg";
import providerCinematic from "../assets/images/provider-cinematic.jpg";
import clinicCinematic from "../assets/images/clinic-cinematic.jpg";
import arkansasFields from "../assets/images/arkansas-fields.jpg";
import aboutImage from "../assets/images/about.jpg";
import servicesImage from "../assets/images/services.jpg";
import services2Image from "../assets/images/services2.jpg";
import teamImage from "../assets/images/team.jpg";
import clinicRoomImage from "../assets/images/clinic-room.jpg";
import founderPortrait from "../assets/images/founder-portrait.jpg";
import harmonyLogo from "../assets/images/harmony-logo.png";
import { LOCATIONS, SERVICES, PROVIDERS, INSURANCE, RECOGNITIONS, TESTIMONIALS, FAQ, RESOURCES } from "./data.js";
import { useLocale, useReducedMotion } from "./i18n.js";
import LocationsMap from "./components/LocationsMap.jsx";
import BookingModal from "./components/BookingModal.jsx";
import InsuranceChecker from "./components/InsuranceChecker.jsx";

function useCountUp(target, duration = 1800, trigger = true, reduced = false) {
  const [val, setVal] = useState(reduced ? target : 0);
  useEffect(() => {
    if (!trigger) return;
    if (reduced) { setVal(target); return; }
    let raf;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => raf && cancelAnimationFrame(raf);
  }, [target, duration, trigger, reduced]);
  return val;
}

function StatCounter({ target, suffix = "", trigger, reduced }) {
  const v = useCountUp(target, 1800, trigger, reduced);
  return <>{Math.floor(v).toLocaleString()}{suffix}</>;
}

function ServiceIcon({ name, color }) {
  const stroke = color || "currentColor";
  const common = { width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "stethoscope": return (<svg {...common}><path d="M5 4v7a4 4 0 0 0 8 0V4" /><path d="M9 14v3a4 4 0 0 0 8 0v-1" /><circle cx="17" cy="11" r="2" /></svg>);
    case "child": return (<svg {...common}><circle cx="12" cy="6" r="3" /><path d="M6 21v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3" /></svg>);
    case "bolt": return (<svg {...common}><path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" /></svg>);
    case "leaf": return (<svg {...common}><path d="M5 21c0-9 7-15 16-15-1 9-7 15-16 15Z" /><path d="M5 21c4-4 8-7 12-9" /></svg>);
    case "heart": return (<svg {...common}><path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z" /></svg>);
    case "shield": return (<svg {...common}><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>);
    default: return null;
  }
}

function isOpenNow(d = new Date()) {
  const day = d.getDay();
  const hour = d.getHours();
  return day >= 1 && day <= 5 && hour >= 8 && hour < 17;
}

function clinicStatusLine(d = new Date()) {
  const day = d.getDay();
  const hour = d.getHours();
  const min = d.getMinutes();
  if (day === 0 || day === 6) return { open: false, label: "Opens Mon 8:00 AM" };
  if (hour >= 8 && hour < 17) {
    return { open: true, label: `Open now, closes 5:00 PM` };
  }
  if (hour < 8) return { open: false, label: "Opens today at 8:00 AM" };
  if (day === 5) return { open: false, label: "Closed, opens Mon 8:00 AM" };
  return { open: false, label: "Opens tomorrow at 8:00 AM" };
}

function timeGreeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function useScrollReveal(ref, threshold = 0.04) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);
  const visible = useScrollReveal(ref);
  return (
    <Tag
      ref={ref}
      className={`sr ${visible ? "sr-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function jitterWait(loc, seed) {
  const v = (Math.sin(seed * 9301 + (loc.name.length * 11)) * 10000) % 1;
  const offset = Math.abs(v) * loc.waitJitter;
  return Math.max(2, Math.round(loc.waitBase + offset - loc.waitJitter / 2));
}

function CursorDot() {
  const dotRef = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const el = dotRef.current;
    if (!el) return;
    const onMove = (e) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      const target = e.target;
      const isLink = target instanceof Element && target.closest("a, button, [role='button']");
      el.classList.toggle("is-link", Boolean(isLink));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);
  if (reduced) return null;
  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}

function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);
  const move = (clientX) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = clientX - rect.left;
    setPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  };
  return (
    <div
      ref={ref}
      className="ba-slider"
      onMouseDown={() => (dragging.current = true)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onMouseMove={(e) => dragging.current && move(e.clientX)}
      onTouchStart={() => (dragging.current = true)}
      onTouchEnd={() => (dragging.current = false)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
    >
      <div className="ba-after">
        <svg viewBox="0 0 200 125" preserveAspectRatio="none">
          <defs>
            <radialGradient id="skinHealed" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#F4E4D5" />
              <stop offset="100%" stopColor="#E8C9A8" />
            </radialGradient>
          </defs>
          <rect width="200" height="125" fill="url(#skinHealed)" />
          <ellipse cx="100" cy="62" rx="12" ry="3" fill="#D4A684" opacity="0.4" />
          <text x="100" y="115" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono, monospace" fill="#7A9885" letterSpacing="1">WEEK 12 · HEALED</text>
        </svg>
      </div>
      <div className="ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <svg viewBox="0 0 200 125" preserveAspectRatio="none">
          <defs>
            <radialGradient id="skinWound" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#F4E4D5" />
              <stop offset="100%" stopColor="#E8C9A8" />
            </radialGradient>
          </defs>
          <rect width="200" height="125" fill="url(#skinWound)" />
          <ellipse cx="100" cy="62" rx="35" ry="16" fill="#C97B5A" opacity="0.18" />
          <ellipse cx="100" cy="62" rx="22" ry="10" fill="#A85F3F" opacity="0.85" />
          <ellipse cx="100" cy="62" rx="18" ry="7" fill="#C97B5A" opacity="0.8" />
          <ellipse cx="100" cy="62" rx="12" ry="4" fill="#8F4A2E" opacity="0.6" />
          <text x="100" y="115" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono, monospace" fill="#A85F3F" letterSpacing="1">WEEK 1 · INITIAL VISIT</text>
        </svg>
      </div>
      <div className="ba-divider" style={{ left: `${pos}%` }} />
      <div className="ba-knob" style={{ left: `${pos}%` }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2">
          <path d="M9 5l-7 7 7 7M15 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="ba-tag ba-tag-left">Before</div>
      <div className="ba-tag ba-tag-right">After, 12 weeks</div>
      <div className="ba-hint">← Drag to compare →</div>
    </div>
  );
}

export default function HarmonyHealth() {
  const reduced = useReducedMotion();
  const { locale, setLocale, t } = useLocale();
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeLoc, setActiveLoc] = useState("wynne");
  const [providerFilter, setProviderFilter] = useState("all");
  const [openProvider, setOpenProvider] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDefaults, setBookingDefaults] = useState({});
  const [zip, setZip] = useState("");
  const [zipDriveTime, setZipDriveTime] = useState(null);
  const [waitSeed, setWaitSeed] = useState(0);
  const statsRef = useRef(null);
  const heroVideoRef = useRef(null);
  const [heroVideoVisible, setHeroVideoVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), reduced ? 250 : 1500);
    return () => clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const el = heroVideoRef.current;
    if (!el) return;
    const show = () => setHeroVideoVisible(true);
    el.addEventListener("playing", show);
    el.addEventListener("loadeddata", show);
    const maxWait = window.setTimeout(show, 6000);
    return () => {
      window.clearTimeout(maxWait);
      el.removeEventListener("playing", show);
      el.removeEventListener("loadeddata", show);
    };
  }, [reduced]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 },
    );
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial((i) => (i + 1) % TESTIMONIALS.length), 7000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setWaitSeed((s) => s + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openProvider || bookingOpen || loading || navOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [openProvider, bookingOpen, loading, navOpen]);

  const filteredProviders = useMemo(() => {
    if (providerFilter === "all") return PROVIDERS;
    if (providerFilter === "accepting") return PROVIDERS.filter((p) => p.accepting);
    return PROVIDERS.filter((p) => p.tags.includes(providerFilter));
  }, [providerFilter]);

  const currentLoc = useMemo(
    () => LOCATIONS.find((l) => l.key === activeLoc) ?? LOCATIONS[0],
    [activeLoc],
  );

  const openNow = isOpenNow();
  const waitMins = jitterWait(currentLoc, waitSeed);
  const wynne = LOCATIONS.find((l) => l.key === "wynne");
  const wynneWait = jitterWait(wynne, waitSeed);
  const status = clinicStatusLine();
  const greeting = timeGreeting();
  const localTime = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    setNavOpen(false);
  };

  const openBooking = (defaults = {}) => {
    setBookingDefaults(defaults);
    setBookingOpen(true);
  };

  const calcDrive = (e) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setZipDriveTime("invalid");
      return;
    }
    const z = parseInt(zip, 10);
    const minutes = 8 + Math.abs((z - 72396) % 60);
    setZipDriveTime(Math.min(75, minutes));
  };

  const filtersTeam = [
    { key: "all", label: t.team.filters_all },
    { key: "accepting", label: locale === "es" ? "Acepta pacientes" : "Accepting patients" },
    { key: "spanish", label: "Español" },
    { key: "primary", label: t.team.filters_primary },
    { key: "pediatrics", label: t.team.filters_pediatrics },
    { key: "urgent", label: t.team.filters_urgent },
    { key: "wound", label: t.team.filters_wound },
    { key: "womens", label: t.team.filters_womens },
    ...LOCATIONS.map((l) => ({ key: l.key, label: l.name })),
  ];

  return (
    <div className="hh-app">
      <style>{styles}</style>
      <CursorDot />
      <a href="#main" className="skip-link">{t.sr.skip}</a>

      {loading && (
        <div className="preloader" aria-hidden="true">
          <div className="preloader-inner">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="32" stroke="var(--bone)" strokeWidth="1" opacity="0.3" />
              <circle cx="40" cy="40" r="32" stroke="var(--terracotta)" strokeWidth="2" pathLength="201" strokeDasharray="201" style={{ animation: "draw-stroke 1.4s cubic-bezier(0.22,1,0.36,1) forwards" }} />
              <path d="M28 32 L28 48 M28 40 L40 40 M40 32 L40 48 M48 32 L48 48 M48 32 L52 36 M48 40 L52 40 M48 48 L52 44" stroke="var(--bone)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-mono preload-label">HARMONY HEALTH CLINIC</span>
          </div>
        </div>
      )}

      <nav className={`nav ${scrolled ? "is-scrolled" : ""}`} aria-label="Primary">
        <div className="container nav-inner">
          <a href="#top" className="brand" aria-label="Harmony Health Clinic, home">
            <img src={harmonyLogo} alt="Harmony Health Clinic" />
          </a>
          <div className="nav-links nav-links-desktop">
            <button onClick={() => scrollTo("services")}>{t.nav.services}</button>
            <button onClick={() => scrollTo("locations")}>{t.nav.locations}</button>
            <button onClick={() => scrollTo("team")}>{t.nav.team}</button>
            <a href="https://epicconnect.org/ccprd/CommunityConnect/mychartcc.html" target="_blank" rel="noreferrer" className="nav-portal">
              {t.nav.portal} ↗
            </a>
            <div className="nav-lang-group" role="group" aria-label={t.sr.lang_toggle}>
              <button
                className={locale === "en" ? "nav-lang-active" : ""}
                onClick={() => setLocale("en")}
                aria-pressed={locale === "en"}
              >EN</button>
              <span aria-hidden="true">|</span>
              <button
                className={locale === "es" ? "nav-lang-active" : ""}
                onClick={() => setLocale("es")}
                aria-pressed={locale === "es"}
              >ES</button>
            </div>
            <button className="btn btn-primary nav-cta" onClick={() => openBooking({})}>
              {t.nav.book}
            </button>
          </div>
          <button className="nav-toggle" aria-label={t.sr.open_menu} aria-expanded={navOpen} onClick={() => setNavOpen((v) => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE FULLSCREEN MENU */}
      <div className={`m-menu ${navOpen ? "is-open" : ""}`} aria-hidden={!navOpen}>
        <div className="m-menu-head">
          <img src={harmonyLogo} alt="" className="m-menu-logo" />
          <button className="m-menu-close" onClick={() => setNavOpen(false)} aria-label={t.sr.close}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>
        <nav className="m-menu-nav" aria-label="Mobile menu">
          <button onClick={() => scrollTo("services")}><span className="font-mono">01</span><span className="font-display">{t.nav.services}</span></button>
          <button onClick={() => scrollTo("team")}><span className="font-mono">02</span><span className="font-display">{t.nav.team}</span></button>
          <button onClick={() => scrollTo("locations")}><span className="font-mono">03</span><span className="font-display">{t.nav.locations}</span></button>
          <button onClick={() => scrollTo("wound-care")}><span className="font-mono">04</span><span className="font-display">{t.nav.wound}</span></button>
          <button onClick={() => scrollTo("faq")}><span className="font-mono">05</span><span className="font-display">{t.nav.faq}</span></button>
        </nav>
        <div className="m-menu-foot">
          <a className="m-menu-portal" href="https://epicconnect.org/ccprd/CommunityConnect/mychartcc.html" target="_blank" rel="noreferrer">
            <span className="font-mono small-label">PORTAL</span>
            <strong className="font-display">MyChart Patient Portal ↗</strong>
          </a>
          <a className="m-menu-call" href={`tel:${currentLoc.phone.replace(/[^0-9]/g, "")}`}>
            <span className="font-mono small-label">CALL {currentLoc.name.toUpperCase()}</span>
            <strong className="font-display">{currentLoc.phone}</strong>
          </a>
          <button
            className="m-menu-lang"
            onClick={() => setLocale(locale === "en" ? "es" : "en")}
          >
            <span className="font-mono small-label">LANGUAGE</span>
            <strong className="font-display">{locale === "en" ? "Switch to Español" : "Switch to English"}</strong>
          </button>
          <button className="btn btn-terracotta btn-lg m-menu-cta" onClick={() => { setNavOpen(false); openBooking({}); }}>
            {t.nav.book}
          </button>
        </div>
      </div>

      {/* ANNOUNCEMENT MARQUEE */}
      <div className="announce" aria-hidden="true">
        <div className="announce-track">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div className="announce-row" key={dup}>
              <span>★ 4.9 average across patient reviews</span>
              <span className="announce-dot">●</span>
              <span>Now accepting new patients across all four locations</span>
              <span className="announce-dot">●</span>
              <span>Same-week visits available at Wynne</span>
              <span className="announce-dot">●</span>
              <span>Spanish-speaking providers available</span>
              <span className="announce-dot">●</span>
              <span>MyChart patient portal for refills and messaging</span>
              <span className="announce-dot">●</span>
              <span>Advanced wound care led by certified specialists</span>
              <span className="announce-dot">●</span>
            </div>
          ))}
        </div>
      </div>

      <main id="main">
        {/* HERO — full-bleed video background, editorial overlay */}
        <header id="top" className="hero-v2">
          <div className="hero-v2-bg">
            {!reduced ? (
              <video
                ref={heroVideoRef}
                className={`hero-v2-video${heroVideoVisible ? " hero-v2-video--visible" : ""}`}
                src={heroVideo4k}
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
                poster={heroVideoPoster}
                aria-label="Harmony Health Clinic atmospheric footage"
              />
            ) : (
              <img
                src={heroVideoPoster}
                alt=""
                aria-hidden="true"
                decoding="async"
                fetchPriority="high"
              />
            )}
            <div className="hero-v2-veil" />
            <div className="hero-v2-vignette" />
          </div>

          <div className="container hero-v2-content">
            <div className="hero-v2-meta reveal">
              <span className="font-mono">EAST ARKANSAS · DELTA · {greeting.toUpperCase()}, {localTime} CT</span>
              <span className={`tag ${status.open ? "tag-live" : "tag-closed"}`}>
                Wynne, {status.label}{status.open ? ` · ${wynneWait} min wait` : ""}
              </span>
            </div>

            <h1 className="hero-v2-headline font-display">
              <span className="word-rise-stage"><span className="delay-1">A</span></span>{" "}
              <span className="word-rise-stage"><span className="delay-2">different</span></span>{" "}
              <span className="word-rise-stage"><span className="delay-3">kind</span></span>
              <br />
              <span className="word-rise-stage"><span className="delay-4">of</span></span>{" "}
              <span className="word-rise-stage"><span className="delay-5"><em>healthcare</em>,</span></span>
              <br />
              <span className="word-rise-stage"><span className="delay-6">built</span></span>{" "}
              <span className="word-rise-stage"><span className="delay-7">for</span></span>{" "}
              <span className="word-rise-stage"><span className="delay-8">the Delta.</span></span>
            </h1>

            <p className="hero-v2-lead reveal" style={{ animationDelay: "1.0s" }}>
              {t.hero.lead}
            </p>

            <div className="hero-v2-actions reveal" style={{ animationDelay: "1.15s" }}>
              <button className="btn btn-terracotta btn-lg" onClick={() => openBooking({})}>
                {t.hero.cta_primary}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button className="btn btn-light" onClick={() => scrollTo("services")}>
                {t.hero.cta_secondary}
              </button>
            </div>

            <div className="hero-v2-trust reveal" style={{ animationDelay: "1.28s" }}>
              <span className="trust-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>
                PCMH Level 3
              </span>
              <span className="trust-pill">Same-day visits</span>
              <span className="trust-pill">BCBS · Aetna · UHC</span>
              <span className="trust-pill">Medicare · Medicaid</span>
            </div>

            <div className="hero-v2-foot reveal" style={{ animationDelay: "1.4s" }}>
              <div><strong className="font-display">04</strong><span>locations</span></div>
              <div><strong className="font-display">12+</strong><span>providers</span></div>
              <div><strong className="font-display">9+</strong><span>years</span></div>
              <div><strong className="font-display">PCMH</strong><span>Level 3 certified</span></div>
            </div>

            <div className="hero-v2-card reveal" style={{ animationDelay: "1.5s" }}>
              <span className="font-mono small-label">SAME-DAY OPENING</span>
              <strong className="font-display">{t.hero.proof_loc}, {t.hero.proof_time}</strong>
              <button className="hero-v2-card-btn" onClick={() => openBooking({ reason: "urgent", location: "wynne" })}>Reserve →</button>
            </div>
          </div>
        </header>

        {/* EDITORIAL PULL QUOTE — full-bleed sand */}
        <section className="pullquote">
          <div className="container">
            <blockquote className="pullquote-text font-display">
              <span aria-hidden="true" className="pullquote-mark">"</span>
              We chose to <em>stay</em>, to listen, and to build the clinic <em>our families</em> would trust.
            </blockquote>
            <div className="pullquote-attribution">
              <svg viewBox="0 0 240 60" width="180" height="44" fill="none" stroke="var(--terracotta-deep)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M5 35 C 25 5, 45 60, 70 28 S 110 50, 130 22 S 170 60, 200 30 S 235 15, 238 28" />
              </svg>
              <span className="font-mono small-label">STEPHEN ANDY ROHRER · COFOUNDER, CEO</span>
            </div>
          </div>
        </section>

        {/* INTENT ROUTER */}
        <section className="intent-router">
          <div className="container">
            <Reveal className="intent-head">
              <span className="eyebrow eyebrow-clay">{t.intent.eyebrow}</span>
              <h2 className="font-display section-headline">{t.intent.title}</h2>
            </Reveal>
            <div className="intent-grid">
              <button className="intent-card card-lift" onClick={() => openBooking({ reason: "urgent" })}>
                <div className="intent-num font-display">01</div>
                <div className="intent-icon" style={{ background: "rgba(176,136,56,0.14)", color: "var(--gold-deep)" }}>
                  <ServiceIcon name="bolt" color="currentColor" />
                </div>
                <h3 className="font-display">{t.intent.sick.t}</h3>
                <p className="lead">{t.intent.sick.d}</p>
                <span className="intent-cta">{t.intent.sick.cta} →</span>
              </button>
              <button className="intent-card card-lift" onClick={() => openBooking({ reason: "primary" })}>
                <div className="intent-num font-display">02</div>
                <div className="intent-icon" style={{ background: "rgba(26,51,41,0.10)", color: "var(--forest)" }}>
                  <ServiceIcon name="stethoscope" color="currentColor" />
                </div>
                <h3 className="font-display">{t.intent.primary.t}</h3>
                <p className="lead">{t.intent.primary.d}</p>
                <span className="intent-cta">{t.intent.primary.cta} →</span>
              </button>
              <button className="intent-card card-lift" onClick={() => openBooking({ reason: "wound" })}>
                <div className="intent-num font-display">03</div>
                <div className="intent-icon" style={{ background: "rgba(110,139,120,0.20)", color: "var(--sage)" }}>
                  <ServiceIcon name="leaf" color="currentColor" />
                </div>
                <h3 className="font-display">{t.intent.wound.t}</h3>
                <p className="lead">{t.intent.wound.d}</p>
                <span className="intent-cta">{t.intent.wound.cta} →</span>
              </button>
            </div>
          </div>
        </section>

        {/* LOCATIONS — promoted near the top: proximity is the #1 healthcare decision factor */}
        <section id="locations" className="locations">
          <div className="container">
            <Reveal className="section-head">
              <div>
                <span className="eyebrow">{t.locations.eyebrow}</span>
                <h2 className="font-display section-headline">{t.locations.title_a} <em>{t.locations.title_em}</em> {t.locations.title_b}</h2>
              </div>
              <p className="lead">{t.locations.lead}</p>
            </Reveal>
            <div className="locations-grid">
              <div className="locations-side">
                <div className="loc-tabs">
                  {LOCATIONS.map((loc) => {
                    const w = jitterWait(loc, waitSeed);
                    return (
                      <button
                        key={loc.key}
                        className={`loc-tab ${activeLoc === loc.key ? "is-active" : ""}`}
                        onClick={() => setActiveLoc(loc.key)}
                      >
                        <span className="font-display">{loc.name}</span>
                        <span className="loc-tab-meta">
                          <span className={`tag ${openNow ? "tag-live" : "tag-closed"}`}>
                            {openNow ? `${w} min` : t.locations.closed_now}
                          </span>
                          <span className="font-mono small-label">{loc.region}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="loc-detail">
                  <div className="loc-detail-head">
                    <h3 className="font-display">{currentLoc.name}</h3>
                    <span className={`tag ${openNow ? "tag-live" : "tag-closed"}`}>{openNow ? `${waitMins} min ${t.locations.live_wait}` : t.locations.closed_now}</span>
                  </div>
                  <p className="lead">{currentLoc.address}</p>
                  <p className="lead"><strong>Hours:</strong> {currentLoc.hours}</p>
                  <p className="lead">
                    <strong>Phone:</strong>{" "}
                    <a className="underline-grow" href={`tel:${currentLoc.phone.replace(/[^0-9]/g, "")}`}>{currentLoc.phone}</a>
                  </p>
                  <div className="loc-services">
                    {currentLoc.services.map((s) => <span key={s} className="chip-static">{s}</span>)}
                  </div>
                  <div className="loc-detail-actions">
                    <a className="btn btn-primary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentLoc.address)}`} target="_blank" rel="noreferrer">{t.locations.directions} ↗</a>
                    <a className="btn btn-ghost" href={`tel:${currentLoc.phone.replace(/[^0-9]/g, "")}`}>{t.locations.call}</a>
                    <button className="btn btn-terracotta" onClick={() => openBooking({ location: currentLoc.key })}>{t.nav.book}</button>
                  </div>
                </div>

                <form className="zip-form" onSubmit={calcDrive}>
                  <span className="font-mono small-label">{t.locations.drive_label}</span>
                  <div className="zip-input">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="\d{5}"
                      maxLength={5}
                      placeholder={t.locations.drive_placeholder}
                      value={zip}
                      onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
                      aria-label={t.locations.drive_placeholder}
                    />
                    <button className="btn btn-primary" type="submit">{t.locations.drive_button}</button>
                  </div>
                  {zipDriveTime !== null && zipDriveTime !== "invalid" && (
                    <p className="zip-result"><strong className="font-display">{zipDriveTime} min</strong> from {zip} to nearest clinic, {currentLoc.name}.</p>
                  )}
                  {zipDriveTime === "invalid" && (
                    <p className="zip-result error">Enter a 5-digit ZIP code.</p>
                  )}
                </form>
              </div>

              <div className="locations-map-wrap">
                <LocationsMap locations={LOCATIONS} activeKey={activeLoc} onPick={setActiveLoc} />
                <div className="locations-meta">
                  <span className="font-mono small-label">DELTA · ARKANSAS</span>
                  <strong className="font-display">{LOCATIONS.length} clinics. One care team.</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INSURANCE STRIP */}
        <section className="insurance-strip" aria-label="Accepted insurance plans">
          <div className="container insurance-strip-inner">
            <span className="font-mono small-label">ACCEPTED PLANS</span>
            <div className="insurance-list-strip">
              {INSURANCE.filter((i) => i.accepted === true).slice(0, 8).map((plan) => (
                <span key={plan.name} className="insurance-pill">{plan.name}</span>
              ))}
            </div>
            <a className="underline-grow" href="#insurance">Verify your plan →</a>
          </div>
        </section>

        <InsuranceChecker t={t} plans={INSURANCE} />

        {/* NUMBERS AS ART — drenched forest */}
        <section ref={statsRef} className="stats-art">
          <div className="container-wide">
            <div className="stats-art-head">
              <span className="font-mono small-label">BY THE NUMBERS · 2026</span>
              <h2 className="font-display">A clinic measured by the families it keeps.</h2>
            </div>
            <div className="stats-art-grid">
              <div className="stat-art">
                <strong className="font-display"><StatCounter target={4} trigger={statsVisible} reduced={reduced} /></strong>
                <div>
                  <span className="font-mono small-label">LOCATIONS</span>
                  <p>Wynne, Osceola, Lonoke, and Scott. Four counties, one care team.</p>
                </div>
              </div>
              <div className="stat-art">
                <strong className="font-display"><StatCounter target={12} trigger={statsVisible} reduced={reduced} />+</strong>
                <div>
                  <span className="font-mono small-label">LICENSED PROVIDERS</span>
                  <p>Board-certified physicians and advanced practice clinicians, all locally rooted.</p>
                </div>
              </div>
              <div className="stat-art">
                <strong className="font-display"><StatCounter target={9} trigger={statsVisible} reduced={reduced} />+</strong>
                <div>
                  <span className="font-mono small-label">YEARS IN THE DELTA</span>
                  <p>Founded 2016. Built relationship by relationship, year over year.</p>
                </div>
              </div>
              <div className="stat-art">
                <strong className="font-display"><StatCounter target={14} trigger={statsVisible} reduced={reduced} /><span style={{ fontSize: "0.4em" }}> min</span></strong>
                <div>
                  <span className="font-mono small-label">AVG URGENT CARE WAIT</span>
                  <p>We text you when your room is ready, so you can wait wherever feels right.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* URGENT VS ER */}
        <section id="urgent-er" className="urgent-er">
          <div className="container">
            <Reveal className="section-head">
              <div>
                <span className="eyebrow eyebrow-clay">{t.urgent.eyebrow}</span>
                <h2 className="font-display section-headline">{t.urgent.title_a} <em>{t.urgent.title_em}</em>{t.urgent.title_b}</h2>
              </div>
              <p className="lead">{t.urgent.lead}</p>
            </Reveal>
            <div className="urgent-grid">
              <article className="urgent-card urgent-uc">
                <span className="urgent-num font-display">01</span>
                <h3 className="font-display">{t.urgent.uc_title}</h3>
                <ul>
                  {t.urgent.uc_items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <button className="btn btn-primary" onClick={() => openBooking({ reason: "urgent" })}>{t.intent.sick.cta} →</button>
              </article>
              <article className="urgent-card urgent-er-card">
                <span className="urgent-num font-display">02</span>
                <h3 className="font-display">{t.urgent.er_title}</h3>
                <ul>
                  {t.urgent.er_items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <a className="btn btn-terracotta" href="tel:911">Call 911</a>
              </article>
            </div>
            <p className="urgent-promise font-display">{t.urgent.promise}</p>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="services-section">
          <div className="container">
            <Reveal className="section-head">
              <div>
                <span className="eyebrow">{t.services.eyebrow}</span>
                <h2 className="font-display section-headline">{t.services.title_a} <em>{t.services.title_em}</em>{t.services.title_b}</h2>
              </div>
              <p className="lead">{t.services.lead}</p>
            </Reveal>
            <div className="services-grid">
              {SERVICES.map((s, i) => (
                <article key={s.name} className="service-card card-lift" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="service-num font-display">{String(i + 1).padStart(2, "0")}</div>
                  <div className="service-icon" style={{ background: `${s.accent}1a`, color: s.accent }}>
                    <ServiceIcon name={s.icon} color={s.accent} />
                  </div>
                  <h3 className="font-display">{s.name}</h3>
                  <p className="lead">{s.desc}</p>
                  <button className="service-link" onClick={() => openBooking({ reason: s.key })}>
                    {s.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WOUND CARE — drenched terracotta */}
        <section id="wound-care" className="wound-drenched">
          <div className="container wound-grid">
            <div>
              <span className="eyebrow eyebrow-light">Advanced wound care</span>
              <h2 className="font-display section-headline" style={{ color: "var(--bone)" }}>When a band-aid <em style={{ color: "var(--gold-pale)" }}>is not enough</em>.</h2>
              <p className="lead lead-lg" style={{ color: "rgba(252,248,238,0.92)" }}>
                Our wound care program is led by certified specialists with hospital-level training. We pair evidence-based protocols with close follow-up so chronic and complex wounds can finally heal.
              </p>
              <ul className="wound-list">
                <li>Chronic wound assessment and individualized care plans</li>
                <li>Diabetic ulcers, pressure injuries, and surgical wounds</li>
                <li>Compression therapy and advanced dressings</li>
                <li>Infection management and follow-up imaging</li>
              </ul>
              <button className="btn btn-light btn-lg" onClick={() => openBooking({ reason: "wound" })}>Start a wound care consult</button>
            </div>
            <div className="wound-visual">
              <BeforeAfterSlider />
              <p className="wound-caption font-mono">Illustrative case visualization · Treatment outcomes vary</p>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section id="team" className="team">
          <div className="container">
            <Reveal className="section-head">
              <div>
                <span className="eyebrow">{t.team.eyebrow}</span>
                <h2 className="font-display section-headline">{t.team.title_a} <em>{t.team.title_em}</em>{t.team.title_b}</h2>
              </div>
              <p className="lead">{t.team.lead}</p>
            </Reveal>
            <div className="filter-row" role="tablist" aria-label="Filter providers">
              {filtersTeam.map((f) => (
                <button
                  key={f.key}
                  className={`chip ${providerFilter === f.key ? "is-active" : ""}`}
                  onClick={() => setProviderFilter(f.key)}
                  role="tab"
                  aria-selected={providerFilter === f.key}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="team-grid">
              {filteredProviders.map((p, i) => (
                <article key={p.name} className="provider-card card-lift" onClick={() => setOpenProvider(p)} tabIndex={0} role="button" onKeyDown={(e) => { if (e.key === "Enter") setOpenProvider(p); }}>
                  <div className="provider-photo">
                    <img src={p.img} alt={p.name} loading="lazy" decoding="async" />
                    <div className="provider-photo-veil" />
                    {p.featured && <span className="provider-pill">{t.team.founder}</span>}
                    <span className="provider-num font-mono">№ {String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="provider-meta">
                    <h3 className="font-display">{p.name}</h3>
                    <span className="provider-role">{p.role}</span>
                    <span className="provider-specialty">{p.specialty}</span>
                    {p.accepting && <span className="tag tag-accepting">{t.team.accepting}</span>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* RECOGNITIONS */}
        <section className="recognitions">
          <div className="container">
            <span className="font-mono small-label" style={{ color: "rgba(252,248,238,0.6)" }}>RECOGNIZED FOR</span>
            <div className="recognition-grid">
              {RECOGNITIONS.map((r) => (
                <div className="rec-card" key={r.name}>
                  <strong className="font-display">{r.name}</strong>
                  <span>{r.explain}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOUNDER */}
        <section className="founder">
          <div className="container founder-grid">
            <figure className="founder-photo">
              <img src={founderPortrait} alt="Stephen Andy Rohrer, cofounder" />
            </figure>
            <div>
              <span className="eyebrow">{t.founder.eyebrow}</span>
              <p className="founder-letter font-display">{t.founder.letter}</p>
              <div className="founder-sig">
                <svg viewBox="0 0 240 60" width="180" height="44" fill="none" stroke="var(--forest)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 35 C 25 5, 45 60, 70 28 S 110 50, 130 22 S 170 60, 200 30 S 235 15, 238 28" />
                </svg>
                <div>
                  <strong className="font-display">{t.founder.sig}</strong>
                  <span>{t.founder.title}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS — drenched */}
        <section className="testimonials">
          <div className="container testimonials-grid">
            <div>
              <span className="eyebrow eyebrow-light">{t.reviews.eyebrow}</span>
              <h2 className="font-display section-headline" style={{ color: "var(--bone)" }}>{t.reviews.title_a} <em style={{ color: "var(--terracotta-pale)" }}>{t.reviews.title_em}</em>{t.reviews.title_b}</h2>
              <div className="t-rating">
                <div className="t-stars" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1">
                      <path d="m12 17.27 5.18 3.04-1.37-5.91L20.36 9.5l-6.06-.52L12 3.5l-2.3 5.48L3.64 9.5l4.55 4.9-1.37 5.91Z" />
                    </svg>
                  ))}
                </div>
                <span className="font-mono small-label">{t.reviews.avg}</span>
              </div>
              <a className="t-google" href="https://www.google.com/search?q=Harmony+Health+Clinic+Wynne+AR+reviews" target="_blank" rel="noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.45-1.13 2.68-2.4 3.5v2.91h3.88c2.27-2.09 3.57-5.18 3.57-8.65z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-2.91c-1.07.72-2.45 1.16-4.05 1.16-3.12 0-5.76-2.1-6.7-4.92H1.3v3.09C3.27 21.31 7.32 24 12 24z" />
                  <path fill="#FBBC05" d="M5.3 14.42c-.24-.72-.38-1.49-.38-2.42s.14-1.7.38-2.42V6.49H1.3C.47 8.13 0 9.99 0 12s.47 3.87 1.3 5.51l4-3.09z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.32 0 3.27 2.69 1.3 6.49l4 3.09C6.24 6.85 8.88 4.75 12 4.75z" />
                </svg>
                <strong className="font-display">4.9</strong>
                <span>on Google · 312 reviews</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="t-stage" role="region" aria-label="Patient testimonials">
              {TESTIMONIALS.map((tm, i) => (
                <blockquote
                  key={tm.author}
                  className={`t-card ${activeTestimonial === i ? "is-active" : ""}`}
                  aria-hidden={activeTestimonial !== i}
                >
                  <p className="font-display t-quote">"{tm.quote}"</p>
                  <footer>
                    <strong>{tm.author}</strong>
                    <span> · {tm.location} · {tm.date}</span>
                  </footer>
                </blockquote>
              ))}
              <div className="t-controls">
                <button
                  className="t-arrow"
                  aria-label="Previous testimonial"
                  onClick={() => setActiveTestimonial((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div className="t-dots">
                  {TESTIMONIALS.map((tm, i) => (
                    <button
                      key={tm.author}
                      aria-label={`Show testimonial ${i + 1} of ${TESTIMONIALS.length}`}
                      aria-current={activeTestimonial === i}
                      className={activeTestimonial === i ? "is-active" : ""}
                      onClick={() => setActiveTestimonial(i)}
                    />
                  ))}
                </div>
                <button
                  className="t-arrow"
                  aria-label="Next testimonial"
                  onClick={() => setActiveTestimonial((i) => (i + 1) % TESTIMONIALS.length)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RESOURCES */}
        <section className="resources">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">{t.resources.eyebrow}</span>
                <h2 className="font-display section-headline">{t.resources.title_a} <em>{t.resources.title_em}</em>{t.resources.title_b}</h2>
              </div>
              <p className="lead">{t.resources.lead}</p>
            </div>
            <div className="resources-grid">
              {RESOURCES.map((r, i) => (
                <article className="resource-card card-lift" key={r.title}>
                  <div className="resource-img">
                    <img src={i === 0 ? clinicRoomImage : i === 1 ? aboutImage : servicesImage} alt="" loading="lazy" decoding="async" />
                  </div>
                  <span className="resource-tag">{r.tag}</span>
                  <h3 className="font-display">{r.title}</h3>
                  <p className="lead">{r.excerpt}</p>
                  <span className="font-mono small-label">{r.minutes} {t.resources.readmin}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="faq">
          <div className="container faq-grid">
            <div>
              <span className="eyebrow">{t.faq.eyebrow}</span>
              <h2 className="font-display section-headline">{t.faq.title_a} <em>{t.faq.title_em}</em>{t.faq.title_b}</h2>
              <p className="lead">{t.faq.lead}</p>
              <img className="faq-image" src={services2Image} alt="Calm clinic environment" />
            </div>
            <div className="faq-list">
              {FAQ.map((item, i) => (
                <div className={`faq-item ${openFaq === i ? "is-open" : ""}`} key={item.q}>
                  <button
                    className="faq-q"
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-a-${i}`}
                  >
                    <span className="font-display">{item.q}</span>
                    <span className="faq-icon" aria-hidden>{openFaq === i ? "−" : "+"}</span>
                  </button>
                  <div className="faq-a" id={`faq-a-${i}`} role="region">
                    <p className="lead">{item.a}</p>
                    {item.cta && item.cta.target && (
                      <button className="faq-link" onClick={() => scrollTo(item.cta.target)}>
                        {item.cta.label} →
                      </button>
                    )}
                    {item.cta && item.cta.external && (
                      <a className="faq-link" href={item.cta.external} target="_blank" rel="noreferrer">
                        {item.cta.label} ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CAREERS */}
        <section className="careers">
          <div className="container careers-grid">
            <figure className="careers-photo">
              <img src={teamImage} alt="Harmony Health team" />
            </figure>
            <div>
              <span className="eyebrow eyebrow-gold">{t.careers.eyebrow}</span>
              <h2 className="font-display section-headline">{t.careers.title}</h2>
              <p className="lead">{t.careers.lead}</p>
              <a className="btn btn-primary" href="https://www.harmonyhealthclinic.com/about/careers/" target="_blank" rel="noreferrer">{t.careers.cta} ↗</a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="book" className="cta">
          <div className="container cta-card grain">
            <div className="cta-copy">
              <span className="eyebrow eyebrow-light">{t.cta.eyebrow}</span>
              <h2 className="font-display" style={{ color: "var(--bone)" }}>{t.cta.title_a} <em style={{ color: "var(--terracotta-pale)" }}>{t.cta.title_em}</em>{t.cta.title_b}</h2>
              <p className="lead lead-lg" style={{ color: "rgba(252,248,238,0.9)", maxWidth: "56ch" }}>{t.cta.lead}</p>
            </div>
            <div className="cta-actions">
              <button className="btn btn-terracotta btn-lg" onClick={() => openBooking({})}>{t.cta.btn_a}</button>
              <a className="btn btn-light" href="https://epicconnect.org/ccprd/CommunityConnect/mychartcc.html" target="_blank" rel="noreferrer">{t.cta.btn_b}</a>
            </div>
            <div className="cta-orbit" aria-hidden="true">
              <div className="orbit-ring spin-slow" />
              <div className="orbit-dot orbit-dot-1" />
              <div className="orbit-dot orbit-dot-2" />
              <div className="orbit-dot orbit-dot-3" />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <img src={harmonyLogo} alt="Harmony Health Clinic" className="footer-logo" />
            <p className="lead">Primary and urgent care across East Arkansas. Family medicine, pediatrics, women health, and advanced wound care.</p>
            <span className="font-mono small-label">© {new Date().getFullYear()} {t.footer.copy}</span>
            <p className="footer-credentials">
              Harmony Health Clinic, PLLC · Tax ID and NPI on file with each location.
            </p>
          </div>
          <div>
            <span className="font-mono small-label">{t.footer.care.toUpperCase()}</span>
            <ul>
              <li><button onClick={() => scrollTo("services")} className="footer-link">{t.nav.services}</button></li>
              <li><button onClick={() => scrollTo("team")} className="footer-link">{t.nav.team}</button></li>
              <li><button onClick={() => scrollTo("wound-care")} className="footer-link">{t.nav.wound}</button></li>
              <li><button onClick={() => scrollTo("locations")} className="footer-link">{t.nav.locations}</button></li>
            </ul>
          </div>
          <div>
            <span className="font-mono small-label">{t.footer.patients.toUpperCase()}</span>
            <ul>
              <li><a className="footer-link" href="https://epicconnect.org/ccprd/CommunityConnect/mychartcc.html" target="_blank" rel="noreferrer">{t.nav.portal}</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/new-patient/" target="_blank" rel="noreferrer">New patient</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/about/careers/" target="_blank" rel="noreferrer">Careers</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/contact/" target="_blank" rel="noreferrer">Contact</a></li>
            </ul>
          </div>
          <div>
            <span className="font-mono small-label">{t.footer.hours.toUpperCase()}</span>
            <ul>
              <li>Mon to Fri</li>
              <li>8:00 a.m. to 5:00 p.m.</li>
              <li>Closed Sat, Sun</li>
            </ul>
            <span className="font-mono small-label" style={{ marginTop: "1rem", display: "block" }}>{t.footer.legal.toUpperCase()}</span>
            <ul>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/privacy-policy/" target="_blank" rel="noreferrer">Privacy Policy</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/" target="_blank" rel="noreferrer">Notice of Privacy Practices</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/accessibility-statement/" target="_blank" rel="noreferrer">{t.footer.access}</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/" target="_blank" rel="noreferrer">{t.footer.hipaa}</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/" target="_blank" rel="noreferrer">Non-Discrimination, Section 1557</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/" target="_blank" rel="noreferrer">Good Faith Estimate</a></li>
            </ul>
          </div>
        </div>
        <div className="container footer-compliance">
          <p className="lead">
            Language assistance services are available free of charge. Servicios de asistencia lingüística están disponibles sin costo. Call (870) 238-3300 for translation in your preferred language.
          </p>
          <p className="lead">
            Harmony Health Clinic complies with applicable Federal civil rights laws and does not discriminate on the basis of race, color, national origin, age, disability, or sex.
          </p>
        </div>
      </footer>

      {/* MOBILE STICKY BAR */}
      <div className="mobile-bar" aria-label="Quick actions">
        <a className="mobile-action" href={`tel:${currentLoc.phone.replace(/[^0-9]/g, "")}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92V20a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3.08a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span>{t.mobile.call}</span>
        </a>
        <a className="mobile-action" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentLoc.address)}`} target="_blank" rel="noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          <span>{t.mobile.directions}</span>
        </a>
        <button className="mobile-action mobile-action-cta" onClick={() => openBooking({})}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
          <span>{t.mobile.book}</span>
        </button>
      </div>

      {/* PROVIDER MODAL */}
      {openProvider && (
        <div className="modal-backdrop" onClick={() => setOpenProvider(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="modal-close" onClick={() => setOpenProvider(null)} aria-label={t.sr.close}>×</button>
            <div className="modal-head">
              <div className="modal-photo">
                <img src={openProvider.img} alt={openProvider.name} />
              </div>
              <div>
                <h3 className="font-display">{openProvider.name}</h3>
                <p className="provider-role">{openProvider.role}</p>
                <p className="provider-specialty">{openProvider.specialty}</p>
              </div>
            </div>
            <p className="lead">{openProvider.bio}</p>
            {openProvider.education && (
              <>
                <span className="font-mono small-label">EDUCATION</span>
                <ul className="modal-list">
                  {openProvider.education.map((e) => (<li key={e}>{e}</li>))}
                </ul>
              </>
            )}
            <button className="btn btn-primary" onClick={() => { setOpenProvider(null); openBooking({ provider: openProvider.name }); }}>
              {t.team.schedule_with}
            </button>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        t={t}
        locations={LOCATIONS}
        providers={PROVIDERS}
        defaultReason={bookingDefaults.reason}
        defaultLocation={bookingDefaults.location}
        defaultProvider={bookingDefaults.provider}
      />
    </div>
  );
}

const styles = `
.hh-app { position: relative; }

.preloader { position: fixed; inset: 0; background: var(--forest-deep); display: flex; align-items: center; justify-content: center; z-index: 100; animation: preload-out 0.8s cubic-bezier(0.22,1,0.36,1) 1.4s forwards; }
.preloader-inner { display: flex; flex-direction: column; align-items: center; gap: 1.2rem; }
.preload-label { color: var(--bone); letter-spacing: 0.32em; font-size: 0.7rem; opacity: 0.7; }

/* ANNOUNCEMENT MARQUEE */
.announce { background: var(--forest-deep); color: var(--bone); padding: 0.65rem 0; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05); position: relative; }
.announce::before, .announce::after { content: ""; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none; }
.announce::before { left: 0; background: linear-gradient(90deg, var(--forest-deep), transparent); }
.announce::after { right: 0; background: linear-gradient(270deg, var(--forest-deep), transparent); }
.announce-track { display: flex; gap: 2.6rem; white-space: nowrap; width: max-content; animation: ticker 80s linear infinite; }
.announce:hover .announce-track { animation-play-state: paused; }
.announce-row { display: inline-flex; gap: 2.6rem; padding-right: 2.6rem; align-items: center; font-family: "JetBrains Mono", monospace; font-size: 0.78rem; letter-spacing: 0.1em; color: rgba(252,248,238,0.86); }
.announce-dot { color: var(--terracotta); font-size: 0.4rem; }

/* TRUST MICRO-ROW */
.hero-v2-trust { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.6rem; }
.trust-pill { display: inline-flex; align-items: center; gap: 0.45rem; background: rgba(252,248,238,0.08); border: 1px solid rgba(252,248,238,0.18); color: rgba(252,248,238,0.92); padding: 0.45rem 0.85rem; border-radius: 999px; font-size: 0.82rem; font-weight: 500; }
.trust-pill svg { color: var(--terracotta-pale); }

.section-headline { font-size: clamp(1.9rem, 4vw, 3.6rem); line-height: 1.06; color: var(--forest-deep); margin: 0.6rem 0 0; max-width: 16ch; font-weight: 400; letter-spacing: -0.022em; }
.section-headline em { color: var(--terracotta-deep); font-style: italic; font-weight: 400; }
.section-head { display: grid; grid-template-columns: 1fr 1.1fr; gap: 2rem; align-items: end; margin-bottom: 2rem; }

/* ============= NAV ============= */
.nav { position: sticky; top: 0; z-index: 40; backdrop-filter: blur(16px); background: rgba(248, 244, 236, 0.78); border-bottom: 1px solid transparent; transition: 280ms ease; }
.nav.is-scrolled { background: rgba(248, 244, 236, 0.97); border-bottom-color: var(--line); box-shadow: 0 8px 28px -22px rgba(15,28,20,0.4); }
.nav-inner { height: 78px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.brand img { height: 36px; width: auto; }
.nav-links { display: flex; align-items: center; gap: 1.6rem; color: var(--ink-soft); font-size: 0.94rem; }
.nav-links button, .nav-links a { background: none; border: none; cursor: pointer; color: inherit; font: inherit; padding: 0; transition: color 200ms; }
.nav-links button:hover, .nav-links a:hover { color: var(--forest); }
.nav-cta { padding: 0.7rem 1.3rem; min-height: 44px; }
.nav-lang-group { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.35rem 0.7rem; border: 1px solid var(--line-strong); border-radius: 999px; font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; letter-spacing: 0.12em; }
.nav-lang-group button { background: none; border: none; cursor: pointer; padding: 0.18rem 0.32rem; color: var(--ink-mute); font: inherit; transition: 200ms ease; min-height: 28px; border-radius: 999px; }
.nav-lang-group button:hover { color: var(--forest); }
.nav-lang-group .nav-lang-active { color: var(--forest); background: var(--ivory-deep); }
.nav-lang-group span { color: var(--ink-mute); opacity: 0.5; }
.nav-toggle { display: none; flex-direction: column; gap: 4px; background: none; border: 1px solid var(--line-strong); border-radius: 10px; padding: 0.55rem 0.65rem; cursor: pointer; min-height: 44px; }
.nav-toggle span { width: 20px; height: 2px; background: var(--forest); border-radius: 2px; }

/* ============= HERO V2 — FULL-BLEED VIDEO ============= */
.hero-v2 {
  position: relative;
  min-height: calc(100vh - 78px);
  color: var(--bone);
  overflow: hidden;
  background: var(--forest-deep);
  isolation: isolate;
}
.hero-v2-bg {
  position: absolute; inset: 0; z-index: 0;
  overflow: hidden;
}
.hero-v2-bg img,
.hero-v2-bg video {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
  filter: saturate(1.06) contrast(1.04);
  /* Strong crop — encoded letterboxing needs zoom past cover */
  transform: scale(1.52);
  transform-origin: center center;
}
.hero-v2-video {
  will-change: transform, opacity;
  background: var(--forest-deep);
  opacity: 0;
  transition: opacity 0.55s ease-out;
}
.hero-v2-video.hero-v2-video--visible {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .hero-v2-video.hero-v2-video--visible {
    transition: opacity 0.2s ease-out;
  }
}
.hero-v2-veil {
  position: absolute; inset: 0;
  background:
    linear-gradient(105deg,
      rgba(12,24,18,0.92) 0%,
      rgba(12,24,18,0.78) 25%,
      rgba(12,24,18,0.5) 45%,
      rgba(12,24,18,0.18) 65%,
      rgba(12,24,18,0.05) 100%
    ),
    linear-gradient(0deg, rgba(12,24,18,0.55) 0%, rgba(12,24,18,0.0) 35%, rgba(12,24,18,0) 65%, rgba(12,24,18,0.35) 100%);
  pointer-events: none;
}
.hero-v2-vignette {
  position: absolute; inset: 0;
  background: radial-gradient(140% 90% at 30% 50%, rgba(12,24,18,0.0) 0%, rgba(12,24,18,0.15) 60%, rgba(12,24,18,0.55) 100%);
  pointer-events: none;
}

.hero-v2-content {
  position: relative;
  z-index: 2;
  min-height: calc(100vh - 78px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5rem 0 4rem;
  gap: 1.5rem;
  max-width: min(1240px, calc(100% - 2.4rem));
}

.hero-v2-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(252,248,238,0.78);
  font-size: 0.78rem;
  flex-wrap: wrap;
  letter-spacing: 0.18em;
}
.hero-v2-meta .font-mono { letter-spacing: 0.18em; }

.hero-v2-headline {
  font-size: clamp(2.4rem, 8.2vw, 8.4rem);
  line-height: 0.95;
  color: var(--bone);
  font-weight: 400;
  letter-spacing: -0.03em;
  margin: 0;
  max-width: 16ch;
  text-shadow: 0 2px 30px rgba(0,0,0,0.25);
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: none;
}
.hero-v2-headline em {
  color: var(--terracotta-pale);
  font-style: italic;
  font-weight: 400;
  padding-right: 0.06em;
}

.hero-v2-lead {
  color: rgba(252,248,238,0.92);
  font-size: 1.12rem;
  line-height: 1.7;
  max-width: 52ch;
  margin: 0;
  text-shadow: 0 1px 16px rgba(0,0,0,0.4);
}

.hero-v2-actions {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 0.4rem;
}
.hero-v2-actions .btn-light {
  background: rgba(252,248,238,0.08);
  border-color: rgba(252,248,238,0.28);
  backdrop-filter: blur(10px);
}
.hero-v2-actions .btn-light:hover {
  background: rgba(252,248,238,0.16);
  border-color: rgba(252,248,238,0.48);
}

.hero-v2-foot {
  display: flex;
  gap: 2.6rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(252,248,238,0.18);
  margin-top: 1.6rem;
  flex-wrap: wrap;
  max-width: 700px;
}
.hero-v2-foot div { display: flex; flex-direction: column; gap: 0.18rem; }
.hero-v2-foot strong { font-size: 1.7rem; color: var(--bone); font-weight: 400; }
.hero-v2-foot span { color: rgba(252,248,238,0.65); font-size: 0.84rem; letter-spacing: 0.04em; }

.hero-v2-card {
  position: absolute;
  right: max(2.4rem, calc((100% - 1240px) / 2 + 1.2rem));
  bottom: 5rem;
  background: rgba(252,248,238,0.96);
  color: var(--ink);
  padding: 1.2rem 1.4rem;
  border-radius: 22px;
  box-shadow: var(--shadow-strong);
  display: grid;
  gap: 0.45rem;
  max-width: 280px;
  border: 1px solid rgba(252,248,238,0.4);
  backdrop-filter: blur(14px);
}
.hero-v2-card strong { font-size: 1.05rem; color: var(--forest-deep); }
.hero-v2-card-btn {
  background: var(--forest);
  color: var(--bone);
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  min-height: 38px;
}
.hero-v2-card-btn:hover { background: var(--forest-deep); }

/* ============= PULL QUOTE ============= */
.pullquote { padding: 5rem 0 4.4rem; background: var(--sand-soft); position: relative; }
.pullquote-text { font-size: clamp(1.7rem, 4.8vw, 4.4rem); line-height: 1.05; color: var(--forest-deep); max-width: 22ch; margin: 0 0 1.8rem; font-weight: 400; letter-spacing: -0.022em; }
.pullquote-text em { color: var(--terracotta-deep); font-style: italic; font-weight: 400; }
.pullquote-mark { color: var(--terracotta); font-size: 2em; line-height: 0; position: relative; top: 0.2em; margin-right: 0.06em; }
.pullquote-attribution { display: flex; gap: 1.2rem; align-items: center; flex-wrap: wrap; }
.pullquote-attribution .small-label { color: var(--ink-mute); }

/* ============= INTENT ROUTER ============= */
.intent-router { padding: 4rem 0 3.6rem; background: var(--ivory); border-bottom: 1px solid var(--line); }
.intent-head { text-align: left; max-width: 60ch; margin-bottom: 2rem; }
.intent-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.intent-card { background: var(--bone); border: 1px solid var(--line); border-radius: 28px; padding: 1.8rem; text-align: left; cursor: pointer; display: grid; gap: 0.7rem; box-shadow: var(--shadow-soft); position: relative; }
.intent-num { position: absolute; top: 1.2rem; right: 1.4rem; color: var(--ink-mute); opacity: 0.5; font-size: 1.5rem; }
.intent-icon { width: 64px; height: 64px; border-radius: 18px; display: inline-flex; align-items: center; justify-content: center; }
.intent-card h3 { margin: 0.6rem 0 0; font-size: 1.4rem; color: var(--forest-deep); font-weight: 400; }
.intent-cta { margin-top: 0.6rem; display: inline-flex; gap: 0.3rem; color: var(--terracotta-deep); font-weight: 700; font-size: 0.92rem; }

/* ============= INSURANCE STRIP ============= */
.insurance-strip { padding: 1.6rem 0; background: var(--forest-deep); color: var(--bone); }
.insurance-strip-inner { display: flex; align-items: center; gap: 1.4rem; flex-wrap: wrap; }
.insurance-strip .small-label { color: rgba(252,248,238,0.65); }
.insurance-list-strip { display: flex; gap: 0.5rem; flex-wrap: wrap; flex: 1; }
.insurance-pill { font-size: 0.82rem; padding: 0.5rem 0.9rem; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.16); color: var(--bone); }
.insurance-strip a { color: var(--terracotta-pale); font-weight: 600; }

/* ============= STATS AS ART ============= */
.stats-art { background: linear-gradient(160deg, #0c1812 0%, #1a3329 60%, #294438 100%); color: var(--bone); padding: 5rem 0 4.4rem; position: relative; overflow: hidden; }
.stats-art::before { content: ""; position: absolute; inset: 0; background-image: radial-gradient(circle at 20% 20%, rgba(194,102,74,0.15), transparent 50%), radial-gradient(circle at 80% 80%, rgba(110,139,120,0.18), transparent 55%); pointer-events: none; }
.stats-art-head { display: grid; grid-template-columns: auto 1fr; gap: 2rem; align-items: end; margin-bottom: 2.4rem; }
.stats-art-head h2 { font-size: clamp(1.8rem, 3.4vw, 3rem); line-height: 1.06; color: var(--bone); margin: 0; max-width: 22ch; font-weight: 400; }
.stats-art-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0; border-top: 1px solid rgba(252,248,238,0.12); }
.stat-art { padding: 2.2rem 2rem; border-bottom: 1px solid rgba(252,248,238,0.12); border-right: 1px solid rgba(252,248,238,0.12); display: grid; grid-template-columns: auto 1fr; gap: 1.6rem; align-items: end; }
.stat-art:nth-child(2n) { border-right: none; }
.stat-art:nth-last-child(-n+2) { border-bottom: none; }
.stat-art strong { font-size: clamp(4rem, 11vw, 9rem); line-height: 0.86; color: var(--bone); font-weight: 400; letter-spacing: -0.05em; }
.stat-art span { color: rgba(252,248,238,0.65); display: block; margin-bottom: 0.4rem; }
.stat-art p { color: rgba(252,248,238,0.78); margin: 0; font-size: 0.96rem; line-height: 1.55; max-width: 36ch; }

/* ============= URGENT VS ER ============= */
.urgent-er { padding: 4.4rem 0; }
.urgent-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
.urgent-card { position: relative; background: var(--bone); border: 1px solid var(--line); border-radius: 30px; padding: 2.4rem; }
.urgent-uc { background: linear-gradient(180deg, var(--sand-soft), var(--bone)); border-color: rgba(176,136,56,0.4); }
.urgent-er-card { background: linear-gradient(180deg, rgba(194,102,74,0.12), var(--bone)); border-color: rgba(194,102,74,0.4); }
.urgent-num { font-size: 3.4rem; color: var(--terracotta); opacity: 0.5; line-height: 1; }
.urgent-card h3 { margin: 0.6rem 0 1rem; font-size: 1.5rem; color: var(--forest-deep); font-weight: 400; }
.urgent-card ul { list-style: none; padding: 0; margin: 0 0 1.6rem; display: grid; gap: 0.55rem; }
.urgent-card li { padding-left: 1.5rem; position: relative; color: var(--ink-soft); }
.urgent-card li::before { content: ""; position: absolute; left: 0; top: 0.55rem; width: 7px; height: 7px; border-radius: 999px; background: var(--terracotta); }
.urgent-promise { margin: 2.4rem 0 0; text-align: center; font-size: clamp(1.1rem, 2vw, 1.5rem); color: var(--forest-deep); font-style: italic; max-width: 36ch; margin-inline: auto; }

/* ============= SERVICES ============= */
.services-section { padding: 4.4rem 0; background: var(--ivory-deep); }
.services-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.2rem; }
.service-card { background: var(--bone); border: 1px solid var(--line); border-radius: 26px; padding: 2rem; box-shadow: var(--shadow-soft); display: flex; flex-direction: column; gap: 0.8rem; position: relative; }
.service-num { position: absolute; top: 1.4rem; right: 1.6rem; color: var(--ink-mute); opacity: 0.4; font-size: 1.2rem; letter-spacing: 0; }
.service-card h3 { margin: 0; font-size: 1.5rem; color: var(--forest); font-weight: 400; }
.service-icon { width: 60px; height: 60px; border-radius: 18px; display: inline-flex; align-items: center; justify-content: center; }
.service-link { margin-top: auto; display: inline-flex; align-items: center; gap: 0.4rem; background: none; border: none; color: var(--forest); font-weight: 600; font-size: 0.94rem; cursor: pointer; padding-top: 0.8rem; min-height: 44px; }
.service-link:hover { color: var(--terracotta-deep); }

/* ============= WOUND DRENCHED ============= */
.wound-drenched { padding: 5rem 0; background: linear-gradient(140deg, #a04e36 0%, #c2664a 50%, #d56e4f 100%); color: var(--bone); position: relative; overflow: hidden; }
.wound-drenched::after { content: ""; position: absolute; inset: 0; background-image: radial-gradient(circle at 80% 30%, rgba(255,255,255,0.18), transparent 50%); pointer-events: none; }
.wound-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; position: relative; z-index: 1; }
.wound-list { list-style: none; padding: 0; margin: 1.4rem 0 2rem; display: grid; gap: 0.6rem; }
.wound-list li { padding-left: 1.6rem; position: relative; color: rgba(252,248,238,0.92); font-size: 1.02rem; }
.wound-list li::before { content: ""; position: absolute; left: 0; top: 0.55rem; width: 8px; height: 8px; border-radius: 999px; background: var(--gold-pale); }
.wound-visual { display: grid; gap: 0.6rem; }
.wound-caption { color: rgba(252,248,238,0.6); font-size: 0.74rem; letter-spacing: 0.1em; }

.ba-slider { position: relative; aspect-ratio: 16 / 10; border-radius: 24px; overflow: hidden; cursor: ew-resize; user-select: none; background: var(--ivory-deep); box-shadow: var(--shadow-strong); border: 1px solid rgba(255,255,255,0.2); }
.ba-after, .ba-before { position: absolute; inset: 0; }
.ba-after svg, .ba-before svg { width: 100%; height: 100%; }
.ba-divider { position: absolute; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.95); pointer-events: none; transform: translateX(-1px); box-shadow: 0 0 24px rgba(0,0,0,0.45); }
.ba-knob { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 52px; height: 52px; border-radius: 999px; background: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 12px 30px rgba(0,0,0,0.5); }
.ba-tag { position: absolute; top: 1rem; padding: 0.36rem 0.8rem; border-radius: 999px; font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; pointer-events: none; }
.ba-tag-left { left: 1rem; background: rgba(160, 78, 54, 0.95); color: #fff; }
.ba-tag-right { right: 1rem; background: rgba(110, 139, 120, 0.95); color: #fff; }
.ba-hint { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); padding: 0.36rem 0.85rem; border-radius: 999px; background: rgba(255,255,255,0.92); color: var(--ink-soft); font-size: 0.75rem; pointer-events: none; }

/* ============= TEAM ============= */
.team { padding: 4.4rem 0; background: var(--ivory); }
.filter-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0 2.4rem; }
.chip { border: 1px solid var(--line-strong); background: transparent; border-radius: 999px; padding: 0.6rem 1rem; font-size: 0.86rem; color: var(--ink-soft); cursor: pointer; transition: 200ms ease; min-height: 44px; }
.chip:hover { border-color: var(--forest); color: var(--forest); }
.chip.is-active { background: var(--forest); color: var(--bone); border-color: var(--forest); }
.chip-static { border: 1px solid var(--line); background: var(--bone); border-radius: 999px; padding: 0.4rem 0.85rem; font-size: 0.82rem; color: var(--ink-soft); }
.team-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.4rem; }
.provider-card { background: var(--bone); border: 1px solid var(--line); border-radius: 28px; overflow: hidden; cursor: pointer; box-shadow: var(--shadow-soft); }
.provider-photo { position: relative; aspect-ratio: 4 / 5; overflow: hidden; }
.provider-photo { background: var(--forest); }
.provider-photo img {
  width: 100%; height: 100%; object-fit: cover;
  transform: scale(1);
  transition: 700ms cubic-bezier(0.22,1,0.36,1);
  filter: grayscale(0.92) contrast(1.06) brightness(0.96);
  mix-blend-mode: luminosity;
  opacity: 0.95;
}
.provider-card:hover .provider-photo img {
  transform: scale(1.04);
  filter: grayscale(0.4) contrast(1.04) brightness(1.0);
  mix-blend-mode: normal;
  opacity: 1;
}
.provider-photo-veil { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,35,25,0) 50%, rgba(20,35,25,0.5) 100%); }
.provider-pill { position: absolute; top: 1rem; left: 1rem; background: rgba(176,136,56,0.95); color: var(--bone); font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; padding: 0.34rem 0.75rem; border-radius: 999px; backdrop-filter: blur(6px); font-weight: 700; }
.provider-num { position: absolute; bottom: 1rem; right: 1rem; color: rgba(252,248,238,0.78); font-size: 0.7rem; letter-spacing: 0.12em; }
.provider-meta { padding: 1.2rem 1.3rem 1.4rem; display: flex; flex-direction: column; gap: 0.3rem; }
.provider-meta h3 { margin: 0; font-size: 1.15rem; color: var(--forest-deep); font-weight: 400; }
.provider-role { font-size: 0.86rem; color: var(--terracotta-deep); font-weight: 600; }
.provider-specialty { font-size: 0.8rem; color: var(--ink-mute); }

/* ============= LOCATIONS ============= */
.locations { padding: 4.4rem 0; background: var(--ivory-deep); }
.locations-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
.locations-side { display: flex; flex-direction: column; gap: 1.4rem; }
.loc-tabs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6rem; }
.loc-tab { background: var(--sand-soft); border: 1px solid var(--line); border-radius: 18px; padding: 1rem 1.1rem; cursor: pointer; text-align: left; display: flex; flex-direction: column; gap: 0.5rem; transition: 200ms ease; min-height: 44px; }
.loc-tab span:first-of-type { font-size: 1.15rem; color: var(--forest-deep); }
.loc-tab-meta { display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap; }
.loc-tab-meta .small-label { font-size: 0.7rem; }
.loc-tab:hover { border-color: var(--forest); }
.loc-tab.is-active { background: var(--forest); color: var(--bone); border-color: var(--forest); }
.loc-tab.is-active span:first-of-type { color: var(--bone); }
.loc-tab.is-active .loc-tab-meta .small-label { color: rgba(252,248,238,0.8); }
.loc-detail { background: var(--bone); border: 1px solid var(--line); border-radius: 24px; padding: 1.6rem; }
.loc-detail-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; gap: 0.5rem; flex-wrap: wrap; }
.loc-detail-head h3 { margin: 0; font-size: 1.6rem; color: var(--forest-deep); font-weight: 400; }
.loc-services { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.9rem; }
.loc-detail-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 1.2rem; }
.zip-form { background: var(--sand-soft); border: 1px solid var(--line); border-radius: 18px; padding: 1.2rem; display: flex; flex-direction: column; gap: 0.7rem; }
.zip-input { display: flex; gap: 0.5rem; }
.zip-input input { flex: 1; padding: 0.95rem 1rem; border-radius: 12px; border: 1px solid var(--line-strong); font: inherit; background: var(--bone); }
.zip-input input:focus { outline: none; border-color: var(--forest); box-shadow: var(--focus); }
.zip-result { margin: 0; color: var(--ink-soft); font-size: 0.95rem; }
.zip-result strong { color: var(--forest); font-size: 1.1rem; }
.zip-result.error { color: var(--terracotta-deep); }
.locations-map-wrap { display: flex; flex-direction: column; gap: 0.8rem; }
.locations-meta { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0 0.4rem; color: var(--ink-mute); }
.locations-meta strong { color: var(--forest); font-size: 1rem; font-weight: 400; }

/* ============= RECOGNITIONS ============= */
.recognitions { padding: 3.4rem 0; background: var(--forest-deep); color: var(--bone); }
.recognition-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 0.8rem; margin-top: 1.4rem; }
.rec-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 1.2rem; }
.rec-card strong { display: block; color: var(--bone); font-size: 1.05rem; margin-bottom: 0.4rem; font-weight: 400; }
.rec-card span { color: rgba(252,248,238,0.7); font-size: 0.84rem; line-height: 1.55; }

/* ============= FOUNDER ============= */
.founder { padding: 4.4rem 0; background: var(--bone); }
.founder-grid { display: grid; grid-template-columns: 0.6fr 1fr; gap: 4rem; align-items: center; }
.founder-photo { margin: 0; border-radius: 28px; overflow: hidden; aspect-ratio: 4 / 5; box-shadow: var(--shadow-strong); }
.founder-photo img { width: 100%; height: 100%; object-fit: cover; }
.founder-letter { font-size: clamp(1.5rem, 2.5vw, 2.4rem); line-height: 1.4; color: var(--forest-deep); margin: 1.2rem 0 1.6rem; max-width: 32ch; font-style: italic; font-weight: 400; }
.founder-sig { display: flex; gap: 1.2rem; align-items: center; padding-top: 1.2rem; border-top: 1px solid var(--line); }
.founder-sig strong { display: block; color: var(--forest-deep); font-weight: 400; }
.founder-sig span { color: var(--ink-mute); font-size: 0.9rem; }

/* ============= TESTIMONIALS ============= */
.testimonials { padding: 4.4rem 0; background: linear-gradient(140deg, #0c1812 0%, #1a3329 50%, #294438 100%); color: var(--bone); position: relative; overflow: hidden; }
.testimonials::after { content: ""; position: absolute; inset: 0; background-image: radial-gradient(circle at 20% 30%, rgba(232,160,133,0.18), transparent 60%), radial-gradient(circle at 80% 70%, rgba(110,139,120,0.18), transparent 60%); pointer-events: none; }
.testimonials-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 4rem; align-items: center; position: relative; z-index: 1; }
.t-rating { display: flex; align-items: center; gap: 0.7rem; margin: 0.8rem 0 1rem; }
.t-stars { display: inline-flex; gap: 0.18rem; }
.t-stage { position: relative; min-height: 320px; }
.t-card { position: absolute; inset: 0; opacity: 0; transition: opacity 700ms ease; padding: 0; margin: 0; }
.t-card.is-active { opacity: 1; }
.t-quote { font-size: clamp(1.4rem, 2.5vw, 2.1rem); line-height: 1.45; color: var(--bone); margin: 0 0 1.6rem; font-weight: 400; font-style: italic; }
.t-card footer { color: rgba(252,248,238,0.86); font-size: 0.96rem; }
.t-dots { display: flex; gap: 0.4rem; align-items: center; }
.t-dots button { width: 36px; height: 4px; border-radius: 4px; border: none; background: rgba(252,248,238,0.3); cursor: pointer; transition: 220ms ease; padding: 0; }
.t-dots button:hover { background: rgba(252,248,238,0.55); }
.t-dots button.is-active { background: var(--terracotta); }
.t-controls { position: absolute; bottom: -2.2rem; left: 0; right: 0; display: flex; align-items: center; gap: 0.8rem; }
.t-arrow { width: 40px; height: 40px; border-radius: 999px; border: 1px solid rgba(252,248,238,0.22); background: transparent; color: var(--bone); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: 200ms ease; }
.t-arrow:hover { background: rgba(252,248,238,0.08); border-color: rgba(252,248,238,0.4); }
.t-google { display: inline-flex; align-items: center; gap: 0.55rem; padding: 0.7rem 1rem; border-radius: 999px; background: rgba(252,248,238,0.06); border: 1px solid rgba(252,248,238,0.14); color: var(--bone); font-weight: 500; transition: 200ms ease; }
.t-google:hover { background: rgba(252,248,238,0.12); border-color: rgba(252,248,238,0.3); }
.t-google strong { font-size: 1.08rem; color: var(--bone); font-weight: 500; }
.t-google span { font-size: 0.84rem; color: rgba(252,248,238,0.78); }

/* FAQ DEEP LINK */
.faq-link { display: inline-flex; align-items: center; gap: 0.3rem; margin-top: 0.7rem; background: none; border: none; color: var(--terracotta-deep); font: inherit; font-weight: 600; font-size: 0.92rem; cursor: pointer; padding: 0; min-height: 32px; }
.faq-link:hover { color: var(--forest); }

/* PROVIDER PHOTO NORMALIZATION (subtle, doesn't kill the photo) */
.provider-photo::after {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(26,51,41,0.18) 0%, rgba(26,51,41,0) 30%, rgba(26,51,41,0) 60%, rgba(26,51,41,0.55) 100%);
  pointer-events: none;
}

/* FOOTER COMPLIANCE */
.footer-credentials { color: rgba(252,248,238,0.55); font-size: 0.82rem; margin: 1rem 0 0; line-height: 1.55; }
.footer-compliance { padding-top: 1.6rem; display: grid; gap: 0.6rem; }
.footer-compliance .lead { color: rgba(252,248,238,0.62); font-size: 0.84rem; max-width: 100%; line-height: 1.6; }

/* ============= RESOURCES ============= */
.resources { padding: 4.4rem 0; }
.resources-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.4rem; }
.resource-card { background: var(--bone); border: 1px solid var(--line); border-radius: 26px; padding: 1.5rem; box-shadow: var(--shadow-soft); display: flex; flex-direction: column; gap: 0.6rem; cursor: pointer; }
.resource-img { aspect-ratio: 16 / 10; border-radius: 18px; overflow: hidden; background: var(--ivory-deep); }
.resource-img img { width: 100%; height: 100%; object-fit: cover; }
.resource-tag { display: inline-flex; padding: 0.3rem 0.7rem; border-radius: 999px; background: rgba(110,139,120,0.18); color: var(--forest); font-size: 0.74rem; font-weight: 700; letter-spacing: 0.06em; align-self: flex-start; }
.resource-card h3 { margin: 0; color: var(--forest-deep); font-size: 1.18rem; font-weight: 400; }

/* ============= FAQ ============= */
.faq { padding: 4.4rem 0; background: var(--ivory-deep); }
.faq-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 4rem; align-items: start; }
.faq-image { margin-top: 1.5rem; border-radius: 22px; box-shadow: var(--shadow-card); width: 100%; height: auto; }
.faq-list { display: grid; gap: 0.5rem; }
.faq-item { background: var(--bone); border: 1px solid var(--line); border-radius: 20px; overflow: hidden; }
.faq-q { width: 100%; background: none; border: none; padding: 1.4rem 1.4rem; text-align: left; display: flex; justify-content: space-between; align-items: center; gap: 1rem; cursor: pointer; font: inherit; color: var(--forest-deep); min-height: 44px; }
.faq-q span:first-of-type { font-size: 1.08rem; font-weight: 400; }
.faq-icon { font-size: 1.5rem; color: var(--terracotta); width: 24px; text-align: center; }
.faq-a { max-height: 0; overflow: hidden; transition: max-height 320ms ease, padding 320ms ease; padding: 0 1.4rem; }
.faq-item.is-open .faq-a { max-height: 360px; padding: 0 1.4rem 1.4rem; }

/* ============= CAREERS ============= */
.careers { padding: 4.4rem 0; }
.careers-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 4rem; align-items: center; }
.careers-photo { margin: 0; border-radius: 28px; overflow: hidden; aspect-ratio: 5 / 4; box-shadow: var(--shadow-card); }
.careers-photo img { width: 100%; height: 100%; object-fit: cover; }

/* ============= CTA ============= */
.cta { padding: 5rem 0 6rem; }
.cta-card { position: relative; background: linear-gradient(120deg, #0c1812 0%, #1a3329 50%, #3f6353 100%); color: var(--bone); border-radius: 40px; padding: 4.5rem; display: grid; grid-template-columns: 1.3fr auto; gap: 2rem; align-items: center; overflow: hidden; isolation: isolate; }
.cta-card h2 { font-size: clamp(2.2rem, 4.4vw, 4rem); line-height: 1.04; margin: 0.8rem 0 1rem; max-width: 16ch; font-weight: 400; }
.cta-card h2 em { font-style: italic; font-weight: 400; }
.cta-actions { display: flex; flex-direction: column; gap: 0.7rem; min-width: 240px; position: relative; z-index: 2; }
.cta-orbit { position: absolute; right: -120px; top: 50%; transform: translateY(-50%); width: 460px; height: 460px; pointer-events: none; opacity: 0.55; }
.orbit-ring { position: absolute; inset: 0; border-radius: 999px; border: 1px dashed rgba(255,255,255,0.18); }
.orbit-dot { position: absolute; width: 10px; height: 10px; border-radius: 999px; background: var(--terracotta); box-shadow: 0 0 24px rgba(194,102,74,0.7); }
.orbit-dot-1 { top: 0; left: 50%; transform: translateX(-50%); }
.orbit-dot-2 { bottom: 0; left: 50%; transform: translateX(-50%); background: var(--gold); }
.orbit-dot-3 { top: 50%; left: 0; transform: translateY(-50%); background: var(--sage-light); }

/* ============= FOOTER ============= */
.footer { background: var(--forest-deep); color: rgba(252, 248, 238, 0.78); padding: 4rem 0 5rem; }
.footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 2.4rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.footer .small-label { color: var(--bone); }
.footer-logo { height: 32px; width: auto; filter: brightness(0) invert(1); margin-bottom: 0.9rem; opacity: 0.88; }
.footer .lead { color: rgba(252, 248, 238, 0.7); }
.footer ul { list-style: none; padding: 0; margin: 0.7rem 0 0; display: grid; gap: 0.4rem; }
.footer-link { background: none; border: none; padding: 0; cursor: pointer; color: rgba(252, 248, 238, 0.78); font: inherit; transition: color 200ms; text-align: left; }
.footer-link:hover { color: var(--bone); }

.modal-backdrop { position: fixed; inset: 0; background: rgba(12, 24, 18, 0.7); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 80; padding: 1.4rem; animation: fade-in 220ms ease-out both; }
.modal-card { background: var(--bone); border-radius: 32px; max-width: 580px; width: 100%; max-height: 86vh; overflow-y: auto; padding: 2rem; position: relative; box-shadow: var(--shadow-strong); animation: scale-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.modal-close { position: absolute; top: 0.9rem; right: 1rem; width: 38px; height: 38px; border-radius: 999px; border: 1px solid var(--line); background: var(--bone); cursor: pointer; font-size: 1.4rem; line-height: 1; }
.modal-head { display: flex; gap: 1.1rem; align-items: center; margin-bottom: 1rem; }
.modal-photo { width: 88px; height: 88px; border-radius: 999px; overflow: hidden; flex-shrink: 0; }
.modal-photo img { width: 100%; height: 100%; object-fit: cover; }
.modal-head h3 { margin: 0; font-size: 1.4rem; color: var(--forest-deep); font-weight: 400; }
.modal-list { list-style: none; padding: 0; margin: 0.5rem 0 1.4rem; display: grid; gap: 0.35rem; color: var(--ink-soft); font-size: 0.92rem; }
.modal-list li { padding-left: 1rem; position: relative; }
.modal-list li::before { content: "•"; position: absolute; left: 0; color: var(--terracotta); }

.mobile-bar {
  position: fixed; left: 0; right: 0; bottom: 0;
  background: rgba(252, 248, 238, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-top: 1px solid var(--line);
  padding: 0.5rem 0.7rem calc(0.5rem + env(safe-area-inset-bottom));
  display: none; gap: 0.4rem; z-index: 60;
  box-shadow: 0 -16px 40px -16px rgba(15,28,20,0.22);
}
.mobile-action {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.18rem;
  padding: 0.7rem 0.3rem;
  border-radius: 16px;
  background: var(--ivory-deep);
  color: var(--forest-deep);
  border: none; cursor: pointer; font: inherit;
  min-height: 60px;
  transition: 200ms ease;
}
.mobile-action:active { transform: scale(0.96); }
.mobile-action span { font-size: 0.74rem; font-weight: 700; letter-spacing: 0.02em; }
.mobile-action-cta {
  background: var(--forest); color: var(--bone);
  flex: 1.3;
  box-shadow: 0 12px 28px -10px rgba(26,51,41,0.6);
}
.mobile-action-cta:active { background: var(--forest-deep); }

/* MOBILE FULLSCREEN MENU */
.m-menu {
  position: fixed; inset: 0; z-index: 90;
  background: var(--forest-deep); color: var(--bone);
  display: flex; flex-direction: column;
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
  transition: transform 480ms cubic-bezier(0.65, 0, 0.35, 1), opacity 240ms ease;
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
}
.m-menu.is-open { transform: translateY(0); opacity: 1; pointer-events: auto; }
.m-menu-head { display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 1.4rem; border-bottom: 1px solid rgba(252,248,238,0.1); }
.m-menu-logo { height: 32px; width: auto; filter: brightness(0) invert(1); opacity: 0.9; }
.m-menu-close { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); color: var(--bone); width: 44px; height: 44px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
.m-menu-close:active { background: rgba(255,255,255,0.16); }
.m-menu-nav { display: flex; flex-direction: column; padding: 1.4rem 0; flex: 1; overflow-y: auto; }
.m-menu-nav button {
  background: none; border: none; cursor: pointer;
  color: var(--bone); font: inherit; text-align: left;
  display: flex; align-items: baseline; gap: 1.2rem;
  padding: 1rem 1.4rem;
  border-bottom: 1px solid rgba(252,248,238,0.06);
  transition: background 220ms ease;
}
.m-menu-nav button:active { background: rgba(252,248,238,0.06); }
.m-menu-nav button .font-mono { font-size: 0.75rem; color: rgba(252,248,238,0.45); letter-spacing: 0.18em; min-width: 36px; }
.m-menu-nav button .font-display { font-size: clamp(1.7rem, 8vw, 2.4rem); line-height: 1.1; color: var(--bone); }

.m-menu-foot { padding: 1.4rem; display: grid; gap: 0.6rem; border-top: 1px solid rgba(252,248,238,0.1); }
.m-menu-portal, .m-menu-call, .m-menu-lang {
  display: flex; flex-direction: column; gap: 0.2rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 0.95rem 1.1rem;
  color: var(--bone);
  cursor: pointer; font: inherit; text-align: left;
  min-height: 60px;
  transition: 200ms ease;
}
.m-menu-portal:active, .m-menu-call:active, .m-menu-lang:active { background: rgba(255,255,255,0.12); }
.m-menu-portal .small-label, .m-menu-call .small-label, .m-menu-lang .small-label { color: rgba(252,248,238,0.6); }
.m-menu-portal strong, .m-menu-call strong, .m-menu-lang strong { color: var(--bone); font-weight: 400; font-size: 1.05rem; }
.m-menu-cta { width: 100%; min-height: 60px; font-size: 1.08rem; }

/* ============= RESPONSIVE ============= */
@media (max-width: 1080px) {
  .hero-v2-grid, .urgent-grid, .wound-grid, .locations-grid, .testimonials-grid, .faq-grid, .founder-grid, .careers-grid { grid-template-columns: 1fr; }
  .section-head, .stats-art-head { grid-template-columns: 1fr; }
  .services-grid, .team-grid, .footer-grid, .resources-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .intent-grid { grid-template-columns: 1fr; }
  .recognition-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .stats-art-grid { grid-template-columns: 1fr; }
  .stat-art { grid-template-columns: 1fr; gap: 0.6rem; padding: 2rem 1.2rem; border-right: none; }
  .stat-art:nth-child(2n) { border-right: none; }
  .stat-art:nth-last-child(-n+2) { border-bottom: 1px solid rgba(252,248,238,0.12); }
  .stat-art:last-child { border-bottom: none; }
  .cta-card { grid-template-columns: 1fr; padding: 2.6rem; }
  .cta-orbit { display: none; }
  .hero-v2 { min-height: auto; }
  .hero-v2-grid { min-height: auto; }
  .hero-v2-right { min-height: 420px; aspect-ratio: 4 / 3; }
  .hero-v2-left { padding: 4rem 5vw 3rem; }
}

@media (max-width: 820px) {
  .nav-toggle { display: inline-flex; }
  .nav-links-desktop { display: none; }
  .nav { background: rgba(248, 244, 236, 0.92); }
  .nav.is-scrolled { background: rgba(248, 244, 236, 0.98); }
  .nav-cta { display: none; }
  .nav-lang { display: none; }
  .mobile-bar { display: flex; }
  body { padding-bottom: calc(86px + env(safe-area-inset-bottom)); }
}

@media (max-width: 720px) {
  /* HERO MOBILE */
  .hero-v2 { min-height: 100vh; }
  .hero-v2-bg img,
  .hero-v2-bg video {
    filter: saturate(1.05) contrast(1.04) brightness(0.82);
    transform: scale(1.68);
  }
  .hero-v2-veil {
    background:
      linear-gradient(180deg, rgba(12,24,18,0.55) 0%, rgba(12,24,18,0.35) 30%, rgba(12,24,18,0.7) 70%, rgba(12,24,18,0.95) 100%);
  }
  .hero-v2-vignette { display: none; }
  .hero-v2-content {
    min-height: 100vh;
    padding: 4.5rem 0 2rem;
    justify-content: flex-end;
    gap: 1rem;
  }
  .hero-v2-meta { font-size: 0.7rem; gap: 0.7rem; }
  .hero-v2-headline {
    font-size: clamp(2rem, 10.5vw, 3.6rem);
    line-height: 0.98;
    max-width: 100%;
  }
  .hero-v2-headline em { padding-right: 0.04em; }
  .hero-v2-lead { font-size: 1rem; line-height: 1.6; max-width: 100%; }
  .hero-v2-actions { gap: 0.6rem; flex-direction: column; align-items: stretch; }
  .hero-v2-actions .btn { width: 100%; min-height: 56px; font-size: 1rem; }
  .hero-v2-foot {
    display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem 1rem;
    padding-top: 1.2rem;
    margin-top: 0.8rem;
  }
  .hero-v2-foot strong { font-size: 1.4rem; }
  .hero-v2-card { display: none; }

  /* PULL QUOTE */
  .pullquote { padding: 4.5rem 0; }
  .pullquote-text { font-size: clamp(1.8rem, 9vw, 2.6rem); max-width: 18ch; }

  /* INTENT ROUTER */
  .intent-router { padding: 4.5rem 0 4rem; }
  .intent-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    margin: 0 -1.2rem;
    padding: 0.5rem 1.2rem 1.2rem;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .intent-grid::-webkit-scrollbar { display: none; }
  .intent-card {
    scroll-snap-align: start;
    flex: 0 0 86%;
    min-width: 86%;
  }

  /* INSURANCE STRIP */
  .insurance-strip { padding: 1.2rem 0; }
  .insurance-strip-inner { gap: 0.8rem; }
  .insurance-list-strip { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 0.4rem; scrollbar-width: none; }
  .insurance-list-strip::-webkit-scrollbar { display: none; }
  .insurance-pill { white-space: nowrap; }

  /* STATS AS ART — confident vertical layout */
  .stats-art { padding: 5rem 0 4rem; }
  .stats-art-head { gap: 1rem; margin-bottom: 2.6rem; }
  .stats-art-head h2 { font-size: clamp(1.8rem, 6vw, 2.4rem); }
  .stats-art-grid {
    display: flex; flex-direction: column;
    border-top: 1px solid rgba(252,248,238,0.12);
  }
  .stat-art {
    grid-template-columns: 1fr; gap: 0.7rem;
    padding: 2.4rem 0.4rem;
    border-right: none;
    border-bottom: 1px solid rgba(252,248,238,0.12);
  }
  .stat-art:last-child { border-bottom: none; }
  .stat-art strong { font-size: clamp(5.2rem, 28vw, 8.4rem); line-height: 0.85; }
  .stat-art p { max-width: 38ch; }

  /* URGENT VS ER */
  .urgent-er { padding: 4.5rem 0; }
  .urgent-grid { grid-template-columns: 1fr; gap: 0.8rem; }
  .urgent-card { padding: 1.8rem; border-radius: 24px; }
  .urgent-num { font-size: 2.4rem; }
  .urgent-promise { font-size: 1rem; margin-top: 1.6rem; }

  /* SERVICES — horizontal snap scroll */
  .services-section { padding: 4.5rem 0; }
  .services-grid {
    display: flex; overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    margin: 0 -1.2rem;
    padding: 0.4rem 1.2rem 1.2rem;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .services-grid::-webkit-scrollbar { display: none; }
  .service-card {
    scroll-snap-align: start;
    flex: 0 0 80%;
    min-width: 80%;
    padding: 1.6rem;
  }

  /* WOUND */
  .wound-drenched { padding: 4.5rem 0; }
  .wound-grid { gap: 2rem; }
  .ba-knob { width: 44px; height: 44px; }

  /* TEAM — horizontal scroll snap */
  .team { padding: 4.5rem 0; }
  .filter-row {
    overflow-x: auto;
    flex-wrap: nowrap;
    margin: 0 -1.2rem 1.6rem;
    padding: 0.2rem 1.2rem 0.8rem;
    scrollbar-width: none;
  }
  .filter-row::-webkit-scrollbar { display: none; }
  .chip { flex-shrink: 0; }
  .team-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    margin: 0 -1.2rem;
    padding: 0.4rem 1.2rem 1.2rem;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .team-grid::-webkit-scrollbar { display: none; }
  .provider-card {
    scroll-snap-align: start;
    flex: 0 0 78%;
    min-width: 78%;
  }

  /* LOCATIONS */
  .locations { padding: 4.5rem 0; }
  .locations-grid { grid-template-columns: 1fr; gap: 1.6rem; }
  .loc-tabs { grid-template-columns: 1fr; }
  .loc-detail-actions .btn { flex: 1; min-width: 0; }
  .locations-map { height: 360px; }

  /* RECOGNITIONS */
  .recognitions { padding: 4rem 0; }
  .recognition-grid { grid-template-columns: 1fr; gap: 0.6rem; }
  .rec-card { padding: 1.1rem; }

  /* FOUNDER */
  .founder { padding: 4.5rem 0; }
  .founder-grid { gap: 2rem; }
  .founder-photo { aspect-ratio: 4 / 3; }
  .founder-letter { font-size: clamp(1.3rem, 5vw, 1.7rem); margin: 1rem 0 1.2rem; max-width: 100%; }

  /* TESTIMONIALS */
  .testimonials { padding: 4.5rem 0; }
  .testimonials-grid { gap: 2rem; }
  .t-stage { min-height: 280px; }
  .t-quote { font-size: clamp(1.2rem, 5vw, 1.5rem); }

  /* RESOURCES — horizontal scroll */
  .resources { padding: 4.5rem 0; }
  .resources-grid {
    display: flex; overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    margin: 0 -1.2rem;
    padding: 0.4rem 1.2rem 1.2rem;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .resources-grid::-webkit-scrollbar { display: none; }
  .resource-card {
    scroll-snap-align: start;
    flex: 0 0 80%;
    min-width: 80%;
  }

  /* FAQ */
  .faq { padding: 4.5rem 0; }
  .faq-grid { grid-template-columns: 1fr; gap: 2rem; }
  .faq-image { display: none; }
  .faq-q { padding: 1.1rem 1.2rem; }
  .faq-q span:first-of-type { font-size: 1rem; }

  /* CAREERS */
  .careers { padding: 4.5rem 0; }
  .careers-grid { grid-template-columns: 1fr; gap: 1.6rem; }
  .careers-photo { aspect-ratio: 16 / 10; }

  /* CTA */
  .cta { padding: 4.5rem 0 5.5rem; }
  .cta-card { padding: 2.4rem 1.6rem; border-radius: 28px; }
  .cta-card h2 { font-size: clamp(2rem, 9vw, 2.8rem); }
  .cta-actions { width: 100%; min-width: 0; }
  .cta-actions .btn { width: 100%; min-height: 56px; }

  /* FOOTER */
  .footer { padding: 3rem 0 1.6rem; }
  .footer-grid { grid-template-columns: 1fr; gap: 2rem; padding-bottom: 1.6rem; }

  /* MODALS — bottom sheet on mobile */
  .modal-backdrop { align-items: flex-end; padding: 0; }
  .modal-card {
    border-radius: 28px 28px 0 0;
    max-height: 92vh;
    padding: 1.4rem 1.2rem calc(1.4rem + env(safe-area-inset-bottom));
    animation: sheet-up 380ms cubic-bezier(0.22,1,0.36,1) both;
  }
  .modal-card::before {
    content: "";
    display: block;
    width: 40px;
    height: 4px;
    border-radius: 4px;
    background: rgba(26,51,41,0.18);
    margin: 0 auto 1.2rem;
  }
  .modal-close { top: 0.8rem; right: 0.9rem; }
  @keyframes sheet-up {
    from { transform: translateY(100%); opacity: 0.5; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* SECTION HEADS more breathing room */
  .section-head { gap: 1rem; margin-bottom: 1.8rem; }
  .section-headline { font-size: clamp(1.8rem, 7vw, 2.6rem); max-width: 18ch; }

  /* UNIVERSAL TAP STATE */
  .btn:active { transform: scale(0.98); }
  .chip:active, .loc-tab:active { transform: scale(0.97); }
  .intent-card:active, .service-card:active, .resource-card:active, .provider-card:active { transform: scale(0.99); }
}

@media (max-width: 480px) {
  .container { width: calc(100% - 1.6rem); }
}
`;
