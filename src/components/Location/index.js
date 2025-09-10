"use client";

import styles from './Location.module.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícone padrão do Leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Cidades principais com nome e localização
const cidades = [
  {
    nome: "Ubatuba",
    position: [-23.4335, -45.0834],
    descricao: "Acesso pela BR-101. Natureza exuberante e muitas praias.",
  },
  {
    nome: "Caraguatatuba",
    position: [-23.6209, -45.4126],
    descricao: "Bem localizada, ideal para explorar todo o Litoral Norte.",
  },
  {
    nome: "São Sebastião",
    position: [-23.78, -45.41],
    descricao: "Conecta ao continente e à balsa para Ilhabela.",
  },
  {
    nome: "Ilhabela",
    position: [-23.7786, -45.3581],
    descricao: "Ilha paradisíaca acessada por balsa a partir de São Sebastião.",
  },
];

const Location = () => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Como Chegar</h2>
      <p className={styles.subtitle}>Descubra o que fazer no Litoral Norte além de tomar sol</p>

      <div className={styles.mapContainer}>
        <MapContainer
          center={[-23.6, -45.3]}
          zoom={10}
          scrollWheelZoom={false}
          style={{ height: "450px", width: "100%", borderRadius: "12px" }}
          className={styles.satelliteMap}
        >
          {/* Mapa de satélite da Esri */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>, Earthstar Geographics'
          />

          {/* Marcadores das cidades */}
          {cidades.map(({ nome, position, descricao }) => (
            <Marker key={nome} position={position} icon={markerIcon}>
              <Popup>
                <strong>{nome}</strong><br />
                {descricao}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
};

export default Location;
