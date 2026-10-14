import React, { useEffect, useRef, useState } from 'react';
import { atBoundary, createWheelGesture } from './bookNavigation.js';
import './gojo-project.css';

export const gojoGroups = [
  ['jas-a-sculpt-gojo-2.jpg', 'jas-a-sculpt-gojo-3.jpg'],
  ['jas-a-sculpt-gojo-8.jpg', 'jas-a-sculpt-gojo-5.jpg', 'jas-a-sculpt-gojo-6.jpg', 'jas-a-sculpt-gojo-7.jpg'],
  ['jas-a-sculpt-gojo-9.webp', 'jas-a-sculpt-gojo-10.webp'],
];
const descriptions = [
  ['Gojo Satoru Nuke Hollow Purple sculpture, first complete showcase view', 'Gojo Satoru Nuke Hollow Purple sculpture, second complete showcase view'],
  ['Gojo sculpture detail study, first view', 'Gojo sculpture detail study, second view', 'Gojo sculpture detail study, third view', 'Gojo sculpture detail study, fourth view'],
  ['Gojo Satoru expression and figure comparison sheet, first sheet', 'Gojo Satoru expression and figure comparison sheet, second sheet'],
];
const projects = {
  kaiju: {
    title: 'Kaiju No. 8 — Kafka Hibino',
    groups: [['jas-a-sculpt-kafka-1.webp', 'jas-a-sculpt-kafka-2.webp'], ['jas-a-sculpt-kafka-3.webp', 'jas-a-sculpt-kafka-4.webp'], ['jas-a-sculpt-kafka-5.webp', 'jas-a-sculpt-kafka-6.webp'], ['jas-a-sculpt-kafka-7.webp']],
    descriptions: [
      ['Kafka Hibino and Kaiju No. 8 sculpture with teal energy and a rubble base, first view', 'Kafka Hibino and Kaiju No. 8 sculpture, second view'],
      ['Kafka Hibino and Kaiju No. 8 sculpture, third view', 'Kafka Hibino and Kaiju No. 8 sculpture, fourth view'],
      ['Kafka Hibino and Kaiju No. 8 sculpture, fifth view', 'Kafka Hibino and Kaiju No. 8 sculpture, sixth view'],
      ['Close view of Kafka Hibino and Kaiju No. 8 with teal energy effects'],
    ],
    layouts: ['two', 'two', 'two', 'single'],
  },
  igris: {
    title: 'Dark Knight Igris',
    groups: [['jas-a-sculpt-igris-1.webp', 'jas-a-sculpt-igris-2.webp'], ['jas-a-sculpt-igris-3.webp', 'jas-a-sculpt-igris-4.webp'], ['jas-a-sculpt-igris-5.webp']],
    descriptions: [['Dark Knight Igris sculpture with red plume, blue effects, sword, and rubble base', 'Dark Knight Igris sculpture, second complete view'], ['Dark Knight Igris sculpture, third view', 'Dark Knight Igris sculpture, fourth view'], ['Dark Knight Igris sculpture, final complete view']],
    layouts: ['two', 'two', 'single'],
  },
  gojo: { title: 'Gojo Satoru’s Last Stand: Nuke Hollow Purple', groups: gojoGroups, descriptions, layouts: ['two', 'quad', 'stacked'] },
  giyu: {
    title: 'Giyu Tomioka 10th Form: Seisei Ruten',
    groups: [['jas-artworks-giyu-1.webp', 'jas-artworks-giyu-2.webp'], ['jas-artworks-giyu-3.webp', 'jas-artworks-giyu-4.webp']],
    descriptions: [
      ['Giyu Tomioka sculpture with a blue water dragon, first complete composition', 'Giyu Tomioka sculpture with water effects, alternate complete composition'],
      ['Giyu Tomioka sculpture detail, first view', 'Close view of Giyu Tomioka and the blue water dragon'],
    ],
    layouts: ['two', 'two'],
  },
};
export function projectIdFromHash() {
  const match = window.location.hash.match(/^#works\/(gojo|giyu|igris|kaiju)(?:\/(\d+))?$/);
  const page = Number(match?.[2] || 1);
  return match && page >= 1 && page <= projects[match[1]].groups.length ? match[1] : null;
}
export function projectPageFromHash() {
  if (!projectIdFromHash()) return null;
  return Number(window.location.hash.split('/')[2] || 1) - 1;
}
export function setProjectHash(page, projectId = 'gojo') {
  window.history.pushState(null, '', `#works/${projectId}/${page + 1}`);
  window.dispatchEvent(new Event('hashchange'));
}

function ImageZoom({ image, onClose }) {
  const [zoom, setZoom] = useState(1);
  const root = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    root.current.querySelector('button').focus();
    const key = event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
      if (event.key === 'Tab') {
        const buttons = [...root.current.querySelectorAll('button:not(:disabled)')];
        if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1).focus(); }
        else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0].focus(); }
      }
    };
    root.current.addEventListener('keydown', key);
    const node = root.current;
    return () => { node.removeEventListener('keydown', key); previous?.focus({ preventScroll: true }); };
  }, [onClose]);
  return <div ref={root} className="project-zoom" role="dialog" aria-modal="true" aria-label="Artwork close inspection">
    <div className="zoom-toolbar"><button onClick={onClose}><span aria-hidden="true">×</span></button><div role="group" aria-label="Image zoom"><button disabled={zoom <= 1} onClick={() => setZoom(Math.max(1, zoom - .5))} aria-label="Zoom out">−</button><span aria-live="polite">{Math.round(zoom * 100)}%</span><button disabled={zoom >= 3} onClick={() => setZoom(Math.min(3, zoom + .5))} aria-label="Zoom in">+</button><button onClick={() => setZoom(1)}>Reset</button></div></div>
    <div className="zoom-viewport"><div className="zoom-canvas" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}><img src={image.src} alt={image.alt} /></div></div>
  </div>;
}

export default function ProjectDetail({ page, onBack, projectId = 'gojo' }) {
  const project = projects[projectId];
  const groups = project.groups;
  const descriptions = project.descriptions;
  const count = groups.length;
  const [active, setActive] = useState(page);
  const [turn, setTurn] = useState(null);
  const [zoom, setZoom] = useState(null);
  const root = useRef(null);
  const sheets = useRef([]);
  const state = useRef({ active, turn, zoom });
  state.current = { active, turn, zoom };
  const closeZoom = React.useCallback(() => setZoom(null), []);

  useEffect(() => {
    if (page === active || turn) return;
    setTurn({ from: active, to: page, direction: page > active ? 'forward' : 'backward' });
  }, [page, active, turn]);
  useEffect(() => {
    if (!turn) return;
    const timer = window.setTimeout(() => { setActive(turn.to); setTurn(null); sheets.current[turn.to]?.focus({ preventScroll: true }); }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : 700);
    return () => window.clearTimeout(timer);
  }, [turn]);
  useEffect(() => {
    root.current.querySelector('button').focus();
    const gesture = createWheelGesture();
    let touch = null;
    const go = direction => {
      const { active, turn, zoom } = state.current;
      if (turn || zoom || active + direction < 0 || active + direction >= count) return;
      setProjectHash(active + direction, projectId);
    };
    const controls = target => target.closest('button:not(.project-image), a, input, select, textarea, .project-zoom');
    const wheel = event => {
      if (state.current.zoom || controls(event.target) || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const sheet = sheets.current[state.current.active];
      if (!sheet.contains(event.target)) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? sheet.clientHeight : 1);
      const boundary = atBoundary(sheet, Math.sign(delta));
      if (boundary || state.current.turn) event.preventDefault();
      const direction = gesture.input(delta, performance.now(), boundary, !!state.current.turn);
      if (direction) go(direction);
    };
    const key = event => {
      if (state.current.zoom || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'Tab') {
        const items = [...root.current.querySelectorAll('button:not(:disabled),[tabindex="0"]')].filter(item => !item.closest('[inert]'));
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1)?.focus(); }
        else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0]?.focus(); }
        return;
      }
      if (controls(event.target) || event.repeat) return;
      const direction = ['ArrowDown', 'PageDown'].includes(event.key) ? 1 : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      if (state.current.turn) return;
      const sheet = sheets.current[state.current.active];
      if (atBoundary(sheet, direction)) go(direction);
      else sheet.scrollBy({ top: direction * sheet.clientHeight * .8 });
    };
    const start = event => {
      if (state.current.zoom || state.current.turn || controls(event.target) || event.touches.length !== 1) { touch = null; return; }
      const sheet = sheets.current[state.current.active];
      if (!sheet.contains(event.target)) return;
      touch = { x: event.touches[0].clientX, y: event.touches[0].clientY, top: atBoundary(sheet, -1), bottom: atBoundary(sheet, 1) };
    };
    const end = event => {
      if (!touch) return;
      const dx = event.changedTouches[0].clientX - touch.x, dy = event.changedTouches[0].clientY - touch.y;
      if (Math.abs(dy) > 65 && Math.abs(dy) > Math.abs(dx) * 1.3 && (dy < 0 ? touch.bottom : touch.top)) go(dy < 0 ? 1 : -1);
      touch = null;
    };
    const node = root.current;
    const cancel = () => { touch = null; };
    node.addEventListener('wheel', wheel, { passive: false });
    node.addEventListener('keydown', key);
    node.addEventListener('touchstart', start, { passive: true });
    node.addEventListener('touchend', end, { passive: true });
    node.addEventListener('touchcancel', cancel);
    return () => { node.removeEventListener('wheel', wheel); node.removeEventListener('keydown', key); node.removeEventListener('touchstart', start); node.removeEventListener('touchend', end); node.removeEventListener('touchcancel', cancel); };
  }, []);

  return <div ref={root} className="gojo-project" role="dialog" aria-modal="true" aria-labelledby="project-title">
    <div className="project-header" inert={!!zoom}><button className="text-link" onClick={onBack} aria-label="Back to Works">←</button><div><p className="eyebrow">Selected project</p><h1 id="project-title">{project.title}</h1></div><div className="project-navigation" aria-label="Showcase pages"><button disabled={!!turn || active === 0} onClick={() => setProjectHash(active - 1, projectId)} aria-label="Previous showcase page">←</button><span aria-live="polite">{(turn?.to ?? active) + 1} / {count}</span><button disabled={!!turn || active === count - 1} onClick={() => setProjectHash(active + 1, projectId)} aria-label="Next showcase page">→</button></div></div>
    <div className={`project-stage art-book ${turn ? `turn-${turn.direction}` : ''}`} inert={!!zoom}>
      {groups.map((group, index) => {
        const selected = active === index && !turn;
        const visible = selected || turn && (turn.from === index || turn.to === index);
        return <div key={index} ref={node => { sheets.current[index] = node; }} className={`project-sheet ${turn ? turn.from === index ? 'page-out' : turn.to === index ? 'page-in' : '' : ''}`} style={{ display: visible ? undefined : 'none' }} inert={!selected} aria-hidden={!selected} tabIndex={0} role="region" aria-label={`${project.title} showcase page ${index + 1} of ${count}`} data-showcase={index + 1}>
          <div className={`project-images group-${index + 1} layout-${project.layouts[index]}`}>{group.map((file, item) => <button key={file} className="project-image" onClick={event => { event.currentTarget.focus({ preventScroll: true }); setZoom({ src: `/assets/${projectId}/${file}`, alt: descriptions[index][item] }); }} aria-label={`Inspect ${descriptions[index][item]}`}><img src={`/assets/${projectId}/${file}`} alt={descriptions[index][item]} /></button>)}</div>
        </div>;
      })}
    </div>
    {zoom && <ImageZoom image={zoom} onClose={closeZoom} />}
  </div>;
}
