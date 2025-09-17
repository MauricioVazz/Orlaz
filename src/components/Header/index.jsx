import { IoSearchOutline, IoPersonSharp, IoHeart } from "react-icons/io5";
import styles from "./Header.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.overlay} />
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">Orlaz</Link>
        </div>
        <nav className={styles.menu}>
          <Link href="/" className={styles.menuLink}>
            Home
          </Link>
          <a href="#">Cidades</a>
          <a href="#">Atrações</a>
          <a href="#">Contato</a>
          <Link href="/favoritos" className={styles.menuLink}>
            
          </Link>
        </nav>
        <div className={styles.actions}>
          <IoSearchOutline className={styles.icon} />
          <IoPersonSharp className={styles.icon} />
        </div>
      </div>
    </header>
  );
}
