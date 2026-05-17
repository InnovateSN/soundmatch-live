import React,{useMemo,useState}from'react';import'./mapProduct.css';

const modes=[
  {label:'All',q:'live music venues'},
  {label:'Small',q:'small live music venues pubs'},
  {label:'Electronic',q:'electronic music clubs'},
  {label:'Pubs',q:'pubs with live music'}
];

const cities=[
  {label:'London',venues:[
    {name:'Fabric',type:'Club',area:'Farringdon',capacity:'1,600',genres:['Electronic','Techno','Bass'],score:96,status:'Hot booking target',budget:'£2k–8k',note:'Major electronic institution. Strong fit for DJs and live electronic acts.'},
    {name:'Village Underground',type:'Venue',area:'Shoreditch',capacity:'700',genres:['Electronic','Live','AV'],score:91,status:'Tour-ready',budget:'£1.5k–5k',note:'Strong live/electronic crossover room with cultural credibility.'},
    {name:'Corsica Studios',type:'Venue',area:'Elephant & Castle',capacity:'500',genres:['Club','Experimental','Electronic'],score:89,status:'Underground fit',budget:'£800–3k',note:'Ideal for underground acts, label nights, and promoter-led bookings.'},
    {name:'KOKO',type:'Venue',area:'Camden',capacity:'1,400',genres:['Live','Indie','Electronic'],score:86,status:'Premium venue',budget:'£3k–12k',note:'High-profile room for larger live campaigns and showcase bookings.'},
    {name:'The Jazz Cafe',type:'Venue',area:'Camden',capacity:'440',genres:['Jazz','Soul','Electronic'],score:82,status:'Curated programming',budget:'£800–3.5k',note:'Useful for hybrid live acts, selectors, and crossover artists.'},
    {name:'Ministry of Sound',type:'Club',area:'Elephant & Castle',capacity:'1,600',genres:['House','Dance','DJ'],score:88,status:'Club institution',budget:'£2k–10k',note:'Best for club/dance-focused artists and promoters.'},
    {name:'The Windmill Brixton',type:'Small venue',area:'Brixton',capacity:'150',genres:['Indie','Punk','Experimental'],score:92,status:'Small-room gold',budget:'£150–700',note:'Strong grassroots venue for new bands, weird lineups, and early fanbase building.'},
    {name:'New River Studios',type:'Small venue',area:'Manor House',capacity:'150–250',genres:['Experimental','Noise','Electronic'],score:90,status:'Underground target',budget:'£150–800',note:'Good fit for experimental electronic, DIY promoters, and underground live shows.'},
    {name:'The Shacklewell Arms',type:'Small venue',area:'Dalston',capacity:'150',genres:['Indie','Alternative','Live'],score:86,status:'Grassroots venue',budget:'£150–650',note:'Useful for smaller touring artists and local promoter nights.'},
    {name:'The George Tavern',type:'Small venue',area:'Whitechapel',capacity:'150',genres:['Live','Alternative','Art'],score:84,status:'Character room',budget:'£150–700',note:'Small iconic room with strong personality; good for visually distinctive acts.'},
    {name:'The Lexington',type:'Small venue',area:'Angel',capacity:'200',genres:['Indie','Live','Alternative'],score:83,status:'Live circuit',budget:'£200–800',note:'Solid mid-small London room for credible live bills.'},
    {name:'The Waiting Room',type:'Small venue',area:'Stoke Newington',capacity:'120',genres:['Electronic','Indie','DJ'],score:81,status:'Small club room',budget:'£100–600',note:'Good for compact electronic, indie and promoter-led nights.'},
    {name:'Peckham Audio',type:'Small venue',area:'Peckham',capacity:'220',genres:['Club','Live','Bass'],score:87,status:'South London fit',budget:'£250–1.2k',note:'Useful for club nights, live showcases and local promoter programming.'},
    {name:'MOTH Club',type:'Venue',area:'Hackney',capacity:'300',genres:['Live','Alternative','Comedy'],score:82,status:'Culture venue',budget:'£400–1.5k',note:'Good mid-small venue with strong identity and varied programming.'},
    {name:'The Grace',type:'Small venue',area:'Highbury',capacity:'200',genres:['Live','Indie','Alternative'],score:80,status:'Small touring room',budget:'£200–900',note:'Good for early touring artists and support slots.'},
    {name:'Sebright Arms',type:'Small venue',area:'Bethnal Green',capacity:'150',genres:['Live','Indie','Punk'],score:82,status:'Grassroots room',budget:'£100–600',note:'Useful for small live bills and emerging acts.'},
    {name:'Paper Dress Vintage',type:'Small venue',area:'Hackney',capacity:'180',genres:['Live','Indie','DJ'],score:78,status:'Boutique room',budget:'£150–650',note:'Small stylish room with live/DJ crossover potential.'},
    {name:'The Victoria Dalston',type:'Small venue',area:'Dalston',capacity:'150',genres:['Indie','Live','Alternative'],score:79,status:'Local circuit',budget:'£100–600',note:'Useful for new bands and local promoters.'},
    {name:'The Old Blue Last',type:'Small venue',area:'Shoreditch',capacity:'150',genres:['Indie','Punk','Alternative'],score:81,status:'Known small room',budget:'£150–700',note:'Good for emerging bands and fast local programming.'},
    {name:'Folklore',type:'Small venue',area:'Hoxton',capacity:'120',genres:['Singer-songwriter','Folk','Live'],score:75,status:'Intimate room',budget:'£80–400',note:'Better for intimate live acts than loud club bookings.'}
  ]},
  {label:'Berlin',venues:[
    {name:'Berghain',type:'Club',area:'Friedrichshain',capacity:'1,500+',genres:['Techno','Electronic'],score:98,status:'Elite target',budget:'€3k–15k',note:'Global electronic music landmark. Extremely selective.'},
    {name:'Tresor',type:'Club',area:'Mitte',capacity:'1,500',genres:['Techno','Industrial'],score:94,status:'Techno fit',budget:'€2k–8k',note:'Strong match for serious electronic and industrial live acts.'},
    {name:'Watergate',type:'Club',area:'Kreuzberg',capacity:'700',genres:['House','Techno'],score:86,status:'Club target',budget:'€1.5k–6k',note:'Good for DJ-focused bookings and label showcases.'},
    {name:'SO36',type:'Venue',area:'Kreuzberg',capacity:'800',genres:['Punk','Live','Alternative'],score:79,status:'Live room',budget:'€800–4k',note:'Useful for bands and alternative touring acts.'},
    {name:'Lido',type:'Venue',area:'Kreuzberg',capacity:'500',genres:['Live','Indie','Electronic'],score:82,status:'Mid-size room',budget:'€700–3k',note:'Good mid-size room for live touring acts.'},
    {name:'Urban Spree',type:'Venue',area:'Friedrichshain',capacity:'400',genres:['Underground','Live','Electronic'],score:84,status:'Alt culture',budget:'€500–2.5k',note:'Strong fit for underground and cross-disciplinary shows.'}
  ]},
  {label:'New York',venues:[
    {name:'Brooklyn Steel',type:'Venue',area:'Brooklyn',capacity:'1,800',genres:['Live','Electronic','Indie'],score:91,status:'Tour-ready',budget:'$3k–12k',note:'Strong mid-large room for touring artists and larger showcases.'},
    {name:'Elsewhere',type:'Venue',area:'Bushwick',capacity:'700+',genres:['Club','Live','Experimental'],score:90,status:'Culture fit',budget:'$1.5k–7k',note:'Great fit for underground electronic, live AV, and hybrid events.'},
    {name:'Public Records',type:'Venue',area:'Brooklyn',capacity:'300+',genres:['Electronic','Listening','DJ'],score:84,status:'Curated target',budget:'$800–4k',note:'Useful for selectors, listening events, and leftfield bookings.'},
    {name:'Baby’s All Right',type:'Small venue',area:'Brooklyn',capacity:'280',genres:['Live','Indie','DJ'],score:83,status:'Small-room target',budget:'$500–2.5k',note:'Useful for emerging artists, live showcases and mixed bills.'}
  ]},
  {label:'Tokyo',venues:[
    {name:'WOMB',type:'Club',area:'Shibuya',capacity:'1,000',genres:['Electronic','Techno','DJ'],score:91,status:'Club target',budget:'¥250k–900k',note:'Strong electronic music destination in Tokyo.'},
    {name:'Liquidroom',type:'Venue',area:'Ebisu',capacity:'900',genres:['Live','Electronic','Alternative'],score:88,status:'Tour-ready',budget:'¥300k–1.2m',note:'Good fit for touring live electronic and alternative acts.'},
    {name:'WWW X',type:'Venue',area:'Shibuya',capacity:'700',genres:['Live','Experimental','Club'],score:84,status:'Culture fit',budget:'¥180k–700k',note:'Useful for modern live acts and curated electronic shows.'},
    {name:'Ruby Room',type:'Small venue',area:'Shibuya',capacity:'150',genres:['Live','DJ','Alternative'],score:78,status:'Small-room target',budget:'¥40k–250k',note:'Better for grassroots gigs and smaller promoter nights.'}
  ]}
];

export default function GoogleMapView(){
  const[city,setCity]=useState(cities[0]);
  const[mode,setMode]=useState(modes[0]);
  const[selected,setSelected]=useState(cities[0].venues[0]);
  const searchQuery=`${mode.q} in ${city.label}`;
  const src=useMemo(()=>`https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`,[searchQuery]);
  const openUrl=useMemo(()=>`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`,[searchQuery]);
  const filteredVenues=useMemo(()=>mode.label==='Small'?city.venues.filter(v=>String(v.capacity).includes('150')||String(v.capacity).includes('120')||String(v.capacity).includes('200')||v.type.toLowerCase().includes('small')):city.venues,[city,mode]);
  function chooseCity(c){setCity(c);setSelected(c.venues[0]);}
  function chooseMode(m){setMode(m);const pool=m.label==='Small'?city.venues.filter(v=>v.type.toLowerCase().includes('small')):city.venues;setSelected(pool[0]||city.venues[0]);}
  function openVenue(v){window.open(`https://www.google.com/maps/search/${encodeURIComponent(v.name+' '+city.label)}`,'_blank','noopener,noreferrer')}
  return <div className='googleMapScreen mapPro'>
    <div className='mapTop'><span className='badge green'>Venue intelligence</span><span className='badge'>{city.label}</span></div>
    <div className='mapFilters'>{cities.map(c=><button key={c.label} className={city.label===c.label?'on':''} onClick={()=>chooseCity(c)}>{c.label}</button>)}</div>
    <div className='mapFilters'>{modes.map(m=><button key={m.label} className={mode.label===m.label?'on':''} onClick={()=>chooseMode(m)}>{m.label}</button>)}</div>
    <div className='googleMapEmbed proMap'><iframe title='SoundMatch Live Google venues map' src={src} loading='lazy' allowFullScreen referrerPolicy='no-referrer-when-downgrade'/></div>
    <div className='venueRail'>{filteredVenues.map(v=><button key={v.name} className={selected.name===v.name?'on':''} onClick={()=>setSelected(v)}><b>{v.name}</b><span>{v.area} · {v.score}%</span></button>)}</div>
    <section className='panel venueDetail'><div className='venueHead'><span className='badge blue'>{selected.type}</span><strong>{selected.score}% fit</strong></div><h3>{selected.name}</h3><p>{selected.note}</p><div className='venueStats'><span>{selected.capacity}</span><span>{selected.budget}</span><span>{selected.status}</span></div><div className='venueTags'>{selected.genres.map(g=><i key={g}>{g}</i>)}</div><div className='venueActions'><button className='primary'>Match</button><button onClick={()=>openVenue(selected)}>Google</button><button onClick={()=>window.open(openUrl,'_blank','noopener,noreferrer')}>Full map</button></div></section>
  </div>;
}
