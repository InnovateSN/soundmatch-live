import React,{useMemo,useState}from'react';

const apiKey=import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY||import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const locations=[
  {label:'London',center:'51.5074,-0.1278',region:'uk'},
  {label:'Berlin',center:'52.5200,13.4050',region:'de'},
  {label:'New York',center:'40.7128,-74.0060',region:'us'},
  {label:'Tokyo',center:'35.6762,139.6503',region:'jp'}
];
const query='live music venues';

export default function GoogleMapView(){
  const[location,setLocation]=useState(locations[0]);
  const src=useMemo(()=>{
    if(!apiKey)return '';
    const params=new URLSearchParams({key:apiKey,q:query,center:location.center,zoom:'12',maptype:'roadmap',language:'en',region:location.region});
    return `https://www.google.com/maps/embed/v1/search?${params.toString()}`;
  },[location]);
  if(!apiKey)return <div className='googleMapScreen'><section className='panel'><span className='badge amber'>Google Embed ready</span><h3>API key needed</h3><p>This version uses one fixed search: live music venues. Users can move and zoom the embedded Google map. Add VITE_GOOGLE_MAPS_EMBED_API_KEY in Vercel, restricted to soundmatch-live.vercel.app and Maps Embed API only.</p></section><section className='panel mapCard'><h3>Planned search</h3><p>live music venues · movable Google map · city jump presets · SoundMatch profiles around it later.</p></section></div>;
  return <div className='googleMapScreen'><div className='mapTop'><span className='badge green'>Live venue map</span><span className='badge'>Google</span></div><div className='mapFilters'>{locations.map(s=><button key={s.label} className={location.label===s.label?'on':''} onClick={()=>setLocation(s)}>{s.label}</button>)}</div><div className='googleMapEmbed'><iframe title='SoundMatch Live music venues map' src={src} loading='lazy' allowFullScreen referrerPolicy='no-referrer-when-downgrade'/></div><section className='panel mapCard'><span className='badge blue'>Search locked</span><h3>Live music venues</h3><p>Move and zoom the map to explore venues in other areas. City buttons just jump the starting point; the search category stays fixed.</p></section></div>;
}
