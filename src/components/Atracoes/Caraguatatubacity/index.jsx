import React from 'react';
import styles from './caraguatatuba.module.css';

const atracoesCaraguatatuba = [
  {
    titulo: 'Praia Martim de Sá',
    descricao: 'Mais famosa da cidade, com quiosques e mar agitado.',
    imagem: '/images/martim.jpg',
  },
  {
    titulo: 'Praia da Cocanha',
    descricao: 'Familiar, águas calmas e acesso à Ilha da Cocanha.',
    imagem: '/images/cocanha.jpg',
  },
  {
    titulo: 'Morro Santo Antônio',
    descricao: 'Mirante com vista panorâmica e voo livre.',
    imagem: '/images/morro.jpg',
  },
  {
    titulo: 'Parque Estadual da Serra do Mar',
    descricao: 'Trilhas, cachoeiras e natureza preservada.',
    imagem: '/images/parque.jpg',
  },
];

export default function AtracoesCaraguatatuba() {  // Nome correto do componente
  return (
    <section className={styles.atracoesSection}>
      <h2>Principais Atrações de Caraguatatuba</h2>
      <div className={styles.cards}>
        {atracoesCaraguatatuba.map((atracao, i) => (
          <div key={i} className={styles.card}>
            <img
              src={atracao.imagem}
              alt={atracao.titulo}
              className={styles.cardImage}
            />
            <h3>{atracao.titulo}</h3>
            <p>{atracao.descricao}</p>
            <button className={styles.cardButton}>Ver Mais</button>
          </div>
        ))}
      </div>
    </section>
  );
}
