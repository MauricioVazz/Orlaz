"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Detecta ESC para voltar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        // Redirect explicitly to home so ESC always returns to the initial screen
        router.push('/');
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: senha })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message || 'Email ou senha inválidos.';
        alert(msg);
        setLoading(false);
        return;
      }

      // espera { profile, token }
      const profile = data.profile || data.user || null;
      const token = data.token || null;
      if (!profile) {
        alert('Login realizado, mas perfil não recebido do servidor.');
        setLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('userId', String(profile.id));
        localStorage.setItem('isLoggedIn', 'true');
        if (token) localStorage.setItem('token', token);
        // retrocompatibilidade: guardar o objeto user completo
        localStorage.setItem('user', JSON.stringify(profile));
        // dispatch global event so other components in the same tab can react
        try {
          const ev = new CustomEvent('auth:login', { detail: { profile, token } });
          window.dispatchEvent(ev);
        } catch (err) {
          // older browsers fallback: create and dispatch
          const ev2 = document.createEvent('CustomEvent');
          ev2.initCustomEvent('auth:login', false, false, { profile, token });
          window.dispatchEvent(ev2);
        }
      }

      alert('Login realizado com sucesso!');
      router.push('/');
    } catch (err) {
      console.error('Login error', err);
      alert('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2 className={styles.titulo}>Login</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Digite seu email"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            placeholder="Digite sua senha"
          />
        </div>

        <button type="submit" className={styles.botao} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p className={styles.link}>
          Não tem conta? <a href="/cadastro">Cadastre-se</a>
        </p>
      </form>
    </div>
  );
}
