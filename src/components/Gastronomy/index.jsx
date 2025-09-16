"use client";
import React, { useState } from 'react';
import styles from './Gastronomy.module.css';

export default function Gastronomy({ title, subtitle, items, buttonLabel, onButtonClick }) {
  const [visibleCount, setVisibleCount] = useState(6);

  // Alterna os itens entre as colunas (zig-zag)
  const visibleItems = items.slice(0, visibleCount);
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
    setVisibleCount((prev) => Math.min(prev + 4, items.length));
    if (onButtonClick) onButtonClick();
  };

  return (
    <section className={styles.gastronomySection}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
      <div className={styles.gastronomyGrid}>
        <div className={styles.leftColumn}>
          {leftItems.map((item, idx) => (
            <div key={idx} className={styles.gastronomyItem}>
              <img src={item.image} alt={item.name} className={styles.gastronomyImg} />
              <div className={styles.gastronomyDescBox}>
                <h3 className={styles.gastronomyName}>{item.name}</h3>
                <p className={styles.gastronomyDesc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.rightColumn}>
          {rightItems.map((item, idx) => (
            <div key={idx} className={styles.gastronomyItem}>
              <img src={item.image} alt={item.name} className={styles.gastronomyImg} />
              <div className={styles.gastronomyDescBox}>
                <h3 className={styles.gastronomyName}>{item.name}</h3>
                <p className={styles.gastronomyDesc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {buttonLabel && visibleCount < items.length && (
        <button className={styles.gastronomyButton} onClick={handleShowMore}>
          {buttonLabel}
        </button>
      )}
    </section>
  );
}
