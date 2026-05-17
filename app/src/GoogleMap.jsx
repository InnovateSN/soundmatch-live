import React,{useMemo,useState}from'react';import'./mapProduct.css';

const cities=[
  {label:'London',query:'live music venues in London',venues:[
    {name:'Fabric',type:'Club',area:'Farringdon',capacity:'1,600',genres:['Electronic','Techno','Bass'],score:96,status:'Hot booking target',budget:'£2k–8k',note:'Major electronic institution. Strong fit for DJs and live electronic acts.'},
    {name:'Village Underground',type:'Venue',area:'Shoreditch',capacity:'700',genres:['Electronic','Live','AV'],score:91,status:'Tour-ready',budget:'£1.5k–5k',note:'Strong live/electronic crossover room with cultural credibility.'},
    {name:'Corsica Studios',type:'Venue',area:'Elephant & Castle',capacity:'500',genres:['Club','Experimental','Electronic'],score:89,status:'Underground fit',budget:'£800–3k',note:'Ideal for underground acts, label nights, and promoter-led bookings.'},
    {name:'KOKO',type:'Venue',area:'Camden',capacity:'1,400',genres:['Live','Indie','Electronic'],score:86,status:'Premium venue',budget:'£3k–12k',note:'High-profile room for larger live campaigns and showcase bookings.'},
    {name:'The Jazz Cafe',type:'Venue',area:'Camden',capacity:'440',genres:['Jazz','Soul','Electronic'],score:82,status:'Curated programming',budget:'£800–3.5k',note:'Useful for hybrid live acts, selectors, and crossover artists.'},
    {name:'Ministry of Sound',type:'Club',area:'Elephant & Castle',capacity:'1,600',genres:['House','Dance','DJ'],score:88,status:'Club institution',budget:'£2k–10k',note:'Best for club/dance-focused artists and promoters.'}
  ]},
  {label:'Berlin',query:'live music venues in Berlin',venues:[
    {name:'Berghain',type:'Club',area:'Friedrichshain',capacity:'1,500+',genres:['Techno','Electronic'],score:98,status:'Elite target',budget:'€3k–15k',note:'Global electronic music landmark. Extremely selective.'},
    {name:'Tresor',type:'Club',area:'Mitte',capacity:'1,500',genres:['Techno','Industrial'],score:94,status:'Techno fit',budget:'€2k–8k',note:'Strong match for serious electronic and industrial live acts.'},
    {name:'Watergate',type:'Club',area:'Kreuzberg',capacity:'700',genres:['House','Techno'],score:86,status:'Club target',budget:'€1.5k–6k',note:'Good for DJ-focused bookings and label showcases.'},
    {name:'SO36',type:'Venue',area:'Kreuzberg',capacity:'800',genres:['Punk','Live','Alternative'],score:79,status:'Live room',budget:'€800–4k',note:'Useful for bands and alternative touring acts.'}
  ]},
  {label:'New York',query:'live music venues in New York',venues:[
    {name:'Brooklyn Steel',type:'Venue',area:'Brooklyn',capacity:'1,800',genres:['Live','Electronic','Indie'],score:91,status:'Tour-ready',budget:'$3k–12k',note:'Strong mid-large room for touring artists and larger showcases.'},
    {name:'Elsewhere',type:'Venue',area:'Bushwick',capacity:'700+',genres:['Club','Live','Experimental'],score:90,status:'Culture fit',budget:'$1.5k–7k',note:'Great fit for underground electronic, live AV, and hybrid events.'},
    {name:'Public Records',type:'Venue',area:'Brooklyn',capacity:'300+',genres:['Electronic','Listening','DJ'],score:84,status:'Curated target',budget:'$800–4k',note:'Useful for selectors, listening events, and leftfield bookings.'},
    {name:'Webster Hall',type:'Venue',area:'Manhattan',capacity:'1,500',genres:['Live','Club','Touring'],score:87,status:'Premium room',budget:'$4k–15k',note:'High-visibility venue for stronger touring packages.'}
  ]},
  {label:'Tokyo',query:'live music venues in Tokyo',venues:[
    {name:'WOMB',type:'Club',area:'Shibuya',capacity:'1,000',genres:['Electronic','Techno','DJ'],score:91,status:'Club target',budget:'¥250k–900k',note:'Strong electronic music destination in Tokyo.'},
    {name:'Liquidroom',type:'Venue',area:'Ebisu',capacity:'900',genres:['Live','Electronic','Alternative'],score:88,status:'Tour-ready',budget:'¥300k–1.2m',note:'Good fit for touring live electronic and alternative acts.'},
    {name:'WWW X',type:'Venue',area:'Shibuya',capacity:'700',genres:['Live','Experimental','Club'],score:84,status:'Culture fit',budget:'¥180k–700k',note:'Useful for modern live acts and curated electronic shows.'},
    {name:'Blue Note Tokyo',type:'Venue',area:'Aoyama',capacity:'300',genres:['Jazz','Soul','Live'],score:80,status:'Premium seated',budget:'¥250k–1m',note:'Better for premium live musicians than club-focused acts.'}
  ]}
];

export default function GoogleMapView(){
  const[city,setCity]=useState(cities[0]);
  const[selected,setSelected]=useState(cities[0].venues[0]);
  const src=useMemo(()=>`https://www.google.com/maps?q=${encodeURIComponent(city.query)}&output=embed`,[city]);
  const openUrl=useMemo(()=>`https://www.google.com/maps/search/${encodeURIComponent(city.query)}`,[city]);
  function chooseCity(c){setCity(c);setSelected(c.venues[0]);}
  function openVenue(v){window.open(`https://www.google.com/maps/search/${encodeURIComponent(v.name+' '+city.label)}`,'_blank','noopener,noreferrer')}
  return <div className='googleMapScreen mapPro'>
    <div className='mapTop'><span className='badge green'>Venue intelligence</span><span className='badge'>{city.label}</span></div>
    <div className='mapFilters'>{cities.map(c=><button key={c.label} className={city.label===c.label?'on':''} onClick={()=>chooseCity(c)}>{c.label}</button>)}</div>
    <div className='googleMapEmbed proMap'><iframe title='SoundMatch Live Google venues map' src={src} loading='lazy' allowFullScreen referrerPolicy='no-referrer-when-downgrade'/></div>
    <div className='venueRail'>{city.venues.map(v=><button key={v.name} className={selected.name===v.name?'on':''} onClick={()=>setSelected(v)}><b>{v.name}</b><span>{v.area} · {v.score}%</span></button>)}</div>
    <section className='panel venueDetail'><div className='venueHead'><span className='badge blue'>{selected.type}</span><strong>{selected.score}% fit</strong></div><h3>{selected.name}</h3><p>{selected.note}</p><div className='venueStats'><span>{selected.capacity}</span><span>{selected.budget}</span><span>{selected.status}</span></div><div className='venueTags'>{selected.genres.map(g=><i key={g}>{g}</i>)}</div><div className='venueActions'><button className='primary'>Match</button><button onClick={()=>openVenue(selected)}>Google</button><button onClick={()=>window.open(openUrl,'_blank','noopener,noreferrer')}>Full map</button></div></section>
  </div>;
}
