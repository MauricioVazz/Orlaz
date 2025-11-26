"use client";

import React, { useState, useEffect } from "react";
import styles from "./CadastroForm.module.css";
import { useRouter } from "next/navigation";

export default function CadastroForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [showSenha, setShowSenha] = useState(false);
  const [showConfirma, setShowConfirma] = useState(false);

  const router = useRouter();

  // ESC para voltar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") router.back();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não conferem!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nome,
          email: email,
          password: senha
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cadastro realizado com sucesso!");
        router.push("/login");
      } else {
        alert(data.error || "Erro ao cadastrar usuário.");
      }
    } catch (err) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className={styles.cadastroContainer}>
      <form onSubmit={handleSubmit} className={styles.cadastroForm}>
        <h2 className={styles.titulo}>Cadastro</h2>

        {/* Nome */}
        <div className={styles.inputGroup}>
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            placeholder="Digite seu nome"
          />
        </div>

        {/* Email */}
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

        {/* SENHA COM OLHO ANIMADO */}
        <div className={styles.inputGroup}>
          <label htmlFor="senha">Senha</label>

          <div className={styles.passwordWrapper}>
            <input
              type={showSenha ? "text" : "password"}
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Digite sua senha"
            />

            <span
              className={`${styles.eyeIcon} ${
                showSenha ? styles.open : styles.closed
              }`}
              onClick={() => setShowSenha(!showSenha)}
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

        {/* CONFIRMAR SENHA COM OLHO ANIMADO */}
        <div className={styles.inputGroup}>
          <label htmlFor="confirmarSenha">Confirmar Senha</label>

          <div className={styles.passwordWrapper}>
            <input
              type={showConfirma ? "text" : "password"}
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              placeholder="Confirme sua senha"
            />

            <span
              className={`${styles.eyeIcon} ${
                showConfirma ? styles.open : styles.closed
              }`}
              onClick={() => setShowConfirma(!showConfirma)}
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

        <button type="submit" className={styles.botao}>
          Cadastrar
        </button>

        <p className={styles.link}>
          Já tem conta? <a href="/login">Faça login</a>
        </p>
      </form>
    </div>
  );
}
