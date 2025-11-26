"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Detecta ESC para voltar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
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
        alert(data?.message || 'Email ou senha inválidos.');
        setLoading(false);
        return;
      }

      const profile = data.profile || data.user || null;
      const token = data.token || null;

      if (!profile) {
        alert('Login realizado, mas perfil não recebido.');
        setLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('userId', String(profile.id));
        localStorage.setItem('isLoggedIn', 'true');
        if (token) localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(profile));

        const ev = new CustomEvent('auth:login', { detail: { profile, token } });
        window.dispatchEvent(ev);
      }

      alert('Login realizado com sucesso!');
      const role = profile?.role?.toLowerCase();
      const type = profile?.type?.toLowerCase();
      const rolesArr = Array.isArray(profile.roles)
        ? profile.roles.map((r) => r.toLowerCase())
        : [];

      const isAdmin = Boolean(
        role === "admin" ||
        type === "admin" ||
        profile?.isAdmin === true ||
        rolesArr.includes("admin")
      );

      router.push(isAdmin ? "/AdmPage" : "/");
    } catch (err) {
      console.error("Login error", err);
      alert("Erro de conexão com o servidor.");
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

        {/* CAMPO DE SENHA COM OLHO ANIMADO */}
        <div className={styles.inputGroup}>
          <label htmlFor="senha">Senha</label>

          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Digite sua senha"
            />

            <span
              className={`${styles.eyeIcon} ${
                showPassword ? styles.open : styles.closed
              }`}
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg
                className={styles.eyeSvg}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  className={styles.eyeLine}
                  d="M1 12C2.5 7 7 4 12 4s9.5 3 11 8c-1.5 5-6 8-11 8S2.5 17 1 12Z"
                />
                <circle className={styles.eyeBall} cx="12" cy="12" r="3" />
                <line
                  className={styles.eyeSlash}
                  x1="4"
                  y1="4"
                  x2="20"
                  y2="20"
                />
              </svg>
            </span>
          </div>
        </div>

        <button type="submit" className={styles.botao} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className={styles.link}>
          Não tem conta? <a href="/cadastro">Cadastre-se</a>
        </p>
      </form>
    </div>
  );
}
