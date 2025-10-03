import { IoSearchOutline, IoPersonSharp, IoHeart } from "react-icons/io5";
import styles from "./HeaderBlue.module.css";
import Link from "next/link";

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.overlay} />
            <div className={styles.container}>
                <div className={styles.logo}><Link href='/'>Orlaz</Link></div>
                <nav className={styles.menu}>
                    <Link href="/" className={styles.menuLink}>Home</Link>
                    <Link href="/Cidades" className={styles.menuLink}>Pontos</Link>
                    <Link href="/favoritos" className={styles.menuLink}>Favoritos</Link>
                </nav>
                <div className={styles.icons}>
  <span className={styles.icon}>
    <IoSearchOutline size={24} />
  </span>
  
  {/* Link para login */}
  <Link href="/login" className={styles.icon}>
    <IoPersonSharp size={24} />
  </Link>
                </div>
            </div>
        </header>
    )
}
