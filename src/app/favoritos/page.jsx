'use client';

import React from "react";
import styles from "./favoritos.module.css";
import Headerblue from "@/components/HeaderBlue";
import Footer from "@/components/Footer";

const favoritos = [
  // Caraguatatuba
  {
    id: 1,
    cidade: "Caraguatatuba",
    titulo: "Praia Martim de Sá",
    descricao: "Mais famosa da cidade, com quiosques e mar agitado, ideal para surfistas.",
    imgAlt: "Praia Martim de Sá",
    imagem: "/images/martim.jpg",
    favorito: true,
  },
  {
    id: 2,
    cidade: "Caraguatatuba",
    titulo: "Morro Santo Antônio",
    descricao: "Mirante com vista panorâmica da cidade e ponto de voo livre.",
    imgAlt: "Morro Santo Antônio",
    imagem: "/images/santo.jpg",
    favorito: true,
  },
  // Ilhabela
  {
    id: 3,
    cidade: "Ilhabela",
    titulo: "Praia do Curral",
    descricao: "Uma das praias mais bonitas, com águas cristalinas e ótima para mergulho.",
    imgAlt: "Praia do Curral",
    imagem: "/images/curralilha.jpg",
    favorito: true,
  },
  {
    id: 4,
    cidade: "Ilhabela",
    titulo: "Baía de Castelhados",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imgAlt: "Baía de Castelhados",
    imagem: "/images/casteilha.png",
    favorito: true,
  },
  // Ubatuba
  {
    id: 5,
    cidade: "Ubatuba",
    titulo: "Praia do Português",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imgAlt: "Praia do Português",
    imagem: "/images/portuuba.png",
    favorito: true,
  },
  {
    id: 6,
    cidade: "Ubatuba",
    titulo: "Projeto TAMAR",
    descricao: "Centro de preservação de tartarugas marinhas com exposições e atividades educativas.",
    imgAlt: "Projeto TAMAR",
    imagem: "/images/projetouba.jpg",
    favorito: true,
  },
  // São Sebastião
  {
    id: 7,
    cidade: "São Sebastião",
    titulo: "Praia de Maresias",
    descricao: "Famosa praia com ondas perfeitas para surf e vida noturna agitada.",
    imgAlt: "Praia de Maresias",
    imagem: "/images/mareseba.png",
    favorito: true,
  },
  {
    id: 8,
    cidade: "São Sebastião",
    titulo: "Centro Histórico",
    descricao: "Construções coloniais preservadas e importante patrimônio cultural.",
    imgAlt: "Centro Histórico",
    imagem: "/images/histoseba.png",
    favorito: true,
  },
];

export default function MeusFavoritos() {
  const handleRemover = (id) => {
    console.log("Remover favorito id:", id);
  };

  return (
    <>
      <Headerblue />
      <section className={styles.container}>
        <h1 className={styles.title}>Meus Favoritos</h1>
        <p className={styles.subtitle}>
          Aqui estão seus pontos turísticos favoritos do Litoral Norte. Lembre os lugares incríveis que deseja visitar novamente ou guardar para futuras viagens.
        </p>

        <div className={styles.cardsGrid}>
          {favoritos.map(({ id, cidade, titulo, descricao, imgAlt, imagem }) => (
            <div key={id} className={styles.card}>
              <div className={styles.imgContainer} aria-label={imgAlt}>
                <img
                  src={imagem}
                  alt={imgAlt}
                  className={styles.cardImg}
                />
                <button
                  className={styles.btnFavorito}
                  aria-label={`Remover dos favoritos: ${titulo}`}
                  onClick={() => handleRemover(id)}
                >
                  <div className={styles.iconWrapper}>
                    <span className={styles.starIcon}>★</span>
                    <span className={styles.removeIcon}>×</span>
                  </div>
                </button>
              </div>

              <div className={styles.cardContent}>
                <p className={styles.cidade}><span role="img" aria-label="localização">📍</span> {cidade}</p>
                <strong className={styles.cardTitle}>{titulo}</strong>
                <p className={styles.cardDesc}>{descricao}</p>
                <button className={styles.btnVerMais}>Ver Mais</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
