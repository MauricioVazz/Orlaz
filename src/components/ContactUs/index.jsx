"use client";

import styles from "./ContactUs.module.css";
import { IoCallOutline, IoMailOutline, IoLocationOutline, IoTimeOutline, IoLogoInstagram, IoLogoWhatsapp, IoLogoTwitter } from "react-icons/io5";

export default function ContactUs() {
  return (
    <section className={styles.contactSection}>
      <div className={styles.contactSectionContent}>
        <h2 className={styles.title}>Fale Conosco</h2>
        <p className={styles.subtitle}>
          Tem dúvidas ou quer saber mais? Envie uma mensagem e nossa equipe responderá em breve!
        </p>
        <div className={styles.contactGrid}>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">Nome Completo</label>
              <input className={styles.input} type="text" id="name" name="name" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input className={styles.input} type="email" id="email" name="email" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="phone">Telefone</label>
              <input className={styles.input} type="tel" id="phone" name="phone" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="city">Cidade de Interesse</label>
              <input className={styles.input} type="text" id="city" name="city" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="message">Mensagem</label>
              <textarea className={styles.textarea} id="message" name="message" rows={4} required />
            </div>
            <button className={styles.button} type="submit">Enviar Mensagem</button>
          </form>

          <div className={styles.contactInfoBox}>
            <h3 className={styles.infoTitle}>Nossos Contatos</h3>
            <div className={styles.infoItem}>
              <IoCallOutline size={22} /> 
              <span><b>Telefone</b><br/>(12) 3456-7890</span>
            </div>
            <div className={styles.infoItem}>
              <IoMailOutline size={22} /> 
              <span><b>Email</b><br/><a href="mailto:contact@orlaz.com">contact@orlaz.com</a></span>
            </div>
            <div className={styles.infoItem}>
              <IoLocationOutline size={22} /> 
              <span><b>Endereço</b><br/>1234 Beach Ave, Caraguatatuba - SP</span>
            </div>
            <div className={styles.infoItem}>
              <IoTimeOutline size={22} /> 
              <span><b>Horário de Funcionamento</b><br/>Seg-Sex: 8h às 18h<br/>Sáb: 9h às 13h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
