"use client";
import React, { useState } from "react";
import styles from "./ilhabela.module.css";

const todasAtracoes = [
  {
    titulo: "Praia Martim de Sá",
    descricao: "Mais famosa da cidade, com quiosques e mar agitado.",
    imagem: "/images/martim.jpg",
  },
  {
    titulo: "Ruínas da Lagoinha",
    descricao: "História preservada, cenário único à beira-mar e uma experiência que mistura cultura, natureza e tranquilidade.",
    imagem: "/images/cocanha.jpg",
  },
  {
    titulo: "Praia do Português",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imagem: "/images/santo.jpg",
  },
  {
    titulo: "Ilha das Couves",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imagem: "/images/parque.jpg",
  },
  {
    titulo: "Cachoeira do Prumirim",
    descricao: "Águas cristalinas, contato direto com a natureza e um refúgio perfeito para relaxar e renovar as energias.",
    imagem: "/images/brava.jpg",
  },
  {
    titulo: "Praia do Indaiá",
    descricao: "Ótima para famílias com crianças.",
    imagem: "/images/indaia.jpg",
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