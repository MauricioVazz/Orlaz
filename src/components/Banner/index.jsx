"use client";
import React, { useState } from "react";
import { FaInfoCircle, FaUsers, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import styles from "./SobreCidade.module.css";

const SobreCidade = ({ nome, descricao, curiosidades, populacao, area, melhorEpoca, mapaUrl }) => {
  const [popup, setPopup] = useState(null);

  const handleClick = (tipo) => {
    setPopup(popup === tipo ? null : tipo); // abre/fecha
  };

  return (
    <section className={styles.sobreCidadeSection}>
      <div className={styles.sobreCidadeGrid}>
        {/* Texto */}
        <div>
          <h2 className={styles.titulo}>Sobre {nome}</h2>
          <p className={styles.descricao}>{descricao}</p>

          {curiosidades && (
            <div className={styles.curiosidades}>
              <FaInfoCircle className={styles.iconeInfo} />
              <span className={styles.curiosidadesTexto}>{curiosidades}</span>
            </div>
          )}

          {/* Ícones com popups */}
          <div className={styles.infoGrid}>
            <div className={styles.infoItem} onClick={() => handleClick("populacao")}>
              <FaUsers className={styles.icone} />
              <span className={styles.infoTexto}>População</span>
              {popup === "populacao" && (
                <div className={styles.popup}>{populacao}</div>
              )}
            </div>

            <div className={styles.infoItem} onClick={() => handleClick("area")}>
              <FaMapMarkerAlt className={styles.icone} />
              <span className={styles.infoTexto}>Área</span>
              {popup === "area" && (
                <div className={styles.popup}>{area}</div>
              )}
            </div>

            <div className={styles.infoItem} onClick={() => handleClick("melhorEpoca")}>
              <FaCalendarAlt className={styles.icone} />
              <span className={styles.infoTexto}>Melhor Época</span>
              {popup === "melhorEpoca" && (
                <div className={styles.popup}>{melhorEpoca}</div>
              )}
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div>
          <iframe
            src={mapaUrl}
            className={styles.mapa}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa de ${nome}`}
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default SobreCidade;
