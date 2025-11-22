"use client";

import React, { useState, useEffect } from 'react';
import { IoSearchOutline, IoTrashOutline } from 'react-icons/io5';
import { useSearchParams } from 'next/navigation';
import styles from './City.module.css';
import Link from 'next/link';
import buildUrl from '@/lib/api';

const cidades = [
  { label: 'Todas as cidades', value: 'Todas as cidades' },
  { label: 'Caraguatatuba', value: 'CARAGUATATUBA' },
  { label: 'Ubatuba', value: 'UBATUBA' },
  { label: 'Ilhabela', value: 'ILHABELA' },
  { label: 'São Sebastião', value: 'SAO_SEBASTIAO' }
];
const categorias = ['Todas as categorias', 'PRAIA', 'URBANO', 'NATUREZA'];

export default function TuristicoAdm() {
  const searchParams = useSearchParams();
  const cityFromQuery = searchParams.get('city');
  const [cidade, setCidade] = useState(cityFromQuery || 'Todas as cidades');
  const [categoria, setCategoria] = useState('Todas as categorias');
  const [cards, setCards] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [q, setQ] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
    fetch(`${API_BASE}/tourist-spot`)
      .then(res => res.json())
      .then(data => setCards(data.touristSpots || data.items || []))
      .catch(() => setCards([]));
  }, []);

  // Atualiza o filtro de cidade se vier da query string
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

  // reset visible count when filters/search change
  useEffect(() => {
    setVisibleCount(6);
  }, [cidade, categoria, q]);

  // No carousel: simple static grid (two rows) is used now.

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este ponto turístico?')) return;
    try {
      setDeleting(id);
      const url = buildUrl(`/tourist-spot/${id}`);
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j?.error || 'Erro ao deletar.');
        setDeleting(null);
        return;
      }
      // remove do state
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
            placeholder="Pesquisar pontos..."
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
      <div>
        <div className={styles.cardsGrid} role="list">
          {cardsFiltrados.slice(0, visibleCount).map((card, i) => (
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

        <div className={styles.moreRow}>
          {cardsFiltrados.length > 6 && (
            <button
              type="button"
              className={styles.moreLink}
              onClick={() => {
                if (visibleCount < cardsFiltrados.length) {
                  setVisibleCount(prev => Math.min(prev + 6, cardsFiltrados.length));
                } else {
                  setVisibleCount(6);
                }
              }}
            >
              {visibleCount < cardsFiltrados.length ? 'Ver Mais' : 'Mostrar menos'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}