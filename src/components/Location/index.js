"use client";

import styles from "./Location.module.css";
import dynamic from "next/dynamic";

// Carrega o mapa só no cliente
const Map = dynamic(() => import("./Map"), { ssr: false });

export default function Location() {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Como Chegar</h2>
      <p className={styles.subtitle}>
        Descubra o que fazer no Litoral Norte além de tomar sol
      </p>

      <div className={styles.mapContainer}>
        <Map />
      </div>
    </section>
  );
}
