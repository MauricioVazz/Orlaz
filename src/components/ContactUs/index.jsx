
import { IoCallOutline, IoMailOutline, IoLocationOutline, IoTimeOutline, IoLogoInstagram, IoLogoWhatsapp, IoLogoTwitter } from 'react-icons/io5';
import styles from './ContactUs.module.css';

export default function ContactUs() {
  return (
    <section className={styles.contactSection}>
      <div className={styles.contactSectionContent}>
        <h2 className={styles.title}>Contact Us</h2>
        <p className={styles.subtitle}>Have questions or want to know more? Send us a message and our team will get back to you soon!</p>
        <div className={styles.contactGrid}>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">Full Name</label>
              <input className={styles.input} type="text" id="name" name="name" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input className={styles.input} type="email" id="email" name="email" required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="phone">Phone</label>
              <input className={styles.input} type="tel" id="phone" name="phone" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="city">City of Interest</label>
              <input className={styles.input} type="text" id="city" name="city" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="message">Message</label>
              <textarea className={styles.textarea} id="message" name="message" rows={4} required />
            </div>
            <button className={styles.button} type="submit">Send Message</button>
          </form>
          <div className={styles.contactInfoBox}>
            <h3 className={styles.infoTitle}>Our Contacts</h3>
            <div className={styles.infoItem}><IoCallOutline size={22} /> <span><b>Phone</b><br/>(12) 3456-7890</span></div>
            <div className={styles.infoItem}><IoMailOutline size={22} /> <span><b>Email</b><br/><a href="mailto:contact@orlaz.com">contact@orlaz.com</a></span></div>
            <div className={styles.infoItem}><IoLocationOutline size={22} /> <span><b>Address</b><br/>1234 Beach Ave, Caraguatatuba - SP</span></div>
            <div className={styles.infoItem}><IoTimeOutline size={22} /> <span><b>Opening Hours</b><br/>Mon-Fri: 8am to 6pm<br/>Sat: 9am to 1pm</span></div>
            <div className={styles.infoItem}>
              <span><b>Social Media</b></span>
              <div className={styles.socialIcons}>
                <a href="#" aria-label="Instagram"><IoLogoInstagram size={22} /></a>
                <a href="#" aria-label="WhatsApp"><IoLogoWhatsapp size={22} /></a>
                <a href="#" aria-label="Twitter"><IoLogoTwitter size={22} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
