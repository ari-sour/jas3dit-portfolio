import React, { useEffect, useRef } from 'react';

// Foreground media events are the only playback authority for this decoration.
export default function HeroBackdrop({ masterRef, active = true }) {
  const layerRef = useRef(null);
  const videoRef = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (!active) videoRef.current?.pause();
  }, [active]);

  useEffect(() => {
    const master = masterRef.current;
    const background = videoRef.current;
    const layer = layerRef.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let running = false, started = false, pending = false, disposed = false;
    let backgroundFailed = false;

    layer.style.height = '100%';

    const hide = () => layer.classList.remove('is-active');
    const align = () => {
      if (background.readyState < 1) return;
      const drift = Math.abs(background.currentTime - master.currentTime);
      if (drift > 0.18 || master.seeking || master.ended) {
        try { background.currentTime = master.currentTime; } catch { /* Wait for metadata. */ }
      }
      background.playbackRate = master.playbackRate;
      background.muted = true;
      background.volume = 0;
    };
    const sync = () => {
      if (disposed || !activeRef.current || motion.matches || backgroundFailed || master.error) {
        background.pause(); hide(); return;
      }
      align();
      if (!running || master.paused || master.ended || master.seeking) {
        background.pause();
        if (started && background.readyState >= 2) layer.classList.add('is-active');
        return;
      }
      if (background.readyState < 3 || !background.paused || pending) return;
      pending = true;
      background.play().then(() => {
        if (disposed || !activeRef.current || !running || master.paused || master.ended || motion.matches || master.error) {
          background.pause();
        } else if (started) layer.classList.add('is-active');
      }).catch(hide).finally(() => { pending = false; });
    };
    const onPlaying = () => { started = true; running = true; sync(); };
    const onHold = () => { running = false; background.pause(); align(); };
    const onSeeked = () => { running = !master.paused && !master.ended && master.readyState >= 3; sync(); };
    const onError = () => { running = false; started = false; background.pause(); hide(); };
    const backgroundError = () => { backgroundFailed = true; background.pause(); hide(); };
    const mute = () => { background.muted = true; background.volume = 0; };
    const configureMotion = () => {
      background.pause(); hide();
      if (motion.matches) { background.removeAttribute('src'); background.load(); }
      else {
        backgroundFailed = false;
        background.src = '/assets/gojo-trailer.mp4';
        background.load();
        running = started && !master.paused && !master.ended && master.readyState >= 3;
      }
    };
    const events = {
      playing: onPlaying, pause: onHold, waiting: onHold,
      seeking: onHold, seeked: onSeeked, ended: onError,
      ratechange: sync, timeupdate: sync, error: onError, emptied: onError,
    };
    Object.entries(events).forEach(([name, handler]) => master.addEventListener(name, handler));
    background.addEventListener('canplay', sync);
    background.addEventListener('loadedmetadata', align);
    background.addEventListener('error', backgroundError);
    background.addEventListener('volumechange', mute);
    motion.addEventListener('change', configureMotion);
    configureMotion();
    // Event-driven sync plus periodic correction handles long uninterrupted playback.
    const timer = window.setInterval(sync, 500);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      Object.entries(events).forEach(([name, handler]) => master.removeEventListener(name, handler));
      background.removeEventListener('canplay', sync);
      background.removeEventListener('loadedmetadata', align);
      background.removeEventListener('error', backgroundError);
      background.removeEventListener('volumechange', mute);
      motion.removeEventListener('change', configureMotion);
      background.pause();
      background.removeAttribute('src');
      background.load();
    };
  }, [masterRef]);

  return <div ref={layerRef} className="hero-backdrop" aria-hidden="true" inert="">
    <video ref={videoRef} muted playsInline preload="metadata" tabIndex={-1} />
  </div>;
}
