"use client";

import { IoSearchOutline, IoPersonSharp, IoHeart } from "react-icons/io5";
import styles from "./HeaderBlue.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Header() {
    const [user, setUser] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        // Busca apenas o id salvo no localStorage
        const userId = localStorage.getItem("userId");
        const loggedIn = localStorage.getItem("isLoggedIn");
        setIsLoggedIn(loggedIn);
        if (userId) {
            // Busca os dados completos do usuário no backend
            fetch(`http://localhost:3000/profile/${userId}`)
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    // O backend retorna { message, profile }
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
                    <span className={styles.icon}>
                        <IoSearchOutline size={24} />
                    </span>
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
                                        isLoggedIn === "true" ? "/perfil" : "/login"
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
