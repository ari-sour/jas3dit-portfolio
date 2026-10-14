import React, { useEffect, useRef, useState } from 'react';

function MediaIcon({ type }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {type === 'pause' ? <><path d="M8 5v14M16 5v14" /></> : type === 'play' ? <path d="m8 5 11 7-11 7Z" /> : type === 'replay' ? <><path d="M4 9a8 8 0 1 1 0 6M4 4v5h5" /></> : <><path d="M11 4 6 8H3v8h3l5 4Z" />{type === 'muted' ? <path d="m16 9 5 6m0-6-5 6" /> : <><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" /></>}</>}
  </svg>;
}
function mediaTime(seconds) {
  const value = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}

export default function HeroMedia({ artwork, onOpen, videoRef, active = true, onCopyPlayback }) {
  const imageRef = useRef(null);
  const alive = useRef(true);
  const attempting = useRef(false);
  const activeRef = useRef(active);
  activeRef.current = active;
  const autoStarted = useRef(false);
  const resumeOnReturn = useRef(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [delayElapsed, setDelayElapsed] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ended, setEnded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [touchVisible, setTouchVisible] = useState(false);
  const [touchTick, setTouchTick] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

  const updateDuration = event => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0);
  useEffect(() => {
    if (!scrubbing) return;
    const release = () => setScrubbing(false);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    return () => { window.removeEventListener('pointerup', release); window.removeEventListener('pointercancel', release); };
  }, [scrubbing]);

  useEffect(() => {
    if (!touchVisible || !playing || !active || scrubbing) return;
    const timer = window.setTimeout(() => setTouchVisible(false), 2500);
    return () => window.clearTimeout(timer);
  }, [touchVisible, touchTick, playing, active, scrubbing]);


  useEffect(() => {
    alive.current = true;
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) setImageLoaded(true);
    const video = videoRef.current;
    return () => { alive.current = false; video?.pause(); };
  }, []);

  useEffect(() => {
    if (!imageLoaded || !active || revealed || failed) return;
    const timer = window.setTimeout(() => setDelayElapsed(true), 2000);
    return () => window.clearTimeout(timer);
  }, [imageLoaded, active, revealed, failed, cycle]);

  async function play(restart = false) {
    const video = videoRef.current;
    if (!video || failed || attempting.current || !activeRef.current) return;
    attempting.current = true;
    if (restart) video.currentTime = 0;
    setEnded(false);
    try {
      await video.play();
      if (!activeRef.current) video.pause();
      if (alive.current) setBlocked(false);
    } catch (error) {
      if (alive.current) {
        if (error.name === 'NotAllowedError') { setBlocked(true); onCopyPlayback?.(false); }
        else if (error.name !== 'AbortError') { setFailed(true); setRevealed(false); onCopyPlayback?.(false); }
      }
    } finally { attempting.current = false; }
  }

  useEffect(() => {
    if (active && delayElapsed && ready && !failed && !autoStarted.current) {
      autoStarted.current = true;
      play(true);
    }
    // One automatic attempt per image/trailer cycle, once playback is ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delayElapsed, ready, failed, active]);

  useEffect(() => {
    const video = videoRef.current;
    if (!active) {
      resumeOnReturn.current = !video.paused && !video.ended;
      video.pause();
    } else if (resumeOnReturn.current) {
      resumeOnReturn.current = false;
      play();
    }
  }, [active]);

  return <div className={`art-panel hero-art ${revealed && !failed ? 'trailer-revealed' : ''}`}>
    <div className={`hero-media ${revealed && !failed ? 'show-trailer' : ''}`}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setHovered(false); }}
      onPointerUp={event => { if (event.pointerType !== 'mouse' && revealed) { setTouchVisible(true); setTouchTick(tick => tick + 1); } }}>
      <div className="hero-media-card">
        <button className="media-face media-image" onClick={() => onOpen(artwork)} aria-label={`View ${artwork.title}`} tabIndex={revealed ? -1 : 0} aria-hidden={revealed}>
          <img ref={imageRef} src={artwork.image} alt={artwork.alt} width="1920" height="1080" fetchPriority="high" onLoad={() => setImageLoaded(true)} />
        </button>
        <div className="media-face media-video" aria-hidden={!revealed}>
          <video ref={videoRef} src="/assets/gojo-trailer.mp4" poster={artwork.image} preload="auto" muted={muted} playsInline aria-label="Gojo Satoru resin figure video trailer"
            onCanPlay={() => setReady(true)}
            onLoadedMetadata={updateDuration} onDurationChange={updateDuration}
            onTimeUpdate={event => setPosition(event.currentTarget.currentTime)}
            onSeeked={event => setPosition(event.currentTarget.currentTime)}
            onPlaying={() => { if (!failed) { setRevealed(true); setPlaying(true); setBlocked(false); onCopyPlayback?.(true); } }}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false); setEnded(true); setRevealed(false);
              setDelayElapsed(false); setBlocked(false);
              autoStarted.current = false;
              onCopyPlayback?.(false);
              setCycle(value => value + 1);
            }}
            onError={() => { setFailed(true); setRevealed(false); setPlaying(false); setBlocked(false); onCopyPlayback?.(false); }} />
        </div>
      </div>
      {(revealed || blocked) && !failed && <div className={`trailer-controls ${hovered || touchVisible || scrubbing || !playing || ended || blocked ? 'controls-visible' : ''}`} role="group" aria-label="Trailer controls">
        <input className="trailer-seek" type="range" min="0" max={duration} step="0.1" value={Math.min(position, duration)} disabled={!duration}
          aria-label="Seek trailer" aria-valuetext={`${mediaTime(position)} of ${mediaTime(duration)}`} title="Drag to fast-forward or rewind"
          style={{ '--seek-progress': `${duration ? position / duration * 100 : 0}%` }}
          onPointerDown={() => setScrubbing(true)} onBlur={() => setScrubbing(false)}
          onChange={event => { const time = Number(event.target.value); videoRef.current.currentTime = time; setPosition(time); }} />
        <button aria-label={playing ? 'Pause trailer' : ended ? 'Play trailer from beginning' : 'Play trailer'} title={playing ? 'Pause trailer' : 'Play trailer'} onClick={() => playing ? videoRef.current.pause() : play(ended || !revealed)}><MediaIcon type={playing ? 'pause' : 'play'} /></button>
        <button aria-label={muted ? 'Enable trailer sound' : 'Mute trailer sound'} title={muted ? 'Enable sound' : 'Mute sound'} onClick={() => { const next = !muted; videoRef.current.muted = next; setMuted(next); }} aria-pressed={!muted}><MediaIcon type={muted ? 'muted' : 'speaker'} /></button>
        <button aria-label="Replay trailer from beginning" title="Replay trailer" onClick={() => play(true)}><MediaIcon type="replay" /></button>
      </div>}
      <span className="sr-only" role="status">{failed ? 'Trailer unavailable. Original artwork displayed.' : blocked ? 'Select Play trailer to start playback.' : ended ? 'Trailer finished. Artwork displayed before the next playback.' : ''}</span>
    </div>
    <div className="art-caption"><div><h2>{artwork.caption}</h2><p>Personal <span aria-hidden="true">·</span> Recent project</p></div><button className="artwork-open" onClick={() => onOpen(artwork)} aria-label={`View full image: ${artwork.title}`}><span className="arrow circle" aria-hidden="true">↗</span></button></div>
  </div>;
}
