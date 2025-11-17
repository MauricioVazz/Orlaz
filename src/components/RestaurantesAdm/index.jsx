"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { useSearchParams } from 'next/navigation';
import styles from '../TuristicoAdm/City.module.css';
import Link from 'next/link';
import buildUrl from '@/lib/api';

const cidades = [
  { label: 'Todas as cidades', value: 'Todas as cidades' },
  { label: 'Caraguatatuba', value: 'CARAGUATATUBA' },
  { label: 'Ubatuba', value: 'UBATUBA' },
  { label: 'Ilhabela', value: 'ILHABELA' },
  { label: 'São Sebastião', value: 'SAO_SEBASTIAO' }
];
const categorias = ['Todas as categorias', 'RESTAURANTE', 'BAR', 'GASTRONOMIA'];

export default function RestaurantesAdm() {
  const searchParams = useSearchParams();
  const cityFromQuery = searchParams.get('city');
  const [cidade, setCidade] = useState(cityFromQuery || 'Todas as cidades');
  const [categoria, setCategoria] = useState('Todas as categorias');
  const [cards, setCards] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const containerRef = useRef(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
    fetch(`${API_BASE}/restaurant`)
      .then(res => res.json())
      .then(data => setCards(data.restaurants || data.items || []))
      .catch(() => setCards([]));
  }, []);

  useEffect(() => {
    if (cityFromQuery && cidades.some(c => c.value === cityFromQuery)) {
      setCidade(cityFromQuery);
    }
  }, [cityFromQuery]);

  const cardsFiltrados = cards.filter(card =>
    (cidade === 'Todas as cidades' || card.city === cidade)
    && (categoria === 'Todas as categorias' || card.type === categoria)
    && (q.trim() === '' || `${card.name} ${card.description}`.toLowerCase().includes(q.toLowerCase()))
  );

  const scroll = (dir = 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este restaurante?')) return;
    try {
      setDeleting(id);
      const url = buildUrl(`/restaurant/${id}`);
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j?.error || 'Erro ao deletar.');
        setDeleting(null);
        return;
      }
      setCards(prev => prev.filter(c => c.id !== id));
      setDeleting(null);
    } catch (err) {
      console.error('delete error', err);
      alert('Erro ao deletar.');
      setDeleting(null);
    }
  };

  return (
    <section className={styles.sectionCidades}>
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <IoSearchOutline className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Pesquisar restaurantes..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
        <select value={cidade} onChange={e => setCidade(e.target.value)}>
          {cidades.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <select value={categoria} onChange={e => setCategoria(e.target.value)}>
          {categorias.map(cat => <option key={cat}>{cat}</option>)}
        </select>
      </div>
      <div className={styles.carouselWrap}>
        <button aria-label="Scroll left" className={styles.carouselNav} onClick={()=>scroll('left')}>◀</button>
        <div ref={containerRef} className={styles.cardsGrid} role="list">
          {cardsFiltrados.map((card, i) => (
            <div key={card.id || i} className={styles.card} role="listitem">
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
                <div className={styles.cardActions}>
                  <Link 
                  href={{
                    pathname: '/Point',
                    query: {
                      name: card.name,
                      description: card.description,
                      city: card.city,
                      type: card.type,
                      images: JSON.stringify(card.images || [])
                    }
                  }} 
                  className={styles.btnVerMaisCity}
                >Ver Mais</Link>
                  <button
                    className={styles.btnDeleteCity}
                    onClick={()=>handleDelete(card.id)}
                    disabled={deleting===card.id}
                    aria-label={`Excluir ${card.name}`}
                  >{deleting===card.id ? 'Excluindo...' : 'Excluir'}</button>
                </div>
            </div>
            </div>
          ))}
        </div>
        <button aria-label="Scroll right" className={styles.carouselNav} onClick={()=>scroll('right')}>▶</button>
      </div>
    </section>
  );
}
