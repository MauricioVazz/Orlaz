"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import styles from "./saosebastiao.module.css";

export default function AtracoesSaosebastiao() {
  const [atracoes, setAtracoes] = useState([]);
  const [visiveis, setVisiveis] = useState(4);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
    fetch(`${API_BASE}/tourist-spot?city=SAO_SEBASTIAO`)
      .then(res => res.json())
      .then(data => {
        const atracoesSeba = (data.touristSpots || []).filter(a => a.city === "SAO_SEBASTIAO");
        setAtracoes(atracoesSeba);
      })
      .catch(() => setAtracoes([]));
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
              </div>
              <p>{atracao.description}</p>
              <Link
                href={{
                  pathname: '/Point',
                  query: {
                    id: atracao.id,
                    name: atracao.name,
                    description: atracao.description,
                    city: atracao.city,
                    type: atracao.type,
                    images: JSON.stringify(atracao.images || [])
                  }
                }}
                className={styles["btn-vermais"]}
              >
                Ver Mais
              </Link>
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
