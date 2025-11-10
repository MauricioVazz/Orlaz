"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ENV from '@/lib/env';

export default function TouristSpotSearch({
  placeholder = 'Buscar pontos turísticos...',
  onSelect,
  apiBase, // optional, e.g. process.env.NEXT_PUBLIC_API_BASE
  autoFocus = false,
  openOnMount = false,
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
  const instanceIdRef = useRef(`search-${Math.random().toString(36).slice(2,8)}`);

  // cap cache to avoid unbounded memory usage
  const CACHE_MAX = 80;

  // Config: prefer explicit prop, then public env, then localhost backend
  const API_BASE = apiBase || ENV.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
  const API = `${API_BASE.replace(/\/$/, '')}/tourist-spot/search`;

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
      const url = `${API}?${params.toString()}`;
      console.log('[Search] fetching', url);
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        console.warn('[Search] non-ok response', res.status, txt, url);
        if (pageToFetch === 1) setResults([]);
        setTotal(0);
        setOpen(false);
        setLoading(false);
        return;
      }
      const json = await res.json();
      console.debug('[Search] response json', json);

      // Accept several shapes returned by the backend
      let list = [];
      if (Array.isArray(json)) list = json;
      else if (json.items) list = json.items;
      else if (json.results) list = json.results;
      else if (json.restaurants) list = json.restaurants;
      else if (json.gastronomies) list = json.gastronomies;
      else if (json.touristSpots) list = json.touristSpots;
      else if (json.data) list = json.data;
      else if (json.length || json.id) list = json;

      if (list && !Array.isArray(list) && typeof list === 'object') {
        // wrap single object
        if (list.id || list.name) list = [list];
        else list = [];
      }

      const items = Array.isArray(list) ? list : [];
      const totalRes = json.total ?? items.length;

      setResults(prev => (pageToFetch > 1 ? [...prev, ...items] : items));
      setTotal(totalRes);
      setPage(json.page ?? pageToFetch);
      setOpen(true);

      // cache with cap
      cacheRef.current.set(cacheKey, { items, total: totalRes, page: json.page ?? pageToFetch });
      if (cacheRef.current.size > CACHE_MAX) {
        // remove oldest key
        const it = cacheRef.current.keys();
        const first = it.next().value;
        cacheRef.current.delete(first);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Search error', err);
      }
    } finally {
      setLoading(false);
    }
  }, [API, limit, minChars]);

  useEffect(() => {
    if ((autoFocus || openOnMount) && inputRef.current) {
      inputRef.current.focus();
      if (openOnMount && results.length) setOpen(true);
    }

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
        aria-controls={`${instanceIdRef.current}-listbox`}
        aria-activedescendant={activeIndex >= 0 && results[activeIndex] ? `${instanceIdRef.current}-item-${results[activeIndex].id}` : undefined}
        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc' }}
      />

      {loading && <div style={{ position: 'absolute', right: 12, top: 10 }}>⏳</div>}

      {open && (
        <div
          id={`${instanceIdRef.current}-listbox`}
          role="listbox"
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 'auto',
            minWidth: 420,
            background: '#fff',
            boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
            borderRadius: 8,
            zIndex: 60,
            maxHeight: 420,
            overflow: 'auto',
            paddingBottom: 8,
          }}
        >
          {/* Visible header to label the recommendations */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #eee', fontWeight: 700, fontSize: 14 }}>Recomendações</div>
          {results.length === 0 && !loading ? (
            <div style={{ padding: 12, color: '#666' }} aria-live="polite">Nenhum resultado</div>
          ) : (
            <>
              <ul style={{ listStyle: 'none', margin: 0, padding: 8 }}>
                {results.map((r, idx) => (
                  <li
                    key={r.id}
                    id={`${instanceIdRef.current}-item-${r.id}`}
                    role="option"
                    aria-selected={activeIndex === idx}
                    onClick={() => handleSelect(r)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderBottom: '1px solid #f5f7f9',
                      cursor: 'pointer',
                      background: activeIndex === idx ? '#f0f7ff' : 'transparent',
                    }}
                  >
                    {renderItem ? (
                      renderItem(r)
                    ) : (
                      <>
                        { (r.image || r.imageUrl) ? (
                          <img src={r.image || r.imageUrl} alt={r.name} style={{width:56,height:56,objectFit:'cover',borderRadius:6,flex:'0 0 56px'}} />
                        ) : (
                          <div style={{width:56,height:56,background:'#eef2f6',borderRadius:6,flex:'0 0 56px'}} />
                        )}
                        <div style={{display:'flex',flexDirection:'column'}}>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div>
                          <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>{r.city || r.cityName || ''} {r.type ? `— ${r.type}` : ''}</div>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {total > results.length && (
                <div style={{ padding: 8, display: 'flex', justifyContent: 'center' }}>
                  <button onClick={loadMore} style={{ padding: '8px 14px', borderRadius: 8, background:'#f3f6fb', border:'1px solid #e6eefb' }}>
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