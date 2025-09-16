"use client";
import React, { useState } from "react";
import styles from "./ubatuba.module.css";
const todasAtracoes = [
 
  {
    titulo: "Ruínas da Lagoinha",
    descricao: "História preservada, cenário único à beira-mar e uma experiência que mistura cultura, natureza e tranquilidade.",
    imagem: "/images/ruinauba.png",
  },
  {
    titulo: "Praia do Português",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imagem: "/images/portuuba.png",
  },
  {
    titulo: "Ilha das Couves",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imagem: "/images/couveuba.png",
  },
  {
    titulo: "Cachoeira do Prumirim",
    descricao: "Águas cristalinas, contato direto com a natureza e um refúgio perfeito para relaxar e renovar as energias.",
    imagem: "/images/cachouba.png",
  },
  {
    titulo: "Projeto TAMAR - Ubatuba",
    descricao: "Centro de preservação das tartarugas marinhas, com exposições e atividades educativas.",
    imagem: "/images/projetouba.jpg",
  },
  {
    titulo: "Praia de Itamambuca",
    descricao: "Famosa pelas ondas perfeitas para o surfe e pela natureza preservada.",
    imagem: "/images/itamamuba.jpg",
  },  
];

export default function atracoesUbatuba() {
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
