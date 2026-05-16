import React,{useEffect,useRef,useState}from'react';

const apiKey=import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const center={lat:51.5074,lng:-0.1278};
const demoPins=[
  {name:'Fabric',type:'Club',tag:'Electronic / DJ sets',position:{lat:51.5196,lng:-0.1026}},
  {name:'Corsica Studios',type:'Venue',tag:'Live / club nights',position:{lat:51.4941,lng:-0.0994}},
  {name:'Fold',type:'Club',tag:'Techno / electronic',position:{lat:51.5152,lng:0.0224}},
  {name:'The Cause',type:'Venue',tag:'Bass / live / electronic',position:{lat:51.5416,lng:-0.0592}},
  {name:'NOVA CRUEL',type:'Artist',tag:'Artist currently in town',position:{lat:51.5138,lng:-0.1084}}
];

function loadGoogleMaps(key){
  if(window.google?.maps?.places)return Promise.resolve(window.google);
  if(window.__soundmatchMapsPromise)return window.__soundmatchMapsPromise;
  window.__soundmatchMapsPromise=new Promise((resolve,reject)=>{
    window.__soundmatchMapsReady=()=>resolve(window.google);
    const s=document.createElement('script');
    s.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&callback=__soundmatchMapsReady`;
    s.async=true;s.defer=true;s.onerror=()=>reject(new Error('Google Maps failed to load'));
    document.head.appendChild(s);
  });
  return window.__soundmatchMapsPromise;
}

export default function GoogleMapView(){
  const el=useRef(null);const[active,setActive]=useState(demoPins[0]);const[places,setPlaces]=useState([]);const[status,setStatus]=useState(apiKey?'loading':'missing-key');
  useEffect(()=>{if(!apiKey||!el.current)return;let cancelled=false;loadGoogleMaps(apiKey).then(g=>{if(cancelled)return;setStatus('ready');const map=new g.maps.Map(el.current,{center,zoom:12,disableDefaultUI:true,zoomControl:true,gestureHandling:'greedy',styles:[{elementType:'geometry',stylers:[{color:'#101015'}]},{elementType:'labels.text.fill',stylers:[{color:'#d8d0bd'}]},{elementType:'labels.text.stroke',stylers:[{color:'#050506'}]},{featureType:'road',elementType:'geometry',stylers:[{color:'#24242a'}]},{featureType:'water',elementType:'geometry',stylers:[{color:'#07171d'}]},{featureType:'poi',elementType:'geometry',stylers:[{color:'#15151a'}]}]});
    const info=new g.maps.InfoWindow();
    demoPins.forEach(p=>{const m=new g.maps.Marker({map,position:p.position,title:p.name,label:p.type[0]});m.addListener('click',()=>{setActive(p);info.setContent(`<strong>${p.name}</strong><br>${p.type}<br>${p.tag}`);info.open(map,m);});});
    const service=new g.maps.places.PlacesService(map);
    service.nearbySearch({location:center,radius:7000,keyword:'live music venue nightclub electronic music'},(results,placeStatus)=>{if(cancelled)return;if(placeStatus===g.maps.places.PlacesServiceStatus.OK&&results){const trimmed=results.slice(0,6).map(r=>({name:r.name,type:'Google Place',tag:r.vicinity||'Nearby music-related place',position:{lat:r.geometry.location.lat(),lng:r.geometry.location.lng()}}));setPlaces(trimmed);trimmed.forEach(p=>{const m=new g.maps.Marker({map,position:p.position,title:p.name,icon:{path:g.maps.SymbolPath.CIRCLE,scale:7,fillColor:'#ccff00',fillOpacity:1,strokeColor:'#050506',strokeWeight:2}});m.addListener('click',()=>{setActive(p);info.setContent(`<strong>${p.name}</strong><br>${p.tag}`);info.open(map,m);});});}});
  }).catch(()=>setStatus('error'));return()=>{cancelled=true};},[]);

  if(status==='missing-key')return <div className='googleMapScreen'><section className='panel'><span className='badge amber'>Google Maps disabled</span><h3>Real map needs an API key</h3><p>Add VITE_GOOGLE_MAPS_API_KEY in Vercel and enable Maps JavaScript API plus Places API in Google Cloud. Then this screen becomes a real Google map with nearby live music venues, clubs, promoters and artist pins.</p></section></div>;
  return <div className='googleMapScreen'><div className='mapTop'><span className='badge green'>Google Maps</span><span className='badge'>London radar</span></div><div ref={el} className='googleMap'>{status==='loading'&&<p>Loading Google Maps…</p>}</div><section className='panel mapCard'><span className='badge blue'>{active.type}</span><h3>{active.name}</h3><p>{active.tag}</p><button className='primary'>Open profile</button></section>{places.length>0&&<div className='placeStrip'>{places.slice(0,3).map(p=><button key={p.name} onClick={()=>setActive(p)}>{p.name}</button>)}</div>}</div>;
}
