"use client";
import React, { useState } from "react";
import styles from "./page.module.css";

const cidades = [
  { value: "", label: "Selecione" },
  { value: "CARAGUATATUBA", label: "Caraguatatuba" },
  { value: "UBATUBA", label: "Ubatuba" },
  { value: "SAO_SEBASTIAO", label: "São Sebastião" },
  { value: "ILHABELA", label: "Ilhabela" },
];

export default function GastronomiaCreate() {
  const [form, setForm] = useState({ name: "", description: "", city: "" });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    const arr = Array.from(e.target.files || []);
    setFiles(arr);
    setPreview(arr.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      if (files && files.length > 0) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("city", form.city);
        files.forEach((f) => fd.append("images", f));

        const res = await fetch("http://localhost:3000/gastronomy/with-images", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (res.ok) {
          setMsg("Gastronomia criada com sucesso.");
          setForm({ name: "", description: "", city: "" });
          setFiles([]);
          setPreview([]);
        } else {
          setMsg(data.error || "Erro ao criar gastronomia.");
        }
      } else {
        const res = await fetch("http://localhost:3000/gastronomy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
          setMsg("Gastronomia criada com sucesso.");
          setForm({ name: "", description: "", city: "" });
        } else {
          setMsg(data.error || "Erro ao criar gastronomia.");
        }
      }
    } catch (err) {
      console.error(err);
      setMsg("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastrar Gastronomia</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>Nome</label>
        <input className={styles.input} value={form.name} required onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />

        <label className={styles.label}>Descrição</label>
        <textarea className={styles.textarea} value={form.description} required onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />

        <label className={styles.label}>Cidade</label>
        <select className={styles.select} value={form.city} required onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}>
          {cidades.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <label className={styles.label}>Imagens (opcional)</label>
        <input className={styles.fileInput} type="file" accept="image/*" multiple onChange={handleFiles} />

        <div className={styles.preview}>{preview.map((p, i) => <img key={i} src={p} alt={`preview-${i}`} />)}</div>

        <button className={styles.button} type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Criar'}</button>
        <div className={styles.msg}>{msg}</div>
      </form>
    </div>
  );
}
