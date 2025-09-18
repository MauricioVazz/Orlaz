"use client";

import React, { useState } from 'react';
import styles from './City.module.css';
import Link from 'next/link';

// Importa arrays de atrações de cada cidade


const cidades = ['Todas as cidades', 'Caraguatatuba', 'Ubatuba', 'Ilhabela', 'São Sebastião'];
const categorias = ['Todas as categorias', 'Praia', 'Urbano', 'Trilha', 'Cachoeira'];

export default function City() {
  const [cidade, setCidade] = useState('Todas as cidades');
  const [categoria, setCategoria] = useState('Todas as categorias');


  // Junta todas as atrações em um único array
  // Mock de cards para exibição
  const cidadesMock = ['Caraguatatuba', 'Ubatuba', 'Ilhabela', 'São Sebastião'];
  const categoriasMock = ['Praia', 'Urbano', 'Trilha', 'Cachoeira'];
  const mockCards = Array.from({ length: 12 }).map((_, i) => ({
    cidade: cidadesMock[i % cidadesMock.length],
    categoria: categoriasMock[i % categoriasMock.length],
    titulo: `Praia aaaaaaaaaaaa`,
    descricao: 'Praia aaaaaaaaaaaa',
    key: i
  }));

  const filteredCards = mockCards.filter(card =>
    (cidade === 'Todas as cidades' || card.cidade === cidade) &&
    (categoria === 'Todas as categorias' || card.categoria === categoria)
  );
  return (
    <section className={styles.sectionCidades}>
      <h1>Descubra os Pontos Turísticos<br />do Litoral Norte</h1>
      <p className={styles.subtitle}>
        Encontre as principais atrações das cidades Ubatuba, Ilhabela, São Sebastião e Caraguatatuba, tudo em um só lugar
      </p>
      <div className={styles.filters}>
        <select value={cidade} onChange={e => setCidade(e.target.value)}>
          {cidades.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={categoria} onChange={e => setCategoria(e.target.value)}>
          {categorias.map(cat => <option key={cat}>{cat}</option>)}
        </select>
      </div>
      <div className={styles.cardsGrid}>
        {filteredCards.map((card, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardImgMock} />
            <div className={styles.cardInfo}>
              <div className={styles.cardHeader}>
                <span className={styles.cardCidade}>{card.cidade}</span>
                <span className={styles.cardCategoria}>{card.categoria}</span>
              </div>
              <h3 className={styles.cardTitulo}>{card.titulo}</h3>
              <p className={styles.cardDescricao}>{card.descricao}</p>
              <Link href="/Point" className={styles.btnVerMaisCity}>Ver Mais</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
