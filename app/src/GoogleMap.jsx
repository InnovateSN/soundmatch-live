import React,{useEffect,useRef,useState}from'react';

const cities=[
  {label:'London',coords:[51.5074,-0.1278],zoom:13},
  {label:'Berlin',coords:[52.5200,13.4050],zoom:13},
  {label:'New York',coords:[40.7128,-74.0060],zoom:13},
  {label:'Tokyo',coords:[35.6762,139.6503],zoom:13}
];

const fallbackVenues={
  London:[['Fabric','club',51.5196,-0.1026],['The Cause','venue',51.5416,-0.0592],['Corsica Studios','venue',51.4941,-0.0994],['Roundhouse','venue',51.5432,-0.1514],['KOKO','venue',51.5348,-0.1382],['Electric Brixton','venue',51.4599,-0.1176],['Village Underground','venue',51.5245,-0.0783],['Jazz Cafe','venue',51.5386,-0.1437],['XOYO','club',51.5258,-0.0836],['O2 Academy Islington','venue',51.5341,-0.1052]],
  Berlin:[['Berghain','club',52.5111,13.4431],['Tresor','club',52.5105,13.4193],['Watergate','club',52.5016,13.4451],['SO36','venue',52.5009,13.4225],['Columbiahalle','venue',52.4845,13.3909],['Astra Kulturhaus','venue',52.5076,13.4543]],
  'New York':[['Brooklyn Steel','venue',40.7283,-73.9386],['Elsewhere','venue',40.7094,-73.9230],['Bowery Ballroom','venue',40.7204,-73.9933],['Blue Note','venue',40.7309,-74.0007],['Webster Hall','venue',40.7318,-73.9891],['Terminal 5','venue',40.7697,-73.9928]],
  Tokyo:[['WOMB','club',35.6584,139.6951],['Contact Tokyo','club',35.6605,139.6968],['Liquidroom','venue',35.6473,139.7101],['WWW X','venue',35.6612,139.6983],['Blue Note Tokyo','venue',35.6626,139.7172],['Shibuya Club Quattro','venue',35.6616,139.6997]]
};

function loadLeaflet(){
  if(window.L)return Promise.resolve(window.L);
  if(window.__soundmatchLeaflet)return window.__soundmatchLeaflet;
  window.__soundmatchLeaflet=new Promise((resolve,reject)=>{
    const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(css);
    const s=document.createElement('script');s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';s.async=true;s.onload=()=>resolve(window.L);s.onerror=()=>reject(new Error('Leaflet failed to load'));document.head.appendChild(s);
  });
  return window.__soundmatchLeaflet;
}

function overpassQuery(bounds){
  const s=bounds.getSouth(),w=bounds.getWest(),n=bounds.getNorth(),e=bounds.getEast();
  const box=`${s},${w},${n},${e}`;
  return `[out:json][timeout:14];(nwr["amenity"="nightclub"](${box});nwr["amenity"="theatre"](${box});nwr["amenity"="arts_centre"](${box});nwr["leisure"="music_venue"](${box});nwr["live_music"="yes"](${box});nwr["music"="live"](${box});nwr["name"~"(club|music|live|venue|academy|hall|theatre|jazz)",i]["amenity"~"^(bar|pub|restaurant)$"](${box}););out center tags 120;`;
}

function elementToVenue(el){
  const tags=el.tags||{};const lat=el.lat||el.center?.lat;const lon=el.lon||el.center?.lon;
  if(!lat||!lon||!tags.name)return null;
  const type=(tags.amenity||tags.leisure||'venue').replaceAll('_',' ');
  const address=tags['addr:street']||tags['addr:city']||tags.operator||'OpenStreetMap venue';
  return {id:`${el.type}-${el.id}`,name:tags.name,type,lat,lon,address};
}

function fallbackFor(city){return (fallbackVenues[city.label]||[]).map((v,i)=>({id:`fallback-${city.label}-${i}`,name:v[0],type:v[1],lat:v[2],lon:v[3],address:'curated starter venue'}));}

export default function GoogleMapView(){
  const mapEl=useRef(null);const mapRef=useRef(null);const layerRef=useRef(null);const abortRef=useRef(null);const leafletRef=useRef(null);
  const[city,setCity]=useState(cities[0]);const[status,setStatus]=useState('loading');const[count,setCount]=useState(0);const[active,setActive]=useState(null);

  function renderVenues(L,venues,label){
    layerRef.current?.clearLayers();
    venues.forEach((v,idx)=>{const icon=L.divIcon({className:'venueMarker',html:`<span>${idx+1}</span>`,iconSize:[34,34],iconAnchor:[17,17]});L.marker([v.lat,v.lon],{icon}).addTo(layerRef.current).bindPopup(`<b>${v.name}</b><br>${v.type}<br>${v.address}`).on('click',()=>setActive(v));});
    setCount(venues.length);setActive(venues[0]||null);setStatus(label);
  }

  useEffect(()=>{let destroyed=false;loadLeaflet().then(L=>{if(destroyed||mapRef.current)return;leafletRef.current=L;const map=L.map(mapEl.current,{zoomControl:true,attributionControl:true}).setView(city.coords,city.zoom);mapRef.current=map;L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);layerRef.current=L.layerGroup().addTo(map);const refresh=()=>loadVenues(L,map);map.on('moveend zoomend',refresh);setTimeout(()=>map.invalidateSize(),120);renderVenues(L,fallbackFor(city),'starter venues');refresh();}).catch(()=>setStatus('map error'));return()=>{destroyed=true;abortRef.current?.abort();if(mapRef.current){mapRef.current.remove();mapRef.current=null;}};},[]);

  useEffect(()=>{if(mapRef.current&&leafletRef.current){mapRef.current.setView(city.coords,city.zoom);setTimeout(()=>{renderVenues(leafletRef.current,fallbackFor(city),'starter venues');loadVenues(leafletRef.current,mapRef.current);},180);}},[city]);

  async function loadVenues(L,map){
    if(map.getZoom()<11){renderVenues(L,fallbackFor(city),'zoom in');return;}
    abortRef.current?.abort();const ac=new AbortController();abortRef.current=ac;setStatus('scanning');
    try{const body=new URLSearchParams({data:overpassQuery(map.getBounds())});const r=await fetch('https://overpass.kumi.systems/api/interpreter',{method:'POST',body,signal:ac.signal});if(!r.ok)throw new Error('overpass');const data=await r.json();if(ac.signal.aborted)return;const venues=(data.elements||[]).map(elementToVenue).filter(Boolean).slice(0,120);if(venues.length)renderVenues(L,venues,'live OSM scan');else renderVenues(L,fallbackFor(city),'starter venues');}catch(e){if(!ac.signal.aborted)renderVenues(L,fallbackFor(city),'starter venues');}
  }

  return <div className='googleMapScreen'><div className='mapTop'><span className='badge green'>Venue map</span><span className='badge'>{count} shown</span></div><div className='mapFilters'>{cities.map(c=><button key={c.label} className={city.label===c.label?'on':''} onClick={()=>setCity(c)}>{c.label}</button>)}</div><div className='leafletVenueMap' ref={mapEl}/><section className='panel mapCard'><span className='badge blue'>{status}</span><h3>{active?.name||'Venues loading'}</h3><p>{active?`${active.type} · ${active.address}`:'Move or zoom the map. Markers stay attached to real coordinates; Overpass fills live OSM results where available, with curated starter venues as fallback.'}</p></section></div>;
}
