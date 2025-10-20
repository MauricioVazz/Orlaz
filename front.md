Guia rápido para o Frontend — Gastronomy CRUD
=============================================

Este arquivo reúne as informações e exemplos para integrar o frontend com o backend de Gastronomy do projeto Orlaz-BackEnd.

Base
----
- Base URL de desenvolvimento: http://localhost:3000
- Rota base: /gastronomy

Endpoints e formatos
--------------------
GET /gastronomy
- Descrição: lista todas as gastronomias
- Resposta 200 (exemplo):
  {
    "message": "Gastronomias encontradas com sucesso",
    "restaurants": [ { id, name, description, imageUrl, city }, ... ]
  }

GET /gastronomy/:id
- Resposta 200 (exemplo):
  { "message": "Gastronomia encontrada com sucesso", "gastronomy": { id, name, description, imageUrl, city } }
- 404 se não existir

POST /gastronomy
- Cria via JSON (Content-Type: application/json)
- Payload JSON (ex):
  {
    "name": "Feijoada",
    "description": "Prato típico",
    "imageUrl": "https://...", // opcional
    "city": "CARAGUATATUBA"
  }
- Resposta 201: { mensagem: "Gastronomia criada com sucesso", gastronomy: {...} }

POST /gastronomy/with-images
- Cria com multipart/form-data (upload de imagens)
- Campos: name, description, city
- Arquivos: key `images` (pode enviar múltiplas entradas `images`)
- O servidor faz upload para Cloudinary e salva `imageUrl` com a primeira imagem

PATCH /gastronomy/:id
- Atualiza via JSON
- Payload: apenas os campos a alterar ou todos
- Status esperados: 200 (sucesso), 400 (payload vazio), 404 (não encontrado), 500 (erro)

DELETE /gastronomy/:id
- Remove registro
- Status 200 em sucesso

Modelo do recurso (shape)
-------------------------
Gastronomy: { id: number, name: string, description: string, imageUrl: string, city: string }

Exemplos Axios (rápido)
-----------------------
import axios from 'axios';
const api = axios.create({ baseURL: 'http://localhost:3000' });

// GET all
const getAll = async () => {
  const resp = await api.get('/gastronomy');
  return resp.data.restaurants || resp.data.gastronomies || resp.data;
}

// GET by id
const getById = async (id) => {
  const resp = await api.get(`/gastronomy/${id}`);
  return resp.data.gastronomy;
}

// POST JSON
const createJson = async (payload) => {
  const resp = await api.post('/gastronomy', payload);
  return resp.data.gastronomy;
}

// POST multipart (upload)
const createWithImages = async ({ name, description, city, files }) => {
  const form = new FormData();
  form.append('name', name);
  form.append('description', description);
  form.append('city', city);
  for (const f of files) form.append('images', f); // key MUST be 'images'

  const resp = await api.post('/gastronomy/with-images', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return resp.data.gastronomy;
}

// PATCH JSON
const update = async (id, payload) => {
  const resp = await api.patch(`/gastronomy/${id}`, payload);
  return resp.data.gastronomy;
}

// DELETE
const remove = async (id) => {
  await api.delete(`/gastronomy/${id}`);
}

Exemplos fetch
--------------
// POST multipart
const resp = await fetch('http://localhost:3000/gastronomy/with-images', {
  method: 'POST',
  body: formData
});

// PATCH JSON
const r = await fetch(`http://localhost:3000/gastronomy/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
const data = await r.json();

FormData builder (helper)
-------------------------
function buildFormData({ name, description, city, files }) {
  const fd = new FormData();
  fd.append('name', name);
  fd.append('description', description);
  fd.append('city', city);
  for (const f of files) fd.append('images', f);
  return fd;
}

React: esqueleto de componente (Form)
-------------------------------------
// Este é um exemplo simplificado, pronto para adaptar
import React, { useState, useEffect } from 'react';
import api from '../services/api'; // axios instance

export default function GastronomyForm({ mode='create', initialData, onDone }) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFiles(e) {
    const chosen = Array.from(e.target.files || []);
    setFiles(chosen);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!name || !description || !city) return setError('Preencha os campos obrigatórios');
    setLoading(true);
    try {
      if (files.length > 0) {
        const fd = buildFormData({ name, description, city, files });
        await api.post('/gastronomy/with-images', fd);
      } else if (mode === 'create') {
        await api.post('/gastronomy', { name, description, city });
      } else {
        await api.patch(`/gastronomy/${initialData.id}`, { name, description, city });
      }
      onDone && onDone();
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro desconhecido';
      setError(msg);
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome" />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição" />
      <select value={city} onChange={e => setCity(e.target.value)}>
        <option value="CARAGUATATUBA">CARAGUATATUBA</option>
        <option value="UBATUBA">UBATUBA</option>
        <option value="SAO_SEBASTIAO">SAO_SEBASTIAO</option>
        <option value="ILHABELA">ILHABELA</option>
      </select>
      <input type="file" multiple onChange={handleFiles} />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Salvar'}</button>
    </form>
  );
}

Validações recomendadas (front)
-------------------------------
- name: obrigatório, minLength 2
- description: obrigatório, minLength 5
- city: deve ser um dos enums listados
- images: aceitar apenas image/*, tamanho máximo (ex.: 5MB)

Tradução de erros (frontend)
----------------------------
- 400: mostre mensagem retornada pelo servidor (ex.: payload vazio)
- 404: "Registro não encontrado"
- 500: "Erro no servidor, tente novamente mais tarde"
