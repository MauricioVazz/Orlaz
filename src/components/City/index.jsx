"use client";

import React, { useState, useEffect } from 'react';
import styles from './City.module.css';
import Link from 'next/link';

const cidades = [
  { label: 'Todas as cidades', value: 'Todas as cidades' },
  { label: 'Caraguatatuba', value: 'CARAGUATATUBA' },
  { label: 'Ubatuba', value: 'UBATUBA' },
  { label: 'Ilhabela', value: 'ILHABELA' },
  { label: 'São Sebastião', value: 'SAO_SEBASTIAO' }
];
const categorias = ['Todas as categorias', 'PRAIA', 'URBANO', 'NATUREZA'];

export default function City() {
  const [cidade, setCidade] = useState('Todas as cidades');
  const [categoria, setCategoria] = useState('Todas as categorias');
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/tourist-spot') // corrigido para a rota correta
      .then(res => res.json())
      .then(data => setCards(data.touristSpots || []))
      .catch(() => setCards([]));
  }, []);

  const cardsFiltrados = cards.filter(card =>
    (cidade === 'Todas as cidades' || card.city === cidade)
    && (categoria === 'Todas as categorias' || card.type === categoria)
  );

  return (
    <section className={styles.sectionCidades}>
      {/* ...restante igual... */}
      <div className={styles.filters}>
        <select value={cidade} onChange={e => setCidade(e.target.value)}>
          {cidades.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select value={categoria} onChange={e => setCategoria(e.target.value)}>
          {categorias.map(cat => <option key={cat}>{cat}</option>)}
        </select>
      </div>
      <div className={styles.cardsGrid}>
        {cardsFiltrados.map((card, i) => (
          <div key={card.id || i} className={styles.card}>
            {card.images && card.images.length > 0 ? (
              <img
                src={card.images[0].url}
                alt={card.name}
                className={styles.cardImg}
              />
            ) : (
              <div className={styles.cardImgPlaceholder}>Sem imagem</div>
            )}
            <div className={styles.cardInfo}>
              <div className={styles.cardHeader}>
                <span className={styles.cardCidade}>{card.city}</span>
                <span className={styles.cardCategoria}>{card.type}</span>
              </div>
              <h3 className={styles.cardTitulo}>{card.name}</h3>
              <p className={styles.cardDescricao}>{card.description}</p>
              <Link href={`/Point/${card.id}`} className={styles.btnVerMaisCity}>Ver Mais</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}