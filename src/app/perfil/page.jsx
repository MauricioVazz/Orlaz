"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./perfil.module.css";
import { useRouter } from "next/navigation";
import { IoPersonSharp, IoLogOutOutline, IoTrashOutline, IoMailOutline, IoColorPaletteOutline, IoCreateOutline } from "react-icons/io5";

export default function PerfilPage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", avatarUrl: "", avatarColor: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fileInputRef = useRef();
  const router = useRouter();

  useEffect(() => {
    // Busca usuário logado do localStorage
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
    setForm({
      name: u.name || "",
      email: u.email || "",
      avatarUrl: u.avatarUrl || "",
      avatarColor: u.avatarColor || "#cccccc"
    });
    setAvatarPreview(u.avatarUrl || "");
  }, [router]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "avatarUrl") {
      setAvatarPreview(e.target.value);
    }
  };

  // Upload real de imagem de avatar para o backend
  const handleAvatarFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch(`http://localhost:3000/profile/${user.id}/avatar`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const updated = await res.json();
        setSuccess("Avatar atualizado com sucesso!");
        setUser(updated.user);
        setForm(f => ({ ...f, avatarUrl: updated.user.avatarUrl }));
        setAvatarPreview(updated.user.avatarUrl);
        localStorage.setItem("user", JSON.stringify(updated.user));
      } else {
        const err = await res.json();
        setError(err.error || err.message || "Erro ao atualizar avatar.");
      }
    } catch {
      setError("Erro de conexão com o servidor.");
    }
    setLoading(false);
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm("Tem certeza que deseja remover a foto?")) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:3000/profile/${user.id}/avatar`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSuccess("Avatar removido com sucesso!");
        setUser(u => ({ ...u, avatarUrl: "", avatarColor: "#cccccc" }));
        setForm(f => ({ ...f, avatarUrl: "", avatarColor: "#cccccc" }));
        setAvatarPreview("");
        localStorage.setItem("user", JSON.stringify({ ...user, avatarUrl: "", avatarColor: "#cccccc" }));
      } else {
        const err = await res.json();
        setError(err.error || err.message || "Erro ao remover avatar.");
      }
    } catch {
      setError("Erro de conexão com o servidor.");
    }
    setLoading(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:3000/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const updated = await res.json();
        setSuccess("Dados atualizados com sucesso!");
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      } else {
        const err = await res.json();
        setError(err.error || err.message || "Erro ao atualizar usuário.");
      }
    } catch {
      setError("Erro de conexão com o servidor.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Tem certeza que deseja deletar sua conta? Esta ação não poderá ser desfeita.")) return;
    setDeleteLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:3000/user/${user.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        localStorage.removeItem("user");
        router.push("/cadastro");
      } else {
        const err = await res.json();
        setError(err.error || err.message || "Erro ao deletar conta.");
      }
    } catch {
      setError("Erro de conexão com o servidor.");
    }
    setDeleteLoading(false);
  };

  if (!user) return null;

  return (
    <div className={styles.perfilContainer}>
      <h1 className={styles.titulo}>Minha Conta</h1>
      <div className={styles.perfilCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarPreview}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" style={{width:100,height:100,borderRadius:"50%",border:`3px solid ${form.avatarColor||'#ccc'}`}} />
            ) : (
              <span className={styles.avatarFallback} style={{background:form.avatarColor}}><IoPersonSharp size={54} color="#fff" /></span>
            )}
          </div>
          <div className={styles.avatarActions}>
            <button type="button" className={styles.avatarBtn} onClick={() => fileInputRef.current.click()}><IoCreateOutline style={{marginRight:4}}/>Trocar Foto</button>
            <input type="file" accept="image/*" style={{display:'none'}} ref={fileInputRef} onChange={handleAvatarFile} />
            {avatarPreview && (
              <button type="button" className={styles.avatarRemoveBtn} onClick={handleRemoveAvatar}><IoTrashOutline size={18}/> Remover</button>
            )}
          </div>
        </div>
        <div className={styles.infoSection}>
          <div className={styles.infoRow}><span>ID:</span> <b>{user.id}</b></div>
          <div className={styles.infoRow}><IoMailOutline style={{marginRight:4}}/> <span>Email:</span> <b>{user.email}</b></div>
          <div className={styles.infoRow}><span>Conta criada em:</span> <b>{new Date(user.createdAt).toLocaleDateString()}</b></div>
        </div>
        <div className={styles.actionsRow}>
          <button className={styles.logoutBtn} onClick={handleLogout}><IoLogOutOutline size={20}/> Sair</button>
          <button className={styles.deleteBtn} onClick={handleDeleteAccount} disabled={deleteLoading}><IoTrashOutline size={20}/> {deleteLoading ? "Deletando..." : "Deletar Conta"}</button>
        </div>
      </div>
      <button className={styles.editBtn} onClick={()=>setShowEdit(v=>!v)}>{showEdit ? "Fechar edição" : "Editar dados"}</button>
      {showEdit && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Nome
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>Email
            <input name="email" value={form.email} onChange={handleChange} type="email" required />
          </label>
          <label>Cor do Avatar
            <input name="avatarColor" value={form.avatarColor} onChange={handleChange} type="color" />
          </label>
          <button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar Alterações"}</button>
          {success && <div className={styles.success}>{success}</div>}
          {error && <div className={styles.error}>{error}</div>}
        </form>
      )}
    </div>
  );
}
