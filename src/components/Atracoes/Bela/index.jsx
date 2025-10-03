"use client";
import React, { useState, useEffect } from "react";
import styles from "./ilhabela.module.css";

export default function AtracoesBela() {
  const [atracoes, setAtracoes] = useState([]);
  const [visiveis, setVisiveis] = useState(4);

  useEffect(() => {
    fetch("http://localhost:3000/tourist-spot?city=ILHABELA")
      .then(res => res.json())
      .then(data => {
        const atracoesIlhabela = (data.touristSpots || []).filter(a => a.city === "ILHABELA");
        setAtracoes(atracoesIlhabela);
      });
  }, []);

  const handleMore = () => {
    setVisiveis((prev) => prev + 2);
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.titulo}>Principais Atrações</h1>
      <p className={styles.subtitulo}>
        Locais mais bem avaliados por nossos usuários
      </p>

      <div className={styles.cards}>
        {atracoes.slice(0, visiveis).map((atracao, i) => (
          <div key={atracao.id || i} className={styles.card}>
            <img
              src={atracao.images && atracao.images.length > 0 ? atracao.images[0].url : "/images/sem-imagem.png"}
              alt={atracao.name}
              className={styles["card-img"]}
            />
            <div className={styles["card-info"]}>
              <div className={styles["card-header"]}>
                <h3>{atracao.name}</h3>
                <span className={styles.nota}>★</span>
              </div>
              <p>{atracao.description}</p>
              <button className={styles["btn-vermais"]}>Ver Mais</button>
            </div>
          </div>
        ))}
      </div>

      {visiveis < atracoes.length && (
        <div className={styles.moreWrapper}>
          <button className={styles.moreButton} onClick={handleMore}>
            Mais Atrações
          </button>
        </div>
      )}
    </section>
  );
}