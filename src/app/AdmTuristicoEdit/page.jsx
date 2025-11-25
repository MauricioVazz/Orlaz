"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import styles from "./page.module.css";

const cidades = [
  { value: '', label: 'Selecione' },
  { value: 'CARAGUATATUBA', label: 'Caraguatatuba' },
  { value: 'UBATUBA', label: 'Ubatuba' },
  { value: 'SAO_SEBASTIAO', label: 'São Sebastião' },
  { value: 'ILHABELA', label: 'Ilhabela' },
];
const tipos = [
  { value: '', label: 'Selecione' },
  { value: 'PRAIA', label: 'Praia' },
  { value: 'URBANO', label: 'Urbano' },
  { value: 'NATUREZA', label: 'Natureza' },
];

export default function EditTuristico() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [form, setForm] = useState({
    name: '',
    description: '',
    city: '',
    type: '',
    images: []
  });
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState('');
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);

  // Preview das imagens
  const handleFiles = e => {
    const filesArr = Array.from(e.target.files || []);
    setFiles(filesArr);
    setPreview(filesArr.map(file => URL.createObjectURL(file)));
  };

  useEffect(() => {
    if (!id) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
    setLoadingItem(true);
    fetch(`${API_BASE}/tourist-spot/${encodeURIComponent(id)}`)
      .then(r => r.json())
      .then(data => {
        const item = data.touristSpot || data || null;
        if (item) {
          setForm({
            name: item.name || '',
            description: item.description || '',
            city: item.city || '',
            type: item.type || ''
          });
          const img = item.imageUrl || item.image || (item.images && item.images[0] && (item.images[0].url || item.images[0]));
          if (img) setPreview([img]);
        }
      })
      .catch(err => console.error('fetch tourist-spot', err))
      .finally(() => setLoadingItem(false));
  }, [id]);

  // Envio do formulário
  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('Enviando...');
    setUploading(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setMsg('Usuário não autenticado. Faça login.');
      setUploading(false);
      return;
    }

    try {
      let resp;
      if (id) {
        // update existing
        if (files.length > 0) {
          const formData = new FormData();
          formData.append('name', form.name);
          formData.append('description', form.description);
          formData.append('city', form.city);
          formData.append('type', form.type);
          // enviar múltiplos arquivos no campo 'images'
          files.forEach(f => formData.append('images', f));
          // PATCH para /tourist-spot/:id com multipart/form-data
          resp = await fetch(`${API_BASE}/tourist-spot/${encodeURIComponent(id)}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
          });
        } else {
          resp = await fetch(`${API_BASE}/tourist-spot/${encodeURIComponent(id)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: form.name, description: form.description, city: form.city, type: form.type })
          });
        }
      } else {
        if (files.length === 0) {
          setMsg('Por favor, selecione ao menos uma imagem.');
          setUploading(false);
          return;
        }
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('city', form.city);
        formData.append('type', form.type);
        files.forEach(f => formData.append('images', f));
        resp = await fetch(`${API_BASE}/tourist-spot/with-images`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
      }

      // parse response safely
      const contentType = resp.headers.get('content-type') || '';
      let data = null;
      if (contentType.includes('application/json')) {
        try { data = await resp.json(); } catch { data = null; }
      } else {
        try { const text = await resp.text(); data = { _text: text }; } catch { data = null; }
      }

      if (resp.ok) {
        setMsg(id ? 'Ponto turístico atualizado com sucesso!' : 'Ponto turístico cadastrado com sucesso!');
        if (!id) {
          setForm({ name: '', description: '', city: '', type: '', images: [] });
          setFiles([]);
          setPreview([]);
        } else {
          router.push('/AdmTuristico');
        }
      } else {
        console.error('Request failed', { status: resp.status, statusText: resp.statusText, data });
        if (data && data.error) setMsg(data.error);
        else if (data && data._text) setMsg(`Erro servidor: ${resp.status} ${resp.statusText}`);
        else setMsg(`Erro ao salvar ponto turístico. Código: ${resp.status}`);
      }
    } catch (err) {
      console.error(err);
      setMsg('Erro ao conectar com o servidor.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Excluir este item?')) return;
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      alert('Usuário não autenticado. Faça login.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/tourist-spot/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) router.push('/AdmTuristico');
      else {
        const contentType = res.headers.get('content-type') || '';
        let d = {};
        if (contentType.includes('application/json')) d = await res.json().catch(() => ({}));
        else {
          const t = await res.text().catch(() => '');
          d = { error: t };
        }
        alert(d.error || 'Erro ao deletar');
      }
    } catch (err) {
      console.error('delete', err);
      alert('Erro ao deletar');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{id ? 'Editar Ponto Turístico' : 'Cadastro de Ponto Turístico'}</h1>
      <form onSubmit={handleSubmit}>
        {loadingItem && <div>Carregando item...</div>}
        <label className={styles.label} htmlFor="name">Nome</label>
        <input className={styles.input} type="text" id="name" value={form.name} required
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />

        <label className={styles.label} htmlFor="description">Descrição</label>
        <textarea className={styles.textarea} id="description" value={form.description} required
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

        <label className={styles.label} htmlFor="city">Cidade</label>
        <select className={styles.select} id="city" value={form.city} required
          onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
          {cidades.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <label className={styles.label} htmlFor="type">Tipo</label>
        <select className={styles.select} id="type" value={form.type} required
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          {tipos.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <label className={styles.label} htmlFor="images">Imagens</label>
        <div className={styles.imagesHint}>
          Você pode <b>arrastar e soltar</b> imagens do seu explorador de arquivos aqui ou clicar para selecionar.
        </div>
        <input className={styles.fileInput} type="file" id="images" accept="image/*" multiple onChange={handleFiles} />
        <div className={styles.imagesPreview}>
          {preview.map((src, i) => (
            <img key={i} src={src} alt="preview" />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className={styles.button} type="submit" disabled={uploading}>{uploading ? 'Enviando...' : (id ? 'Atualizar' : 'Cadastrar')}</button>
          {id && <button type="button" onClick={handleDelete} className={styles.button} style={{ background: '#ff4d4f' }}>Excluir</button>}
        </div>
        <div className={styles.msg}>{msg}</div>
      </form>
    </div>
  );
}
