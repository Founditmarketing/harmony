import React, { useEffect, useMemo, useState } from "react";

const SAMPLE_TIMES = [
  "Tomorrow, 9:00 AM",
  "Tomorrow, 11:30 AM",
  "Tomorrow, 2:15 PM",
  "Friday, 8:30 AM",
  "Friday, 10:00 AM",
  "Friday, 3:45 PM",
];

export default function BookingModal({ open, onClose, t, locations, providers, defaultReason, defaultLocation, defaultProvider }) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState(defaultReason || "");
  const [locKey, setLocKey] = useState(defaultLocation || "");
  const [providerName, setProviderName] = useState(defaultProvider || "");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setSubmitted(false);
    if (defaultReason) setReason(defaultReason);
    if (defaultLocation) setLocKey(defaultLocation);
    if (defaultProvider) setProviderName(defaultProvider);
  }, [open, defaultReason, defaultLocation, defaultProvider]);

  const reasons = useMemo(
    () => [
      { key: "primary", label: t.booking.reason_primary },
      { key: "urgent", label: t.booking.reason_urgent },
      { key: "pediatrics", label: t.booking.reason_pediatrics },
      { key: "wound", label: t.booking.reason_wound },
      { key: "womens", label: t.booking.reason_womens },
      { key: "other", label: t.booking.reason_other },
    ],
    [t],
  );

  const filteredProviders = useMemo(() => {
    if (!locKey) return providers;
    return providers.filter((p) => p.tags.includes(locKey));
  }, [providers, locKey]);

  const canNext = useMemo(() => {
    if (step === 1) return Boolean(reason);
    if (step === 2) return Boolean(locKey);
    if (step === 3) return true;
    if (step === 4) return Boolean(time && name && phone);
    return false;
  }, [step, reason, locKey, time, name, phone]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={t.booking.title}>
      <div className="booking-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t.sr.close}>×</button>

        {!submitted && (
          <>
            <div className="booking-head">
              <span className="font-mono small-label">{t.booking.title}</span>
              <div className="booking-steps" aria-hidden="true">
                {[t.booking.step1, t.booking.step2, t.booking.step3, t.booking.step4].map((label, i) => (
                  <div key={label} className={`booking-step ${step > i ? "done" : step === i + 1 ? "active" : ""}`}>
                    <span className="booking-step-num">{i + 1}</span>
                    <span className="booking-step-label">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="booking-step-body">
                  <h3 className="font-display">{t.booking.sub_reason}</h3>
                  <div className="booking-options">
                    {reasons.map((r) => (
                      <button
                        type="button"
                        key={r.key}
                        className={`booking-option ${reason === r.key ? "is-selected" : ""}`}
                        onClick={() => setReason(r.key)}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="booking-step-body">
                  <h3 className="font-display">{t.booking.sub_location}</h3>
                  <div className="booking-options">
                    {locations.map((l) => (
                      <button
                        type="button"
                        key={l.key}
                        className={`booking-option ${locKey === l.key ? "is-selected" : ""}`}
                        onClick={() => setLocKey(l.key)}
                      >
                        <span className="font-display" style={{ display: "block", fontSize: "1.05rem" }}>{l.name}</span>
                        <span className="font-mono small-label" style={{ color: "var(--ink-mute)" }}>{l.region}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="booking-step-body">
                  <h3 className="font-display">{t.booking.sub_provider}</h3>
                  <div className="booking-options">
                    <button
                      type="button"
                      className={`booking-option ${providerName === "" ? "is-selected" : ""}`}
                      onClick={() => setProviderName("")}
                    >
                      {t.booking.skip}
                    </button>
                    {filteredProviders.slice(0, 8).map((p) => (
                      <button
                        type="button"
                        key={p.name}
                        className={`booking-option ${providerName === p.name ? "is-selected" : ""}`}
                        onClick={() => setProviderName(p.name)}
                      >
                        <span style={{ display: "block", fontWeight: 600 }}>{p.name}</span>
                        <span className="small-label" style={{ color: "var(--ink-mute)" }}>{p.role}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="booking-step-body">
                  <h3 className="font-display">{t.booking.sub_time}</h3>
                  <div className="booking-options">
                    {SAMPLE_TIMES.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        className={`booking-option ${time === slot ? "is-selected" : ""}`}
                        onClick={() => setTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <div className="booking-fields">
                    <label>
                      <span>{t.booking.patient_name}</span>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
                    </label>
                    <label>
                      <span>{t.booking.patient_phone}</span>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" placeholder="(555) 123-4567" />
                    </label>
                    <label>
                      <span>{t.booking.patient_dob}</span>
                      <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                    </label>
                  </div>
                </div>
              )}

              <div className="booking-actions">
                {step > 1 && (
                  <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => Math.max(1, s - 1))}>
                    {t.booking.back}
                  </button>
                )}
                {step < 4 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setStep((s) => Math.min(4, s + 1))}
                    disabled={!canNext}
                  >
                    {t.booking.next}
                  </button>
                )}
                {step === 4 && (
                  <button type="submit" className="btn btn-terracotta" disabled={!canNext}>
                    {t.booking.submit}
                  </button>
                )}
              </div>
            </form>
          </>
        )}

        {submitted && (
          <div className="booking-success">
            <div className="success-mark" aria-hidden="true">
              <svg viewBox="0 0 60 60" width="60" height="60" fill="none">
                <circle cx="30" cy="30" r="28" stroke="var(--sage)" strokeWidth="2" />
                <path d="M18 31 L26 39 L42 22" stroke="var(--forest)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-display">{t.booking.success_title}</h3>
            <p className="lead">{t.booking.success_body}</p>
            <button className="btn btn-primary" onClick={onClose}>{t.booking.success_close}</button>
          </div>
        )}
      </div>

      <style>{`
        .booking-card { background: rgba(255,255,255,0.72); backdrop-filter: blur(26px) saturate(165%); -webkit-backdrop-filter: blur(26px) saturate(165%); border: 1px solid rgba(255,255,255,0.62); border-radius: 28px; max-width: 640px; width: 100%; max-height: 92vh; overflow-y: auto; padding: 2rem; position: relative; box-shadow: inset 0 1px 0 rgba(255,255,255,0.82), var(--shadow-strong); animation: scale-in 320ms cubic-bezier(0.22,1,0.36,1) both; }
        .booking-head { margin-bottom: 1.4rem; }
        .booking-head .small-label { color: var(--ink-mute); }
        .booking-steps { display: flex; gap: 0.4rem; margin-top: 0.7rem; }
        .booking-step { flex: 1; display: flex; align-items: center; gap: 0.5rem; padding: 0.45rem 0.6rem; border-radius: 12px; background: var(--ivory-deep); border: 1px solid var(--line); color: var(--ink-mute); font-size: 0.78rem; }
        .booking-step.active { background: var(--forest); color: var(--ivory); border-color: var(--forest); }
        .booking-step.done { background: var(--sand); color: var(--forest); border-color: var(--sand); }
        .booking-step-num { display: inline-flex; width: 22px; height: 22px; align-items: center; justify-content: center; border-radius: 999px; background: rgba(255,255,255,0.18); font-weight: 700; font-size: 0.74rem; }
        .booking-step.done .booking-step-num, .booking-step:not(.active) .booking-step-num { background: rgba(21,101,184,0.14); }
        .booking-step-body h3 { font-size: 1.4rem; margin: 0 0 1rem; color: var(--forest-deep); }
        .booking-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.55rem; }
        .booking-option { padding: 0.95rem 1rem; text-align: left; border-radius: 14px; border: 1px solid var(--line); background: var(--ivory-deep); cursor: pointer; transition: 220ms ease; min-height: 56px; }
        .booking-option:hover { border-color: var(--forest); }
        .booking-option.is-selected { background: var(--forest); color: var(--ivory); border-color: var(--forest); }
        .booking-option.is-selected .small-label { color: rgba(247,240,226,0.8); }
        .booking-fields { display: grid; gap: 0.7rem; margin-top: 1.2rem; }
        .booking-fields label { display: grid; gap: 0.3rem; }
        .booking-fields span { font-size: 0.85rem; color: var(--ink-mute); font-weight: 600; }
        .booking-fields input { padding: 0.85rem 0.95rem; border-radius: 12px; border: 1px solid var(--line-strong); font: inherit; background: var(--ivory); }
        .booking-fields input:focus { outline: none; border-color: var(--forest); box-shadow: var(--focus); }
        .booking-actions { display: flex; justify-content: space-between; gap: 0.5rem; margin-top: 1.6rem; flex-wrap: wrap; }
        .booking-actions .btn { flex: 1; min-width: 140px; }
        .booking-success { text-align: center; padding: 2rem 1rem 1rem; }
        .booking-success h3 { font-size: 1.6rem; margin: 0.8rem 0 0.4rem; color: var(--forest-deep); }
        .success-mark { display: inline-flex; }
        @media (max-width: 720px) {
          .modal-backdrop { align-items: flex-end !important; padding: 0 !important; }
          .booking-card {
            border-radius: 24px 24px 0 0;
            max-height: 92vh;
            padding: 1.4rem 1.2rem calc(1.4rem + env(safe-area-inset-bottom));
            animation: sheet-up 360ms cubic-bezier(0.22,1,0.36,1) both;
          }
          .booking-card::before {
            content: "";
            display: block;
            width: 40px;
            height: 4px;
            border-radius: 4px;
            background: rgba(21,76,130,0.16);
            margin: 0 auto 1rem;
          }
          .booking-options { grid-template-columns: 1fr; }
          .booking-step-label { display: none; }
          .booking-step { padding: 0.6rem 0.5rem; }
          .booking-actions .btn { min-height: 56px; font-size: 1.02rem; }
        }
        @keyframes sheet-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
