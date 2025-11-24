"use client";

import { IoSearchOutline, IoPersonSharp, IoHeart } from "react-icons/io5";
import styles from "./HeaderBlue.module.css";
import Link from "next/link";
import TouristSpotSearch from '@/components/search';
import React, { useEffect, useState } from "react";

export default function Header() {
    const [user, setUser] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        // Preferir o objeto `user` armazenado no localStorage (salvo pelo novo fluxo de login)
        if (typeof window === 'undefined') return;
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const loggedInFlag = localStorage.getItem('isLoggedIn') || (token ? 'true' : null);
        setIsLoggedIn(loggedInFlag);

        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                setMounted(true);
            } catch (err) {
                console.warn('HeaderBlue: erro ao parsear localStorage.user', err);
                setUser(null);
                setMounted(true);
            }
            return;
        }

        // Se não houver objeto `user`, tentamos buscar por userId (compatibilidade retroativa)
        const userId = localStorage.getItem('userId');
        setIsLoggedIn(loggedInFlag);
        if (userId) {
            const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
            fetch(`${API_BASE}/profile/${userId}`)
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => {
                    setUser(data && data.profile ? data.profile : null);
                    setMounted(true);
                })
                .catch(() => {
                    setUser(null);
                    setMounted(true);
                });
        } else {
            setUser(null);
            setMounted(true);
        }

        // Atualiza o header quando o localStorage muda (login/logout em outra aba)
        const onStorage = (ev) => {
            if (!ev.key) return;
            if (['user', 'userId', 'isLoggedIn', 'token'].includes(ev.key)) {
                // re-run the effect logic quickly
                const sUser = localStorage.getItem('user');
                const tok = localStorage.getItem('token');
                const logged = localStorage.getItem('isLoggedIn') || (tok ? 'true' : null);
                setIsLoggedIn(logged);
                if (sUser) {
                    try { setUser(JSON.parse(sUser)); } catch { setUser(null); }
                    setMounted(true);
                } else {
                    const uid = localStorage.getItem('userId');
                    if (uid) {
                        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
                        fetch(`${API_BASE}/profile/${uid}`)
                          .then(res => res.ok ? res.json() : null)
                          .then(data => setUser(data && data.profile ? data.profile : null))
                          .catch(() => setUser(null))
                          .finally(() => setMounted(true));
                    } else {
                        setUser(null);
                        setMounted(true);
                    }
                }
            }
        };
        window.addEventListener('storage', onStorage);
        // também suportar eventos dentro da mesma aba
        const onAuthLogin = (ev) => {
            const detail = ev?.detail || {};
            const profile = detail.profile || JSON.parse(localStorage.getItem('user') || 'null');
            const tok = detail.token || localStorage.getItem('token');
            setIsLoggedIn(localStorage.getItem('isLoggedIn') || (tok ? 'true' : null));
            setUser(profile || null);
            setMounted(true);
        };
        const onAuthLogout = () => {
            setIsLoggedIn(null);
            setUser(null);
            setMounted(true);
        };
        window.addEventListener('auth:login', onAuthLogin);
        window.addEventListener('auth:logout', onAuthLogout);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('auth:login', onAuthLogin);
            window.removeEventListener('auth:logout', onAuthLogout);
        };
    }, []);

    return (
        <header className={styles.header}>
            <div className={styles.overlay} />
            <div className={styles.container}>
                <div className={styles.logo}><Link href='/'>Orlaz</Link></div>
                <nav className={styles.menu}>
                    <Link href="/" className={styles.menuLink}>Home</Link>
                    <Link href="/Pontos" className={styles.menuLink}>Pontos</Link>
                    <Link href="/favoritos" className={styles.menuLink}>Favoritos</Link>
                </nav>
                <div className={styles.icons}>
                    <span className={styles.icon} onClick={() => setShowSearch(s => !s)} style={{cursor: 'pointer'}}>
                        <IoSearchOutline size={24} />
                    </span>
                    {showSearch && (
                        <div className={styles.searchWrapper}>
                            <TouristSpotSearch placeholder="Buscar pontos..." autoFocus openOnMount onSelect={() => setShowSearch(false)} />
                        </div>
                    )}
                    {/* Avatar do usuário logado ou ícone padrão */}
                    {mounted && (
                        (() => {
                            // eslint-disable-next-line no-console
                            console.log("[Header-Link] isLoggedIn:", isLoggedIn);
                            // eslint-disable-next-line no-console
                            console.log("[Header-Link] user:", user);
                            // eslint-disable-next-line no-console
                            console.log("[Header-Link] href será:", isLoggedIn === "true" ? "/perfil" : "/login");
                            return (
                                <Link
                                    href={
                                        isLoggedIn === "true"
                                            ? (user && user.id ? `/perfil?id=${user.id}` : '/perfil')
                                            : '/login'
                                    }
                                    className={styles.icon}
                                >
                                    {user && user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt="avatar" style={{width:38,height:38,borderRadius:"50%"}} />
                                    ) : user && user.avatarColor ? (
                                        <span style={{width:38,height:38,display:'inline-block',borderRadius:'50%',background:user.avatarColor}}></span>
                                    ) : (
                                        <IoPersonSharp size={28} />
                                    )}
                                </Link>
                            );
                        })()
                    )}
                </div>
            </div>
        </header>
    )
}
