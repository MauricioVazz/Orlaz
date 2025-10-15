"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./perfil.module.css";
import HeaderBlue from "../../components/HeaderBlue";
import { useRouter } from "next/navigation";
import { IoPersonSharp, IoLogOutOutline, IoTrashOutline, IoMailOutline, IoColorPaletteOutline, IoCreateOutline } from "react-icons/io5";

export default function PerfilPage() {
  // Troca de senha
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handlePasswordChange = e => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    if (!passwords.new || passwords.new.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPasswordError("As senhas não coincidem.");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/profile/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: passwords.new,
          currentPassword: passwords.current
        })
      });
      if (res.ok) {
        setPasswordSuccess("Senha alterada com sucesso!");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        const err = await res.json();
        setPasswordError(err.error || err.message || "Erro ao alterar senha.");
      }
    } catch {
      setPasswordError("Erro de conexão com o servidor.");
    }
    setPasswordLoading(false);
  };
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
    // Busca usuário logado pelo userId do localStorage
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
      return;
    }
    fetch(`http://localhost:3000/profile/${userId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (!data || !data.profile) {
          router.push("/login");
          return;
        }
        setUser(data.profile);
        setForm({
          name: data.profile.name || "",
          email: data.profile.email || "",
          avatarUrl: data.profile.avatarUrl || "",
          avatarColor: data.profile.avatarColor || "#cccccc"
        });
        setAvatarPreview(data.profile.avatarUrl || "");
      });
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
        method: 'PATCH',
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


  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`http://localhost:3000/profile/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const updated = await res.json();
        setSuccess("Dados atualizados com sucesso!");
        // Buscar novamente o usuário do backend para garantir dados completos
        const userId = user.id;
        fetch(`http://localhost:3000/profile/${userId}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && data.profile) {
              setUser(data.profile);
              localStorage.setItem("user", JSON.stringify(data.profile));
            }
          });
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
      const res = await fetch(`http://localhost:3000/profile/${user.id}`, {
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
    <div>
      <HeaderBlue />
    <div className={styles.perfilContainer}>
      <h1 className={styles.titulo}>Minha Conta</h1>
      <div className={styles.perfilCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarPreview}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="avatar" style={{width:100,height:100,borderRadius:"50%"}} />
            ) : (
              <span className={styles.avatarFallback} style={{background:form.avatarColor}}><IoPersonSharp size={54} color="#fff" /></span>
            )}
          </div>
          <div className={styles.avatarActions}>
            <button type="button" className={styles.avatarBtn} onClick={() => fileInputRef.current.click()}><IoCreateOutline style={{marginRight:4}}/>Trocar Foto</button>
            <input type="file" accept="image/*" style={{display:'none'}} ref={fileInputRef} onChange={handleAvatarFile} />

          </div>
        </div>
        <div className={styles.infoSection}>
          {/* Removido ID: não exibir mais o ID do usuário */}
          <div className={styles.infoRow}><span>Nome:</span> <b>{user.name}</b></div>
          <div className={styles.infoRow}><span>Email:</span> <b>{user.email}</b></div>
          <div className={styles.infoRow}><span>Conta criada em:</span> <b>{new Date(user.createdAt).toLocaleDateString()}</b></div>
        </div>
        <div className={styles.actionsRow}>
          <button className={styles.logoutBtn} onClick={handleLogout}><IoLogOutOutline size={20}/> Sair</button>
          <button className={styles.deleteBtn} onClick={handleDeleteAccount} disabled={deleteLoading}><IoTrashOutline size={20}/> {deleteLoading ? "Deletando..." : "Deletar Conta"}</button>
        </div>
      </div>
      <button className={styles.editBtn} onClick={()=>setShowEdit(v=>!v)}>{showEdit ? "Fechar edição" : "Editar dados"}</button>
      <button className={styles.editBtn} onClick={()=>setShowPasswordForm(v=>!v)}>{showPasswordForm ? "Fechar troca de senha" : "Trocar senha"}</button>
      {showPasswordForm && (
        <form className={styles.form} onSubmit={handlePasswordSubmit} style={{marginTop:16}}>
          <label>Senha atual
            <input name="current" value={passwords.current} onChange={handlePasswordChange} type="password" required autoComplete="current-password" />
          </label>
          <label>Nova senha
            <input name="new" value={passwords.new} onChange={handlePasswordChange} type="password" required autoComplete="new-password" minLength={6} />
          </label>
          <label>Confirmar nova senha
            <input name="confirm" value={passwords.confirm} onChange={handlePasswordChange} type="password" required autoComplete="new-password" minLength={6} />
          </label>
          <button type="submit" disabled={passwordLoading}>{passwordLoading ? "Salvando..." : "Alterar Senha"}</button>
          {passwordSuccess && <div className={styles.success}>{passwordSuccess}</div>}
          {passwordError && <div className={styles.error}>{passwordError}</div>}
        </form>
      )}
      {showEdit && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>Nome
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>Email
            <input name="email" value={form.email} onChange={handleChange} type="email" required />
          </label>
          <button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar Alterações"}</button>
          {success && <div className={styles.success}>{success}</div>}
          {error && <div className={styles.error}>{error}</div>}
        </form>
      )}
      </div>
          </div>
  );
}
