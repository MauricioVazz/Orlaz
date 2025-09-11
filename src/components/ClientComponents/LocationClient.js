'use client';

import dynamic from 'next/dynamic';

const LocationMap = dynamic(
  () => import('../Location'),
  { 
    ssr: false,
    loading: () => <div style={{height: "450px", display: "flex", alignItems: "center", justifyContent: "center"}}>Carregando mapa...</div>
  }
);

export default function LocationClient() {
  return <LocationMap />;
}
