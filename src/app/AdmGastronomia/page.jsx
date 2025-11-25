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

export default function CadastroGastronomia() {
  const [form, setForm] = useState({ name: "", description: "", city: "" });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFiles = (e) => {
    const filesArr = Array.from(e.target.files || []);
    setFiles(filesArr);
    setPreview(filesArr.map((f) => URL.createObjectURL(f)));
  };

  const resetForm = () => {
    setForm({ name: "", description: "", city: "" });
    setFiles([]);
    setPreview([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMsg("Enviando...");
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

    // read token from localStorage (must be set at login)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setMsg('Usuário não autenticado. Faça login.');
      setUploading(false);
      return;
    }

    try {
      if (files.length === 0) {
        setMsg('Por favor, selecione ao menos uma imagem.');
        setUploading(false);
        return;
      }
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("city", form.city);
      files.forEach((f) => formData.append("images", f));
      const resp = await fetch(`${API_BASE}/gastronomy/with-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
          // no Content-Type header: browser will set multipart boundary
        },
        body: formData,
      });

      // Try to parse JSON only when response is JSON; otherwise read text
      const contentType = resp.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        try {
          data = await resp.json();
        } catch (err) {
          console.warn('Failed to parse JSON response', err);
          data = null;
        }
      } else {
        try {
          const text = await resp.text();
          data = { _text: text };
        } catch (err) {
          data = null;
        }
      }

      if (resp.ok) {
        setMsg("Gastronomia cadastrada com sucesso!");
        resetForm();
      } else {
        console.error('Upload failed', { status: resp.status, statusText: resp.statusText, data });
        if (data && data.error) setMsg(data.error);
        else if (data && data._text) setMsg(`Erro servidor: ${resp.status} ${resp.statusText}`);
        else setMsg(`Erro ao cadastrar gastronomia. Código: ${resp.status}`);
      }
    } catch (err) {
      console.error(err);
      setMsg("Erro de conexão com o servidor.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro de Gastronomia</h1>
      <form onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="name">Nome</label>
        <input className={styles.input} id="name" type="text" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />

        <label className={styles.label} htmlFor="description">Descrição</label>
        <textarea className={styles.textarea} id="description" required value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />

        <label className={styles.label} htmlFor="city">Cidade</label>
        <select className={styles.select} id="city" required value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}>
          {cidades.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        

        <label className={styles.label} htmlFor="images">Ou envie imagens</label>
        <div className={styles.imagesHint}>Você pode enviar uma imagem (recomendado) — caso envie, o campo URL será ignorado.</div>
        <input className={styles.fileInput} id="images" type="file" accept="image/*" onChange={handleFiles} />
        <div className={styles.imagesPreview}>{preview.map((src, i) => <img key={i} src={src} alt="preview" />)}</div>

        <button className={styles.button} type="submit" disabled={uploading}>{uploading ? 'Enviando...' : 'Cadastrar'}</button>
        <div className={styles.msg}>{msg}</div>
      </form>
    </div>
  );
}
