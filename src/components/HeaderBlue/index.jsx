"use client";

import { IoSearchOutline, IoPersonSharp, IoHeart } from "react-icons/io5";
import styles from "./HeaderBlue.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Header() {
    const [user, setUser] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        try {
            const u = JSON.parse(localStorage.getItem("user"));
            setUser(u);
        } catch {
            setUser(null);
        }
        setMounted(true);
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
                        <Link href={user ? "/perfil" : "/login"} className={styles.icon}>
                            {user && user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="avatar" style={{width:32,height:32,borderRadius:"50%",border:`2px solid ${user.avatarColor||'#ccc'}`}} />
                            ) : user && user.avatarColor ? (
                                <span style={{width:32,height:32,display:'inline-block',borderRadius:'50%',background:user.avatarColor,border:'2px solid #fff'}}></span>
                            ) : (
                                <IoPersonSharp size={24} />
                            )}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
