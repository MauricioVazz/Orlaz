'use client';

import dynamic from 'next/dynamic';

const LocationMap = dynamic(
  () => import('@/components/Location'),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        height: "min(450px, 70vh)",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        Carregando mapa...
      </div>
    )
  }
);

export default function LocationClient() {
  return <LocationMap />;
}
