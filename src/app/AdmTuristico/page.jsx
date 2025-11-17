"use client";
import React, { useState } from "react";
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

export default function CadastroPontoTuristico() {
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

  // Preview das imagens
  const handleFiles = e => {
    const filesArr = Array.from(e.target.files);
    setFiles(filesArr);
    setPreview(filesArr.map(file => URL.createObjectURL(file)));
  };

  // Envio do formulário
  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('Enviando...');
    setUploading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('city', form.city);
    formData.append('type', form.type);
    files.forEach(f => formData.append('images', f));
    try {
      const resp = await fetch('http://localhost:3000/tourist-spot/with-images', {
        method: 'POST',
        body: formData
      });
      const data = await resp.json();
      if (resp.ok) {
        setMsg('Ponto turístico cadastrado com sucesso!');
        setForm({ name: '', description: '', city: '', type: '', images: [] });
        setFiles([]);
        setPreview([]);
      } else {
        setMsg(data.error || 'Erro ao cadastrar ponto turístico.');
      }
    } catch {
      setMsg('Erro ao conectar com o servidor.');
    }
    setUploading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro de Ponto Turístico</h1>
      <form onSubmit={handleSubmit}>
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
        <input className={styles.fileInput} type="file" id="images" accept="image/*" multiple required onChange={handleFiles} />
        <div className={styles.imagesPreview}>
          {preview.map((src, i) => (
            <img key={i} src={src} alt="preview" />
          ))}
        </div>

        <button className={styles.button} type="submit" disabled={uploading}>Cadastrar</button>
        <div className={styles.msg}>{msg}</div>
      </form>
    </div>
  );
}
