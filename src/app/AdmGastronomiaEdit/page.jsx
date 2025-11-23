"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import styles from "./page.module.css";

const cidades = [
  { value: "", label: "Selecione" },
  { value: "CARAGUATATUBA", label: "Caraguatatuba" },
  { value: "UBATUBA", label: "Ubatuba" },
  { value: "SAO_SEBASTIAO", label: "São Sebastião" },
  { value: "ILHABELA", label: "Ilhabela" },
];

export default function EditGastronomia() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [form, setForm] = useState({ name: "", description: "", city: "" });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);

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

  useEffect(() => {
    if (!id) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";
    setLoadingItem(true);
    fetch(`${API_BASE}/gastronomy/${encodeURIComponent(id)}`)
      .then(r => r.json())
      .then(data => {
        const item = data.gastronomy || data || null;
        if (item) {
          setForm({ name: item.name || '', description: item.description || '', city: item.city || '' });
          const img = item.imageUrl || item.image || (item.images && item.images[0] && (item.images[0].url || item.images[0]));
          if (img) setPreview([img]);
        }
      })
      .catch(err => console.error('fetch gastronomy', err))
      .finally(() => setLoadingItem(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMsg("Enviando...");
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

    try {
      let resp;
      if (id) {
        // update existing
        if (files.length > 0) {
          const formData = new FormData();
          formData.append("name", form.name);
          formData.append("description", form.description);
          formData.append("city", form.city);
          files.forEach((f) => formData.append("images", f));
          resp = await fetch(`${API_BASE}/gastronomy/${encodeURIComponent(id)}/with-images`, {
            method: "PATCH",
            body: formData,
          });
        } else {
          resp = await fetch(`${API_BASE}/gastronomy/${encodeURIComponent(id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: form.name, description: form.description, city: form.city }),
          });
        }
      } else {
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
        resp = await fetch(`${API_BASE}/gastronomy/with-images`, {
          method: "POST",
          body: formData,
        });
      }

      // parse response safely
      const contentType = resp.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        try { data = await resp.json(); } catch (err) { data = null; }
      } else {
        try { const text = await resp.text(); data = { _text: text }; } catch { data = null; }
      }

      if (resp.ok) {
        setMsg(id ? "Gastronomia atualizada com sucesso!" : "Gastronomia cadastrada com sucesso!");
        if (!id) resetForm();
        else router.push('/AdmGastronomia');
      } else {
        console.error('Request failed', { status: resp.status, statusText: resp.statusText, data });
        if (data && data.error) setMsg(data.error);
        else if (data && data._text) setMsg(`Erro servidor: ${resp.status} ${resp.statusText}`);
        else setMsg(`Erro ao salvar gastronomia. Código: ${resp.status}`);
      }
    } catch (err) {
      console.error(err);
      setMsg("Erro de conexão com o servidor.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Excluir este item?')) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";
    try {
      const res = await fetch(`${API_BASE}/gastronomy/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) router.push('/AdmGastronomia');
      else {
        const d = await res.json().catch(() => ({}));
        alert(d.error || 'Erro ao deletar');
      }
    } catch (err) {
      console.error('delete', err);
      alert('Erro ao deletar');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{id ? 'Editar Gastronomia' : 'Cadastro de Gastronomia'}</h1>
      <form onSubmit={handleSubmit}>
        {loadingItem && <div>Carregando item...</div>}
        <label className={styles.label} htmlFor="name">Nome</label>
        <input className={styles.input} id="name" type="text" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />

        <label className={styles.label} htmlFor="description">Descrição</label>
        <textarea className={styles.textarea} id="description" required value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />

        <label className={styles.label} htmlFor="city">Cidade</label>
        <select className={styles.select} id="city" required value={form.city} onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}>
          {cidades.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        <label className={styles.label} htmlFor="images">Envie imagem (substitui a atual)</label>
        <div className={styles.imagesHint}>Envie uma nova imagem para substituir a atual (opcional).</div>
        <input className={styles.fileInput} id="images" type="file" accept="image/*" onChange={handleFiles} />
        <div className={styles.imagesPreview}>{preview.map((src, i) => <img key={i} src={src} alt="preview" />)}</div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className={styles.button} type="submit" disabled={uploading}>{uploading ? 'Enviando...' : (id ? 'Atualizar' : 'Cadastrar')}</button>
          {id && <button type="button" onClick={handleDelete} className={styles.button} style={{ background: '#ff4d4f' }}>Excluir</button>}
        </div>
        <div className={styles.msg}>{msg}</div>
      </form>
    </div>
  );
}
