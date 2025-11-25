"use client";
import React, { useEffect, useState } from "react";
import styles from "./CommentsTourist.module.css";

// API base (mesmo backend)
const API_BASE = "http://localhost:3000";

// Util para pegar userId do localStorage (reaproveitado)
function getUserId() {
  if (typeof window === "undefined") return null;
  const userId = localStorage.getItem("userId");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (userId && isLoggedIn === "true") return userId;
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && (user.islogged || user.isLoggedIn) && user.id) return user.id;
  } catch {}
  return null;
}

// helper to build Authorization header when token exists
function getAuthHeaders() {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function CommentsTourist({ touristId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profiles, setProfiles] = useState({});
  const [effectiveId, setEffectiveId] = useState(touristId || null);

  useEffect(() => {
    const uid = getUserId();
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      // tentar extrair id da URL se a prop não foi passada
      const tryGetIdFromUrl = () => {
        try {
          const params = new URLSearchParams(window.location.search);
          return params.get('id') || params.get('touristId') || params.get('placeId') || null;
        } catch (e) {
          return null;
        }
      };
      const fromUrl = tryGetIdFromUrl();
      const eff = touristId || fromUrl || null;
      // eslint-disable-next-line no-console
      console.log("user no localStorage:", localStorage.getItem("user"), "userId detectado:", uid, "touristId prop:", touristId, "touristId url:", fromUrl, "effectiveId:", eff);
      setEffectiveId(eff);
    }
    setUserId(uid);
  }, []);

  useEffect(() => {
    const idToUse = effectiveId || touristId;
    if (!idToUse) return;
    setLoading(true);
    setError(null);
    // use the backend's tourist-spot query param (rouristSpotId)
    const fetchUrl = `${API_BASE}/comment?touristSpotId=${idToUse}`;
    // debug
    // eslint-disable-next-line no-console
    console.log('Fetching comments from', fetchUrl);
    fetch(fetchUrl, { headers: getAuthHeaders() })
      .then((r) => r.json())
      .then((data) => {
        let list = [];
        if (Array.isArray(data.comments)) list = data.comments;
        else if (Array.isArray(data.data)) list = data.data;
        setComments(list);
        const ids = Array.from(new Set(list.map((c) => c.userId).filter(Boolean)));
        if (ids.length) fetchProfiles(ids);
      })
      .catch(() => setError("Erro ao buscar comentários"))
      .finally(() => setLoading(false));
  }, [touristId, effectiveId]);

  async function fetchProfiles(ids) {
    const missing = ids.filter((id) => !profiles[id]);
    if (!missing.length) return;
    try {
      const results = await Promise.all(
        missing.map((id) => fetch(`${API_BASE}/profile/${id}`, { headers: getAuthHeaders() }).then((r) => (r.ok ? r.json() : null)))
      );
      const map = {};
      results.forEach((res, idx) => {
        const id = missing[idx];
        if (res && res.profile) map[id] = res.profile;
      });
      setProfiles((prev) => ({ ...prev, ...map }));
    } catch {}
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const idToUse = effectiveId || touristId;
    if (!input.trim() || !userId || !idToUse) return;
    setError(null);
    // send exactly what the backend expects for creating a tourist-spot comment
    const payload = {
      userId: Number(userId),
      touristSpotId: Number(idToUse),
      content: input,
    };
    // debug
    // eslint-disable-next-line no-console
    console.log('Submitting comment payload', payload, 'effectiveId:', idToUse);
    try {
      const res = await fetch(`${API_BASE}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      // capture response body (may include server error info)
      let data;
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text();
        // eslint-disable-next-line no-console
        console.error('Non-JSON response on comment POST:', text);
        throw new Error('Servidor retornou resposta inválida');
      }
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error('Server error response for POST /comment:', data);
        throw new Error(data.error || data.message || 'Erro ao comentar (500)');
      }
      setComments((prev) => [data.comment || data, ...prev]);
      setInput("");
    } catch (err) {
      setError(err.message || "Erro ao comentar");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deseja deletar este comentário?")) return;
    setError(null);
    // eslint-disable-next-line no-console
    console.log('Deleting comment', id, 'as user', userId);
    try {
      const res = await fetch(`${API_BASE}/comment/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ userId: Number(userId) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao deletar");
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message || "Erro ao deletar");
    }
  }

  return (
    <section className={styles.commentsSection}>
      <h2 className={styles.title}>Comentários</h2>
      {loading && <div className={styles.loading}>Carregando...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {userId ? (
        <form className={styles.commentInputCard} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="Escreva um comentário..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={1000}
            autoComplete="off"
          />
          <button className={styles.button} type="submit" disabled={!input.trim()}>
            Comentar
          </button>
        </form>
      ) : (
        <div className={styles.commentLoginHint}>Faça login para comentar.</div>
      )}

      <div className={styles.commentsList}>
        {comments.length === 0 && <div>Nenhum comentário ainda.</div>}
        {comments
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((c) => {
            const prof = profiles[c.userId];
            return (
              <div className={styles.commentCard} key={c.id}>
                <div className={styles.commentHeader}>
                  {prof && prof.avatarUrl ? (
                    <img src={prof.avatarUrl} alt={prof.name || "avatar"} className={styles.avatarImg} />
                  ) : prof && prof.avatarColor ? (
                    <div className={styles.avatarPlaceholder} style={{ background: prof.avatarColor }}>
                      {(prof.name || "U").charAt(0)}
                    </div>
                  ) : (
                    <div className={styles.avatarPlaceholder}>U</div>
                  )}
                  <span className={styles.userName}>{prof && prof.name ? prof.name : "Usuário"}</span>
                </div>
                <div className={styles.text}>{c.content}</div>
                <div className={styles.commentMeta}>{new Date(c.createdAt).toLocaleString()}</div>
                {userId && Number(c.userId) === Number(userId) && (
                  <button className={styles.smallBtnDanger} onClick={() => handleDelete(c.id)}>
                    Excluir
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
}
