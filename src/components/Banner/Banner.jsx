import styles from './Banner.module.css';
import Image from 'next/image';

export default function Banner({ image, title }) {
    return (
        <div className={styles.banner}>
            <Image
                src={image}
                alt={title}
                fill
                priority
                className={styles.bannerImage}
            />
            <div className={styles.bannerContent}>
                <h1 className={styles.bannerTitle}>{title}</h1>
            </div>
        </div>
    );
}
