import React, { useEffect, useRef, useState } from 'react';

export default function IgrisPreview({ work }) {
  const root = useRef(null);
  const video = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!loaded || failed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timer;
    const observer = new IntersectionObserver(([entry]) => {
      clearTimeout(timer);
      if (entry.isIntersecting && !root.current.closest('[inert]') && !document.hidden) {
        timer = setTimeout(() => { video.current.muted = true; video.current.play().catch(() => setPlaying(false)); }, 3000);
      } else video.current?.pause();
    }, { threshold: .4 });
    observer.observe(root.current);
    const visibility = () => { if (document.hidden) video.current?.pause(); };
    document.addEventListener('visibilitychange', visibility);
    return () => { clearTimeout(timer); observer.disconnect(); document.removeEventListener('visibilitychange', visibility); video.current?.pause(); };
  }, [loaded, failed, cycle]);
  return <span ref={root} className={`igris-preview ${playing && !failed ? 'is-playing' : ''}`} aria-hidden="true">
    <span className="igris-preview-card"><img src={work.image} alt="" onLoad={() => setLoaded(true)} /><video ref={video} src="/assets/igris/igris-vid.mp4" muted playsInline preload="metadata" tabIndex={-1} onPlaying={() => setPlaying(true)} onEnded={() => { setPlaying(false); video.current.currentTime = 0; setCycle(value => value + 1); }} onError={() => { setFailed(true); setPlaying(false); }} /></span>
  </span>;
}
