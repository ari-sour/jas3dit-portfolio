import React, { useCallback, useEffect, useRef, useState } from 'react';
import { atBoundary, createWheelGesture, hashPage, pageIds } from './bookNavigation.js';

const names = ['Home', 'Works', 'Services', 'About', 'Contact'];
const interactive = target => target.closest('button, a, input, textarea, select, video, [contenteditable], .nav, .overlay, [role="dialog"]');

export default function ArtBook({ pages, header, blocked, onActivePage }) {
  const [active, setActive] = useState(hashPage);
  const [turn, setTurn] = useState(null);
  const current = useRef(active);
  const locked = useRef(false);
  const timer = useRef(null);
  const pendingHistory = useRef(null);
  const pageRefs = useRef([]);
  const shell = useRef(null);
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;
  const activeCallback = useRef(onActivePage);
  activeCallback.current = onActivePage;
  const goRef = useRef(null);

  const go = useCallback((target, history = true) => {
    if (target < 0 || target >= pageIds.length) return;
    if (locked.current) { if (!history) pendingHistory.current = target; return; }
    if (target === current.current) return;
    locked.current = true;
    const from = current.current;
    activeCallback.current(-1);
    setTurn({ from, to: target, direction: target > from ? 'forward' : 'backward' });
    if (history) window.history.pushState(null, '', `#${pageIds[target]}`);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = window.setTimeout(() => {
      current.current = target;
      setActive(target);
      setTurn(null);
      locked.current = false;
      activeCallback.current(target);
      pageRefs.current[target]?.focus({ preventScroll: true });
      const pending = pendingHistory.current;
      pendingHistory.current = null;
      if (pending !== null && pending !== target) goRef.current(pending, false);
    }, reduced ? 100 : 700);
  }, []);
  goRef.current = go;

  useEffect(() => {
    activeCallback.current(current.current);
    if (!pageIds.includes(window.location.hash.slice(1).split('/')[0])) window.history.replaceState(null, '', '#home');
    const history = () => go(hashPage(), false);
    window.addEventListener('popstate', history);
    window.addEventListener('hashchange', history);
    return () => {
      window.clearTimeout(timer.current);
      window.removeEventListener('popstate', history);
      window.removeEventListener('hashchange', history);
    };
  }, [go]);

  useEffect(() => {
    const root = shell.current;
    const gesture = createWheelGesture();
    let touch = null;
    const unavailable = target => blockedRef.current || !!document.querySelector('.nav.open') || interactive(target);
    const wheel = event => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || unavailable(event.target)) return;
      const page = pageRefs.current[current.current];
      if (!page.contains(event.target)) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? page.clientHeight : 1);
      const boundary = atBoundary(page, Math.sign(delta));
      if (locked.current || boundary) event.preventDefault();
      const direction = gesture.input(delta, performance.now(), boundary, locked.current);
      if (direction) go(current.current + direction);
    };
    const key = event => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || unavailable(event.target)) return;
      const direction = ['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key) ? 1 : ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key) ? -1 : 0;
      if (!direction || event.repeat) return;
      const page = pageRefs.current[current.current];
      event.preventDefault();
      if (locked.current) return;
      if (!atBoundary(page, direction)) {
        page.scrollBy({ top: direction * page.clientHeight * .8, behavior: 'auto' });
      } else go(current.current + direction);
    };
    const start = event => {
      if (event.touches.length !== 1 || unavailable(event.target) || locked.current) { touch = null; return; }
      const page = pageRefs.current[current.current];
      if (!page.contains(event.target)) return;
      touch = { x: event.touches[0].clientX, y: event.touches[0].clientY, top: atBoundary(page, -1), bottom: atBoundary(page, 1), time: performance.now() };
    };
    const end = event => {
      if (!touch || locked.current) return;
      const point = event.changedTouches[0];
      const dx = point.clientX - touch.x, dy = point.clientY - touch.y;
      if (Math.abs(dy) > 65 && Math.abs(dy) > Math.abs(dx) * 1.3 && performance.now() - touch.time < 1100) {
        const direction = dy < 0 ? 1 : -1;
        // Boundary must already have been reached before this new swipe started.
        if (direction > 0 ? touch.bottom : touch.top) go(current.current + direction);
      }
      touch = null;
    };
    root.addEventListener('wheel', wheel, { passive: false });
    root.addEventListener('touchstart', start, { passive: true });
    root.addEventListener('touchend', end, { passive: true });
    const cancel = () => { touch = null; };
    root.addEventListener('touchcancel', cancel);
    document.addEventListener('keydown', key);
    return () => {
      root.removeEventListener('wheel', wheel);
      root.removeEventListener('touchstart', start);
      root.removeEventListener('touchend', end);
      root.removeEventListener('touchcancel', cancel);
      document.removeEventListener('keydown', key);
    };
  }, [go]);

  const link = event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const hash = anchor.getAttribute('href').slice(1);
    const target = pageIds.indexOf(hash);
    if (target !== -1) { event.preventDefault(); go(target); }
    else if (hash === 'main') { event.preventDefault(); pageRefs.current[current.current]?.focus(); }
  };
  return <div ref={shell} className="book-shell" onClick={link}>
    {header(names[turn?.to ?? active])}
    <main id="main" className={`art-book ${turn ? `turning turn-${turn.direction}` : ''}`} aria-label="Jas 3D It digital art book" aria-busy={!!turn}>
      {pages.map((render, index) => {
        const selected = index === active && !turn;
        const visible = selected || turn && (index === turn.from || index === turn.to);
        const phase = turn ? index === turn.from ? 'page-out' : index === turn.to ? 'page-in' : '' : '';
        return <div ref={element => { pageRefs.current[index] = element; }} key={pageIds[index]} className={`book-page ${phase}`} data-page={pageIds[index]} style={{ display: visible ? undefined : 'none' }} inert={!selected} aria-hidden={!selected} tabIndex={-1} role="region" aria-label={`${names[index]} — page ${index + 1} of 5`}>
          <div className="page-content">{render(selected)}</div>
        </div>;
      })}
    </main>
    <span className="sr-only" aria-live="polite">{names[turn?.to ?? active]}</span>
  </div>;
}
