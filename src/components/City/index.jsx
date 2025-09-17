"use client";

import React, { useState } from 'react';
import styles from './City.module.css';


// Importa arrays de atrações de cada cidade


const cidades = ['Todas as cidades', 'Caraguatatuba', 'Ubatuba', 'Ilhabela', 'São Sebastião'];
const categorias = ['Todas as categorias', 'Praia', 'Urbano', 'Trilha', 'Cachoeira'];

export default function City() {
  const [cidade, setCidade] = useState('Todas as cidades');
  const [categoria, setCategoria] = useState('Todas as categorias');


  // Junta todas as atrações em um único array
  // Mock de cards para exibição
  const mockCards = Array.from({ length: 12 }).map((_, i) => ({
    cidade: 'Caraguatatuba',
    categoria: i % 2 === 0 ? 'Praia' : 'Urbano',
    titulo: `Praia aaaaaaaaaaaa`,
    descricao: 'Praia aaaaaaaaaaaa',
    key: i
  }));

  const filteredCards = mockCards.filter(card =>
    categoria === 'Todas as categorias' || card.categoria === categoria
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
            <div style={{ width: '100%', height: 120, background: '#3b59ff', borderRadius: 8, marginBottom: 12 }} />
            <div className={styles.cardInfo}>
              <div className={styles.cardHeader}>
                <span style={{ fontSize: 12, color: '#888' }}>{card.cidade}</span>
                <span style={{ fontSize: 12, color: '#888' }}>{card.categoria}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: '8px 0 4px 0' }}>{card.titulo}</h3>
              <p style={{ fontSize: 13, color: '#444', marginBottom: 8 }}>{card.descricao}</p>
              <button className={styles.btnVerMaisCity}>Ver Mais</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
