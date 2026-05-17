import React,{useMemo,useState}from'react';

const cities=[
  {label:'London',query:'live music venues in London'},
  {label:'Berlin',query:'live music venues in Berlin'},
  {label:'New York',query:'live music venues in New York'},
  {label:'Tokyo',query:'live music venues in Tokyo'}
];

export default function GoogleMapView(){
  const[city,setCity]=useState(cities[0]);
  const src=useMemo(()=>`https://www.google.com/maps?q=${encodeURIComponent(city.query)}&output=embed`,[city]);
  const openUrl=useMemo(()=>`https://www.google.com/maps/search/${encodeURIComponent(city.query)}`,[city]);
  return <div className='googleMapScreen'><div className='mapTop'><span className='badge green'>Google Map</span><span className='badge'>Live venues</span></div><div className='mapFilters'>{cities.map(c=><button key={c.label} className={city.label===c.label?'on':''} onClick={()=>setCity(c)}>{c.label}</button>)}</div><div className='googleMapEmbed'><iframe title='SoundMatch Live Google venues map' src={src} loading='lazy' allowFullScreen referrerPolicy='no-referrer-when-downgrade'/></div><section className='panel mapCard'><span className='badge blue'>Embedded search</span><h3>{city.query}</h3><p>Google Maps embedded directly. Use the map to explore venues; open full Google Maps for deeper search, directions and details.</p><button className='primary' onClick={()=>window.open(openUrl,'_blank','noopener,noreferrer')}>Open full map</button></section></div>;
}
