import React, { useState } from 'react';
import './works-gallery.css';
import IgrisPreview from './IgrisPreview.jsx';

// Edit each work's category to 'personal' or 'professional' in main.jsx later.
const filters = [['personal', 'Personal'], ['professional', 'Professional'], ['all', 'All'], ['3d', '3D Art'], ['2d', '2D Art']];
export default function WorksGallery({ works, onOpen }) {
  const [filter, setFilter] = useState('all');
  const visible = works.filter(work => filter === 'all' || work.category === filter || (filter === '3d' && work.type === '3D Sculpt') || (filter === '2d' && work.medium === '2d'));
  return <div className="works-overview">
    <div className="overview-filters" role="group" aria-label="Filter projects">{filters.map(([value, label]) => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
    <div className="overview-grid" aria-label="All artwork projects">{visible.map(work => <button key={work.id} className="overview-tile" data-work-id={work.id} onClick={() => onOpen(work)} aria-label={`Open ${work.title}${work.category === 'personal' ? ', Personal project' : ''}`}>
      <>{work.id === 'igris' ? <IgrisPreview work={work} /> : <img src={work.image} alt={work.alt} loading="lazy" />}</>
      <span className="overview-caption" aria-hidden="true"><strong>{work.title}</strong>{work.category && <span>{work.category === 'personal' ? 'Personal' : 'Professional'}</span>}</span>
    </button>)}</div>
    {!visible.length && <p className="overview-empty" role="status">No projects in this category yet.</p>}
  </div>;
}
