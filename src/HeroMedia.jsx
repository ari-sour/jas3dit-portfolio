import React, { useEffect, useRef, useState } from 'react';

export default function HeroMedia({ artwork, onOpen }) {
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const alive = useRef(true);
  const attempting = useRef(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [delayElapsed, setDelayElapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    alive.current = true;
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) setImageLoaded(true);
    const video = videoRef.current;
    return () => { alive.current = false; video?.pause(); };
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;
    const timer = window.setTimeout(() => setDelayElapsed(true), 5000);
    return () => window.clearTimeout(timer);
  }, [imageLoaded]);

  async function play(restart = false) {
    const video = videoRef.current;
    if (!video || failed || attempting.current) return;
    attempting.current = true;
    if (restart) video.currentTime = 0;
    setEnded(false);
    try {
      await video.play();
      if (alive.current) setBlocked(false);
    } catch (error) {
      if (alive.current) {
        if (error.name === 'NotAllowedError') setBlocked(true);
        else if (error.name !== 'AbortError') { setFailed(true); setRevealed(false); }
      }
    } finally { attempting.current = false; }
  }

  useEffect(() => {
    if (delayElapsed && ready && !failed) play(true);
    // A single automatic attempt, after both the image delay and media readiness.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delayElapsed, ready, failed]);

  return <div className="art-panel hero-art">
    <div className={`hero-media ${revealed && !failed ? 'show-trailer' : ''}`}>
      <div className="hero-media-card">
        <button className="media-face media-image" onClick={() => onOpen(artwork)} aria-label={`View ${artwork.title}`} tabIndex={revealed ? -1 : 0} aria-hidden={revealed}>
          <img ref={imageRef} src={artwork.image} alt={artwork.alt} width="1920" height="1080" fetchPriority="high" onLoad={() => setImageLoaded(true)} />
        </button>
        <div className="media-face media-video" aria-hidden={!revealed}>
          <video ref={videoRef} src="/assets/gojo-trailer.mp4" poster={artwork.image} preload="auto" muted={muted} playsInline aria-label="Gojo Satoru resin figure video trailer"
            onCanPlay={() => setReady(true)}
            onPlaying={() => { if (!failed) { setRevealed(true); setPlaying(true); setBlocked(false); } }}
            onPause={() => setPlaying(false)}
            onEnded={() => { setPlaying(false); setEnded(true); }}
            onError={() => { setFailed(true); setRevealed(false); setPlaying(false); setBlocked(false); }} />
        </div>
      </div>
      {blocked && !failed && !revealed && <button className="trailer-start button" onClick={() => play(true)}>Play trailer <span aria-hidden="true">▶</span></button>}
      {revealed && !failed && <div className="trailer-controls" role="group" aria-label="Trailer controls">
        {!ended && <button onClick={() => playing ? videoRef.current.pause() : play()}>{playing ? 'Pause' : 'Play'}<span className="sr-only"> trailer</span></button>}
        <button onClick={() => { const next = !muted; videoRef.current.muted = next; setMuted(next); }} aria-pressed={!muted}>{muted ? 'Enable sound' : 'Mute sound'}</button>
        <button onClick={() => play(true)}>Replay<span className="sr-only"> trailer from beginning</span></button>
      </div>}
      <span className="sr-only" role="status">{failed ? 'Trailer unavailable. Original artwork displayed.' : ended ? 'Trailer finished. Replay available.' : blocked ? 'Select Play trailer to start playback.' : ''}</span>
    </div>
    <div className="art-caption"><div><h2>{artwork.caption}</h2><p>Digital sculpt <span aria-hidden="true">·</span> Featured project</p></div><button className="artwork-open" onClick={() => onOpen(artwork)} aria-label={`View full image: ${artwork.title}`}><span className="arrow circle" aria-hidden="true">↗</span></button></div>
  </div>;
}
