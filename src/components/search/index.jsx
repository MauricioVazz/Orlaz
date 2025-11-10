"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function TouristSpotSearch({
  placeholder = 'Buscar pontos turísticos...',
  onSelect,
  apiBase, // optional, e.g. process.env.NEXT_PUBLIC_API_BASE
  minChars = 2,
  debounceMs = 300,
  initialLimit = 8,
  className,
  renderItem,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(initialLimit); // items por request/sugestão
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const abortRef = useRef(null);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const rootRef = useRef(null);
  const cacheRef = useRef(new Map());

  // Config
  const API_BASE = apiBase || process.env.NEXT_PUBLIC_API_BASE || '';
  const API = `${API_BASE.replace(/\/$/, '')}/tourist-spot/search`.replace(/^\//, '');

  // fetchResults is stable across renders
  const fetchResults = useCallback(async (q, pageToFetch = 1) => {
    if (!q || q.trim().length < minChars) return;

    // check cache
    const cacheKey = `${q}|${pageToFetch}|${limit}`;
    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      setResults(prev => (pageToFetch > 1 ? [...prev, ...cached.items] : cached.items));
      setTotal(cached.total);
      setPage(cached.page);
      setOpen(true);
      return;
    }

    // abort previous
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const params = new URLSearchParams({ q: q, page: pageToFetch, limit: String(limit) });
      // ensure API has protocol if not provided
      const url = API.startsWith('http') ? `${API}?${params.toString()}` : `${window.location.origin}${API.startsWith('/') ? '' : '/'}${API}?${params.toString()}`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) {
        if (pageToFetch === 1) setResults([]);
        setTotal(0);
        setOpen(false);
        setLoading(false);
        return;
      }
      const json = await res.json();
      const items = json.items || json.results || [];

      setResults(prev => (pageToFetch > 1 ? [...prev, ...items] : items));
      setTotal(json.total ?? 0);
      setPage(json.page ?? pageToFetch);
      setOpen(true);

      cacheRef.current.set(cacheKey, { items, total: json.total ?? 0, page: json.page ?? pageToFetch });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Search error', err);
      }
    } finally {
      setLoading(false);
    }
  }, [API, limit, minChars]);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (!query || query.trim().length < minChars) {
      setResults([]);
      setTotal(0);
      setOpen(false);
      setPage(1);
      setActiveIndex(-1);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResults(query, 1);
    }, debounceMs);
  }, [query, debounceMs, fetchResults, minChars]);

  // close when clicking outside
  useEffect(() => {
    const onDoc = (ev) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(ev.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
    };
  }, []);

  const handleSelect = (item) => {
    setQuery(item.name);
    setOpen(false);
    setActiveIndex(-1);
    if (onSelect) onSelect(item);
  };

  const loadMore = () => {
    const next = page + 1;
    fetchResults(query, next);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      setActiveIndex(-1);
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        handleSelect(results[activeIndex]);
      }
    }
  };

  return (
    <div ref={rootRef} className={className} style={{ position: 'relative', maxWidth: 640 }}>
      <input
        ref={inputRef}
        type="search"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (results.length) setOpen(true); }}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="search-listbox"
        aria-activedescendant={activeIndex >= 0 && results[activeIndex] ? `search-item-${results[activeIndex].id}` : undefined}
        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc' }}
      />

      {loading && <div style={{ position: 'absolute', right: 12, top: 10 }}>⏳</div>}

      {open && (
        <div
          id="search-listbox"
          role="listbox"
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            background: '#fff',
            boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            borderRadius: 6,
            zIndex: 30,
            maxHeight: 320,
            overflow: 'auto',
          }}
        >
          {results.length === 0 && !loading ? (
            <div style={{ padding: 12, color: '#666' }}>Nenhum resultado</div>
          ) : (
            <>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {results.map((r, idx) => (
                  <li
                    key={r.id}
                    id={`search-item-${r.id}`}
                    role="option"
                    aria-selected={activeIndex === idx}
                    onClick={() => handleSelect(r)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    style={{
                      padding: 12,
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      background: activeIndex === idx ? '#f7f9fc' : 'transparent',
                    }}
                  >
                    {renderItem ? (
                      renderItem(r)
                    ) : (
                      <>
                        <div style={{ fontWeight: 600 }}>{r.name}</div>
                        <div style={{ fontSize: 13, color: '#666' }}>{r.city} — {r.type}</div>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {total > results.length && (
                <div style={{ padding: 8, display: 'flex', justifyContent: 'center' }}>
                  <button onClick={loadMore} style={{ padding: '6px 12px', borderRadius: 6 }}>
                    Carregar mais
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}