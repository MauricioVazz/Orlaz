"use client";
import React, { useState, useEffect } from "react";
import buildUrl from "@/lib/api";
import styles from "./Gastronomy.module.css";

export default function Gastronomy({
  title,
  subtitle,
  items = [],
  buttonLabel,
  onButtonClick,
  fetchUrl,
  initialCount = 6,
  increment = 4,
  showLessLabel = "Ver Menos",
  onShowLess,
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [remoteItems, setRemoteItems] = useState(items || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Determine which source to use (remoteItems after fetch, otherwise fallback items prop)
  const sourceItems =
    remoteItems && remoteItems.length > 0 ? remoteItems : items || [];

  // Fetch from backend when component mounts. Accepts optional `fetchUrl` prop.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        // Build effective URL using shared helper. If fetchUrl is already absolute
        // (starts with http) use it as-is; otherwise build with buildUrl so we
        // respect NEXT_PUBLIC_API_BASE and avoid double-prefixing.
        let url;
        if (fetchUrl) {
          if (
            fetchUrl.startsWith("http://") ||
            fetchUrl.startsWith("https://")
          ) {
            url = fetchUrl;
          } else {
            url = buildUrl(fetchUrl);
          }
        } else {
          url = buildUrl("/gastronomy");
        }
        console.log("[Gastronomy] fetching from", url);
        const resp = await fetch(url);

        if (!resp.ok) {
          // tenta parsear JSON de erro, senão usa text
          let parsed = "";
          try {
            const json = await resp.json();
            parsed = json?.error || JSON.stringify(json);
          } catch {
            parsed = await resp.text().catch(() => "");
          }
          console.warn("[Gastronomy] fetch failed", resp.status, parsed);
          if (!cancelled) {
            setError(parsed || `Erro HTTP ${resp.status}`);
            setRemoteItems([]); // fallback vazio
          }
          return;
        }

        const data = await resp.json();
        if (!cancelled) {
          setRemoteItems(Array.isArray(data) ? data : data.items || []);
        }
      } catch (err) {
        console.error("[Gastronomy] fetch error", err);
        if (!cancelled)
          setError("Erro ao carregar gastronomias. Tente novamente.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // adicione reloadKey e demais dependências reais do seu fetch
  }, [fetchUrl, reloadKey]);

  // função de retry simples (pode ser usada no render)
  const retry = () => setReloadKey((k) => k + 1);

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
      {error && (
        <div className={styles.error}>
          Erro: {error}
          <button onClick={retry} className={styles.retryButton}>
            Tentar novamente
          </button>
        </div>
      )}

      <div className={styles.gastronomyGrid}>
        <div className={styles.leftColumn}>
          {leftItems.map((item, idx) => (
            <div key={idx} className={styles.gastronomyItem}>
              <img
                src={item.image || item.imageUrl}
                alt={item.name}
                className={styles.gastronomyImg}
              />
              <div className={styles.gastronomyDescBox}>
                <h3 className={styles.gastronomyName}>{item.name}</h3>
                <p className={styles.gastronomyDesc}>
                  {item.desc || item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.rightColumn}>
          {rightItems.map((item, idx) => (
            <div key={idx} className={styles.gastronomyItem}>
              <img
                src={item.image || item.imageUrl}
                alt={item.name}
                className={styles.gastronomyImg}
              />
              <div className={styles.gastronomyDescBox}>
                <h3 className={styles.gastronomyName}>{item.name}</h3>
                <p className={styles.gastronomyDesc}>
                  {item.desc || item.description}
                </p>
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
