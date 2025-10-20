"use client";
import React, { useEffect, useState } from 'react';
import styles from './Comments.module.css';
import { MdModeComment } from 'react-icons/md';
import Link from 'next/link';
import buildUrl from '../../lib/api';

// keep some sample placeholders when no placeId provided
const placeholderComments = [
  { id: 'p1', content: 'Lugar incrível, recomendo!', userId: null, userName: 'Visitante', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', createdAt: new Date().toISOString() },
];

export default function CommentsSection({ placeId, placeType = 'restaurant', authToken, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfiles, setUserProfiles] = useState({}); // map userId -> profile
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // fetch comments when placeId provided
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!placeId) {
        setComments(placeholderComments);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const param = placeType === 'touristSpot' ? 'touristSpotId' : 'restaurantId';
        const url = buildUrl(`/comments?${param}=${encodeURIComponent(placeId)}`);
        const res = await fetch(url, { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = data && data.comments ? data.comments : [];
        if (mounted) {
          setComments(list);
          // fetch profiles for unique userIds
          const ids = Array.from(new Set(list.map(c => c.userId).filter(Boolean)));
          if (ids.length) fetchProfiles(ids);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Erro ao buscar comentários');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [placeId, placeType, authToken]);

  // fetch current user profile if we have a currentUserId
  useEffect(() => {
    if (!currentUserId) return;
    // if already cached, skip
    if (userProfiles[currentUserId]) return;
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(buildUrl(`/profile/${currentUserId}`), { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        if (data && data.profile) {
          setUserProfiles(prev => ({ ...prev, [currentUserId]: data.profile }));
        }
      } catch (err) {
        console.error('Erro ao buscar perfil do usuário atual', err);
      }
    })();
    return () => { mounted = false };
  }, [currentUserId, authToken, userProfiles]);
  const canPost = !!(authToken || currentUserId);

  async function createComment(e) {
    e && e.preventDefault();
    if (!input.trim()) return;
    if (!placeId) return;
    try {
      const payload = { content: input };
      if (placeType === 'touristSpot') payload.touristSpotId = Number(placeId);
      else payload.restaurantId = Number(placeId);
      if (!authToken && currentUserId) payload.userId = Number(currentUserId);

      const res = await fetch(buildUrl('/comments'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      // backend returns comment in data.comment
      const created = data.comment;
      setComments(prev => [created, ...prev]);
      setInput('');
    } catch (err) {
      setError(err.message || 'Erro ao criar comentário');
    }
  }

  // fetch profiles for a list of user ids and cache them
  async function fetchProfiles(ids) {
    const missing = ids.filter(id => !userProfiles[id]);
    if (!missing.length) return;
    try {
      const promises = missing.map(id => fetch(buildUrl(`/profile/${id}`), { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} }).then(r => r.ok ? r.json() : null));
      const results = await Promise.all(promises);
      const map = {};
      results.forEach((res, idx) => {
        const id = missing[idx];
        if (res && res.profile) map[id] = res.profile;
      });
      setUserProfiles(prev => ({ ...prev, ...map }));
    } catch (err) {
      // ignore profile fetch errors
      console.error('Erro ao buscar perfis de usuário', err);
    }
  }

  async function startEdit(c) {
    setEditingId(c.id);
    setEditingText(c.content);
  }

  async function submitEdit(id) {
    if (!editingText.trim()) return;
    try {
      const payload = { content: editingText };
      if (!authToken && currentUserId) payload.userId = Number(currentUserId);
      const res = await fetch(buildUrl(`/comments/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      const updated = data.comment;
      setComments(prev => prev.map(p => (p.id === id ? updated : p)));
      setEditingId(null);
      setEditingText('');
    } catch (err) {
      setError(err.message || 'Erro ao editar comentário');
    }
  }

  async function deleteComment(id) {
    if (!confirm('Deseja realmente deletar este comentário?')) return;
    try {
      const opts = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      };
      if (!authToken && currentUserId) opts.body = JSON.stringify({ userId: Number(currentUserId) });
      const res = await fetch(buildUrl(`/comments/${id}`), opts);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message || 'Erro ao deletar comentário');
    }
  }

  return (
    <section className={styles.commentsSection}>
      <div className={styles.commentsCol}>
        <h2 className={styles.title}><MdModeComment /> Comentários</h2>
        {loading && <div className={styles.loading}>Carregando comentários...</div>}
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.commentsList}>
          {canPost ? (
            <form className={styles.commentInputCard} onSubmit={createComment} style={{ marginBottom: 0 }}>
              <div className={styles.avatar}>
                {(() => {
                  const p = userProfiles[currentUserId];
                  if (p && p.avatarUrl) return <img src={p.avatarUrl} alt={p.name || 'avatar'} className={styles.avatarImg} />;
                  if (p && p.avatarColor) return <div className={styles.avatarPlaceholder} style={{ background: p.avatarColor }}>{(p.name||'U').charAt(0)}</div>;
                  return <div className={styles.avatarPlaceholder}>U</div>;
                })()}
              </div>
              <div style={{ flex: 1 }}>
                <div className={styles.user}>{currentUserId ? `Você (#${currentUserId})` : 'Você'}</div>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Escreva um comentário..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  maxLength={1000}
                  autoComplete="off"
                  style={{ marginTop: 4 }}
                />
              </div>
            </form>
          ) : (
            <div className={styles.commentLoginHint}>
              <Link href="/login">Faça login</Link> para comentar.
            </div>
          )}

          {comments.map((c) => (
            <div className={styles.commentCard} key={c.id}>
              <div className={styles.commentAvatar}>
                {(() => {
                  const prof = userProfiles[c.userId];
                  if (prof && prof.avatarUrl) return <img src={prof.avatarUrl} alt={prof.name || 'avatar'} className={styles.avatarImg} />;
                  if (prof && prof.avatarColor) return <div className={styles.avatarPlaceholder} style={{ background: prof.avatarColor }}>{(prof.name||'U').charAt(0)}</div>;
                  return c.avatar ? <img src={c.avatar} alt={c.userName || 'avatar'} className={styles.avatarImg} /> : <div className={styles.avatarPlaceholder}>{(c.userName||'U').charAt(0)}</div>;
                })()}
              </div>
              <div style={{ flex: 1 }}>
                <div className={styles.user}>{c.userName || `Usuário #${c.userId || 'anon'}`}</div>
                {editingId === c.id ? (
                  <div>
                    <textarea className={styles.textarea} value={editingText} onChange={e => setEditingText(e.target.value)} />
                    <div className={styles.commentActions}>
                      <button className={styles.button} onClick={() => submitEdit(c.id)}>Salvar</button>
                      <button className={styles.buttonAlt} onClick={() => { setEditingId(null); setEditingText(''); }}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.text}>{c.content}</div>
                )}
                <div className={styles.commentMeta}>{new Date(c.createdAt).toLocaleString()}</div>
              </div>
              <div className={styles.commentControls}>
                {currentUserId && Number(c.userId) === Number(currentUserId) && editingId !== c.id && (
                  <>
                    <button className={styles.smallBtn} onClick={() => startEdit(c)}>Editar</button>
                    <button className={styles.smallBtnDanger} onClick={() => deleteComment(c.id)}>Excluir</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right column: keep previous 'places' suggestions static */}
      <div className={styles.placesCol}>
        <h2 className={styles.title}>Outros locais</h2>
        <div className={styles.placesList}>
          <div className={styles.placeCard}>
            <img className={styles.placeImg} src="/images/parque.jpg" alt="Parque" />
            <div className={styles.placeInfo}>
              <div className={styles.placeTitle}>Parque Estadual da Serra do Mar</div>
              <div className={styles.placeDesc}>Trilhas, cachoeiras e natureza preservada!</div>
              <Link className={styles.placeLink} href={`/point`}>Ver mais</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
