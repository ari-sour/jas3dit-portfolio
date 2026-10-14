import React, { useEffect, useId, useState } from 'react';
import './hero-buttons.css';

function PurpleEnergy({ id }) {
  return <><div className="energy-trail" /><div className="orb-carrier"><svg viewBox="0 0 120 120" className="purple-orb"><defs><radialGradient id={id}><stop offset="0" stopColor="#fff" /><stop offset=".28" stopColor="#f2ddff" /><stop offset=".62" stopColor="#bc60ff" /><stop offset="1" stopColor="#8234ea" stopOpacity="0" /></radialGradient></defs><circle cx="60" cy="60" r="33" fill={`url(#${id})`} /><g fill="none" stroke="#d7a4ff"><circle cx="60" cy="60" r="24" strokeWidth="1.5" /><circle cx="60" cy="60" r="34" strokeWidth=".8" /><circle cx="60" cy="60" r="43" strokeWidth=".8" strokeDasharray="16 7 4 9" /><path d="M39 36 32 27 22 29 15 18 4 15M83 37l7-12 10 3 5-15 12-7M35 76l-11 5-7-6-4 13-11 4M85 81l10 7 8-5 4 17 11 6M59 18l-4-8 7-7M61 102l6 8-3 8" strokeWidth="1.6" /></g><circle cx="60" cy="60" r="9" fill="#fff7ff" /></svg></div><svg className="energy-arcs" viewBox="0 0 240 52" preserveAspectRatio="none"><g fill="none" stroke="#c482ff" strokeWidth=".7"><path d="m0 14 18 3 13-8 18 14 25-9 16 10 24-6 18 12 22-16 15 6 21-9 17 8 33-4M0 39l22-8 17 9 19-11 20 9 24-6 17 12 17-14 20 8 21-7 23 10 20-8 20 3" /></g></svg></>;
}
function DetectiveScan() {
  return <><svg className="detective-details" viewBox="0 0 240 54" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#71d5f5" strokeWidth=".7" opacity=".7"><path d="M20 12 54 25 78 9M20 12l5 31 29-18 24 19M78 9l2 35M25 43l55 1" strokeDasharray="2 3" /><rect x="14" y="7" width="13" height="15" transform="rotate(-10 20 14)" /><rect x="71" y="3" width="12" height="13" /><rect x="72" y="38" width="15" height="12" /><circle cx="54" cy="25" r="3" /><path d="M176 42c-12-11-12-30 0-34 14-5 23 9 19 24M171 42c-9-12-8-25 2-29 10-4 18 5 17 14M176 43c-8-10-9-22 0-25 7-3 12 4 10 12M181 44c-8-9-10-19-3-21 5-2 7 3 6 9M188 44c-4-5-6-9-7-13" /></g><g transform="translate(112 0)"><path d="M-17 54l3-14 10-5c-8-3-11-9-11-17L-20 22l7-13-1-7 11 3L3 0l8 5 12-3-6 11 4 8-6-3c0 8-3 14-10 18l10 5 5 13Z" fill="#071728" stroke="#6bd8f5" strokeWidth=".65" /><g fill="none" stroke="#96eaff" strokeWidth="1"><ellipse cx="-6" cy="22" rx="7" ry="5" /><ellipse cx="9" cy="22" rx="7" ry="5" /><path d="M1 22h1m-15-2-4-2M16 20l4-2M-5 33l7 1" /></g><path d="m-5 42-8-3v10l8-4 5 4 8-10-8 3" fill="#144055" stroke="#77d8f4" strokeWidth=".8" /><circle cx="-3" cy="43" r="2" fill="#91eaff" /></g></svg><div className="scan-beam" /><svg className="magnifier" viewBox="0 0 48 48"><circle cx="20" cy="19" r="11" fill="#123a5540" stroke="#9aeaff" strokeWidth="2.2" /><circle cx="20" cy="19" r="15" fill="none" stroke="#3cc5ff" strokeWidth=".7" strokeDasharray="14 5" /><path d="m28 28 10 13" stroke="#88e4ff" strokeWidth="5" strokeLinecap="round" /><path d="M13 16c1-3 3-5 6-5" fill="none" stroke="#fff" strokeWidth="1.4" /><path className="lens-glint" d="M20 10v18M11 19h18" stroke="#d8fbff" strokeWidth=".8" /></svg></>;
}

export default function HeroButton({ href, theme, children }) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [running, setRunning] = useState(false);
  const [entry, setEntry] = useState(0);
  const engaged = hover || focus;
  useEffect(() => {
    if (engaged) { setRunning(true); setEntry(value => value + 1); return; }
    // Let the decorative layer fade away before resetting its animation.
    const timer = window.setTimeout(() => setRunning(false), 320);
    return () => window.clearTimeout(timer);
  }, [engaged]);
  const id = `energy-${useId().replace(/:/g, '')}`;
  return <a href={href} className={`button hero-pill hero-pill-${theme} ${engaged ? 'is-engaged' : ''} ${running ? 'effects-running' : ''} ${pressed ? 'is-pressed' : ''}`}
    onPointerDown={event => { if (event.pointerType !== 'mouse') setPressed(true); }}
    onPointerUp={() => setPressed(false)} onPointerCancel={() => setPressed(false)}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHover(true); }}
    onPointerLeave={() => setHover(false)}
    onFocus={event => setFocus(event.currentTarget.matches(':focus-visible'))}
    onBlur={() => setFocus(false)}>
    <div key={entry} className="pill-effects" aria-hidden="true">{theme === 'purple' ? <PurpleEnergy id={id} /> : <DetectiveScan />}</div>
    <span className="pill-label">{children}</span><span className="pill-arrow" aria-hidden="true">→</span>
  </a>;
}
