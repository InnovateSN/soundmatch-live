import React,{useEffect,useRef,useState}from'react';

const cities=[
  {label:'London',coords:[51.5074,-0.1278],zoom:13},
  {label:'Berlin',coords:[52.5200,13.4050],zoom:13},
  {label:'New York',coords:[40.7128,-74.0060],zoom:13},
  {label:'Tokyo',coords:[35.6762,139.6503],zoom:13}
];

function loadLeaflet(){
  if(window.L)return Promise.resolve(window.L);
  if(window.__soundmatchLeaflet)return window.__soundmatchLeaflet;
  window.__soundmatchLeaflet=new Promise((resolve,reject)=>{
    const css=document.createElement('link');
    css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);
    const s=document.createElement('script');
    s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    s.async=true;s.onload=()=>resolve(window.L);s.onerror=()=>reject(new Error('Leaflet failed to load'));
    document.head.appendChild(s);
  });
  return window.__soundmatchLeaflet;
}

function overpassQuery(bounds){
  const s=bounds.getSouth(),w=bounds.getWest(),n=bounds.getNorth(),e=bounds.getEast();
  const box=`${s},${w},${n},${e}`;
  return `[out:json][timeout:18];(
    nwr["amenity"="nightclub"](${box});
    nwr["amenity"="theatre"](${box});
    nwr["amenity"="arts_centre"](${box});
    nwr["leisure"="music_venue"](${box});
    nwr["live_music"="yes"](${box});
    nwr["music"="live"](${box});
    nwr["name"~"(club|music|live|venue|academy|hall|theatre|jazz)",i]["amenity"~"^(bar|pub|restaurant)$"](${box});
  );out center tags 90;`;
}

function elementToVenue(el){
  const tags=el.tags||{};
  const lat=el.lat||el.center?.lat;
  const lon=el.lon||el.center?.lon;
  if(!lat||!lon||!tags.name)return null;
  const type=tags.amenity||tags.leisure||'venue';
  const label=type.replaceAll('_',' ');
  return {id:`${el.type}-${el.id}`,name:tags.name,type:label,lat,lon,address:tags['addr:street']||tags['addr:city']||tags.operator||'OpenStreetMap venue'};
}

export default function GoogleMapView(){
  const mapEl=useRef(null);const mapRef=useRef(null);const layerRef=useRef(null);const abortRef=useRef(null);
  const[city,setCity]=useState(cities[0]);const[status,setStatus]=useState('loading');const[count,setCount]=useState(0);const[active,setActive]=useState(null);

  useEffect(()=>{let destroyed=false;loadLeaflet().then(L=>{if(destroyed||mapRef.current)return;const map=L.map(mapEl.current,{zoomControl:true,attributionControl:true}).setView(city.coords,city.zoom);mapRef.current=map;L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);layerRef.current=L.layerGroup().addTo(map);const refresh=()=>loadVenues(L,map);map.on('moveend zoomend',refresh);refresh();}).catch(()=>setStatus('map error'));return()=>{destroyed=true;abortRef.current?.abort();if(mapRef.current){mapRef.current.remove();mapRef.current=null;}};},[]);

  useEffect(()=>{if(mapRef.current){mapRef.current.setView(city.coords,city.zoom);}},[city]);

  async function loadVenues(L,map){
    if(map.getZoom()<11){setStatus('zoom in');setCount(0);layerRef.current?.clearLayers();return;}
    abortRef.current?.abort();const ac=new AbortController();abortRef.current=ac;setStatus('scanning');
    try{const body=new URLSearchParams({data:overpassQuery(map.getBounds())});const r=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body,signal:ac.signal});const data=await r.json();if(ac.signal.aborted)return;const venues=(data.elements||[]).map(elementToVenue).filter(Boolean).slice(0,90);layerRef.current.clearLayers();venues.forEach((v,idx)=>{const icon=L.divIcon({className:'venueMarker',html:`<span>${idx+1}</span>`,iconSize:[30,30],iconAnchor:[15,15]});L.marker([v.lat,v.lon],{icon}).addTo(layerRef.current).bindPopup(`<b>${v.name}</b><br>${v.type}<br>${v.address}`).on('click',()=>setActive(v));});setCount(venues.length);setActive(venues[0]||null);setStatus(venues.length?'ready':'no venues');}catch(e){if(!ac.signal.aborted)setStatus('scan failed');}
  }

  return <div className='googleMapScreen'><div className='mapTop'><span className='badge green'>Live venue scan</span><span className='badge'>{count} found</span></div><div className='mapFilters'>{cities.map(c=><button key={c.label} className={city.label===c.label?'on':''} onClick={()=>setCity(c)}>{c.label}</button>)}</div><div className='leafletVenueMap' ref={mapEl}/><section className='panel mapCard'><span className='badge blue'>{status}</span><h3>{active?.name||'Move / zoom the map'}</h3><p>{active?`${active.type} · ${active.address}`:'The app scans the current map area for live music venues, clubs, theatres, arts centres and music-tagged pubs/bars from OpenStreetMap.'}</p></section></div>;
}
