import styles from './Banner.module.css';

export default function Banner({ image, title, subtitle }) {
    return (
        <section className={styles.banner}>
            <img src={image} alt={title} className={styles.bannerImage} />
            <div className={styles.overlay} />
            <div className={styles.content}>
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>
        </section>
    );
}