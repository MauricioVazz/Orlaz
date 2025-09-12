import React, { useState } from "react";
import styles from "./caraguatatuba.module.css";

const todasAtracoes = [
  {
    titulo: "Praia Martim de Sá",
    descricao: "Mais famosa da cidade, com quiosques e mar agitado.",
    imagem: "/images/martim.jpg",
  },
  {
    titulo: "Praia da Cocanha",
    descricao: "Familiar, águas calmas e acesso à Ilha da Cocanha.",
    imagem: "/images/cocanha.jpg",
  },
  {
    titulo: "Morro Santo Antônio",
    descricao: "Mirante com vista panorâmica e voo livre.",
    imagem: "/images/santo.jpg",
  },
  {
    titulo: "Parque Estadual da Serra do Mar",
    descricao: "Trilhas, cachoeiras e natureza preservada.",
    imagem: "/images/parque.jpg",
  },
  {
    titulo: "Praia Brava",
    descricao: "Perfeita para surfistas e aventureiros.",
    imagem: "/images/brava.jpg",
  },
  {
    titulo: "Praia do Indaiá",
    descricao: "Ótima para famílias com crianças.",
    imagem: "/images/indaia.jpg",
  },
];

export default function AtracoesCaraguatatuba() {
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
