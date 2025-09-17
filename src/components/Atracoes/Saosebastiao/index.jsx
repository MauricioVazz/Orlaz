"use client";
import React, { useState } from "react";
import styles from "./saosebastiao.module.css";

export const todasAtracoes = [
  {
    titulo: "Centro Histórico",
    descricao: "Ruas coloniais, igrejas antigas e cultura local.",
    imagem: "/images/histoseba.png",
  },
  {
    titulo: "Praia de Juquehy",
    descricao: "Areia clara, boas ondas e opções de lazer.",
    imagem: "/images/juquehyseba.png",
  },
  {
    titulo: "Praia de Maresias",
    descricao: "Famosa pelo surf e vida noturna agitada.",
    imagem: "/images/mareseba.png",
  },
  {
    titulo: "Praia de Toque-Toque Grande",
    descricao: "Tranquilidade, mar calmo e boa para famílias.",
    imagem: "/images/toqueseba.png",
  },
  {
    titulo: "Praia de Camburi",
    descricao: "Mar agitado para o surfe, além de ótimos bares e restaurantes à beira-mar.",
    imagem: "/images/cambuseba.jpg",
  },
  {
    titulo: "Praia da Baleia",
    descricao: "Areia dura e extensa, ideal para caminhadas e esportes na praia.",
    imagem: "/images/baleiaseba.jpg",
  },
];

export default function AtracoesSaosebastiao() {
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
