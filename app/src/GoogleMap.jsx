import React,{useMemo,useState}from'react';

const apiKey=import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY||import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const locations=[
  {label:'London',center:'51.5074,-0.1278',region:'uk',bbox:'-0.2440,51.4630,-0.0050,51.5550',pins:[['Fabric',43,42],['The Cause',64,32],['Corsica',55,68],['Venue cluster',33,56]]},
  {label:'Berlin',center:'52.5200,13.4050',region:'de',bbox:'13.2500,52.4300,13.5600,52.6000',pins:[['Berghain',61,54],['Club cluster',49,46],['Live venue',39,58],['Promoter',70,35]]},
  {label:'New York',center:'40.7128,-74.0060',region:'us',bbox:'-74.0600,40.6600,-73.9200,40.8000',pins:[['Brooklyn venue',68,58],['Manhattan room',46,42],['Promoter',55,52],['Club cluster',63,36]]},
  {label:'Tokyo',center:'35.6762,139.6503',region:'jp',bbox:'139.5700,35.6200,139.7900,35.7400',pins:[['Shibuya venue',42,58],['Club cluster',53,51],['Live house',62,45],['Promoter',72,38]]}
];
const query='live music venues';

export default function GoogleMapView(){
  const[location,setLocation]=useState(locations[0]);
  const[active,setActive]=useState(location.pins[0]);
  const googleSrc=useMemo(()=>{
    if(!apiKey)return '';
    const params=new URLSearchParams({key:apiKey,q:query,center:location.center,zoom:'12',maptype:'roadmap',language:'en',region:location.region});
    return `https://www.google.com/maps/embed/v1/search?${params.toString()}`;
  },[location]);
  const osmSrc=useMemo(()=>`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(location.bbox)}&layer=mapnik`,[location]);
  function chooseCity(s){setLocation(s);setActive(s.pins[0]);}
  return <div className='googleMapScreen'><div className='mapTop'><span className='badge green'>{apiKey?'Google map':'Free map'}</span><span className='badge'>Live venues</span></div><div className='mapFilters'>{locations.map(s=><button key={s.label} className={location.label===s.label?'on':''} onClick={()=>chooseCity(s)}>{s.label}</button>)}</div><div className='googleMapEmbed'><iframe title='SoundMatch Live venues map' src={apiKey?googleSrc:osmSrc} loading='lazy' allowFullScreen referrerPolicy='no-referrer-when-downgrade'/>{!apiKey&&<div className='soundPins'>{location.pins.map((p,i)=><button key={p[0]} className={i===0?'hot':''} style={{left:p[1]+'%',top:p[2]+'%'}} onClick={()=>setActive(p)}>{p[0][0]}</button>)}</div>}</div><section className='panel mapCard'><span className='badge blue'>{apiKey?'Google search':'OpenStreetMap mode'}</span><h3>{apiKey?'Live music venues':active[0]}</h3><p>{apiKey?'Move and zoom the map to explore venues in other areas. The search category stays fixed.':'Free no-key map now active. Move and zoom the map; SoundMatch pins are our own overlay and can become real venue/promoter/artist profiles later.'}</p></section></div>;
}
