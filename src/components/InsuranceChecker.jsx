import React, { useMemo, useState } from "react";

export default function InsuranceChecker({ t, plans }) {
  const [query, setQuery] = useState("");
  const [match, setMatch] = useState(null);

  const suggestions = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return plans
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query, plans]);

  return (
    <section className="insurance" id="insurance">
      <div className="container insurance-grid">
        <div>
          <span className="eyebrow">{t.insurance.eyebrow}</span>
          <h2 className="font-display">{t.insurance.title}</h2>
          <p className="lead">{t.insurance.sub}</p>
        </div>
        <div className="insurance-card">
          <label className="insurance-input">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3-3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setMatch(null); }}
              placeholder={t.insurance.placeholder}
              autoComplete="off"
              aria-autocomplete="list"
              aria-controls="insurance-suggestions"
            />
            {query && (
              <button type="button" className="ins-clear" onClick={() => { setQuery(""); setMatch(null); }} aria-label="Clear">
                ×
              </button>
            )}
          </label>

          {!match && suggestions.length > 0 && (
            <ul id="insurance-suggestions" className="insurance-list" role="listbox">
              {suggestions.map((p) => (
                <li key={p.name}>
                  <button
                    type="button"
                    className="insurance-suggestion"
                    onClick={() => { setMatch(p); setQuery(p.name); }}
                  >
                    <span>{p.name}</span>
                    {p.accepted === true && <span className="tag tag-live">{t.insurance.yes.split(",")[0]}</span>}
                    {p.accepted === null && <span className="tag tag-closed">{t.insurance.maybe.split(",")[0]}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {match && (
            <div className="insurance-result">
              {match.accepted === true && (
                <>
                  <strong className="font-display">{t.insurance.yes}</strong>
                  {match.note && <p className="lead">{match.note}</p>}
                </>
              )}
              {match.accepted === null && (
                <>
                  <strong className="font-display">{t.insurance.maybe}</strong>
                  <p className="lead">{match.note}</p>
                  <a className="btn btn-ghost" href="tel:8702383300">{t.insurance.callus}</a>
                </>
              )}
            </div>
          )}

          {!match && query && suggestions.length === 0 && (
            <div className="insurance-result">
              <strong className="font-display">{t.insurance.noresult}</strong>
              <a className="btn btn-ghost" href="tel:8702383300">{t.insurance.callus}</a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .insurance { padding: 4rem 0; background: linear-gradient(165deg, rgba(224,242,254,0.65), var(--sand-soft)); border-block: 1px solid var(--line); }
        .insurance-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 3rem; align-items: center; }
        .insurance h2 { font-size: clamp(1.7rem, 2.8vw, 2.4rem); margin: 0.6rem 0 0.6rem; color: var(--forest-deep); }
        .insurance-card { background: rgba(255,255,255,0.52); backdrop-filter: blur(22px) saturate(160%); -webkit-backdrop-filter: blur(22px) saturate(160%); border: 1px solid rgba(255,255,255,0.58); border-radius: 24px; padding: 1.4rem; box-shadow: inset 0 1px 0 rgba(255,255,255,0.72), var(--glass-shadow); position: relative; }
        .insurance-input { display: flex; align-items: center; gap: 0.65rem; background: rgba(255,255,255,0.42); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.55); border-radius: 16px; padding: 0.85rem 1rem; color: var(--ink-mute); }
        .insurance-input:focus-within { border-color: var(--forest); box-shadow: var(--focus); }
        .insurance-input input { flex: 1; border: none; background: transparent; font: inherit; outline: none; color: var(--ink); min-height: 32px; }
        .ins-clear { background: none; border: none; cursor: pointer; color: var(--ink-mute); font-size: 1.3rem; line-height: 1; }
        .insurance-list { list-style: none; padding: 0; margin: 0.6rem 0 0; display: grid; gap: 0.3rem; }
        .insurance-suggestion { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; padding: 0.7rem 0.95rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.5); background: rgba(255,255,255,0.38); backdrop-filter: blur(10px); cursor: pointer; text-align: left; font: inherit; }
        .insurance-suggestion:hover { border-color: var(--forest); }
        .insurance-result { margin-top: 0.8rem; padding: 1rem 1.1rem; background: rgba(255,255,255,0.45); backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.55); border-radius: 16px; display: grid; gap: 0.6rem; }
        .insurance-result strong { font-size: 1.1rem; color: var(--forest-deep); }
        @media (max-width: 880px) { .insurance-grid { grid-template-columns: 1fr; gap: 1.4rem; } }
      `}</style>
    </section>
  );
}
