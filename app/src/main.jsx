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
    status: 'Festival-ready'
  }
];

const requests = [
  { id: 1, artist: 'NOVA CRUEL', buyer: 'The Cause London', date: '28 Jun 2026', fee: '£2,200', status: 'Negotiating' },
  { id: 2, artist: 'THE RAIN STATIC', buyer: 'Village Underground', date: '12 Jul 2026', fee: '£1,100', status: 'New' },
  { id: 3, artist: 'MIRAI UNIT', buyer: 'Media Arts Festival', date: '04 Sep 2026', fee: '€3,800', status: 'Reviewing' },
  { id: 4, artist: 'LUA FOGO', buyer: 'Warehouse Club Series', date: '19 Sep 2026', fee: '£1,600', status: 'Confirmed' }
];

const packages = [
  { title: 'Paid pilot', price: '£1.5k–£10k', body: 'Small branded test for a school, venue, festival or promoter network.' },
  { title: 'White-label licence', price: '£5k–£25k setup', body: 'A branded booking and EPK system for an organisation with its own network.' },
  { title: 'Direct launch', price: '£9–£99/mo', body: 'Artist Pro, Promoter Pro, featured profiles and organisation dashboards.' },
  { title: 'Asset sale', price: 'Discuss', body: 'Sell codebase, brand, roadmap, demo assets and early validation.' }
];

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

function Shell({ view, setView, children }) {
  const nav = ['Landing', 'Discover', 'EPK', 'Request', 'Dashboard', 'Commercial'];
  return (
    <div className="app">
      <aside>
        <p className="eyebrow">Buyer-ready MVP</p>
        <h1>SoundMatch<br />Live</h1>
        <p>EPK, artist discovery and booking request platform for music schools, venues, promoters, festivals and artist networks.</p>
        <div className="sideStat"><b>Goal</b><span>Paid pilot / white-label / sale</span></div>
        {nav.map((item) => <button key={item} className={view === item ? 'on' : ''} onClick={() => setView(item)}>{item}</button>)}
      </aside>
      <main>
        <div className="phone">
          <header>
            <div>
              <p className="micro">SoundMatch Live</p>
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
        <Badge>Ready-to-adapt music booking system</Badge>
        <h3>Sell the pilot before building the empire.</h3>
        <p>SoundMatch Live packages artist EPKs, discovery and structured booking requests into a product that a school, venue, promoter, festival or artist network can understand immediately.</p>
        <div className="ctaRow">
          <button className="primary" onClick={() => setView('EPK')}>Show EPK</button>
          <button onClick={() => setView('Commercial')}>Pricing</button>
        </div>
      </section>
      <section className="grid2">
        <div className="panel"><b>For schools</b><p>Graduate profiles, employability, alumni talent network and real booking workflow simulation.</p></div>
        <div className="panel"><b>For venues</b><p>Cleaner artist pipeline instead of messy DMs, spreadsheets and incomplete EPKs.</p></div>
        <div className="panel"><b>For promoters</b><p>Shortlist artists, compare EPKs and send booking requests in one place.</p></div>
        <div className="panel"><b>For buyers</b><p>White-label licence, paid pilot, partnership or asset sale.</p></div>
      </section>
      <section className="panel warning"><b>Cash-first rule</b><p>Build only the pieces that help someone pay: profile, request, dashboard, buyer pitch.</p></section>
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
      <div className="filters"><Badge>Buyer demo</Badge><Badge>{artist.score}% fit</Badge></div>
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
      <section className="panel">
        <h3>Technical rider basics</h3>
        <p>{selected.tech}</p>
        <button className="primary" onClick={() => setView('Request')}>Send booking request</button>
      </section>
    </div>
  );
}

function Request({ selected, setView }) {
  const [sent, setSent] = useState(false);
  const fields = ['Event name', 'Buyer / organisation', 'Contact email', 'Event date', 'City / venue', 'Fee offer', 'Set length', 'Technical notes'];
  return (
    <div className="stack">
      <section className="panel">
        <Badge>Booking request</Badge>
        <h3>Request {selected.name}</h3>
        <p>This is the buyer-visible workflow: structured booking data instead of loose DMs.</p>
      </section>
      <section className="formPanel">
        {fields.map((field) => <label key={field}>{field}<input placeholder={field === 'Fee offer' ? '£2,200' : field} /></label>)}
        <label>Message<textarea placeholder="Tell the artist what you are booking, where, when and why it fits." /></label>
        <button className="primary" onClick={() => setSent(true)}>Submit request</button>
      </section>
      {sent && <section className="panel success"><b>Demo request created.</b><p>In the sellable MVP this becomes an inbox item, email notification and buyer dashboard record.</p><button onClick={() => setView('Dashboard')}>Open dashboard</button></section>}
    </div>
  );
}

function Dashboard() {
  const totals = useMemo(() => ({ profiles: 42, requests: requests.length, pilot: '£3k+' }), []);
  return (
    <div className="stack">
      <section className="panel">
        <Badge>Organisation dashboard</Badge>
        <h3>Buyer control room</h3>
        <p>Mock dashboard for a music school, venue group, promoter network or festival.</p>
        <div className="stats"><div><b>{totals.profiles}</b><small>Profiles</small></div><div><b>{totals.requests}</b><small>Requests</small></div><div><b>{totals.pilot}</b><small>Pilot anchor</small></div></div>
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
        <h3>Launch it, license it, pilot it, or sell it.</h3>
        <p>The project succeeds if money arrives through any route. It does not require permanent platform management.</p>
      </section>
      {packages.map((pack) => <section className="package panel" key={pack.title}><div><h3>{pack.title}</h3><p>{pack.body}</p></div><strong>{pack.price}</strong></section>)}
      <section className="panel warning"><b>Next sales asset</b><p>After this demo: one-page pitch deck + 30 targeted buyer emails.</p></section>
    </div>
  );
}

function App() {
  const [view, setView] = useState('Landing');
  const [selected, setSelected] = useState(profiles[0]);
  let screen = <Landing setView={setView} />;
  if (view === 'Discover') screen = <Discover setSelected={setSelected} setView={setView} />;
  if (view === 'EPK') screen = <EPK selected={selected} setView={setView} />;
  if (view === 'Request') screen = <Request selected={selected} setView={setView} />;
  if (view === 'Dashboard') screen = <Dashboard />;
  if (view === 'Commercial') screen = <Commercial />;
  return <Shell view={view} setView={setView}>{screen}</Shell>;
}

createRoot(document.getElementById('root')).render(<App />);
