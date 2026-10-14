import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './book.css';
import HeroMedia from './HeroMedia.jsx';
import HeroBackdrop from './HeroBackdrop.jsx';
import ArtBook from './ArtBook.jsx';
import HeroButton from './HeroButton.jsx';
import ProjectDetail, { projectPageFromHash, projectIdFromHash, setProjectHash } from './GojoProject.jsx';

const logo = '/assets/jas3dit-logo.jpg';
const gojo = { id: 'gojo', title: 'Gojo Satoru’s Last Stand: Nuke Hollow Purple', caption: 'Gojo Satoru / Nuke Hollow Purple', image: '/assets/gojo-nuke-hollow-purple.jpg', alt: 'Gojo Satoru standing on a sculpted rubble base beneath a luminous purple energy sphere, surrounded by blue and purple effects.', type: '3D Sculpt', date: null };
// Add official local images and verified ISO publication dates here when supplied.
const featured = [
  { id: 'giyu', title: 'Giyu Tomioka 10th Form: Seseiruten', image: '/assets/giyu/jas-artworks-giyu-1.webp', alt: 'Giyu Tomioka sculpture surrounded by a blue water dragon, splashing water, and a sculpted rubble base.', tone: 'blue', type: '3D Sculpt', date: null },
  { id: 'igris', title: 'Dark Knight Igris', image: '/assets/igris/jas-a-sculpt-igris-1.webp', alt: 'Dark Knight Igris sculpture with a red plume, glowing blue armor, sword, and a rubble base.', tone: 'purple', type: '3D Sculpt', date: null },
  { id: 'kaiju', title: 'Kaiju No. 8', image: null, tone: 'teal', type: '3D Sculpt', date: null },
];
const allWorks = [gojo, ...featured];
const socials = [ ['Facebook', 'https://www.facebook.com/jas3ditcustomstudios/'], ['Instagram', 'https://www.instagram.com/jas3dit/'], ['ArtStation', 'https://www.artstation.com/jasasculpt'] ];
function Arrow({ circle = false }) { return <span className={circle ? 'arrow circle' : 'arrow'} aria-hidden="true">↗</span>; }
function ButtonLink({ href, children, secondary = false, ...props }) { return <a className={`button ${secondary ? 'secondary' : ''}`} href={href} {...props}>{children}<span aria-hidden="true">→</span></a>; }
function Eyebrow({ children }) { return <p className="eyebrow">{children}</p>; }

function Header({ active }) {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const nav = useRef(null);
  useEffect(() => {
    const handleKey = (event) => {
      if (!open) return;
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const links = [...nav.current.querySelectorAll('a')];
        const first = toggle.current, last = links.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const handleResize = () => { if (window.innerWidth > 760) setOpen(false); };
    document.addEventListener('keydown', handleKey);
    window.addEventListener('resize', handleResize);
    return () => { document.removeEventListener('keydown', handleKey); window.removeEventListener('resize', handleResize); };
  }, [open]);
  return <header className="header"><div className="container header-inner">
    <a className="brand" href="#home" aria-label="Jas 3D It home" onClick={() => setOpen(false)}><img src={logo} alt="Jas 3D It official logo" /><span>JAS 3D IT</span></a>
    <button ref={toggle} className={`menu-toggle ${open ? 'is-open' : ''}`} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}><span /><span /></button>
    <nav ref={nav} id="main-nav" className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
      {['Works', 'Services', 'About', 'Contact'].map(label => <a key={label} href={`#${label.toLowerCase()}`} aria-current={active === label ? 'page' : undefined} onClick={() => { setOpen(false); toggle.current?.focus(); }}>{label}</a>)}
      
    </nav>
  </div></header>;
}
function Hero({ onOpen, videoRef, active }) {
  const [trailerCopy, setTrailerCopy] = useState(false);
  return <section className="hero container" id="home" aria-label="Home — Gojo Satoru artwork and trailer">
    <div className="hero-copy"><Eyebrow>Jas 3D It <span>Sculpture & fabrication</span></Eyebrow>
      <div className="hero-copy-stack">
        <div className={`copy-layer ${!trailerCopy ? 'copy-active' : ''}`} aria-hidden={trailerCopy}>
          <h1><span className="silver-text">Beyond the screen.<br />Into your collection.</span></h1>
          <div className="short-line" />
          <p className="hero-description">Custom 3D sculptures, prints, and fabrication by Jas.</p>
        </div>
        <div className={`copy-layer ${trailerCopy ? 'copy-active' : ''}`} aria-hidden={!trailerCopy}>
          <h1><span className="hollow-purple-text">Hollow Purple.</span><br /><span className="silver-text">Brought to life.</span></h1>
          <div className="short-line" />
          <p className="hero-description">Gojo Satoru’s Last Stand — a closer look at the sculpt, expressions, and details.</p>
        </div>
      </div>
      <div className="actions"><HeroButton href="#works" theme="purple">Explore the work</HeroButton><HeroButton href="#contact" theme="detective">Let’s create</HeroButton></div>
    </div>
    <HeroMedia artwork={gojo} onOpen={onOpen} videoRef={videoRef} active={active} onCopyPlayback={setTrailerCopy} />
  </section>;
}
function Placeholder({ work }) {
  return <div className={`placeholder ${work.tone || 'purple'}`} role="img" aria-label={`${work.title}: temporary placeholder, official artwork not supplied`}>
    <span className="placeholder-index" aria-hidden="true">{work.id === 'giyu' ? '01' : work.id === 'igris' ? '02' : '03'}</span>
    <div className="placeholder-label"><span className="placeholder-mark" aria-hidden="true">◇</span><strong>Artwork coming soon</strong><span>Temporary placeholder</span><small>Official image not supplied</small></div>
  </div>;
}
function WorkCard({ work, onOpen }) {
  return <button className="art-panel work-card" data-work-id={work.id} onClick={() => onOpen(work)} aria-label={`View ${work.title}${!work.image ? ' — artwork placeholder' : ''}`}>
    {work.image ? <div className="card-image"><img src={work.image} alt={work.alt} loading="lazy" /></div> : <Placeholder work={work} />}
    <div className="art-caption"><div><h3>{work.title}</h3><p>{work.type}</p></div><Arrow circle /></div>
  </button>;
}
function FeaturedWorks({ onOpen, onGallery }) {
  const [galleryPage, setGalleryPage] = useState(0);
  const sorted = [...allWorks].sort((a, b) => (b.date ? Date.parse(b.date) : 0) - (a.date ? Date.parse(a.date) : 0));
  const count = Math.ceil(sorted.length / 3);
  return <section className="works container section" id="works" aria-labelledby="works-heading">
    <div className="section-top"><div><Eyebrow>The collection</Eyebrow><h2 id="works-heading">Featured Works</h2></div>
      <div className="tabs" role="tablist" aria-label="Artwork sorting"><button role="tab" aria-selected="true" aria-controls="recent-works" id="recent-tab">Recent</button><button role="tab" aria-selected="false" aria-disabled="true" disabled title="Unavailable until actual view data is connected">Most Viewed <span className="unavailable">Unavailable</span></button></div>
      <button className="text-link" onClick={onGallery}>View all works <span aria-hidden="true">→</span></button>
    </div>
    <div id="recent-works" role="tabpanel" aria-labelledby="recent-tab" className="gallery-grid">{sorted.slice(galleryPage * 3, galleryPage * 3 + 3).map(work => <WorkCard key={work.id} work={work} onOpen={onOpen} />)}</div>
    <div className="gallery-pagination" aria-label="Artwork gallery pagination"><button disabled={galleryPage === 0} onClick={() => setGalleryPage(galleryPage - 1)}>← Previous works</button><span aria-live="polite">{galleryPage + 1} / {count}</span><button disabled={galleryPage === count - 1} onClick={() => setGalleryPage(galleryPage + 1)}>Next works →</button></div>
    <p className="asset-note">Kaiju No. 8 images pending. Publication dates are unverified; works are shown in the requested order.</p>
  </section>;
}
const services = [ ['3D Printing', 'FDM & Resin'], ['3D Modeling', 'Anime, Trophies & CAD'], ['3D Scanning', 'On-site & home service'], ['Figure Painting', ''], ['Resin Figure Repaint & Repair', ''], ['Bodykits Fabrication', ''] ];
function Services() {
  return <section className="services container section" id="services" aria-labelledby="services-heading"><div className="services-intro"><Eyebrow>Our services</Eyebrow><h2 id="services-heading">From sculpt<br />to finish.</h2><div className="short-line" /><p>Bring your ideas to life with professional 3D services,<br className="desktop-break" /> from concept to final piece.</p></div>
    <ol className="service-list">{services.map(([title, subtitle], index) => <li key={title}><span className="service-number">0{index + 1}</span><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div></li>)}</ol>
  </section>;
}
function About() {
  const [expanded, setExpanded] = useState(true);
  return <section className="about section" id="about" aria-labelledby="about-heading"><div className="container about-inner"><div><Eyebrow>The artist</Eyebrow><h2 id="about-heading">Meet Jas.</h2><p>3D artist & concept artist based in Silang, Cavite.</p><button className="text-link" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="artist-bio">{expanded ? 'Close artist bio' : 'About the artist'} <span aria-hidden="true">{expanded ? '−' : '→'}</span></button>
      <div id="artist-bio" hidden={!expanded} className="bio"><p>Jas creates custom 3D sculptures, prints, and fabrication through Jas 3D It. The studio’s services span modeling, printing, scanning, figure painting, repaint and repair, and bodykits fabrication.</p><p>Explore the portfolio on <a href={socials[2][1]} target="_blank" rel="noreferrer">ArtStation</a>, or get in touch to discuss your idea.</p></div>
    </div><div className="about-logo"><img src={logo} alt="Jas 3D It official logo, displayed in place of an artist portrait" loading="lazy" /></div></div></section>;
}
function Contact() {
  const [expanded, setExpanded] = useState(false);
  return <section className="contact container section" id="contact" aria-labelledby="contact-heading"><div className="contact-top"><h2 id="contact-heading">Your idea.<br />Our next creation.</h2><button className="button" aria-expanded={expanded} aria-controls="project-details" onClick={() => setExpanded(!expanded)}>Start a project <span aria-hidden="true">→</span></button><a className="email" href="mailto:jas3dit@gmail.com"><span aria-hidden="true">✉</span> jas3dit@gmail.com</a></div>
    <div id="project-details" hidden={!expanded} className="project-details"><Eyebrow>Let’s create something</Eyebrow><h3>Tell Jas about your project.</h3><p>Share your idea, reference images, preferred size, and timeline by email or phone.</p><ButtonLink href="mailto:jas3dit@gmail.com?subject=Project%20enquiry%20%E2%80%94%20Jas%203D%20It">Email your project</ButtonLink></div>
    <footer><div className="contact-details"><a href="tel:+639611755954">+63 961 175 5954</a><span>Silang, Cavite, Philippines</span></div><div className="socials">{socials.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name}<Arrow /></a>)}</div><p className="copyright">© {new Date().getFullYear()} Jas 3D It</p></footer>
  </section>;
}
function Overlay({ title, onClose, children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current.querySelector('button')?.focus();
    const handle = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key === 'Tab') {
        const items = [...ref.current.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]')];
        const first = items[0], last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', handle);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handle); previous?.focus(); };
  }, [onClose]);
  return <div className="overlay" onClick={event => { if (event.target === event.currentTarget) onClose(); }}><div ref={ref} className={`dialog ${className}`} role="dialog" aria-modal="true" aria-labelledby="dialog-heading"><div className="dialog-header"><h2 id="dialog-heading">{title}</h2><button className="close-button" onClick={onClose} aria-label="Close dialog">×</button></div>{children}</div></div>;
}
function App() {
  const heroVideoRef = useRef(null);
  const [projectPage, setProjectPage] = useState(projectPageFromHash);
  const [projectId, setProjectId] = useState(projectIdFromHash);
  const previousProject = useRef(projectId);
  const [homeActive, setHomeActive] = useState(() => !window.location.hash || window.location.hash === '#home');
  const [overlay, setOverlay] = useState(null);
  const close = React.useCallback(() => setOverlay(null), []);
  useEffect(() => {
    const route = () => { setProjectPage(projectPageFromHash()); setProjectId(projectIdFromHash()); };
    window.addEventListener('hashchange', route);
    window.addEventListener('popstate', route);
    return () => { window.removeEventListener('hashchange', route); window.removeEventListener('popstate', route); };
  }, []);
  useEffect(() => {
    let timer;
    const returningId = previousProject.current;
    if (returningId !== null && projectPage === null) {
      let attempts = 0;
      const restore = () => {
        const card = document.querySelector(`.works [data-work-id="${returningId}"]`);
        if (card && !card.closest('[inert]')) card.focus({ preventScroll: true });
        else if (++attempts < 20) timer = window.setTimeout(restore, 50);
      };
      timer = window.setTimeout(restore, 0);
    }
    previousProject.current = projectId;
    return () => window.clearTimeout(timer);
  }, [projectPage, projectId]);
  const openWork = work => {
    if (['gojo', 'giyu', 'igris'].includes(work.id)) { setOverlay(null); setProjectHash(0, work.id); }
    else setOverlay(work);
  };
  const backToWorks = () => {
    window.history.pushState(null, '', '#works');
    window.dispatchEvent(new Event('hashchange'));
  };
  return <div className={`site-shell digital-book ${homeActive ? 'home-active' : 'home-inactive'}`}><HeroBackdrop masterRef={heroVideoRef} active={homeActive && projectPage === null} /><a className="skip-link" href="#main" inert={projectPage !== null}>Skip to content</a><div className="project-underlay" inert={projectPage !== null} aria-hidden={projectPage !== null}><ArtBook blocked={!!overlay || projectPage !== null} onActivePage={index => setHomeActive(index === 0)} header={active => <Header active={active} />} pages={[
    active => <Hero onOpen={setOverlay} videoRef={heroVideoRef} active={active} />,
    () => <FeaturedWorks onOpen={openWork} onGallery={() => setOverlay('gallery')} />,
    () => <Services />,
    () => <About />,
    () => <Contact />,
  ]} /></div>
    {projectPage !== null && <ProjectDetail key={projectId} projectId={projectId} page={projectPage} onBack={backToWorks} />}
    {overlay && <Overlay title={overlay === 'gallery' ? 'The collection' : overlay.title} onClose={close} className={overlay === 'gallery' ? 'gallery-dialog' : 'lightbox'}>{overlay === 'gallery' ? <><p className="dialog-intro">All works available in this local collection. Visit <a href={socials[2][1]} target="_blank" rel="noreferrer">Jas’s ArtStation portfolio ↗</a> for the complete online portfolio.</p><div className="gallery-grid">{allWorks.map(work => <WorkCard key={work.id} work={work} onOpen={work => ['gojo', 'giyu', 'igris'].includes(work.id) ? openWork(work) : setOverlay({ ...work, fromGallery: true })} />)}</div></> : <>{overlay.fromGallery && <button className="text-link back-link" onClick={() => setOverlay('gallery')}>← Back to collection</button>}{overlay.image ? <img className="lightbox-image" src={overlay.image} alt={overlay.alt} /> : <><Placeholder work={overlay} /><p className="dialog-intro">This is a temporary placeholder. The official {overlay.title} image has not been supplied and could not be retrieved from ArtStation.</p><a className="text-link" href={socials[2][1]} target="_blank" rel="noreferrer">Visit the artist’s portfolio ↗</a></>}</>}</Overlay>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);
