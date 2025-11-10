"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
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
      const res = await fetch("http://localhost:3000/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      const users = data.profiles || [];
      const user = users.find(u => u.email === email && u.password === senha);
      if (user) {
        alert("Login realizado com sucesso!");
        if (typeof window !== "undefined") {
          // Salva o id do usuário e o flag de login
          localStorage.setItem("userId", String(user.id));
          localStorage.setItem("isLoggedIn", "true");
        }
        router.push("/"); // Redireciona para a home ou dashboard
      } else {
        alert("Email ou senha inválidos.");
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
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

        <button type="submit" className={styles.botao}>
          Entrar
        </button>

        <p className={styles.link}>
          Não tem conta? <a href="/cadastro">Cadastre-se</a>
        </p>
      </form>
    </div>
  );
}
