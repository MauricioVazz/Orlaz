import { IoSearchOutline, IoPersonSharp } from 'react-icons/io5';
import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.overlay} />
            <div className={styles.container}>
                <div className={styles.logo}><Link href='/'>Orlaz</Link></div>
                <nav className={styles.menu}>
                    <a href="#">Home</a>
                    <a href="#">Cidades</a>
                    <a href="#">Atrações</a>
                    <a href="#">Contato</a>
                </nav>
                <div className={styles.icons}>
                    <span className={styles.icon}>
                        <IoSearchOutline size={24} />
                    </span>
                    <span className={styles.icon}>
                        <IoPersonSharp size={24} />
                    </span>
                </div>
            </div>
        </header>
    )
}