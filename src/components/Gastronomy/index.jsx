"use client";
import React, { useState } from 'react';
import styles from './Gastronomy.module.css';

export default function Gastronomy({ title, subtitle, items = [], buttonLabel, onButtonClick, fetchUrl, initialCount = 6, increment = 4, showLessLabel = 'Ver Menos', onShowLess }) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [remoteItems, setRemoteItems] = useState(items || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine which source to use (remoteItems after fetch, otherwise fallback items prop)
  const sourceItems = remoteItems && remoteItems.length > 0 ? remoteItems : items || [];

  // Fetch from backend when component mounts. Accepts optional `fetchUrl` prop.
  React.useEffect(() => {
    let aborted = false;
    const url = fetchUrl || '/gastronomy';
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();

        // backend may return different shapes: { restaurants: [...] } or { gastronomies: [...] } or the array directly
        let list = data && (data.restaurants || data.gastronomies || data.gastronomy || data);

        // If the server returned an object for a single item, wrap it
        if (list && !Array.isArray(list) && typeof list === 'object') {
          // if the object looks like { id, name, ... } treat as single entry
          if (list.id || list.name) list = [list];
          else list = [];
        }

        if (!aborted) setRemoteItems(Array.isArray(list) ? list : []);
      } catch (err) {
        if (!aborted) setError(err.message || 'Erro ao buscar gastronomias');
      } finally {
        if (!aborted) setLoading(false);
      }
    }

    // Only fetch if a fetchUrl was provided or items prop is empty
    if (fetchUrl || (items == null || items.length === 0)) {
      load();
    }

    return () => {
      aborted = true;
    };
  }, [fetchUrl]);

  // Alterna os itens entre as colunas (zig-zag)
  const visibleItems = sourceItems.slice(0, visibleCount);
  const leftItems = [];
  const rightItems = [];
  visibleItems.forEach((item, idx) => {
    if (idx % 2 === 0) {
      leftItems.push(item);
    } else {
      rightItems.push(item);
    }
  });

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + increment, sourceItems.length));
    if (onButtonClick) onButtonClick();
  };

  const handleShowLess = () => {
    setVisibleCount((prev) => Math.max(initialCount, prev - increment));
    if (onShowLess) onShowLess();
  };

  return (
    <section className={styles.gastronomySection}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>

      {loading && <div className={styles.loading}>Carregando...</div>}
      {error && <div className={styles.error}>Erro: {error}</div>}

      <div className={styles.gastronomyGrid}>
        <div className={styles.leftColumn}>
          {leftItems.map((item, idx) => (
            <div key={idx} className={styles.gastronomyItem}>
              <img src={item.image || item.imageUrl} alt={item.name} className={styles.gastronomyImg} />
              <div className={styles.gastronomyDescBox}>
                <h3 className={styles.gastronomyName}>{item.name}</h3>
                <p className={styles.gastronomyDesc}>{item.desc || item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.rightColumn}>
          {rightItems.map((item, idx) => (
            <div key={idx} className={styles.gastronomyItem}>
              <img src={item.image || item.imageUrl} alt={item.name} className={styles.gastronomyImg} />
              <div className={styles.gastronomyDescBox}>
                <h3 className={styles.gastronomyName}>{item.name}</h3>
                <p className={styles.gastronomyDesc}>{item.desc || item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.gastronomyButtons}>
        {visibleCount > initialCount && (
          <button className={styles.gastronomyButton} onClick={handleShowLess}>
            {showLessLabel}
          </button>
        )}

        {buttonLabel && visibleCount < sourceItems.length && (
          <button className={styles.gastronomyButton} onClick={handleShowMore}>
            {buttonLabel}
          </button>
        )}
      </div>
    </section>
  );
}
