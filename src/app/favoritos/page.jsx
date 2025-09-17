'use client';

import React from "react";
import styles from "./favoritos.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const favoritos = [
  {
    id: 1,
    cidade: "Caraguatatuba",
    titulo: "Molhes do Porto Novo",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imgAlt: "Molhes do Porto Novo",
    favorito: true,
  },
  {
    id: 2,
    cidade: "Ilhabela",
    titulo: "Praia do Jabaquara",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imgAlt: "Praia do Jabaquara",
    favorito: true,
  },
  {
    id: 3,
    cidade: "Ubatuba",
    titulo: "Praia Itamambuca",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imgAlt: "Praia Itamambuca",
    favorito: true,
  },
  {
    id: 4,
    cidade: "São Sebastião",
    titulo: "Praia da Baleia",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imgAlt: "Praia da Baleia",
    favorito: true,
  },
  {
    id: 5,
    cidade: "Caraguatatuba",
    titulo: "Praia",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imgAlt: "Praia",
    favorito: false,
  },
  {
    id: 6,
    cidade: "Caraguatatuba",
    titulo: "Praia",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imgAlt: "Praia",
    favorito: false,
  },
  {
    id: 7,
    cidade: "Caraguatatuba",
    titulo: "Praia",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imgAlt: "Praia",
    favorito: false,
  },
  {
    id: 8,
    cidade: "Caraguatatuba",
    titulo: "Praia",
    descricao: "Praias extensas, natureza exuberante e ótima infraestrutura turística.",
    imgAlt: "Praia",
    favorito: false,
  },
];

export default function MeusFavoritos() {
  const handleRemover = (id) => {
    console.log("Remover favorito id:", id);
  };

  const handleEditar = (id) => {
    console.log("Editar favorito id:", id);
  };

  return (
    <>
      <Header />
      <section className={styles.container}>
        <h1 className={styles.title}>Meus Favoritos</h1>
        <p className={styles.subtitle}>
          Aqui estão seus pontos turísticos favoritos do Litoral Norte. Lembre os lugares incríveis que deseja visitar novamente ou guardar para futuras viagens.
        </p>

        <div className={styles.cardsGrid}>
          {favoritos.map(({ id, cidade, titulo, descricao, imgAlt, favorito }) => (
            <div key={id} className={styles.card}>
              <div className={styles.imgContainer} aria-label={imgAlt}>
                <img
                  src="https://via.placeholder.com/320x180/1768f2/ffffff?text=Imagem"
                  alt={imgAlt}
                  className={styles.cardImg}
                />
                {favorito ? (
                  <button
                    className={styles.btnRemove}
                    aria-label={`Remover favorito: ${titulo}`}
                    onClick={() => handleRemover(id)}
                  >
                    ×
                  </button>
                ) : (
                  <button
                    className={styles.btnEdit}
                    aria-label={`Editar favorito: ${titulo}`}
                    onClick={() => handleEditar(id)}
                  >
                    ⚡
                  </button>
                )}
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
