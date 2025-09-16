"use client";
import React, { useState } from "react";
import styles from "./ilhabela.module.css";

const todasAtracoes = [
  {
    titulo: "Praia  do Bonete",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imagem: "/images/boneilha.png",
  },
  {
    titulo: "Praia  de Jabaquara",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imagem: "/images/jabailha.png",
  },
  {
    titulo: "Praia do Julião",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imagem: "/images/juilha.png",
  },
  {
    titulo: "Baía de Castelhados",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imagem: "/images/casteilha.png",
  },
  {
    titulo: "Praia do Curral - Ilhabela",
    descricao: "Uma das mais famosas da ilha, com ótima estrutura de bares e mar perfeito para banho.",
    imagem: "/images/curralilha.jpg",
  },
  {
    titulo: "Praia da Feiticeira - Ilhabela",
    descricao: "Pequena e charmosa, com mar calmo e rodeada por muito verde, ideal para relaxar.",
    imagem: "/images/feitiilha.jpg",
  },
];

export default function AtracoesBela() {
  const [visiveis, setVisiveis] = useState(4);

  const handleMore = () => {
    setVisiveis((prev) => prev + 2); // mostra +2 cards a cada clique
  };

  return (
    <section className={styles.container}>
      <h1 className={styles.titulo}>Principais Atrações</h1>
      <p className={styles.subtitulo}>
        Locais mais bem avaliados por nossos usuários
      </p>

      <div className={styles.cards}>
        {todasAtracoes.slice(0, visiveis).map((atracao, i) => (
          <div key={i} className={styles.card}>
            <img
              src={atracao.imagem}
              alt={atracao.titulo}
              className={styles["card-img"]}
            />
            <div className={styles["card-info"]}>
              <div className={styles["card-header"]}>
                <h3>{atracao.titulo}</h3>
                <span className={styles.nota}>★</span>
              </div>
              <p>{atracao.descricao}</p>
              <button className={styles["btn-vermais"]}>Ver Mais</button>
            </div>
          </div>
        ))}
      </div>

      {visiveis < todasAtracoes.length && (
        <div className={styles.moreWrapper}>
          <button className={styles.moreButton} onClick={handleMore}>
            Mais Atrações
          </button>
        </div>
      )}
    </section>
  );
}