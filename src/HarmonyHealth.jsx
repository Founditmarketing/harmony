import React, { useEffect, useMemo, useRef, useState } from "react";
import heroImage from "../assets/images/hero-new.jpg";
import aboutImage from "../assets/images/about.jpg";
import servicesImage from "../assets/images/services.jpg";
import services2Image from "../assets/images/services2.jpg";
import teamImage from "../assets/images/team.jpg";
import telehealthImage from "../assets/images/telehealth-new.jpg";
import harmonyLogo from "../assets/images/harmony-logo.png";

const LOCATIONS = [
  {
    key: "wynne",
    name: "Wynne",
    address: "585 Falls Blvd S, Wynne, AR 72396",
    phone: "(870) 238-3300",
    hours: "Mon to Fri, 8:00 a.m. to 5:00 p.m.",
    services: ["Primary care", "Urgent care", "Wound care", "Pediatrics", "Women health"],
    coords: { x: 75, y: 32 },
    region: "Cross County",
  },
  {
    key: "osceola",
    name: "Osceola",
    address: "Osceola, AR",
    phone: "(870) 563-7700",
    hours: "Mon to Fri, 8:00 a.m. to 5:00 p.m.",
    services: ["Family medicine", "Urgent care", "Women health"],
    coords: { x: 85, y: 18 },
    region: "Mississippi County",
  },
  {
    key: "lonoke",
    name: "Lonoke",
    address: "Lonoke, AR",
    phone: "(501) 676-3000",
    hours: "Mon to Fri, 8:00 a.m. to 5:00 p.m.",
    services: ["Primary care", "Pediatrics", "Prevention"],
    coords: { x: 35, y: 65 },
    region: "Lonoke County",
  },
  {
    key: "scott",
    name: "Scott",
    address: "Scott, AR",
    phone: "(501) 961-1100",
    hours: "Mon to Fri, 8:00 a.m. to 5:00 p.m.",
    services: ["Primary care", "Med-Peds", "Chronic care"],
    coords: { x: 28, y: 60 },
    region: "Pulaski County",
  },
];

const SERVICES = [
  {
    name: "Primary Care",
    desc: "Whole-family preventive care, chronic condition management, annual wellness visits, and same-week access.",
    icon: "stethoscope",
    accent: "#1f3a2e",
  },
  {
    name: "Pediatrics",
    desc: "Board-certified care for newborns to teens, with well visits, immunizations, and gentle calm-first appointments.",
    icon: "child",
    accent: "#c97b5a",
  },
  {
    name: "Urgent Care",
    desc: "Stitches, illness, minor injuries, x-rays, and lab tests when you cannot wait days for an appointment.",
    icon: "bolt",
    accent: "#b8924a",
  },
  {
    name: "Wound Care",
    desc: "Advanced wound management led by certified specialists with healing protocols beyond standard dressing changes.",
    icon: "leaf",
    accent: "#7a9885",
  },
  {
    name: "Women Health",
    desc: "Annual exams, screenings, contraception support, and trusted ongoing care delivered by women-focused providers.",
    icon: "heart",
    accent: "#a85f3f",
  },
  {
    name: "Occupational Health",
    desc: "Workplace injury care, return-to-work planning, drug screens, and employer health support across East Arkansas.",
    icon: "shield",
    accent: "#2d4a3c",
  },
];

const PROVIDERS = [
  {
    name: "Dr. Aaron Mitchell, MD",
    role: "Chief Medical Officer, Cofounder",
    specialty: "Family Medicine, Board Certified",
    tags: ["wynne", "primary"],
    accepting: true,
    featured: true,
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80&auto=format&fit=crop",
    bio: "Methodist Hospital Physician Leadership Academy delegate, recognized among the top 20 physicians in greater Memphis. Led the team to Level 3 PCMH Certification and Hypertension Champion recognition.",
    education: ["UAMS, Doctor of Medicine", "UAMS Family Medicine Residency, Jonesboro AR", "MBA, University of Arkansas at Little Rock"],
  },
  {
    name: "Stephen Andy Rohrer",
    role: "Chief Executive Officer, Cofounder",
    specialty: "MSN-RN, APRN, AGACNP-BC, FNP-BC, RNFA, CWS",
    tags: ["wynne", "primary", "wound"],
    accepting: true,
    featured: true,
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop",
    bio: "Fifteen plus years in healthcare. Trained at UAB and UCA. Board certified in hospital medicine, family medicine, and advanced wound management. Dedicated to better access for the Delta.",
    education: ["MSN, University of Alabama Birmingham", "BSN, University of Central Arkansas"],
  },
  {
    name: "Dr. Hong-Van Nguyen, MD",
    role: "Pediatrics",
    specialty: "Pediatric Care",
    tags: ["wynne", "pediatrics"],
    accepting: true,
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80&auto=format&fit=crop",
    bio: "From New Orleans. Medical degree from LSU New Orleans, pediatric residency at UAMS Little Rock with training at Arkansas Children Hospital. Believes in calm child-friendly visits.",
    education: ["LSU New Orleans, Doctor of Medicine", "UAMS Pediatric Residency"],
  },
  {
    name: "Erica Dewey, MD",
    role: "Family Medicine",
    specialty: "Women Health, Pediatrics, Preventative Care",
    tags: ["lonoke", "primary", "womens", "pediatrics"],
    accepting: true,
    img: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=800&q=80&auto=format&fit=crop",
    bio: "Born and raised in Arkansas. UAMS medical school. Chief resident at Baptist Health-UAMS in North Little Rock. Passionate about women health, pediatrics, and chronic disease management.",
    education: ["UAMS, Doctor of Medicine", "Baptist Health-UAMS Residency, Chief Resident"],
  },
  {
    name: "Zoe Weeks, MD",
    role: "Internal Medicine and Pediatrics",
    specialty: "Combined Med-Peds",
    tags: ["scott", "primary", "pediatrics"],
    accepting: true,
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80&auto=format&fit=crop",
    bio: "Northeast Arkansas native. Taught 7th grade math through Teach For America before medical school. UAMS 2020. IM-Peds residency at UTHSC Memphis with training at St. Jude and Le Bonheur.",
    education: ["UAMS, Doctor of Medicine 2020", "UTHSC Memphis IM-Peds Residency"],
  },
  {
    name: "Dr. Sean Koch, MD",
    role: "Family Medicine",
    specialty: "Evidence-Based Primary Care",
    tags: ["wynne", "primary"],
    accepting: true,
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80&auto=format&fit=crop",
    bio: "Born in St. Louis, raised in Searcy. Harding University undergrad, UAMS medical school, three-year residency in Jonesboro.",
    education: ["UAMS, Doctor of Medicine", "Jonesboro Family Medicine Residency"],
  },
  {
    name: "Jill Davis",
    role: "Pediatric Nurse Practitioner",
    specialty: "MSN-RN, APRN, PNP-PC",
    tags: ["wynne", "pediatrics"],
    accepting: true,
    img: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=800&q=80&auto=format&fit=crop",
    bio: "Wynne native. Inaugural class of the accelerated BSN at Arkansas State. Former LeBonheur Trauma ER nurse and Wynne Public Schools district nurse before her MSN at UAMS in 2018.",
    education: ["UAMS, MSN 2018", "Arkansas State University, BSN 2008"],
  },
  {
    name: "Jodi Renigar",
    role: "Nurse Practitioner",
    specialty: "MSN-RN, FNP-BC, Women Health",
    tags: ["wynne", "primary", "urgent", "womens", "pediatrics"],
    accepting: true,
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop",
    bio: "From Saint Francis County. Arkansas School for Math, Sciences and the Arts to Crowley Ridge LPN to EACC RN to Walden University MSN. Board certified in family practice with women health focus.",
    education: ["MSN, Walden University 2023"],
  },
  {
    name: "Josh Moore",
    role: "Nurse Practitioner",
    specialty: "Family Practice, Addiction Medicine",
    tags: ["wynne", "primary"],
    accepting: true,
    img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80&auto=format&fit=crop",
    bio: "RN from Baptist Health Schools Little Rock. BSN from U of A. MSN at Walden while working bedside ICU. Currently pursuing his DNP at Arkansas State.",
    education: ["MSN, Walden University", "BSN, University of Arkansas 2015"],
  },
  {
    name: "Ashley Duncan",
    role: "Nurse Practitioner",
    specialty: "Urgent Care, Diabetes and Thyroid",
    tags: ["wynne", "primary", "urgent", "womens"],
    accepting: true,
    img: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=800&q=80&auto=format&fit=crop",
    bio: "Local resident of Wynne. 19 plus years as an RN in ICU, Cath Lab, Home Health, and Wynne School District. NP from Harding 2020. Skilled in suturing, joint injections, and women health.",
    education: ["MSN, Harding University 2020", "BSN, Arkansas State University 2001"],
  },
  {
    name: "Whitney Reed",
    role: "Nurse Practitioner",
    specialty: "Family Practice, Board Certified",
    tags: ["lonoke", "primary", "urgent"],
    accepting: true,
    img: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=800&q=80&auto=format&fit=crop",
    bio: "From Cabot. UAMS BSN 11, MSN 15. A decade of experience in primary and urgent care. Loves the Lonoke community and is excited to be back in the land of the Jackrabbits.",
    education: ["UAMS, MSN 2015", "UAMS, BSN 2011"],
  },
  {
    name: "Erin OGuin",
    role: "Nurse Practitioner",
    specialty: "Family Practice, Patient-Centered Care",
    tags: ["wynne", "primary"],
    accepting: true,
    img: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=800&q=80&auto=format&fit=crop",
    bio: "Began her healthcare journey at Arkansas State and earned her master in nursing from Harding. Passionate about empowering patients across acute conditions, chronic illness, and prevention.",
    education: ["MSN, Harding University", "Arkansas State University"],
  },
];

const REVIEWS = [
  { quote: "Best clinic in the area. They actually listen.", author: "Kasey M.", source: "Google" },
  { quote: "Got us in same day for my son. Friendly and fast.", author: "Ryan P.", source: "Google" },
  { quote: "Front desk is incredible. Felt taken care of.", author: "Grace W.", source: "Google" },
  { quote: "Wound healed quickly with their advanced care team.", author: "James T.", source: "Google" },
  { quote: "My pediatrician of choice. Calm and gentle visits.", author: "Maria L.", source: "Google" },
  { quote: "Best healthcare experience I have had in years.", author: "Daniel K.", source: "Google" },
];

const TESTIMONIALS = [
  {
    quote: "It was my first visit to Harmony Health Clinic and overall it was a great experience. The staff was so friendly and extremely knowledgeable. I felt very comfortable and am so thankful my friend referred them to me.",
    author: "Kasey M.",
    location: "Wynne",
  },
  {
    quote: "The team at Harmony Health Clinic are experienced and caring individuals. They are focused on helping their patients and have treatments to fit your needs. I would recommend them to my friends and family.",
    author: "Grace W.",
    location: "Lonoke",
  },
  {
    quote: "I had an amazing experience taking my son to Harmony Health Clinic. He has always been afraid of the doctor office, but the team was so patient and really made him feel comfortable. It was such a pleasant trip.",
    author: "Ryan P.",
    location: "Wynne",
  },
];

const FAQ = [
  { q: "Are you accepting new patients?", a: "Yes. Most providers across all four locations are accepting new patients. Filter the team grid above by your preferred location to see who is currently available." },
  { q: "What insurance do you accept?", a: "Harmony Health accepts most major insurance plans. Bring your insurance card to your first visit. Call your preferred clinic if you have specific questions about coverage." },
  { q: "Do you offer same-day appointments?", a: "Yes. Same-day urgent care visits are available at Wynne and most other locations during business hours. Call ahead so we can prepare your visit." },
  { q: "What is the difference between urgent care and the ER?", a: "Urgent care handles non-life-threatening illness and minor injuries quickly and at lower cost than the ER. For chest pain, stroke symptoms, severe bleeding, or trauma, call 911 or go to the nearest ER." },
  { q: "Can I get my labs done in-office?", a: "Yes. Harmony Health Clinic offers in-house diagnostics and lab services to streamline your visit and reduce time to results." },
  { q: "How do I access my records?", a: "Use the MyChart Patient Portal to view records, request refills, and message your care team. Use the Patient Portal link in the navigation." },
];

function useCountUp(target, duration = 1600, trigger = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
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
  }, [target, duration, trigger]);
  return val;
}

function StatCounter({ target, decimals = 0, suffix = "", trigger }) {
  const v = useCountUp(target, 1600, trigger);
  return (
    <>
      {decimals > 0 ? v.toFixed(decimals) : Math.floor(v).toLocaleString()}
      {suffix}
    </>
  );
}

function ServiceIcon({ name, color }) {
  const stroke = color || "var(--forest)";
  const common = { width: 30, height: 30, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "stethoscope":
      return (
        <svg {...common}>
          <path d="M5 4v7a4 4 0 0 0 8 0V4" />
          <path d="M9 14v3a4 4 0 0 0 8 0v-1" />
          <circle cx="17" cy="11" r="2" />
        </svg>
      );
    case "child":
      return (
        <svg {...common}>
          <circle cx="12" cy="6" r="3" />
          <path d="M6 21v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3" />
          <path d="M12 9v3" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <path d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M5 21c0-9 7-15 16-15-1 9-7 15-16 15Z" />
          <path d="M5 21c4-4 8-7 12-9" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    default:
      return null;
  }
}

function DeltaMap({ activeKey, onPick }) {
  return (
    <svg viewBox="0 0 100 90" className="delta-map" aria-label="East Arkansas locations map">
      <defs>
        <radialGradient id="dotGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#E8A085" />
          <stop offset="100%" stopColor="#A85F3F" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="riverGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7A9885" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7A9885" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path
        d="M 95 5 Q 92 20 94 30 Q 90 40 92 50 Q 88 60 90 70 Q 86 80 88 90"
        stroke="url(#riverGrad)"
        strokeWidth="0.6"
        fill="none"
        strokeDasharray="0.8 0.8"
      />
      <g stroke="var(--terracotta)" strokeWidth="0.3" fill="none" opacity="0.4" strokeDasharray="0.6 1.2" className="constellation">
        {LOCATIONS.map((loc, i) => {
          const next = LOCATIONS[(i + 1) % LOCATIONS.length];
          return (
            <line
              key={loc.key}
              x1={loc.coords.x}
              y1={loc.coords.y}
              x2={next.coords.x}
              y2={next.coords.y}
            />
          );
        })}
      </g>
      {LOCATIONS.map((loc) => {
        const isActive = activeKey === loc.key;
        return (
          <g
            key={loc.key}
            style={{ cursor: "pointer" }}
            onClick={() => onPick && onPick(loc.key)}
          >
            <circle
              cx={loc.coords.x}
              cy={loc.coords.y}
              r={isActive ? 5 : 2.6}
              fill="none"
              stroke="var(--terracotta)"
              strokeWidth="0.5"
              opacity={isActive ? 0.7 : 0.35}
            >
              {isActive && (
                <>
                  <animate attributeName="r" values="3.5;7;3.5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2s" repeatCount="indefinite" />
                </>
              )}
            </circle>
            <circle cx={loc.coords.x} cy={loc.coords.y} r="1.6" fill="url(#dotGrad)" filter="url(#glow)" />
            <text
              x={loc.coords.x}
              y={loc.coords.y - 5}
              textAnchor="middle"
              fontSize="2.6"
              fontFamily="JetBrains Mono, monospace"
              fill={isActive ? "var(--terracotta-deep)" : "var(--forest)"}
              fontWeight="600"
              letterSpacing="0.15"
            >
              {loc.name.toUpperCase()}
            </text>
          </g>
        );
      })}
      <text x="50" y="84" textAnchor="middle" fontSize="1.7" fontFamily="JetBrains Mono, monospace" fill="var(--ink-mute)" letterSpacing="2.5" opacity="0.55">
        EAST ARKANSAS, DELTA REGION
      </text>
    </svg>
  );
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
          <text x="100" y="115" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono, monospace" fill="#7A9885" letterSpacing="1">
            WEEK 12 · HEALED
          </text>
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
          <text x="100" y="115" textAnchor="middle" fontSize="6" fontFamily="JetBrains Mono, monospace" fill="#A85F3F" letterSpacing="1">
            WEEK 1 · INITIAL VISIT
          </text>
        </svg>
      </div>
      <div className="ba-divider" style={{ left: `${pos}%` }} />
      <div className="ba-knob" style={{ left: `${pos}%` }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--forest)" strokeWidth="2">
          <path d="M9 5l-7 7 7 7M15 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="ba-tag ba-tag-left">Before</div>
      <div className="ba-tag ba-tag-right">After, 12 weeks</div>
      <div className="ba-hint">← Drag to compare →</div>
    </div>
  );
}

function timeBasedGreeting(d) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HarmonyHealth() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeLoc, setActiveLoc] = useState("wynne");
  const [providerFilter, setProviderFilter] = useState("all");
  const [openProvider, setOpenProvider] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [missionVisible, setMissionVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [time, setTime] = useState(new Date());
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [cursorInHero, setCursorInHero] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const missionRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!missionRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setMissionVisible(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(missionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial((i) => (i + 1) % TESTIMONIALS.length), 7000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 60_000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom && e.clientX >= rect.left && e.clientX <= rect.right) {
        setCursorInHero(true);
        setCursorPos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      } else {
        setCursorInHero(false);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openProvider || bottomSheetOpen || loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openProvider, bottomSheetOpen, loading]);

  const filteredProviders = useMemo(() => {
    if (providerFilter === "all") return PROVIDERS;
    return PROVIDERS.filter((p) => p.tags.includes(providerFilter));
  }, [providerFilter]);

  const currentLoc = useMemo(
    () => LOCATIONS.find((l) => l.key === activeLoc) ?? LOCATIONS[0],
    [activeLoc],
  );

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setNavOpen(false);
  };

  const greeting = timeBasedGreeting(time);
  const localTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="hh-app">
      <style>{styles}</style>

      {loading && (
        <div className="preloader" aria-hidden="true">
          <div className="preloader-inner">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="draw-logo">
              <circle cx="40" cy="40" r="32" stroke="var(--ivory)" strokeWidth="1" opacity="0.3" />
              <circle cx="40" cy="40" r="32" stroke="var(--terracotta)" strokeWidth="2" strokeDasharray="201" strokeDashoffset="0" pathLength="201" style={{ animation: "draw-stroke 1.4s cubic-bezier(0.22,1,0.36,1) forwards" }} />
              <path d="M28 32 L28 48 M28 40 L40 40 M40 32 L40 48 M48 32 L48 48 M48 32 L52 36 M48 40 L52 40 M48 48 L52 44" stroke="var(--ivory)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="font-mono preload-label">HARMONY HEALTH CLINIC</span>
          </div>
        </div>
      )}

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div className="ticker-row" key={dup}>
              <span>Now accepting new patients across all four locations</span>
              <span className="dot">•</span>
              <span>Same-week visits available at Wynne</span>
              <span className="dot">•</span>
              <span>MyChart patient portal for refills, records, and messaging</span>
              <span className="dot">•</span>
              <span>Advanced wound care led by board-certified specialists</span>
              <span className="dot">•</span>
              <span>Family medicine, urgent care, pediatrics, women health</span>
              <span className="dot">•</span>
            </div>
          ))}
        </div>
      </div>

      <nav className={`nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container nav-inner">
          <a href="#top" className="brand">
            <img src={harmonyLogo} alt="Harmony Health Clinic" />
          </a>
          <div className={`nav-links ${navOpen ? "is-open" : ""}`}>
            <button onClick={() => scrollTo("services")}>Services</button>
            <button onClick={() => scrollTo("team")}>Team</button>
            <button onClick={() => scrollTo("locations")}>Locations</button>
            <button onClick={() => scrollTo("wound-care")}>Wound Care</button>
            <button onClick={() => scrollTo("faq")}>FAQ</button>
            <a href="https://epicconnect.org/ccprd/CommunityConnect/mychartcc.html" target="_blank" rel="noreferrer" className="nav-portal">
              Patient Portal ↗
            </a>
            <button className="btn btn-primary nav-cta" onClick={() => scrollTo("book")}>
              Book Visit
            </button>
          </div>
          <button className="nav-toggle" aria-label="Toggle navigation" onClick={() => setNavOpen((v) => !v)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <header id="top" ref={heroRef} className="hero grain">
        <div className="hero-bg">
          <img src={heroImage} alt="" aria-hidden="true" />
          <div className="hero-veil" />
          {cursorInHero && (
            <div
              className="hero-cursor-glow"
              style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
              aria-hidden="true"
            />
          )}
        </div>
        <div className="container hero-inner">
          <div className="hero-meta-bar">
            <span className="font-mono small-label">EST 2016 · EAST ARKANSAS</span>
            <span className="font-mono small-label">{greeting} · {localTime} CT</span>
          </div>
          <h1 className="font-display word-rise hero-headline">
            <span className="delay-1">A different</span>{" "}
            <span className="delay-2">kind</span>{" "}
            <span className="delay-3">of</span>{" "}
            <span className="delay-4">healthcare,</span>{" "}
            <span className="delay-5"><em>built for</em></span>{" "}
            <span className="delay-6">the Delta.</span>
          </h1>
          <div className="hero-deck reveal" style={{ animationDelay: "0.85s" }}>
            <p className="lead hero-lead">
              Hometown trust meets modern clinical standards. Family medicine, urgent care, pediatrics, women health, and advanced wound care, delivered by clinicians who chose to live here too.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => scrollTo("book")}>
                Schedule a visit
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="btn btn-light" onClick={() => scrollTo("services")}>
                Explore services
              </button>
            </div>
          </div>
          <div className="hero-foot reveal" style={{ animationDelay: "1s" }}>
            <div className="hero-stat">
              <strong className="font-display">4</strong>
              <span>locations</span>
            </div>
            <div className="hero-stat">
              <strong className="font-display">12+</strong>
              <span>licensed providers</span>
            </div>
            <div className="hero-stat">
              <strong className="font-display">9+</strong>
              <span>years in the Delta</span>
            </div>
            <div className="hero-stat">
              <strong className="font-display">PCMH</strong>
              <span>Level 3 Certified</span>
            </div>
          </div>
        </div>
        <button className="hero-scroll" onClick={() => scrollTo("trust")} aria-label="Scroll to learn more">
          <span className="font-mono">SCROLL</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      <section id="trust" className="trust">
        <div className="container trust-inner">
          <div className="trust-row">
            <div className="trust-row-label">
              <span className="small-label font-mono">RECOGNIZED FOR</span>
            </div>
            <div className="trust-marquee">
              <div className="ticker-track" style={{ animationDuration: "70s" }}>
                {Array.from({ length: 2 }).map((_, dup) => (
                  <div key={dup} className="trust-row-items">
                    <strong className="font-display">PCMH Level 3</strong>
                    <span className="trust-sep">●</span>
                    <strong className="font-display">Hypertension Champion</strong>
                    <span className="trust-sep">●</span>
                    <strong className="font-display">Board Certified</strong>
                    <span className="trust-sep">●</span>
                    <strong className="font-display">Methodist Leadership Academy</strong>
                    <span className="trust-sep">●</span>
                    <strong className="font-display">Crittenden County Medical Society</strong>
                    <span className="trust-sep">●</span>
                    <strong className="font-display">Certified Wound Specialists</strong>
                    <span className="trust-sep">●</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews-strip">
        <div className="container reviews-strip-inner">
          <div className="reviews-strip-head">
            <div className="reviews-rating">
              <div className="t-stars" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1">
                    <path d="m12 17.27 5.18 3.04-1.37-5.91L20.36 9.5l-6.06-.52L12 3.5l-2.3 5.48L3.64 9.5l4.55 4.9-1.37 5.91Z" />
                  </svg>
                ))}
              </div>
              <strong className="font-display">4.9 average</strong>
              <span className="font-mono small-label">GOOGLE REVIEWS</span>
            </div>
            <a className="underline-grow" href="https://www.google.com/search?q=Harmony+Health+Clinic+Wynne+AR+reviews" target="_blank" rel="noreferrer">
              Read more on Google ↗
            </a>
          </div>
          <div className="reviews-marquee">
            <div className="ticker-track" style={{ animationDuration: "75s" }}>
              {Array.from({ length: 2 }).map((_, dup) => (
                <div key={dup} className="reviews-row">
                  {REVIEWS.map((r) => (
                    <div className="review-pill" key={`${dup}-${r.author}`}>
                      <span className="review-quote">&ldquo;{r.quote}&rdquo;</span>
                      <span className="review-author">— {r.author}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mission" ref={missionRef}>
        <div className="container mission-grid">
          <div className="mission-copy">
            <span className="eyebrow">Our mission</span>
            <h2 className="font-display">
              Healthcare that recognizes <em>patients as people</em>, and keeps care close to home.
            </h2>
            <p className="lead">
              Harmony Health was founded in 2016 to bring better access, better technology, and better outcomes to rural East Arkansas. Today, our team delivers comprehensive primary care, urgent care, pediatrics, and advanced wound management with the kind of trust that only comes from showing up, year after year, for the same families.
            </p>
            <div className="mission-stats">
              <div>
                <strong className="font-display"><StatCounter target={4} trigger={missionVisible} /></strong>
                <span>locations</span>
              </div>
              <div>
                <strong className="font-display"><StatCounter target={12} trigger={missionVisible} />+</strong>
                <span>providers</span>
              </div>
              <div>
                <strong className="font-display"><StatCounter target={9} trigger={missionVisible} />+</strong>
                <span>years</span>
              </div>
              <div>
                <strong className="font-display"><StatCounter target={6} trigger={missionVisible} /></strong>
                <span>service lines</span>
              </div>
            </div>
          </div>
          <div className="mission-visual-stack">
            <figure className="mission-visual main">
              <img src={aboutImage} alt="Doctor speaking with a patient" />
              <figcaption>
                <span className="font-mono small-label">PROVIDER VISIT</span>
                <strong className="font-display">Calm rooms. Real conversation.</strong>
              </figcaption>
            </figure>
            <figure className="mission-visual side">
              <img src={telehealthImage} alt="Modern care environment" />
            </figure>
          </div>
        </div>
      </section>

      <section id="services" className="services-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Services</span>
              <h2 className="font-display">Comprehensive care, <em>under one roof</em>.</h2>
            </div>
            <p className="lead">
              From annual physicals and pediatric visits to urgent care, in-house diagnostics, and advanced wound management, Harmony Health is built to handle the everyday and the unexpected.
            </p>
          </div>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <article key={s.name} className="service-card card-lift" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="service-icon" style={{ background: `${s.accent}1a`, color: s.accent }}>
                  <ServiceIcon name={s.icon} color={s.accent} />
                </div>
                <h3 className="font-display">{s.name}</h3>
                <p className="lead">{s.desc}</p>
                <button className="service-link" onClick={() => scrollTo("book")}>
                  Schedule a visit
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </article>
            ))}
          </div>
          <a className="services-all" href="https://www.harmonyhealthclinic.com/services/" target="_blank" rel="noreferrer">
            View all services <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      <section id="wound-care" className="wound">
        <div className="container wound-grid">
          <div>
            <span className="eyebrow eyebrow-gold">Advanced wound care</span>
            <h2 className="font-display">When a band-aid <em>is not enough</em>.</h2>
            <p className="lead">
              Our wound care program is led by certified wound specialists with hospital-level training. We pair evidence-based protocols with close follow-up so chronic and complex wounds can finally heal.
            </p>
            <ul className="wound-list">
              <li>Chronic wound assessment and individualized care plans</li>
              <li>Diabetic ulcers, pressure injuries, and surgical wounds</li>
              <li>Compression therapy and advanced dressings</li>
              <li>Infection management and follow-up imaging</li>
            </ul>
            <button className="btn btn-terracotta" onClick={() => scrollTo("book")}>
              Start a wound care consult
            </button>
          </div>
          <div className="wound-visual">
            <BeforeAfterSlider />
            <p className="wound-caption font-mono">Illustrative case visualization</p>
          </div>
        </div>
      </section>

      <section id="team" className="team">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Care team</span>
              <h2 className="font-display">Clinicians who know the Delta <em>by name</em>.</h2>
            </div>
            <p className="lead">
              Board-certified physicians, advanced practice providers, and nurse practitioners who chose to live and serve in East Arkansas.
            </p>
          </div>
          <div className="filter-row">
            {[
              { key: "all", label: "All providers" },
              { key: "primary", label: "Primary care" },
              { key: "pediatrics", label: "Pediatrics" },
              { key: "urgent", label: "Urgent care" },
              { key: "wound", label: "Wound care" },
              { key: "womens", label: "Women health" },
              { key: "wynne", label: "Wynne" },
              { key: "lonoke", label: "Lonoke" },
              { key: "scott", label: "Scott" },
            ].map((f) => (
              <button
                key={f.key}
                className={`chip ${providerFilter === f.key ? "is-active" : ""}`}
                onClick={() => setProviderFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="team-grid">
            {filteredProviders.map((p) => (
              <article key={p.name} className="provider-card card-lift" onClick={() => setOpenProvider(p)}>
                <div className="provider-photo">
                  <img src={p.img} alt={p.name} loading="lazy" />
                  <div className="provider-photo-veil" />
                  {p.featured && <span className="provider-pill">Founder</span>}
                </div>
                <div className="provider-meta">
                  <h3 className="font-display">{p.name}</h3>
                  <span className="provider-role">{p.role}</span>
                  <span className="provider-specialty">{p.specialty}</span>
                  {p.accepting && <span className="tag tag-accepting">Accepting new patients</span>}
                </div>
              </article>
            ))}
          </div>
          <a className="services-all" href="https://www.harmonyhealthclinic.com/about/meet-the-team/" target="_blank" rel="noreferrer">
            Read full bios on the official site <span aria-hidden>↗</span>
          </a>
        </div>
      </section>

      <section id="locations" className="locations">
        <div className="container locations-grid">
          <div className="locations-side">
            <span className="eyebrow">Locations</span>
            <h2 className="font-display">Four clinics. <em>One standard</em> of care.</h2>
            <p className="lead">Pick a location to see hours, services, and direct contact info.</p>
            <div className="loc-tabs">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.key}
                  className={`loc-tab ${activeLoc === loc.key ? "is-active" : ""}`}
                  onClick={() => setActiveLoc(loc.key)}
                >
                  <span className="font-display">{loc.name}</span>
                  <span className="font-mono">{loc.region}</span>
                </button>
              ))}
            </div>
            <div className="loc-detail">
              <div className="loc-detail-head">
                <h3 className="font-display">{currentLoc.name}</h3>
                <span className="font-mono small-label">{currentLoc.region.toUpperCase()}</span>
              </div>
              <p className="lead">{currentLoc.address}</p>
              <p className="lead">
                <strong>Hours:</strong> {currentLoc.hours}
              </p>
              <p className="lead">
                <strong>Phone:</strong>{" "}
                <a className="underline-grow" href={`tel:${currentLoc.phone.replace(/[^0-9]/g, "")}`}>
                  {currentLoc.phone}
                </a>
              </p>
              <div className="loc-services">
                {currentLoc.services.map((s) => (
                  <span key={s} className="chip-static">{s}</span>
                ))}
              </div>
              <div className="loc-detail-actions">
                <a
                  className="btn btn-primary"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentLoc.address)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get directions ↗
                </a>
                <a className="btn btn-ghost" href={`tel:${currentLoc.phone.replace(/[^0-9]/g, "")}`}>
                  Call clinic
                </a>
              </div>
            </div>
          </div>
          <div className="locations-map-wrap">
            <div className="locations-map">
              <DeltaMap activeKey={activeLoc} onPick={setActiveLoc} />
            </div>
            <div className="locations-meta">
              <span className="font-mono small-label">DELTA · ARKANSAS</span>
              <strong className="font-display">{LOCATIONS.length} clinics. One care team.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container testimonials-grid">
          <div>
            <span className="eyebrow eyebrow-light">Patient stories</span>
            <h2 className="font-display">Care that <em>earns the recommendation</em>.</h2>
            <div className="t-rating">
              <div className="t-stars" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="1">
                    <path d="m12 17.27 5.18 3.04-1.37-5.91L20.36 9.5l-6.06-.52L12 3.5l-2.3 5.48L3.64 9.5l4.55 4.9-1.37 5.91Z" />
                  </svg>
                ))}
              </div>
              <span className="font-mono small-label">4.9 average across patient reviews</span>
            </div>
          </div>
          <div className="t-stage">
            {TESTIMONIALS.map((t, i) => (
              <blockquote
                key={t.author}
                className={`t-card ${activeTestimonial === i ? "is-active" : ""}`}
                aria-hidden={activeTestimonial !== i}
              >
                <p className="font-display t-quote">&ldquo;{t.quote}&rdquo;</p>
                <footer>
                  <strong>{t.author}</strong>
                  <span> · {t.location}</span>
                </footer>
              </blockquote>
            ))}
            <div className="t-dots">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.author}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={activeTestimonial === i ? "is-active" : ""}
                  onClick={() => setActiveTestimonial(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="faq">
        <div className="container faq-grid">
          <div>
            <span className="eyebrow">Frequently asked</span>
            <h2 className="font-display">Quick answers, <em>before your visit</em>.</h2>
            <p className="lead">
              Cannot find what you are looking for? Call your preferred clinic directly. The team is ready to help.
            </p>
            <img className="faq-image" src={services2Image} alt="Calm clinic environment" />
          </div>
          <div className="faq-list">
            {FAQ.map((item, i) => (
              <div className={`faq-item ${openFaq === i ? "is-open" : ""}`} key={item.q}>
                <button
                  className="faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="font-display">{item.q}</span>
                  <span className="faq-icon" aria-hidden>{openFaq === i ? "−" : "+"}</span>
                </button>
                <div className="faq-a">
                  <p className="lead">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="cta">
        <div className="container cta-card grain">
          <div className="cta-copy">
            <span className="eyebrow eyebrow-light">Book your visit</span>
            <h2 className="font-display">Ready when <em>you are</em>.</h2>
            <p className="lead">
              Whether you need a primary care physician, a same-day urgent visit, a pediatric checkup, or advanced wound care, Harmony Health Clinic is one call away.
            </p>
          </div>
          <div className="cta-actions">
            <a className="btn btn-terracotta" href="https://www.harmonyhealthclinic.com/contact/" target="_blank" rel="noreferrer">
              Contact a clinic
            </a>
            <a className="btn btn-light" href="https://epicconnect.org/ccprd/CommunityConnect/mychartcc.html" target="_blank" rel="noreferrer">
              Open patient portal
            </a>
          </div>
          <div className="cta-orbit" aria-hidden="true">
            <div className="orbit-ring spin-slow" />
            <div className="orbit-dot orbit-dot-1" />
            <div className="orbit-dot orbit-dot-2" />
            <div className="orbit-dot orbit-dot-3" />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <img src={harmonyLogo} alt="Harmony Health Clinic" className="footer-logo" />
            <p className="lead">
              Primary and urgent care across East Arkansas. Family medicine, pediatrics, women health, and advanced wound care.
            </p>
            <span className="font-mono small-label">© {new Date().getFullYear()} HARMONY HEALTH CLINIC</span>
          </div>
          <div>
            <span className="font-mono small-label">CARE</span>
            <ul>
              <li><button onClick={() => scrollTo("services")} className="footer-link">Services</button></li>
              <li><button onClick={() => scrollTo("team")} className="footer-link">Team</button></li>
              <li><button onClick={() => scrollTo("wound-care")} className="footer-link">Wound care</button></li>
              <li><button onClick={() => scrollTo("locations")} className="footer-link">Locations</button></li>
            </ul>
          </div>
          <div>
            <span className="font-mono small-label">PATIENTS</span>
            <ul>
              <li><a className="footer-link" href="https://epicconnect.org/ccprd/CommunityConnect/mychartcc.html" target="_blank" rel="noreferrer">Patient portal</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/new-patient/" target="_blank" rel="noreferrer">New patient</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/about/careers/" target="_blank" rel="noreferrer">Careers</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/contact/" target="_blank" rel="noreferrer">Contact</a></li>
            </ul>
          </div>
          <div>
            <span className="font-mono small-label">HOURS</span>
            <ul>
              <li>Mon to Fri</li>
              <li>8:00 a.m. to 5:00 p.m.</li>
              <li>Closed Sat, Sun</li>
            </ul>
            <span className="font-mono small-label" style={{ marginTop: "1rem", display: "block" }}>LEGAL</span>
            <ul>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/privacy-policy/" target="_blank" rel="noreferrer">Privacy</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/accessibility-statement/" target="_blank" rel="noreferrer">Accessibility</a></li>
              <li><a className="footer-link" href="https://www.harmonyhealthclinic.com/" target="_blank" rel="noreferrer">HIPAA</a></li>
            </ul>
          </div>
        </div>
      </footer>

      <button className="floating-action" onClick={() => setBottomSheetOpen(true)} aria-label="Quick actions">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92V20a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3.08a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {bottomSheetOpen && (
        <div className="sheet-backdrop" onClick={() => setBottomSheetOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h3 className="font-display">Quick actions</h3>
            <a className="sheet-action" href={`tel:${currentLoc.phone.replace(/[^0-9]/g, "")}`}>
              <strong>Call {currentLoc.name}</strong>
              <span>{currentLoc.phone}</span>
            </a>
            <a
              className="sheet-action"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentLoc.address)}`}
              target="_blank"
              rel="noreferrer"
            >
              <strong>Directions to {currentLoc.name}</strong>
              <span>{currentLoc.address}</span>
            </a>
            <a className="sheet-action" href="https://epicconnect.org/ccprd/CommunityConnect/mychartcc.html" target="_blank" rel="noreferrer">
              <strong>Patient portal</strong>
              <span>MyChart records, refills, messaging</span>
            </a>
            <button className="sheet-close" onClick={() => setBottomSheetOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {openProvider && (
        <div className="modal-backdrop" onClick={() => setOpenProvider(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpenProvider(null)} aria-label="Close">×</button>
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
            <button className="btn btn-primary" onClick={() => { setOpenProvider(null); scrollTo("book"); }}>
              Schedule with this provider
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = `
.hh-app { position: relative; }

.preloader { position: fixed; inset: 0; background: var(--forest-deep); display: flex; align-items: center; justify-content: center; z-index: 100; animation: preload-out 0.8s cubic-bezier(0.22,1,0.36,1) 1.4s forwards; }
.preloader-inner { display: flex; flex-direction: column; align-items: center; gap: 1.2rem; }
.preload-label { color: var(--ivory); letter-spacing: 0.32em; font-size: 0.7rem; opacity: 0.65; }
.draw-logo path { stroke-dasharray: 60; stroke-dashoffset: 60; animation: draw-stroke 1.4s cubic-bezier(0.22,1,0.36,1) 0.3s forwards; }

.ticker { background: var(--forest); color: var(--ivory-deep); font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; letter-spacing: 0.08em; padding: 0.6rem 0; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.08); }
.ticker-track { display: flex; gap: 2.4rem; white-space: nowrap; width: max-content; }
.ticker-row { display: inline-flex; gap: 2.4rem; padding-right: 2.4rem; align-items: center; }
.ticker .dot { color: var(--terracotta); }

.nav { position: sticky; top: 0; z-index: 40; backdrop-filter: blur(14px); background: rgba(250, 247, 242, 0.78); border-bottom: 1px solid transparent; transition: 240ms ease; }
.nav.is-scrolled { background: rgba(250, 247, 242, 0.96); border-bottom-color: var(--line); box-shadow: 0 8px 28px -22px rgba(20,35,25,0.35); }
.nav-inner { height: 78px; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.brand img { height: 38px; width: auto; }
.nav-links { display: flex; align-items: center; gap: 1.4rem; color: var(--ink-soft); font-size: 0.94rem; }
.nav-links button, .nav-links a { background: none; border: none; cursor: pointer; color: inherit; font: inherit; padding: 0; transition: color 200ms; }
.nav-links button:hover, .nav-links a:hover { color: var(--forest); }
.nav-portal { position: relative; }
.nav-cta { padding: 0.65rem 1.2rem; }
.nav-toggle { display: none; flex-direction: column; gap: 4px; background: none; border: 1px solid var(--line-strong); border-radius: 10px; padding: 0.55rem 0.65rem; cursor: pointer; }
.nav-toggle span { width: 18px; height: 2px; background: var(--forest); border-radius: 2px; }

.hero { position: relative; min-height: 92vh; padding: 4rem 0 5rem; color: var(--ivory); overflow: hidden; isolation: isolate; }
.hero-bg { position: absolute; inset: 0; z-index: -2; }
.hero-bg img { width: 100%; height: 100%; object-fit: cover; }
.hero-veil { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(14,28,20,0.35) 0%, rgba(14,28,20,0.62) 60%, rgba(14,28,20,0.92) 100%), radial-gradient(60% 60% at 30% 30%, rgba(31,58,46,0.55) 0%, rgba(14,28,20,0.85) 100%); }
.hero-cursor-glow { position: absolute; width: 480px; height: 480px; border-radius: 999px; background: radial-gradient(closest-side, rgba(232,160,133,0.32), transparent); transform: translate(-50%, -50%); pointer-events: none; mix-blend-mode: screen; transition: left 220ms ease, top 220ms ease; }
.hero-inner { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: center; min-height: calc(92vh - 9rem); }
.hero-meta-bar { display: flex; justify-content: space-between; gap: 1rem; opacity: 0.85; margin-bottom: 1.4rem; }
.small-label { letter-spacing: 0.18em; font-size: 0.72rem; opacity: 0.85; }
.hero-headline { font-size: clamp(2.6rem, 7.6vw, 7.4rem); line-height: 0.95; letter-spacing: -0.02em; max-width: 16ch; margin: 0; color: var(--ivory); }
.hero-headline em { font-style: italic; color: var(--terracotta-pale); font-weight: 400; }
.hero-deck { margin-top: 1.8rem; max-width: 60ch; }
.hero-lead { color: rgba(247, 240, 226, 0.82); font-size: 1.12rem; }
.hero-actions { display: flex; gap: 0.8rem; margin-top: 1.6rem; flex-wrap: wrap; }
.hero-foot { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.2rem; margin-top: 3rem; padding-top: 1.6rem; border-top: 1px solid rgba(255,255,255,0.18); max-width: 720px; }
.hero-stat { display: flex; flex-direction: column; gap: 0.2rem; }
.hero-stat strong { font-size: 1.6rem; color: var(--ivory); }
.hero-stat span { color: rgba(247, 240, 226, 0.7); font-size: 0.82rem; }
.hero-scroll { position: absolute; bottom: 1.6rem; left: 50%; transform: translateX(-50%); background: none; border: none; color: var(--ivory); display: flex; align-items: center; gap: 0.5rem; font-size: 0.74rem; letter-spacing: 0.22em; cursor: pointer; opacity: 0.75; }
.hero-scroll:hover { opacity: 1; }

.trust { background: var(--forest-deep); color: var(--ivory-deep); padding: 1.2rem 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
.trust-row { display: flex; gap: 1.6rem; align-items: center; }
.trust-row-label { flex-shrink: 0; padding-right: 1.4rem; border-right: 1px solid rgba(255,255,255,0.18); }
.trust-marquee { flex: 1; overflow: hidden; }
.trust-row-items { display: inline-flex; align-items: center; gap: 2rem; padding-right: 2rem; white-space: nowrap; }
.trust-row-items strong { font-size: 1.05rem; color: var(--ivory); }
.trust-sep { color: var(--terracotta); }

.reviews-strip { background: var(--ivory); padding: 2.2rem 0 1.6rem; border-bottom: 1px solid var(--line); }
.reviews-strip-head { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
.reviews-rating { display: flex; align-items: center; gap: 0.7rem; }
.reviews-rating strong { color: var(--forest-deep); font-size: 1.05rem; }
.t-stars { display: inline-flex; gap: 0.18rem; }
.reviews-marquee { overflow: hidden; }
.reviews-row { display: inline-flex; gap: 0.8rem; padding-right: 0.8rem; white-space: nowrap; }
.review-pill { display: inline-flex; gap: 0.5rem; align-items: center; padding: 0.7rem 1rem; background: var(--ivory-deep); border: 1px solid var(--line); border-radius: 999px; font-size: 0.92rem; }
.review-quote { color: var(--ink); }
.review-author { color: var(--ink-mute); font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; }

.mission { padding: 6rem 0 5rem; }
.mission-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 3rem; align-items: center; }
.mission-copy h2 { font-size: clamp(2rem, 3.6vw, 3.4rem); line-height: 1.08; margin: 1rem 0 1.2rem; color: var(--forest-deep); max-width: 18ch; }
.mission-copy h2 em { color: var(--terracotta-deep); font-style: italic; font-weight: 400; }
.mission-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; margin-top: 2rem; padding-top: 1.6rem; border-top: 1px solid var(--line); }
.mission-stats strong { font-size: 1.9rem; color: var(--forest); display: block; line-height: 1; margin-bottom: 0.35rem; }
.mission-stats span { color: var(--ink-mute); font-size: 0.82rem; }

.mission-visual-stack { position: relative; display: grid; grid-template-columns: 1fr 0.6fr; grid-template-rows: auto auto; gap: 1rem; }
.mission-visual { margin: 0; border-radius: 28px; overflow: hidden; box-shadow: var(--shadow-strong); position: relative; }
.mission-visual.main { grid-column: 1 / span 2; grid-row: 1; aspect-ratio: 16 / 11; }
.mission-visual.side { grid-column: 2 / span 1; grid-row: 2; aspect-ratio: 1; transform: translateY(-30%); }
.mission-visual img { width: 100%; height: 100%; object-fit: cover; display: block; }
.mission-visual figcaption { position: absolute; left: 1.1rem; bottom: 1.1rem; background: rgba(14,28,20,0.78); color: var(--ivory); padding: 0.7rem 0.95rem; border-radius: 14px; backdrop-filter: blur(10px); }
.mission-visual figcaption strong { display: block; font-size: 1.05rem; margin-top: 0.2rem; }

.section-head { display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem; align-items: end; margin-bottom: 2.4rem; }
.section-head h2 { font-size: clamp(2rem, 3.5vw, 3.4rem); line-height: 1.06; color: var(--forest-deep); margin: 0.6rem 0 0; max-width: 16ch; }
.section-head h2 em { color: var(--terracotta-deep); font-style: italic; font-weight: 400; }

.services-section { padding: 5rem 0; background: var(--ivory-deep); }
.services-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.1rem; }
.service-card { background: var(--ivory); border: 1px solid var(--line); border-radius: 22px; padding: 1.7rem; box-shadow: var(--shadow-soft); display: flex; flex-direction: column; gap: 0.7rem; }
.service-card h3 { margin: 0; font-size: 1.4rem; color: var(--forest); }
.service-icon { width: 56px; height: 56px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; }
.service-link { margin-top: auto; display: inline-flex; align-items: center; gap: 0.4rem; background: none; border: none; color: var(--forest); font-weight: 600; font-size: 0.93rem; cursor: pointer; padding-top: 0.6rem; }
.service-link:hover { color: var(--terracotta-deep); }
.services-all { display: inline-flex; gap: 0.4rem; margin-top: 1.6rem; color: var(--forest); font-weight: 600; }

.wound { padding: 6rem 0; }
.wound-grid { display: grid; grid-template-columns: 0.95fr 1.05fr; gap: 3rem; align-items: center; }
.wound h2 { font-size: clamp(2rem, 3.4vw, 3rem); color: var(--forest-deep); margin: 0.8rem 0 1rem; max-width: 14ch; }
.wound h2 em { color: var(--terracotta-deep); font-style: italic; font-weight: 400; }
.wound-list { list-style: none; padding: 0; margin: 1.2rem 0 1.6rem; display: grid; gap: 0.55rem; }
.wound-list li { padding-left: 1.5rem; position: relative; color: var(--ink-soft); }
.wound-list li::before { content: ""; position: absolute; left: 0; top: 0.55rem; width: 8px; height: 8px; border-radius: 999px; background: var(--terracotta); }
.wound-visual { display: grid; gap: 0.6rem; }
.wound-caption { color: var(--ink-mute); font-size: 0.74rem; letter-spacing: 0.1em; }

.ba-slider { position: relative; aspect-ratio: 16 / 10; border-radius: 24px; overflow: hidden; cursor: ew-resize; user-select: none; background: var(--ivory-deep); box-shadow: var(--shadow-strong); }
.ba-after, .ba-before { position: absolute; inset: 0; }
.ba-after svg, .ba-before svg { width: 100%; height: 100%; }
.ba-divider { position: absolute; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.95); pointer-events: none; transform: translateX(-1px); box-shadow: 0 0 20px rgba(0,0,0,0.4); }
.ba-knob { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 48px; height: 48px; border-radius: 999px; background: #fff; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 26px rgba(31,58,46,0.4); }
.ba-tag { position: absolute; top: 1rem; padding: 0.32rem 0.7rem; border-radius: 999px; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 600; pointer-events: none; }
.ba-tag-left { left: 1rem; background: rgba(168, 95, 63, 0.95); color: #fff; }
.ba-tag-right { right: 1rem; background: rgba(122, 152, 133, 0.95); color: #fff; }
.ba-hint { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); padding: 0.32rem 0.8rem; border-radius: 999px; background: rgba(255,255,255,0.92); color: var(--ink-soft); font-size: 0.75rem; pointer-events: none; }

.team { padding: 6rem 0; background: var(--ivory-deep); }
.filter-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0 2.2rem; }
.chip { border: 1px solid var(--line-strong); background: transparent; border-radius: 999px; padding: 0.5rem 0.95rem; font-size: 0.85rem; color: var(--ink-soft); cursor: pointer; transition: 200ms ease; }
.chip:hover { border-color: var(--forest); color: var(--forest); }
.chip.is-active { background: var(--forest); color: var(--ivory); border-color: var(--forest); }
.chip-static { border: 1px solid var(--line); background: var(--ivory); border-radius: 999px; padding: 0.35rem 0.8rem; font-size: 0.8rem; color: var(--ink-soft); }
.team-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.3rem; }
.provider-card { background: var(--ivory); border: 1px solid var(--line); border-radius: 26px; overflow: hidden; cursor: pointer; box-shadow: var(--shadow-soft); }
.provider-photo { position: relative; aspect-ratio: 4 / 5; overflow: hidden; }
.provider-photo img { width: 100%; height: 100%; object-fit: cover; transform: scale(1); transition: 600ms cubic-bezier(0.22,1,0.36,1); }
.provider-card:hover .provider-photo img { transform: scale(1.05); }
.provider-photo-veil { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,35,25,0) 50%, rgba(20,35,25,0.5) 100%); }
.provider-pill { position: absolute; top: 0.9rem; left: 0.9rem; background: rgba(184,146,74,0.9); color: var(--ivory); font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.32rem 0.7rem; border-radius: 999px; backdrop-filter: blur(6px); }
.provider-meta { padding: 1.1rem 1.2rem 1.3rem; display: flex; flex-direction: column; gap: 0.25rem; }
.provider-meta h3 { margin: 0; font-size: 1.1rem; color: var(--forest-deep); }
.provider-role { font-size: 0.85rem; color: var(--terracotta-deep); font-weight: 600; }
.provider-specialty { font-size: 0.8rem; color: var(--ink-mute); }
.tag { font-size: 0.7rem; padding: 0.25rem 0.6rem; border-radius: 999px; align-self: flex-start; margin-top: 0.4rem; }
.tag-accepting { background: rgba(122, 152, 133, 0.18); color: var(--forest); }

.locations { padding: 6rem 0; }
.locations-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
.locations h2 { font-size: clamp(2rem, 3.4vw, 3.2rem); margin: 1rem 0 1rem; color: var(--forest-deep); max-width: 14ch; }
.locations h2 em { color: var(--terracotta-deep); font-style: italic; font-weight: 400; }
.loc-tabs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6rem; margin: 1.6rem 0 1.4rem; }
.loc-tab { background: var(--ivory-deep); border: 1px solid var(--line); border-radius: 16px; padding: 0.95rem 1.1rem; cursor: pointer; text-align: left; display: flex; flex-direction: column; gap: 0.2rem; transition: 200ms ease; }
.loc-tab span:first-of-type { font-size: 1.1rem; color: var(--forest-deep); }
.loc-tab span:last-of-type { font-size: 0.74rem; color: var(--ink-mute); letter-spacing: 0.06em; }
.loc-tab:hover { border-color: var(--forest); }
.loc-tab.is-active { background: var(--forest); color: var(--ivory); border-color: var(--forest); }
.loc-tab.is-active span:first-of-type { color: var(--ivory); }
.loc-tab.is-active span:last-of-type { color: rgba(247, 240, 226, 0.75); }
.loc-detail { background: var(--ivory-deep); border: 1px solid var(--line); border-radius: 24px; padding: 1.6rem; }
.loc-detail-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.4rem; }
.loc-detail-head h3 { margin: 0; font-size: 1.5rem; color: var(--forest-deep); }
.loc-services { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.9rem; }
.loc-detail-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 1.2rem; }
.locations-map-wrap { display: flex; flex-direction: column; gap: 0.8rem; }
.locations-map { background: linear-gradient(180deg, var(--ivory-deep), var(--ivory-warm)); border-radius: 28px; padding: 1.6rem; border: 1px solid var(--line); box-shadow: var(--shadow-soft); }
.delta-map { width: 100%; height: auto; }
.locations-meta { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0 0.4rem; color: var(--ink-mute); }
.locations-meta strong { color: var(--forest); font-size: 1rem; }

.testimonials { padding: 6rem 0; background: linear-gradient(140deg, #142319 0%, #1f3a2e 50%, #2d4a3c 100%); color: var(--ivory-deep); position: relative; overflow: hidden; }
.testimonials::after { content: ""; position: absolute; inset: 0; background-image: radial-gradient(circle at 20% 30%, rgba(232,160,133,0.18), transparent 60%), radial-gradient(circle at 80% 70%, rgba(122,152,133,0.18), transparent 60%); pointer-events: none; }
.testimonials h2 { color: var(--ivory); font-size: clamp(2rem, 3.4vw, 3.2rem); margin: 1rem 0 1.4rem; max-width: 16ch; }
.testimonials h2 em { color: var(--terracotta-pale); font-style: italic; font-weight: 400; }
.testimonials .lead { color: rgba(247, 240, 226, 0.82); }
.testimonials-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 3rem; align-items: center; position: relative; z-index: 1; }
.t-rating { display: flex; align-items: center; gap: 0.7rem; }
.t-stage { position: relative; min-height: 260px; }
.t-card { position: absolute; inset: 0; opacity: 0; transition: opacity 600ms ease; padding: 0; margin: 0; }
.t-card.is-active { opacity: 1; }
.t-quote { font-size: clamp(1.3rem, 2.2vw, 1.7rem); line-height: 1.5; color: var(--ivory); margin: 0 0 1.4rem; }
.t-card footer { color: rgba(247, 240, 226, 0.85); font-size: 0.95rem; }
.t-dots { position: absolute; bottom: -1.6rem; left: 0; display: flex; gap: 0.4rem; }
.t-dots button { width: 32px; height: 4px; border-radius: 4px; border: none; background: rgba(247, 240, 226, 0.3); cursor: pointer; transition: 220ms ease; }
.t-dots button.is-active { background: var(--terracotta); }

.faq { padding: 6rem 0; }
.faq-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 3rem; align-items: start; }
.faq h2 { font-size: clamp(2rem, 3.4vw, 3rem); margin: 1rem 0 1rem; color: var(--forest-deep); max-width: 16ch; }
.faq h2 em { color: var(--terracotta-deep); font-style: italic; font-weight: 400; }
.faq-image { margin-top: 1.5rem; border-radius: 22px; box-shadow: var(--shadow-card); width: 100%; height: auto; }
.faq-list { display: grid; gap: 0.5rem; }
.faq-item { background: var(--ivory-deep); border: 1px solid var(--line); border-radius: 18px; overflow: hidden; }
.faq-q { width: 100%; background: none; border: none; padding: 1.2rem 1.3rem; text-align: left; display: flex; justify-content: space-between; align-items: center; gap: 1rem; cursor: pointer; font: inherit; color: var(--forest-deep); }
.faq-q span:first-of-type { font-size: 1.05rem; }
.faq-icon { font-size: 1.4rem; color: var(--terracotta); width: 24px; text-align: center; }
.faq-a { max-height: 0; overflow: hidden; transition: max-height 320ms ease, padding 320ms ease; padding: 0 1.3rem; }
.faq-item.is-open .faq-a { max-height: 360px; padding: 0 1.3rem 1.2rem; }

.cta { padding: 5rem 0 6rem; }
.cta-card { position: relative; background: linear-gradient(120deg, #0e1c14 0%, #1f3a2e 50%, #3f6353 100%); color: var(--ivory); border-radius: 36px; padding: 4rem; display: grid; grid-template-columns: 1.3fr auto; gap: 2rem; align-items: center; overflow: hidden; isolation: isolate; }
.cta-card h2 { font-size: clamp(2.2rem, 4vw, 3.6rem); line-height: 1.04; margin: 0.8rem 0 1rem; color: var(--ivory); max-width: 16ch; }
.cta-card h2 em { color: var(--terracotta-pale); font-style: italic; font-weight: 400; }
.cta-card .lead { color: rgba(247, 240, 226, 0.88); max-width: 56ch; }
.cta-actions { display: flex; flex-direction: column; gap: 0.7rem; min-width: 240px; position: relative; z-index: 2; }
.cta-orbit { position: absolute; right: -120px; top: 50%; transform: translateY(-50%); width: 460px; height: 460px; pointer-events: none; opacity: 0.55; }
.orbit-ring { position: absolute; inset: 0; border-radius: 999px; border: 1px dashed rgba(255,255,255,0.18); }
.orbit-dot { position: absolute; width: 10px; height: 10px; border-radius: 999px; background: var(--terracotta); box-shadow: 0 0 24px rgba(201,123,90,0.7); }
.orbit-dot-1 { top: 0; left: 50%; transform: translateX(-50%); }
.orbit-dot-2 { bottom: 0; left: 50%; transform: translateX(-50%); background: var(--gold); }
.orbit-dot-3 { top: 50%; left: 0; transform: translateY(-50%); background: var(--sage-light); }

.footer { background: var(--forest-deep); color: rgba(247, 240, 226, 0.78); padding: 4rem 0 2rem; }
.footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 2.4rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
.footer .small-label { color: var(--ivory-deep); }
.footer-logo { height: 32px; width: auto; filter: brightness(0) invert(1); margin-bottom: 0.9rem; opacity: 0.88; }
.footer .lead { color: rgba(247, 240, 226, 0.7); }
.footer ul { list-style: none; padding: 0; margin: 0.7rem 0 0; display: grid; gap: 0.4rem; }
.footer-link { background: none; border: none; padding: 0; cursor: pointer; color: rgba(247, 240, 226, 0.78); font: inherit; transition: color 200ms; text-align: left; }
.footer-link:hover { color: var(--ivory); }

.modal-backdrop { position: fixed; inset: 0; background: rgba(14, 28, 20, 0.65); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 80; padding: 1.4rem; animation: fade-in 220ms ease-out both; }
.modal-card { background: var(--ivory); border-radius: 28px; max-width: 560px; width: 100%; max-height: 86vh; overflow-y: auto; padding: 2rem; position: relative; box-shadow: var(--shadow-strong); animation: scale-in 320ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.modal-close { position: absolute; top: 0.9rem; right: 1rem; width: 38px; height: 38px; border-radius: 999px; border: 1px solid var(--line); background: var(--ivory); cursor: pointer; font-size: 1.4rem; line-height: 1; }
.modal-head { display: flex; gap: 1.1rem; align-items: center; margin-bottom: 1rem; }
.modal-photo { width: 84px; height: 84px; border-radius: 999px; overflow: hidden; flex-shrink: 0; }
.modal-photo img { width: 100%; height: 100%; object-fit: cover; }
.modal-head h3 { margin: 0; font-size: 1.3rem; color: var(--forest-deep); }
.modal-list { list-style: none; padding: 0; margin: 0.5rem 0 1.4rem; display: grid; gap: 0.35rem; color: var(--ink-soft); font-size: 0.92rem; }
.modal-list li { padding-left: 1rem; position: relative; }
.modal-list li::before { content: "•"; position: absolute; left: 0; color: var(--terracotta); }

.floating-action { position: fixed; bottom: 1.4rem; right: 1.4rem; width: 56px; height: 56px; border-radius: 999px; background: var(--terracotta); color: var(--ivory); border: none; box-shadow: 0 14px 28px -10px rgba(201,123,90,0.6); cursor: pointer; display: none; align-items: center; justify-content: center; z-index: 50; }
.sheet-backdrop { position: fixed; inset: 0; background: rgba(14, 28, 20, 0.55); backdrop-filter: blur(8px); display: flex; align-items: flex-end; z-index: 70; animation: fade-in 220ms ease-out both; }
.sheet { background: var(--ivory); width: 100%; border-radius: 28px 28px 0 0; padding: 1.4rem 1.4rem 2rem; animation: scale-in 280ms cubic-bezier(0.22,1,0.36,1) both; }
.sheet-handle { width: 48px; height: 4px; border-radius: 4px; background: var(--line-strong); margin: 0 auto 1.2rem; }
.sheet h3 { margin: 0 0 1rem; font-size: 1.3rem; color: var(--forest-deep); }
.sheet-action { display: flex; flex-direction: column; gap: 0.15rem; padding: 0.95rem 1rem; border-radius: 16px; border: 1px solid var(--line); margin-bottom: 0.5rem; color: var(--forest); }
.sheet-action strong { color: var(--forest-deep); }
.sheet-action span { color: var(--ink-mute); font-size: 0.85rem; }
.sheet-close { width: 100%; background: var(--forest); color: var(--ivory); border: none; border-radius: 999px; padding: 0.95rem; cursor: pointer; font: inherit; font-weight: 600; margin-top: 0.6rem; }

@media (max-width: 1080px) {
  .hero-grid, .mission-grid, .wound-grid, .locations-grid, .testimonials-grid, .faq-grid { grid-template-columns: 1fr; }
  .section-head { grid-template-columns: 1fr; }
  .services-grid, .team-grid, .footer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cta-card { grid-template-columns: 1fr; padding: 2.6rem; }
  .cta-orbit { display: none; }
  .mission-visual.side { display: none; }
  .mission-visual.main { grid-column: 1 / span 2; aspect-ratio: 4/3; }
}

@media (max-width: 720px) {
  .nav-toggle { display: inline-flex; }
  .nav-links { position: absolute; top: 78px; left: 0; right: 0; flex-direction: column; align-items: stretch; gap: 1rem; background: var(--ivory); border-bottom: 1px solid var(--line); padding: 1.2rem 1.2rem 1.6rem; box-shadow: var(--shadow-card); transform: translateY(-12px); opacity: 0; pointer-events: none; transition: 240ms ease; }
  .nav-links.is-open { transform: translateY(0); opacity: 1; pointer-events: auto; }
  .nav-cta { width: 100%; }
  .services-grid, .team-grid, .footer-grid, .mission-stats, .loc-tabs { grid-template-columns: 1fr; }
  .hero { padding: 3rem 0 4rem; min-height: auto; }
  .hero-foot { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .floating-action { display: inline-flex; }
}
`;
