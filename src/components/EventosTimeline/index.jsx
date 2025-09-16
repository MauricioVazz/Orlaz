"use client";

import React from "react";
import styles from "./EventosTimeline.module.css";

export default function EventosTimeline({ eventos, cor }) {
  return (
    <section className={styles.timelineSection} style={{ background: cor }}>
      <h2 className={styles.titulo}>Eventos e Festivais</h2>

      <div className={styles.timeline}>
        {eventos.map((evento, index) => (
          <div key={index} className={styles.evento}>
            <div
              className={styles.iconWrapper}
              style={{ color: cor }}
            >
              {evento.icone}
            </div>
            <span className={styles.data}>{evento.data}</span>
            <span className={styles.nome}>{evento.nome}</span>
            {index < eventos.length - 1 && (
              <div className={styles.linha} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
