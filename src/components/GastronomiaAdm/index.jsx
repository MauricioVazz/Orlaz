"use client";

import React, { useState, useEffect } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from '../TuristicoAdm/City.module.css';
import buildUrl from '@/lib/api';

const cidades = [
  { label: 'Todas as cidades', value: 'Todas as cidades' },
  { label: 'Caraguatatuba', value: 'CARAGUATATUBA' },
  { label: 'Ubatuba', value: 'UBATUBA' },
  { label: 'Ilhabela', value: 'ILHABELA' },
  { label: 'São Sebastião', value: 'SAO_SEBASTIAO' }
];
const categorias = ['Todas as categorias', 'GASTRONOMIA', 'RESTAURANTE', 'BAR'];

export default function GastronomiaAdm(){
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
    fetch(`${API_BASE}/gastronomy`)
      .then(res => res.json())
      .then(data => {
        // Normalize multiple possible response shapes
        let items = [];
        if (Array.isArray(data)) items = data;
        else if (Array.isArray(data.gastronomies)) items = data.gastronomies;
        else if (Array.isArray(data.items)) items = data.items;
        else if (data.gastronomy) items = Array.isArray(data.gastronomy) ? data.gastronomy : [data.gastronomy];
        else if (data.gastronomies) items = data.gastronomies;
        else items = [];
        setCards(items);
      })
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

  // reset visible count when filters/search change
  useEffect(() => {
    setVisibleCount(6);
  }, [cidade, categoria, q]);

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este item de gastronomia?')) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      alert('Usuário não autenticado. Faça login.');
      return;
    }
    try {
      setDeleting(id);
      const url = buildUrl(`/gastronomy/${id}`);
      const res = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        const contentType = res.headers.get('content-type') || '';
        let j = {};
        if (contentType.includes('application/json')) j = await res.json().catch(() => ({}));
        else {
          const t = await res.text().catch(() => '');
          j = { error: t };
        }
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
            placeholder="Pesquisar gastronomia..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
        <select value={cidade} onChange={e => setCidade(e.target.value)}>
          {cidades.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div>
        <div className={styles.cardsGrid} role="list">
          {cardsFiltrados.slice(0, visibleCount).map((card, i) => (
            <div key={card.id || i} className={styles.card} role="listitem">
              {(() => {
                const imgSrc = card.imageUrl || card.image || (card.images && card.images[0] && (card.images[0].url || card.images[0]));
                return imgSrc ? (
                  <img src={imgSrc} alt={card.name} className={styles.cardImg} />
                ) : (
                  <div className={styles.cardImgPlaceholder}>Sem imagem</div>
                );
              })()}
              <div className={styles.cardInfo}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardCidade}>{card.city}</span>
                  <span className={styles.cardCategoria}>{card.type}</span>
                </div>
                <h3 className={styles.cardTitulo}>{card.name}</h3>
                <p className={styles.cardDescricao}>{card.description}</p>
                <div className={styles.cardActions}>
                  <Link href={`/AdmGastronomiaEdit?id=${card.id}`}>
                    <button className={styles.btnEditCity} aria-label={`Editar ${card.name}`}>Editar</button>
                  </Link>
                  <button
                    className={styles.btnDeleteCity}
                    onClick={() => handleDelete(card.id)}
                    disabled={deleting === card.id}
                    aria-label={`Excluir ${card.name}`}
                  >{deleting === card.id ? 'Excluindo...' : 'Excluir'}</button>
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
