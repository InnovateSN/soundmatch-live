import React,{useMemo,useState}from'react';

const apiKey=import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY||import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const searches=[
  {label:'Live venues',q:'live music venues in London',note:'Pubs, venues and live rooms'},
  {label:'Electronic',q:'electronic music clubs in London',note:'Clubs and electronic rooms'},
  {label:'DJ sets',q:'dj sets venues in London',note:'Nightlife and DJ-led spaces'},
  {label:'Promoters',q:'music promoters in London',note:'Promoter and booking-related results'}
];

export default function GoogleMapView(){
  const[active,setActive]=useState(searches[0]);
  const src=useMemo(()=>{
    if(!apiKey)return '';
    const params=new URLSearchParams({key:apiKey,q:active.q,center:'51.5074,-0.1278',zoom:'12',maptype:'roadmap',language:'en',region:'uk'});
    return `https://www.google.com/maps/embed/v1/search?${params.toString()}`;
  },[active]);
  if(!apiKey)return <div className='googleMapScreen'><section className='panel'><span className='badge amber'>Google Embed ready</span><h3>API key needed</h3><p>This version uses Google Maps Embed API search mode. Add VITE_GOOGLE_MAPS_EMBED_API_KEY in Vercel, restricted to soundmatch-live.vercel.app and Maps Embed API only. Embed requests are free, but Google still requires an authenticated key.</p></section><section className='panel mapCard'><h3>Planned search</h3><p>live music venues in London · electronic music clubs · DJ set venues · promoters</p></section></div>;
  return <div className='googleMapScreen'><div className='mapTop'><span className='badge green'>Google Embed</span><span className='badge'>Search map</span></div><div className='mapFilters'>{searches.map(s=><button key={s.label} className={active.label===s.label?'on':''} onClick={()=>setActive(s)}>{s.label}</button>)}</div><div className='googleMapEmbed'><iframe title='SoundMatch Live Google map search' src={src} loading='lazy' allowFullScreen referrerPolicy='no-referrer-when-downgrade'/></div><section className='panel mapCard'><span className='badge blue'>{active.label}</span><h3>{active.q}</h3><p>{active.note}. This is a fixed Google search viewer for discovery; SoundMatch profiles and booking tools sit around it.</p></section></div>;
}
