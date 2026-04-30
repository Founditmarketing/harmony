import React, { useEffect, useMemo, useState } from "react";
import heroImage from "./assets/images/hero-new.jpg";
import aboutImage from "./assets/images/about.jpg";
import servicesImage from "./assets/images/services.jpg";
import teamImage from "./assets/images/team.jpg";
import telehealthImage from "./assets/images/telehealth-new.jpg";
import harmonyLogo from "./assets/images/harmony-logo.png";

const locations = [
  {
    name: "Wynne",
    address: "585 Falls Blvd S, Wynne, AR",
    phone: "870-238-3300",
    services: "Primary care, urgent care, wound care, pediatrics",
  },
  {
    name: "Osceola",
    address: "Osceola, AR",
    phone: "870-563-7700",
    services: "Family medicine, urgent care, women health",
  },
  {
    name: "Lonoke",
    address: "Lonoke, AR",
    phone: "501-676-3000",
    services: "Primary care, pediatrics, prevention",
  },
  {
    name: "Scott",
    address: "Scott, AR",
    phone: "501-961-1100",
    services: "Primary care, med-peds, chronic care",
  },
];

const serviceCards = [
  {
    title: "Primary Care",
    body: "Whole-family care with preventive screenings, chronic condition management, and same-week visits.",
  },
  {
    title: "Pediatrics",
    body: "Board-certified pediatric care for well checks, sick visits, vaccines, and parent guidance.",
  },
  {
    title: "Urgent Care",
    body: "Fast care for stitches, illness, minor injuries, x-rays, and treatment when timing matters.",
  },
  {
    title: "Wound Care",
    body: "Advanced wound management for healing support that goes beyond bandages and routine dressing changes.",
  },
  {
    title: "Women Health",
    body: "Comprehensive women-focused services including exams, preventive care, and ongoing support.",
  },
  {
    title: "Occupational Health",
    body: "Care pathways for workplace injuries and return-to-work planning with practical follow-up.",
  },
];

const providers = [
  {
    name: "Dr. Aaron Mitchell, MD",
    role: "Chief Medical Officer, Cofounder",
    bio: "Board-certified family medicine physician with deep experience in rural access, quality outcomes, and leadership.",
  },
  {
    name: "Stephen Andy Rohrer",
    role: "Chief Executive Officer, Cofounder",
    bio: "Advanced practice clinician focused on patient experience, access, and practical care delivery across East Arkansas.",
  },
  {
    name: "Dr. Hong-Van Nguyen, MD",
    role: "Pediatrics",
    bio: "Pediatric specialist centered on preventive care, family education, and child-friendly visits.",
  },
  {
    name: "Erica Dewey, MD",
    role: "Family Medicine",
    bio: "Family medicine physician passionate about women health, pediatric continuity, and prevention.",
  },
];

export default function HarmonyHealth() {
  const [activeLocation, setActiveLocation] = useState("Wynne");
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLocation = useMemo(
    () => locations.find((loc) => loc.name === activeLocation) ?? locations[0],
    [activeLocation],
  );

  useEffect(() => {
    document.title = "Harmony Health Clinic | Primary and Urgent Care";
  }, []);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  return (
    <div className="hh-root">
      <style>{`
        :root {
          --bg: #f4f7f5;
          --paper: #fbfcfb;
          --ink: #1f2c26;
          --muted: #56645e;
          --brand: #2b5d4a;
          --brand-soft: #d8e7df;
          --accent: #d07b54;
          --line: rgba(24, 40, 33, 0.14);
          --shadow: 0 22px 55px -26px rgba(22, 43, 34, 0.38);
        }
        * { box-sizing: border-box; }
        html, body, #root { margin: 0; min-height: 100%; font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; background: var(--bg); color: var(--ink); }
        a { color: inherit; text-decoration: none; }
        .container { width: min(1160px, calc(100% - 2.2rem)); margin: 0 auto; }
        .btn { border: 1px solid transparent; border-radius: 999px; padding: 0.78rem 1.25rem; font-weight: 600; font-size: 0.95rem; transition: 220ms ease; cursor: pointer; }
        .btn-primary { background: var(--brand); color: #f4f8f6; }
        .btn-primary:hover { transform: translateY(-1px); filter: brightness(0.95); }
        .btn-ghost { border-color: var(--line); background: var(--paper); }
        .btn-ghost:hover { border-color: var(--brand); color: var(--brand); }
        .nav { position: sticky; top: 0; z-index: 40; backdrop-filter: blur(9px); background: rgba(244, 247, 245, 0.92); border-bottom: 1px solid var(--line); }
        .nav-inner { height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .logo { height: 40px; width: auto; }
        .nav-links { display: flex; gap: 1.1rem; font-size: 0.93rem; color: var(--muted); }
        .nav-links button { border: none; background: none; color: inherit; font: inherit; cursor: pointer; }
        .hero { padding: 2.4rem 0 4rem; }
        .hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 2rem; align-items: center; }
        .eyebrow { display: inline-flex; gap: 0.5rem; align-items: center; background: var(--brand-soft); color: var(--brand); border-radius: 999px; padding: 0.4rem 0.7rem; font-weight: 600; font-size: 0.8rem; }
        h1 { margin: 1rem 0 1.1rem; font-size: clamp(2rem, 4vw, 3.9rem); line-height: 1.04; letter-spacing: -0.02em; }
        .lead { color: var(--muted); max-width: 62ch; line-height: 1.6; }
        .hero-actions { display: flex; gap: 0.75rem; margin-top: 1.4rem; flex-wrap: wrap; }
        .hero-card { border-radius: 28px; overflow: hidden; background: var(--paper); border: 1px solid var(--line); box-shadow: var(--shadow); }
        .hero-card img { width: 100%; height: 100%; min-height: 410px; object-fit: cover; display: block; }
        .stats { margin-top: 1.1rem; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.8rem; }
        .stat { background: var(--paper); border: 1px solid var(--line); border-radius: 16px; padding: 0.85rem; }
        .stat strong { font-size: 1.25rem; display: block; }
        .section { padding: 4rem 0; }
        .section h2 { font-size: clamp(1.6rem, 3vw, 2.6rem); line-height: 1.14; margin: 0 0 0.8rem; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.4rem; align-items: stretch; }
        .panel { background: var(--paper); border: 1px solid var(--line); border-radius: 24px; padding: 1.2rem; box-shadow: var(--shadow); }
        .panel img { width: 100%; border-radius: 18px; display: block; object-fit: cover; max-height: 300px; }
        .services { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.9rem; margin-top: 1rem; }
        .service { background: #f9fcfa; border: 1px solid var(--line); border-radius: 18px; padding: 1rem; }
        .service h3 { margin: 0 0 0.45rem; font-size: 1.05rem; }
        .team-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.9rem; margin-top: 1rem; }
        .provider { border: 1px solid var(--line); border-radius: 16px; padding: 0.9rem; background: #f8fbf9; }
        .loc-tabs { display: flex; flex-wrap: wrap; gap: 0.55rem; margin: 0.8rem 0 1rem; }
        .tab { padding: 0.5rem 0.8rem; border-radius: 999px; border: 1px solid var(--line); background: transparent; cursor: pointer; }
        .tab.active { background: var(--brand); color: #f4f8f6; border-color: var(--brand); }
        .split { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 1.1rem; }
        .testimonial { background: #1f3f32; color: #eff6f2; border-radius: 22px; padding: 1.4rem; }
        .testimonial p { color: #d9e8df; line-height: 1.65; }
        .cta { text-align: center; background: linear-gradient(120deg, #234838 0%, #2f6350 55%, #497865 100%); color: #f3f8f5; border-radius: 26px; padding: 2.2rem 1.2rem; }
        .footer { padding: 2rem 0 2.5rem; color: var(--muted); font-size: 0.9rem; }
        .mobile-toggle { display: none; }

        @media (max-width: 980px) {
          .hero-grid, .grid-2, .split { grid-template-columns: 1fr; }
          .services { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 760px) {
          .nav-links { display: ${mobileOpen ? "flex" : "none"}; position: absolute; top: 76px; left: 0; right: 0; padding: 0.95rem 1rem; background: var(--paper); border-bottom: 1px solid var(--line); flex-direction: column; }
          .mobile-toggle { display: inline-flex; border: 1px solid var(--line); border-radius: 10px; background: var(--paper); padding: 0.45rem 0.65rem; }
          .services, .team-list { grid-template-columns: 1fr; }
          .stats { grid-template-columns: 1fr; }
          h1 { font-size: clamp(1.85rem, 8vw, 2.55rem); }
        }
      `}</style>

      <nav className="nav">
        <div className="container nav-inner">
          <img src={harmonyLogo} alt="Harmony Health Clinic" className="logo" />
          <button className="mobile-toggle" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle navigation">
            Menu
          </button>
          <div className="nav-links">
            <button onClick={() => scrollToId("services")}>Services</button>
            <button onClick={() => scrollToId("team")}>Team</button>
            <button onClick={() => scrollToId("locations")}>Locations</button>
            <a href="https://epicconnect.org/ccprd/CommunityConnect/mychartcc.html" target="_blank" rel="noreferrer">Patient Portal</a>
            <button className="btn btn-primary" onClick={() => scrollToId("book")}>Book Visit</button>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Primary and Urgent Care in East Arkansas</span>
            <h1>A better healthcare experience, built for real life.</h1>
            <p className="lead">
              Harmony Health Clinic delivers primary care, pediatrics, urgent care, women health, and wound care with modern workflows and a hometown level of trust.
              We brought in real copy and core images from your current site, then redesigned the digital experience for clarity, speed, and conversion.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => scrollToId("book")}>Schedule Appointment</button>
              <a className="btn btn-ghost" href="https://www.harmonyhealthclinic.com/services/" target="_blank" rel="noreferrer">View Full Services</a>
            </div>
            <div className="stats" aria-label="Clinic highlights">
              <div className="stat"><strong>4</strong> Arkansas locations</div>
              <div className="stat"><strong>All ages</strong> Family-centered care</div>
              <div className="stat"><strong>Same week</strong> Access-first scheduling</div>
            </div>
          </div>
          <div className="hero-card">
            <img src={heroImage} alt="Clinician meeting with family in bright clinic space" />
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container grid-2">
          <article className="panel">
            <h2>Comprehensive care with modern clinical standards</h2>
            <p className="lead">
              Harmony Health is a full-service clinic with evidence-based medicine, in-house diagnostics, and community-centered care.
              This experience is designed to reduce friction from first click through follow-up care.
            </p>
            <img src={aboutImage} alt="Doctor speaking with patient" />
          </article>
          <article className="panel">
            <h2>Digital front door that feels premium and human</h2>
            <p className="lead">
              Strong hierarchy, focused content blocks, and simple actions improve confidence and guide more patients to schedule.
              The structure keeps critical information visible on every screen size.
            </p>
            <img src={telehealthImage} alt="Virtual care consultation" />
          </article>
        </div>
      </section>

      <section id="services" className="section">
        <div className="container">
          <h2>Core services patients search for most</h2>
          <p className="lead">Fast overview up front, deeper pathways as needed.</p>
          <div className="services">
            {serviceCards.map((service) => (
              <article key={service.title} className="service">
                <h3>{service.title}</h3>
                <p className="lead">{service.body}</p>
              </article>
            ))}
          </div>
          <div className="panel" style={{ marginTop: "1.1rem" }}>
            <img src={servicesImage} alt="Medical team working together" />
          </div>
        </div>
      </section>

      <section id="team" className="section">
        <div className="container split">
          <article className="panel">
            <h2>Trusted care team</h2>
            <p className="lead">Licensed physicians and advanced practice providers serving East Arkansas communities.</p>
            <div className="team-list">
              {providers.map((provider) => (
                <div className="provider" key={provider.name}>
                  <strong>{provider.name}</strong>
                  <p style={{ margin: "0.35rem 0", color: "var(--brand)", fontWeight: 600 }}>{provider.role}</p>
                  <p className="lead">{provider.bio}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="panel">
            <img src={teamImage} alt="Healthcare providers team" style={{ maxHeight: 360 }} />
            <a className="btn btn-ghost" href="https://www.harmonyhealthclinic.com/about/meet-the-team/" target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "1rem" }}>
              Read Full Provider Bios
            </a>
          </article>
        </div>
      </section>

      <section id="locations" className="section">
        <div className="container split">
          <article className="panel">
            <h2>Locations and contact</h2>
            <p className="lead">Pick your preferred clinic to get direct contact details quickly.</p>
            <div className="loc-tabs">
              {locations.map((loc) => (
                <button
                  key={loc.name}
                  className={`tab ${activeLocation === loc.name ? "active" : ""}`}
                  onClick={() => setActiveLocation(loc.name)}
                >
                  {loc.name}
                </button>
              ))}
            </div>
            <div className="provider">
              <strong>{currentLocation.name}</strong>
              <p className="lead">{currentLocation.address}</p>
              <p className="lead"><strong>Phone:</strong> {currentLocation.phone}</p>
              <p className="lead">{currentLocation.services}</p>
            </div>
          </article>
          <article className="testimonial">
            <h3 style={{ marginTop: 0, fontSize: "1.3rem" }}>What patients say</h3>
            <p>
              "It was my first visit to Harmony Health Clinic and overall it was a great experience. The staff was friendly and very knowledgeable."
            </p>
            <p>
              "The team is experienced and caring. They are focused on helping patients and finding care that fits real needs."
            </p>
            <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>Testimonials adapted from live site content.</p>
          </article>
        </div>
      </section>

      <section id="book" className="section">
        <div className="container cta">
          <h2 style={{ marginTop: 0 }}>Schedule your appointment today</h2>
          <p style={{ maxWidth: 700, margin: "0.6rem auto 1.2rem", lineHeight: 1.7, opacity: 0.95 }}>
            Need primary care, urgent care, pediatric support, or preventive checkups, Harmony Health Clinic is ready to help with faster access and trusted care.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.7rem", flexWrap: "wrap" }}>
            <a className="btn btn-ghost" href="https://www.harmonyhealthclinic.com/contact/" target="_blank" rel="noreferrer" style={{ background: "#f2f8f5" }}>Contact Clinic</a>
            <a className="btn btn-primary" href="https://epicconnect.org/ccprd/CommunityConnect/mychartcc.html" target="_blank" rel="noreferrer">Open Patient Portal</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap" }}>
          <span>Harmony Health Clinic, East Arkansas</span>
          <span>Mon to Fri, 8:00 a.m. to 5:00 p.m.</span>
          <a href="https://www.harmonyhealthclinic.com/" target="_blank" rel="noreferrer">Live Site Reference</a>
        </div>
      </footer>
    </div>
  );
}
