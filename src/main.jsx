import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './book.css';
import HeroMedia from './HeroMedia.jsx';
import HeroBackdrop from './HeroBackdrop.jsx';
import ArtBook from './ArtBook.jsx';
import HeroButton from './HeroButton.jsx';
import './contact.css';
import WorksGallery from './WorksGallery.jsx';
import ProjectDetail, { projectPageFromHash, projectIdFromHash, setProjectHash } from './GojoProject.jsx';

const logo = '/assets/jas3dit-logo.jpg';
const gojo = { id: 'gojo', category: 'personal', title: 'Gojo Satoru’s Last Stand: Nuke Hollow Purple', caption: 'Gojo Satoru / Nuke Hollow Purple', image: '/assets/gojo-nuke-hollow-purple.jpg', alt: 'Gojo Satoru standing on a sculpted rubble base beneath a luminous purple energy sphere, surrounded by blue and purple effects.', type: '3D Sculpt', date: null };
// Add official local images and verified ISO publication dates here when supplied.
const featured = [
  { id: 'gojo-void', category: 'personal', title: "Gojo Satoru's Domain Expansion: Unlimited Void", image: '/assets/gojo-void/gojo-void-1.webp', alt: 'Gojo Satoru Unlimited Void sculpture, preserving its complete composition and original branding.', type: '3D Sculpt', date: null },
  { id: 'estes', category: 'professional', title: 'Mobile Legends: Estes Holy Priest', image: '/assets/estes/jas-artworks-estes-1.webp', alt: 'Estes Holy Priest sculpture from Mobile Legends, complete artwork with original branding.', type: '3D Sculpt', date: null },
  { id: 'goku', category: 'personal', title: 'Goku Super Saiyan 4', image: '/assets/goku/jas-artworks-1-goku-4.jpg', alt: 'Goku Super Saiyan 4 sculpture, complete artwork with original branding.', type: '3D Sculpt', date: null },
  { id: 'giyu', category: 'personal', title: 'Giyu Tomioka 10th Form: Seseiruten', image: '/assets/giyu/jas-artworks-giyu-1.webp', alt: 'Giyu Tomioka sculpture surrounded by a blue water dragon, splashing water, and a sculpted rubble base.', tone: 'blue', type: '3D Sculpt', date: null },
  { id: 'igris', category: 'professional', title: 'Dark Knight Igris', image: '/assets/igris/jas-a-sculpt-igris-1.webp', alt: 'Dark Knight Igris sculpture with a red plume, glowing blue armor, sword, and a rubble base.', tone: 'purple', type: '3D Sculpt', date: null },
  { id: 'kaiju', category: 'personal', title: 'Kaiju No. 8', image: '/assets/kaiju/jas-a-sculpt-kafka-1.webp', alt: 'Kafka Hibino and Kaiju No. 8 sculpture surrounded by teal energy and rubble, with the original branding and base.', tone: 'teal', type: '3D Sculpt', date: null },
  { id: 'yuta', category: 'professional', title: "Yuta Okkotsu's Pure & Mutual Love", image: '/assets/yuta/jas-artworks-yuta-1.webp', alt: 'Yuta Okkotsu sculpture with Rika, purple effects, swords, and a sculpted base.', type: '3D Sculpt', date: null },
  { id: 'kaito', category: 'personal', title: 'Phantom Thief, Moonlight Magician: Kaitou Kid', image: '/assets/kaito/jas-artworks-kaito-1.webp', alt: 'Kaitou Kid sculpture in a white suit, surrounded by a moon, doves, playing cards, and a clockwork base.', type: '3D Sculpt', date: null },
];
// Artist-supplied chronology, newest first. No publication dates are invented.
const newestFirstOrder = ['goku', 'yuta', 'kaito', 'gojo-void', 'giyu', 'estes', 'gojo', 'kaiju', 'igris'];
const kaitoIllustration = { id: 'kaito-2d', category: 'personal', medium: '2d', type: '2D Art', title: 'Kaitou Kid — 2D Illustration', image: '/assets/kaito/jas-artworks-kaito-9.webp', alt: 'Kaitou Kid illustration with doves, playing cards, gemstones, and a clockwork base.' };
const allWorks = [...[gojo, ...featured].sort((a, b) => newestFirstOrder.indexOf(a.id) - newestFirstOrder.indexOf(b.id)), kaitoIllustration];
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
function Hero({ onOpen, onProjectOpen, videoRef, active }) {
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
    <HeroMedia artwork={gojo} onOpen={onOpen} onProjectOpen={onProjectOpen} videoRef={videoRef} active={active} onCopyPlayback={setTrailerCopy} />
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
function FeaturedWorks({ onOpen }) {
  return <section className="works container section" id="works" aria-labelledby="works-heading">
    <div className="section-top"><div><Eyebrow>The collection</Eyebrow><h2 id="works-heading">Portfolio</h2></div>
    </div>
    <WorksGallery works={allWorks} onOpen={onOpen} />
  </section>;
}
const services = [ ['3D Printing', 'FDM & Resin'], ['3D Modeling', 'Anime, Trophies & CAD'], ['3D Scanning', 'On-site & home service'], ['Figure Painting', ''], ['Resin Figure Repaint & Repair', ''], ['Bodykits Fabrication', ''] ];
function Services() {
  return <section className="services container section" id="services" aria-labelledby="services-heading"><div className="services-intro"><Eyebrow>Our services</Eyebrow><h2 id="services-heading">From sculpt<br />to finish.</h2><div className="short-line" /><p>Bring your ideas to life with professional 3D services, from concept to final piece.</p></div>
    <ol className="service-list">{services.map(([title, subtitle], index) => <li key={title}><span className="service-number">0{index + 1}</span><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div></li>)}</ol>
  </section>;
}
function About() {
  const [expanded, setExpanded] = useState(true);
  return <section className="about section" id="about" aria-labelledby="about-heading"><div className="container about-inner"><div><Eyebrow>The artist</Eyebrow><h2 id="about-heading">Meet Jas.</h2><p className="established-label">Established 2020</p><p>3D artist & concept artist based in Silang, Cavite.</p><button className="text-link" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="artist-bio">{expanded ? 'Close artist bio' : 'About the artist'} <span aria-hidden="true">{expanded ? '−' : '→'}</span></button>
      <div id="artist-bio" hidden={!expanded} className="bio"><p>Founded in 2020, Jas 3D It brings ideas to life through custom 3D modeling, digital sculpting, and 3D scanning.</p><p>The studio’s services span printing, figure painting, repaint and repair, and bodykits fabrication, taking projects from concept to final piece.</p><p>Explore the portfolio on <a href={socials[2][1]} target="_blank" rel="noreferrer">ArtStation</a>, or get in touch to discuss your idea.</p></div>
    </div><div className="about-logo"><img src="/assets/bio-pic-jas.jpg" alt="Jas, the artist behind Jas 3D It" loading="lazy" /></div></div></section>;
}
function Contact() {
  const prepareEmail = event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name')).trim();
    const email = String(data.get('email')).trim();
    const message = String(data.get('message')).trim();
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:jas3dit@gmail.com?subject=${encodeURIComponent(`Project enquiry — ${name}`)}&body=${encodeURIComponent(body)}`;
  };
  return <section className="contact contact-direct container section" id="contact" aria-labelledby="contact-heading">
    <div className="contact-heading-row"><Eyebrow>Let’s create something</Eyebrow><h2 id="contact-heading">Contact</h2></div>
    <div className="contact-columns">
      <div className="contact-information"><h3>For projects, collaborations, or just to say hi.</h3>
        <a className="contact-email-link" href="mailto:jas3dit@gmail.com">jas3dit@gmail.com</a>
        <dl className="contact-channels"><div><dt>Phone</dt><dd><a href="tel:+639611755954">+63 961 175 5954</a></dd></div><div><dt>Location</dt><dd>Silang, Cavite, Philippines</dd></div></dl>
        <div className="contact-profiles"><p>Follow the work</p><div className="socials">{socials.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name}<Arrow /></a>)}</div></div>
      </div>
      <form className="contact-form" onSubmit={prepareEmail}>
        <label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={120} />
        <label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} />
        <label htmlFor="contact-message">Message</label><textarea id="contact-message" name="message" rows={5} required maxLength={4000} aria-describedby="contact-message-hint" />
        <p id="contact-message-hint" className="contact-form-hint">Tell Jas about your idea, preferred size, and timeline.</p>
        <div className="contact-submit"><button type="submit" className="button secondary">Open email draft <span aria-hidden="true">→</span></button><p>Opens your email app with this message filled in.</p></div>
      </form>
    </div>
    <p className="copyright">© {new Date().getFullYear()} Jas 3D It</p>
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
    if (newestFirstOrder.includes(work.id)) { setOverlay(null); setProjectHash(0, work.id); }
    else setOverlay(work);
  };
  const backToWorks = () => {
    window.history.pushState(null, '', '#works');
    window.dispatchEvent(new Event('hashchange'));
  };
  return <div className={`site-shell digital-book ${homeActive ? 'home-active' : 'home-inactive'}`}><HeroBackdrop masterRef={heroVideoRef} active={homeActive && projectPage === null} /><a className="skip-link" href="#main" inert={projectPage !== null}>Skip to content</a><div className="project-underlay" inert={projectPage !== null} aria-hidden={projectPage !== null}><ArtBook blocked={!!overlay || projectPage !== null} onActivePage={index => setHomeActive(index === 0)} header={active => <Header active={active} />} pages={[
    active => <Hero onOpen={setOverlay} onProjectOpen={openWork} videoRef={heroVideoRef} active={active} />,
    () => <FeaturedWorks onOpen={openWork} />,
    () => <Services />,
    () => <About />,
    () => <Contact />,
  ]} /></div>
    {projectPage !== null && <ProjectDetail key={projectId} projectId={projectId} page={projectPage} onBack={backToWorks} />}
    {overlay && <Overlay title={overlay === 'gallery' ? 'The collection' : overlay.title} onClose={close} className={overlay === 'gallery' ? 'gallery-dialog' : 'lightbox'}>{overlay === 'gallery' ? <WorksGallery works={allWorks} onOpen={openWork} /> : <>{overlay.fromGallery && <button className="text-link back-link" onClick={() => setOverlay('gallery')}>← Back to collection</button>}{overlay.image ? <img className="lightbox-image" src={overlay.image} alt={overlay.alt} /> : <><Placeholder work={overlay} /><p className="dialog-intro">This is a temporary placeholder. The official {overlay.title} image has not been supplied and could not be retrieved from ArtStation.</p><a className="text-link" href={socials[2][1]} target="_blank" rel="noreferrer">Visit the artist’s portfolio ↗</a></>}</>}</Overlay>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);
