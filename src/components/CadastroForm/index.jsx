"use client";

import React, { useState, useEffect } from "react";
import styles from "./CadastroForm.module.css";
import { useRouter } from "next/navigation";

export default function CadastroForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const router = useRouter();
  
    // Detecta ESC para voltar
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          router.back(); // volta para a página anterior
        }
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
        headers: {
          "Content-Type": "application/json"
        },
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

        <div className={styles.inputGroup}>
          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <input
            type="password"
            id="confirmarSenha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
            placeholder="Confirme sua senha"
          />
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
