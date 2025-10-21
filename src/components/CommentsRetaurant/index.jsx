
"use client";
import React, { useEffect, useState } from "react";
import styles from "./CommentsRestaurant.module.css";

// API base
const API_BASE = "http://localhost:3000";

// Util para pegar userId do localStorage
function getUserId() {
  if (typeof window === "undefined") return null;
  // Caso 1: formato antigo (userId/isLoggedIn)
  const userId = localStorage.getItem("userId");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (userId && isLoggedIn === "true") return userId;
  // Caso 2: formato novo (objeto user)
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && (user.islogged || user.isLoggedIn) && user.id) return user.id;
  } catch {}
  return null;
}


export default function CommentsRestaurant({ restaurantId }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profiles, setProfiles] = useState({}); // userId -> profile

  // Pega userId do localStorage ao montar
  useEffect(() => {
    const uid = getUserId();
    // debug temporário
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.log("user no localStorage:", localStorage.getItem("user"), "userId detectado:", uid);
    }
    setUserId(uid);
  }, []);

  // Busca comentários do restaurante
  useEffect(() => {
    if (!restaurantId) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/comment?restaurantId=${restaurantId}`)
      .then((r) => r.json())
      .then((data) => {
        let list = [];
        if (Array.isArray(data.comments)) list = data.comments;
        else if (Array.isArray(data.data)) list = data.data;
        setComments(list);
        // Buscar perfis dos usuários
        const ids = Array.from(new Set(list.map(c => c.userId).filter(Boolean)));
        if (ids.length) fetchProfiles(ids);
      })
      .catch(() => setError("Erro ao buscar comentários"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  // Busca perfis dos usuários
  async function fetchProfiles(ids) {
    const missing = ids.filter(id => !profiles[id]);
    if (!missing.length) return;
    try {
      const results = await Promise.all(
        missing.map(id => fetch(`${API_BASE}/profile/${id}`).then(r => r.ok ? r.json() : null))
      );
      const map = {};
      results.forEach((res, idx) => {
        const id = missing[idx];
        if (res && res.profile) map[id] = res.profile;
      });
      setProfiles(prev => ({ ...prev, ...map }));
    } catch {}
  }

  // Cria comentário
  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || !userId || !restaurantId) return;
    setError(null);
    const payload = {
      content: input,
      userId: Number(userId),
      restaurantId: Number(restaurantId),
    };
    try {
      const res = await fetch(`${API_BASE}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao comentar");
      setComments((prev) => [data.comment || data, ...prev]);
      setInput("");
    } catch (err) {
      setError(err.message || "Erro ao comentar");
    }
  }

  // Deleta comentário
  async function handleDelete(id) {
    if (!window.confirm("Deseja deletar este comentário?")) return;
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/comment/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
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
                      {(prof.name||'U').charAt(0)}
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
