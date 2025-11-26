import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.col}>
          <h2 className={styles.logo}>
            Orlaz
            <br />
            Litoral Norte
          </h2>
          <p className={styles.desc}>
            Descubra as belezas, culturas e gastronomia do Litoral Norte de São Paulo.
          </p>
          <div className={styles.socials}>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <rect
                  width="20"
                  height="20"
                  x="2"
                  y="2"
                  rx="6"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="#fff" />
              </svg>
            </a>
            <a
              href="https://web.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.12.55 4.13 1.6 5.92L0 24l6.18-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.85 0-3.63-.5-5.18-1.44l-.37-.22-3.67.96.98-3.58-.24-.37A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.54-.45-.47-.61-.48-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3 0 1.35.99 2.66 1.13 2.85.14.18 1.95 2.98 4.74 4.06.66.23 1.18.37 1.58.47.66.17 1.26.15 1.74.09.53-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z"
                  fill="#fff"
                />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M22.46 5.94c-.8.36-1.66.6-2.56.71a4.48 4.48 0 0 0 1.97-2.48 8.94 8.94 0 0 1-2.83 1.08A4.48 4.48 0 0 0 11.1 9.5c0 .35.04.7.11 1.03A12.7 12.7 0 0 1 3.1 4.86a4.48 4.48 0 0 0 1.39 5.98c-.74-.02-1.44-.23-2.05-.57v.06c0 2.18 1.55 4 3.6 4.42-.38.1-.78.16-1.2.16-.29 0-.57-.03-.85-.08.57 1.78 2.23 3.08 4.2 3.12A9 9 0 0 1 2 20.07a12.7 12.7 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.78 0-.2 0-.39-.01-.58.88-.64 1.65-1.44 2.26-2.35z"
                  fill="#fff"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Links Rapido</h3>
          <ul className={styles.links}>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="/Pontos">Pontos</a>
            </li>
            <li>
              <a href="/favoritos">Favoritos</a>
            </li>
          </ul>
        </div>
        <div className={styles.col}>
          <h3 className={styles.colTitle}>Contato</h3>
          <address className={styles.address}>
            Av. da Praia, 1234 –<br />
            Caraguatuba – SP
            <br />
            <a href="mailto:Orlazcaragua@gmail.com">Orlazcaragua@gmail.com</a>
          </address>
        </div>
      </div>
      <div className={styles.copy}>
        © 2025 Orlaz Litoral Norte – Todos os direitos reservados
      </div>
    </footer>
  );
}
