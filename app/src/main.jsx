import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const profiles = [
  {
    id: 'nova-cruel',
    name: 'NOVA CRUEL',
    role: 'Live Electronic Act',
    city: 'Berlin',
    country: 'Germany',
    genres: ['Industrial Techno', 'Live AV', 'Warehouse'],
    fee: '€1.8k–3k',
    availability: 'Jun–Aug',
    travel: 'EU + UK',
    score: 94,
    bio: 'Industrial techno duo built for warehouses, late festival slots and high-pressure club rooms.',
    tech: 'Stereo DI, riser preferred, 30 min changeover, optional projector feed.',
    media: 'Live set, press shots, stage plot, short trailer',
    response: 'Usually replies within 48h',
    status: 'Featured demo profile'
  },
  {
    id: 'rain-static',
    name: 'THE RAIN STATIC',
    role: 'Post-punk Band',
    city: 'London',
    country: 'United Kingdom',
    genres: ['Post-Punk', 'Noise Rock', 'Alternative'],
    fee: '£900–1.5k',
    availability: 'Fri/Sat',
    travel: 'UK + EU',
    score: 87,
    bio: 'Sharp London band with strong local draw, fast changeovers and underground venue fit.',
    tech: 'Vocal mic, 2 guitar amps, bass DI, 4-piece drum kit, 25 min changeover.',
    media: 'EPK PDF, live video, private audio links, photos',
    response: 'Open to support slots and headline rooms',
    status: 'London pipeline'
  },
  {
    id: 'mirai-unit',
    name: 'MIRAI UNIT',
    role: 'AV Performer',
    city: 'Tokyo',
    country: 'Japan',
    genres: ['Live Electronic', 'Experimental', 'Visuals'],
    fee: '¥280k–480k',
    availability: 'Jul–Oct',
    travel: 'Asia + EU',
    score: 89,
    bio: 'High-detail live electronic and AV performance for theatres, clubs and media festivals.',
    tech: 'Stereo DI, HDMI/SDI video feed, dark room preferred, 45 min setup.',
    media: 'AV reel, technical pack, stills, festival references',
    response: 'Best for arts, media and hybrid performance contexts',
    status: 'International showcase'
  },
  {
    id: 'lua-fogo',
    name: 'LUA FOGO',
    role: 'DJ',
    city: 'São Paulo',
    country: 'Brazil',
    genres: ['Baile Funk', 'Club', 'Percussive'],
    fee: 'R$3.5k–8k',
    availability: 'Aug–Dec',
    travel: 'Americas + EU',
    score: 84,
    bio: 'Percussive global club DJ with high-energy sets and festival-ready edits.',
    tech: '2x CDJ-3000, DJM-900NXS2, booth monitor, 15 min changeover.',
    media: 'Mix links, radio clips, press shots, event footage',
    response: 'Good fit for festival tents and club series',
    status: 'Festival-ready'
  }
];

const requests = [
  { id: 1, artist: 'NOVA CRUEL', buyer: 'The Cause London', date: '28 Jun 2026', fee: '£2,200', status: 'Negotiating' },
  { id: 2, artist: 'THE RAIN STATIC', buyer: 'Village Underground', date: '12 Jul 2026', fee: '£1,100', status: 'New' },
  { id: 3, artist: 'MIRAI UNIT', buyer: 'Media Arts Festival', date: '04 Sep 2026', fee: '€3,800', status: 'Reviewing' },
  { id: 4, artist: 'LUA FOGO', buyer: 'Warehouse Club Series', date: '19 Sep 2026', fee: '£1,600', status: 'Confirmed' }
];

const buyerUseCases = [
  {
    title: 'Music schools',
    problem: 'Student and alumni profiles are scattered across links, socials and PDFs.',
    workflow: 'Create booking-ready EPK profiles and route external opportunities into one review dashboard.',
    pilot: 'Best first pilot: 20 student or alumni profiles + opportunity request form + staff dashboard.'
  },
  {
    title: 'Venues',
    problem: 'Programming teams receive incomplete artist information through DMs and email threads.',
    workflow: 'Collect EPKs, shortlist artists and review inbound booking requests with consistent data.',
    pilot: 'Best first pilot: local talent pipeline for one venue or venue group.'
  },
  {
    title: 'Festivals',
    problem: 'Artist submissions and booking options become hard to compare at scale.',
    workflow: 'Standardise artist profiles, submission data, shortlist status and booking follow-up.',
    pilot: 'Best first pilot: limited submission pool for one stage, showcase or emerging-artist programme.'
  },
  {
    title: 'Industry organisations',
    problem: 'Artist and venue support projects need practical infrastructure, not another static directory.',
    workflow: 'Pilot structured EPK and booking workflows with selected artists, venues or education partners.',
    pilot: 'Best first pilot: ecosystem test with a small cohort and measurable workflow feedback.'
  }
];

const packages = [
  { title: 'Paid pilot', price: '£1.5k–£10k', body: 'A focused 30–90 day test for a school, venue, festival or industry partner.' },
  { title: 'White-label licence', price: '£5k–£25k setup', body: 'A branded EPK and booking workflow adapted to an organisation’s own network.' },
  { title: 'Platform partnership', price: 'Scope-based', body: 'Integrate SoundMatch Live as a product layer for an existing music platform.' },
  { title: 'Asset sale', price: 'Post-validation', body: 'Discuss codebase, concept, roadmap and early validation after pilot interest.' }
];

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function Shell({ view, setView, children }) {
  const nav = ['Landing', 'Use Cases', 'Discover', 'EPK', 'Request', 'Dashboard', 'Commercial'];
  return (
    <div className="app">
      <aside>
        <p className="eyebrow">Pilot-ready demo</p>
        <h1>SoundMatch<br />Live</h1>
        <p>Booking and EPK workflow platform for music institutions, venues, festivals, promoters and artist networks.</p>
        <div className="sideStat"><b>Built by</b><span>Innovate Solutions Now</span></div>
        <div className="sideStat"><b>Goal</b><span>Paid pilot / white-label / licence</span></div>
        {nav.map((item) => <button key={item} className={view === item ? 'on' : ''} onClick={() => setView(item)}>{item}</button>)}
      </aside>
      <main>
        <div className="phone">
          <header>
            <div>
              <p className="micro">Innovate Solutions Now</p>
              <h2>{view}</h2>
            </div>
            <button onClick={() => setView('Commercial')}>£</button>
          </header>
          <section className="screen">{children}</section>
        </div>
      </main>
    </div>
  );
}

function Landing({ setView }) {
  return (
    <div className="stack landing">
      <section className="hero panel">
        <Badge>Booking + EPK workflow</Badge>
        <h3>Turn artist discovery into a structured booking pipeline.</h3>
        <p>SoundMatch Live gives artists booking-ready EPK profiles and gives organisations a clearer way to review opportunities, requests and shortlists.</p>
        <div className="ctaRow">
          <button className="primary" onClick={() => setView('Use Cases')}>View use cases</button>
          <button onClick={() => setView('Commercial')}>Pilot</button>
        </div>
      </section>
      <section className="grid2">
        {buyerUseCases.map((item) => <div className="panel" key={item.title}><b>{item.title}</b><p>{item.workflow}</p></div>)}
      </section>
      <section className="panel trust"><b>Pilot-ready, not inflated.</b><p>This demo shows the workflow layer: profiles, discovery, requests, dashboard and commercial pilot options.</p></section>
    </div>
  );
}

function UseCases({ setView }) {
  return (
    <div className="stack">
      <section className="panel hero">
        <Badge>Buyer-specific workflows</Badge>
        <h3>One platform, four pilot routes.</h3>
        <p>Each buyer type gets a clear operational use case, not a generic marketplace pitch.</p>
      </section>
      {buyerUseCases.map((item) => <section className="panel useCase" key={item.title}><h3>{item.title}</h3><p><b>Problem:</b> {item.problem}</p><p><b>Workflow:</b> {item.workflow}</p><p><b>Pilot:</b> {item.pilot}</p></section>)}
      <button className="primary" onClick={() => setView('Discover')}>Open discovery demo</button>
    </div>
  );
}

function Discover({ setSelected, setView }) {
  const [index, setIndex] = useState(0);
  const artist = profiles[index % profiles.length];
  function next() { setIndex((value) => value + 1); }
  function open() { setSelected(artist); setView('EPK'); }
  return (
    <div className="stack">
      <div className="filters"><Badge>Review mode</Badge><Badge>{artist.score}% fit</Badge></div>
      <article className="card">
        <div className="cardtop"><b>MATCH {artist.score}%</b><span>{artist.status}</span></div>
        <div className="poster"><div className="bars">{Array.from({ length: 30 }).map((_, i) => <i key={i} style={{ height: 12 + ((i * 17) % 64) }} />)}</div></div>
        <p className="role">{artist.role}</p>
        <h3>{artist.name}</h3>
        <p className="loc">{artist.city}, {artist.country}</p>
        <div className="chips">{artist.genres.map((genre) => <span key={genre}>{genre}</span>)}</div>
        <div className="metrics"><div><small>Fee</small><b>{artist.fee}</b></div><div><small>Avail.</small><b>{artist.availability}</b></div><div><small>Travel</small><b>{artist.travel}</b></div></div>
      </article>
      <div className="actions"><button onClick={next}>Pass</button><button onClick={next}>Save</button><button className="interest" onClick={open}>Open EPK</button></div>
    </div>
  );
}

function EPK({ selected, setView }) {
  return (
    <div className="stack">
      <section className="epk panel">
        <div className="poster small"><div className="bars">{Array.from({ length: 24 }).map((_, i) => <i key={i} style={{ height: 10 + ((i * 11) % 50) }} />)}</div></div>
        <Badge>Public booking profile</Badge>
        <h3>{selected.name}</h3>
        <p className="subline">{selected.role} · {selected.city}, {selected.country}</p>
        <p>{selected.bio}</p>
        <div className="chips">{selected.genres.map((genre) => <span key={genre}>{genre}</span>)}</div>
        <div className="stats"><div><b>{selected.fee}</b><small>Fee range</small></div><div><b>{selected.availability}</b><small>Available</small></div><div><b>{selected.travel}</b><small>Travel</small></div></div>
      </section>
      <section className="panel"><h3>Technical rider</h3><p>{selected.tech}</p></section>
      <section className="panel"><h3>Media pack</h3><p>{selected.media}</p><p>{selected.response}</p><button className="primary" onClick={() => setView('Request')}>Send booking request</button></section>
    </div>
  );
}

function Request({ selected, setView }) {
  const [sent, setSent] = useState(false);
  const fields = ['Event name', 'Buyer / organisation', 'Contact email', 'Event date', 'City / venue', 'Fee offer', 'Set length', 'Technical notes'];
  return (
    <div className="stack">
      <section className="panel">
        <Badge>Structured request</Badge>
        <h3>Request {selected.name}</h3>
        <p>Standardised booking data replaces loose DMs and incomplete enquiries.</p>
      </section>
      <section className="formPanel">
        {fields.map((field) => <label key={field}>{field}<input placeholder={field === 'Fee offer' ? '£2,200' : field} /></label>)}
        <label>Message<textarea placeholder="Tell the artist what you are booking, where, when and why it fits." /></label>
        <button className="primary" onClick={() => setSent(true)}>Submit request</button>
      </section>
      {sent && <section className="panel success"><b>Request added to review dashboard.</b><p>In a pilot this becomes a saved request, notification and status-tracked workflow item.</p><button onClick={() => setView('Dashboard')}>Open dashboard</button></section>}
    </div>
  );
}

function Dashboard() {
  const totals = useMemo(() => ({ profiles: 42, requests: requests.length, pilot: '30–90d' }), []);
  return (
    <div className="stack">
      <section className="panel">
        <Badge>Organisation dashboard</Badge>
        <h3>Pilot control room</h3>
        <p>Mock dashboard for a school, venue, festival or industry organisation reviewing profiles and requests.</p>
        <div className="stats"><div><b>{totals.profiles}</b><small>Profiles</small></div><div><b>{totals.requests}</b><small>Requests</small></div><div><b>{totals.pilot}</b><small>Pilot</small></div></div>
      </section>
      <section className="grid2">
        <div className="panel"><b>New</b><p>2 requests awaiting review</p></div>
        <div className="panel"><b>Shortlisted</b><p>9 artists saved by team</p></div>
        <div className="panel"><b>Confirmed</b><p>1 opportunity converted</p></div>
        <div className="panel"><b>Feedback</b><p>Workflow report at pilot end</p></div>
      </section>
      <section className="panel"><h3>Booking pipeline</h3>{requests.map((request) => <div className="item" key={request.id}><div><b>{request.artist}</b><small>{request.buyer} · {request.date}</small></div><strong>{request.status}</strong></div>)}</section>
    </div>
  );
}

function Commercial() {
  return (
    <div className="stack">
      <section className="panel hero">
        <Badge>Commercial route</Badge>
        <h3>Start with a paid pilot.</h3>
        <p>The fastest revenue path is a focused pilot for one organisation, then white-label licensing or partnership if the workflow proves useful.</p>
      </section>
      {packages.map((pack) => <section className="package panel" key={pack.title}><div><h3>{pack.title}</h3><p>{pack.body}</p></div><strong>{pack.price}</strong></section>)}
      <section className="panel trust"><b>Clear next step</b><p>Request a short demo or scope a small pilot with Innovate Solutions Now.</p></section>
    </div>
  );
}

function App() {
  const [view, setView] = useState('Landing');
  const [selected, setSelected] = useState(profiles[0]);
  let screen = <Landing setView={setView} />;
  if (view === 'Use Cases') screen = <UseCases setView={setView} />;
  if (view === 'Discover') screen = <Discover setSelected={setSelected} setView={setView} />;
  if (view === 'EPK') screen = <EPK selected={selected} setView={setView} />;
  if (view === 'Request') screen = <Request selected={selected} setView={setView} />;
  if (view === 'Dashboard') screen = <Dashboard />;
  if (view === 'Commercial') screen = <Commercial />;
  return <Shell view={view} setView={setView}>{screen}</Shell>;
}

createRoot(document.getElementById('root')).render(<App />);
