import React,{useEffect,useRef,useState}from'react';import'./map.css';

const cities=[
  {label:'London',coords:[51.5074,-0.1278],zoom:12},
  {label:'Berlin',coords:[52.5200,13.4050],zoom:12},
  {label:'New York',coords:[40.7128,-74.0060],zoom:12},
  {label:'Tokyo',coords:[35.6762,139.6503],zoom:12}
];

const curatedVenues={
  London:[
    ['Fabric','club',51.5196,-0.1026],['The Cause','venue',51.5416,-0.0592],['Corsica Studios','venue',51.4941,-0.0994],['Roundhouse','venue',51.5432,-0.1514],['KOKO','venue',51.5348,-0.1382],['Electric Brixton','venue',51.4599,-0.1176],['Village Underground','venue',51.5245,-0.0783],['Jazz Cafe','venue',51.5386,-0.1437],['XOYO','club',51.5258,-0.0836],['O2 Academy Islington','venue',51.5341,-0.1052],
    ['Scala','venue',51.5308,-0.1201],['Union Chapel','venue',51.5448,-0.1026],['The Garage','venue',51.5466,-0.1037],['Electric Ballroom','venue',51.5407,-0.1430],['Heaven','club',51.5081,-0.1232],['Ministry of Sound','club',51.4977,-0.0991],['Phonox','club',51.4622,-0.1145],['MOTH Club','venue',51.5452,-0.0548],['EartH Hackney','venue',51.5509,-0.0751],['Troxy','venue',51.5126,-0.0394],
    ['O2 Forum Kentish Town','venue',51.5520,-0.1426],['Omeara','venue',51.5045,-0.0912],['100 Club','venue',51.5163,-0.1353],['Ronnie Scott’s','venue',51.5130,-0.1311],['The Lexington','venue',51.5304,-0.1112],['The Windmill Brixton','venue',51.4435,-0.1216],['New River Studios','venue',51.5715,-0.1064],['Peckham Audio','venue',51.4708,-0.0698],['Studio 9294','venue',51.5352,-0.0220],['Hootananny Brixton','venue',51.4582,-0.1203],
    ['The George Tavern','venue',51.5152,-0.0542],['The Shacklewell Arms','venue',51.5482,-0.0692],['Oslo Hackney','venue',51.5470,-0.0552],['The Waiting Room','venue',51.5618,-0.0742],['The Hope and Anchor','venue',51.5437,-0.1030],['Camden Assembly','venue',51.5439,-0.1481]
  ],
  Berlin:[
    ['Berghain','club',52.5111,13.4431],['Tresor','club',52.5105,13.4193],['Watergate','club',52.5016,13.4451],['SO36','venue',52.5009,13.4225],['Columbiahalle','venue',52.4845,13.3909],['Astra Kulturhaus','venue',52.5076,13.4543],['Lido','venue',52.4997,13.4416],['About Blank','club',52.5027,13.4652],['Sisyphos','club',52.4936,13.4936],['Kater Blau','club',52.5112,13.4263],['Gretchen','venue',52.4966,13.3891],['Huxleys Neue Welt','venue',52.4865,13.4219]
  ],
  'New York':[
    ['Brooklyn Steel','venue',40.7283,-73.9386],['Elsewhere','venue',40.7094,-73.9230],['Bowery Ballroom','venue',40.7204,-73.9933],['Blue Note','venue',40.7309,-74.0007],['Webster Hall','venue',40.7318,-73.9891],['Terminal 5','venue',40.7697,-73.9928],['Knockdown Center','venue',40.7150,-73.9144],['Public Records','venue',40.6787,-73.9856],['Baby’s All Right','venue',40.7100,-73.9639],['Music Hall of Williamsburg','venue',40.7193,-73.9619],['Brooklyn Mirage','venue',40.7092,-73.9240],['Le Poisson Rouge','venue',40.7285,-74.0007]
  ],
  Tokyo:[
    ['WOMB','club',35.6584,139.6951],['Contact Tokyo','club',35.6605,139.6968],['Liquidroom','venue',35.6473,139.7101],['WWW X','venue',35.6612,139.6983],['Blue Note Tokyo','venue',35.6626,139.7172],['Shibuya Club Quattro','venue',35.6616,139.6997],['Unit Daikanyama','venue',35.6482,139.7031],['O-East','venue',35.6589,139.6955],['O-West','venue',35.6581,139.6957],['Zepp Shinjuku','venue',35.6950,139.7011],['Cotton Club','venue',35.6812,139.7654],['Billboard Live Tokyo','venue',35.6659,139.7311]
  ]
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
  return `[out:json][timeout:10];(nwr["amenity"="nightclub"](${box});nwr["leisure"="music_venue"](${box});nwr["live_music"="yes"](${box});nwr["music"="live"](${box});nwr["amenity"="arts_centre"](${box});nwr["name"~"(club|music|live|venue|academy|hall|theatre|jazz)",i]["amenity"~"^(bar|pub|theatre)$"](${box}););out center tags 160;`;
}

function elementToVenue(el){
  const tags=el.tags||{};const lat=el.lat||el.center?.lat;const lon=el.lon||el.center?.lon;
  if(!lat||!lon||!tags.name)return null;
  const type=(tags.amenity||tags.leisure||'venue').replaceAll('_',' ');
  const address=tags['addr:street']||tags['addr:city']||tags.operator||'OpenStreetMap venue';
  return {id:`${el.type}-${el.id}`,name:tags.name,type,lat,lon,address,source:'osm'};
}

function curatedFor(city){return (curatedVenues[city.label]||[]).map((v,i)=>({id:`curated-${city.label}-${i}`,name:v[0],type:v[1],lat:v[2],lon:v[3],address:'curated starter venue',source:'curated'}));}
function inBounds(bounds,v){return bounds.contains([v.lat,v.lon]);}
function dedupe(list){const seen=new Set();return list.filter(v=>{const k=v.name.toLowerCase().replace(/[^a-z0-9]/g,'');if(seen.has(k))return false;seen.add(k);return true;});}

export default function GoogleMapView(){
  const mapEl=useRef(null);const mapRef=useRef(null);const layerRef=useRef(null);const abortRef=useRef(null);const leafletRef=useRef(null);const debounceRef=useRef(null);const cacheRef=useRef(new Map());
  const[city,setCity]=useState(cities[0]);const[status,setStatus]=useState('loading');const[count,setCount]=useState(0);const[active,setActive]=useState(null);

  function renderVenues(L,venues,label){
    layerRef.current?.clearLayers();
    venues.forEach((v,idx)=>{const icon=L.divIcon({className:'venueMarker '+(v.source==='osm'?'osm':'curated'),html:`<span>${idx+1}</span>`,iconSize:[34,34],iconAnchor:[17,17]});L.marker([v.lat,v.lon],{icon}).addTo(layerRef.current).bindPopup(`<b>${v.name}</b><br>${v.type}<br>${v.address}`).on('click',()=>setActive(v));});
    setCount(venues.length);setActive(venues[0]||null);setStatus(label);
  }

  function visibleCurated(){
    const map=mapRef.current;if(!map)return curatedFor(city);
    const bounds=map.getBounds();return curatedFor(city).filter(v=>inBounds(bounds,v));
  }

  function quickRender(){
    if(!leafletRef.current)return;
    const visible=visibleCurated();
    renderVenues(leafletRef.current,visible.length?visible:curatedFor(city),'instant curated');
  }

  function scheduleScan(){
    clearTimeout(debounceRef.current);
    quickRender();
    debounceRef.current=setTimeout(()=>{if(leafletRef.current&&mapRef.current)loadVenues(leafletRef.current,mapRef.current);},650);
  }

  useEffect(()=>{let destroyed=false;loadLeaflet().then(L=>{if(destroyed||mapRef.current)return;leafletRef.current=L;const map=L.map(mapEl.current,{zoomControl:true,attributionControl:true}).setView(city.coords,city.zoom);mapRef.current=map;L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);layerRef.current=L.layerGroup().addTo(map);map.on('moveend zoomend',scheduleScan);setTimeout(()=>map.invalidateSize(),120);renderVenues(L,curatedFor(city),'instant curated');scheduleScan();}).catch(()=>setStatus('map error'));return()=>{destroyed=true;clearTimeout(debounceRef.current);abortRef.current?.abort();if(mapRef.current){mapRef.current.remove();mapRef.current=null;}};},[]);

  useEffect(()=>{if(mapRef.current&&leafletRef.current){mapRef.current.setView(city.coords,city.zoom);setTimeout(()=>{renderVenues(leafletRef.current,curatedFor(city),'instant curated');scheduleScan();},180);}},[city]);

  async function loadVenues(L,map){
    if(map.getZoom()<11){quickRender();setStatus('zoom in for live scan');return;}
    const b=map.getBounds();const cacheKey=[b.getSouth().toFixed(2),b.getWest().toFixed(2),b.getNorth().toFixed(2),b.getEast().toFixed(2)].join(',');
    if(cacheRef.current.has(cacheKey)){const merged=dedupe([...cacheRef.current.get(cacheKey),...visibleCurated()]).slice(0,140);renderVenues(L,merged,'cached scan');return;}
    abortRef.current?.abort();const ac=new AbortController();abortRef.current=ac;setStatus('scanning OSM');
    try{const body=new URLSearchParams({data:overpassQuery(b)});const r=await fetch('https://overpass.kumi.systems/api/interpreter',{method:'POST',body,signal:ac.signal});if(!r.ok)throw new Error('overpass');const data=await r.json();if(ac.signal.aborted)return;const osm=(data.elements||[]).map(elementToVenue).filter(Boolean);cacheRef.current.set(cacheKey,osm);const merged=dedupe([...osm,...visibleCurated()]).slice(0,140);renderVenues(L,merged,osm.length?'live OSM scan':'instant curated');}catch(e){if(!ac.signal.aborted)quickRender();}
  }

  return <div className='googleMapScreen'><div className='mapTop'><span className='badge green'>Venue map</span><span className='badge'>{count} shown</span></div><div className='mapFilters'>{cities.map(c=><button key={c.label} className={city.label===c.label?'on':''} onClick={()=>setCity(c)}>{c.label}</button>)}</div><div className='leafletVenueMap' ref={mapEl}/><section className='panel mapCard'><span className='badge blue'>{status}</span><h3>{active?.name||'Move / zoom the map'}</h3><p>{active?`${active.type} · ${active.address}`:'Fast curated venues appear immediately. OSM venue scan runs after you stop moving and adds extra real map results when available.'}</p></section></div>;
}
