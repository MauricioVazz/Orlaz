
import styles from './ContentPage.module.css';
import { MdLocationOn, MdShare, MdFavorite } from 'react-icons/md';
import React, { useState } from 'react';

export default function ContentPage({ name, description, city, type, images }) {
    const [mainIdx, setMainIdx] = useState(0);
    const hasImages = images && images.length > 0;
    return (
        <div>
            <div className={styles.title}>
                <h1 className={styles.tituloPrincipal}>{name}</h1>
            </div>
            <div className={styles.container}>
                <div className={styles.images}>
                    {hasImages ? (
                        <img src={images[mainIdx].url} alt={name} className={styles.mainImage} />
                    ) : (
                        <div className={styles.mainImage} style={{background:'#eee',display:'flex',alignItems:'center',justifyContent:'center'}}>Sem imagem</div>
                    )}
                    <div className={styles.thumbsRow}>
                        {hasImages && images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img.url}
                                alt={`thumb${idx+1}`}
                                className={mainIdx === idx ? `${styles.thumb} ${styles.thumbActive}` : styles.thumb}
                                onClick={() => setMainIdx(idx)}
                                style={{cursor:'pointer'}}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.actionsRow}>
                        <button className={styles.btnCidade}><MdLocationOn size={20} /> {city}</button>
                        <button className={styles.btnCompartilhar}><MdShare size={20} /> Compartilhar</button>
                        <button className={styles.btnFavorito}><MdFavorite size={20} /> Favorito</button>
                    </div>
                        {type && <span className={styles.tipo}>{type}</span>}
                    <p className={styles.descricao}>{description}</p>
                </div>
            </div>
        </div>
    )
}