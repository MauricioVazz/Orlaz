"use client";
import styles from "@/components/ContentPage/ContentPage.module.css";
import { MdLocationOn, MdShare } from "react-icons/md";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Comments from "@/components/Comments";
import Footer from "@/components/Footer";
import HeaderBlue from "@/components/HeaderBlue";

export default function RestauranteDetalhe() {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [mainIdx, setMainIdx] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3000/restaurant/${id}`)
      .then(res => res.json())
      .then(data => setRestaurante(data.restaurant));
  }, [id]);

  if (!restaurante) return <div style={{textAlign:'center',marginTop:40}}>Carregando...</div>;

  const hasImages = restaurante.images && restaurante.images.length > 0;

  return (
      <div>
        <HeaderBlue />
      <div className={styles.title}>
        <h1 className={styles.tituloPrincipal}>{restaurante.name}</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.images}>
          {hasImages ? (
            <img src={restaurante.images[mainIdx].url} alt={restaurante.name} className={styles.mainImage} />
          ) : (
            <div className={styles.mainImage} style={{background:'#eee',display:'flex',alignItems:'center',justifyContent:'center'}}>Sem imagem</div>
          )}
          <div className={styles.thumbsRow}>
            {hasImages && restaurante.images.map((img, idx) => (
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
            <button className={styles.btnCidade}><MdLocationOn size={20} /> {restaurante.city}</button>
            <button className={styles.btnCompartilhar}><MdShare size={20} /> Compartilhar</button>
          </div>
          {restaurante.type && <span className={styles.tipo}>{restaurante.type}</span>}
          <p className={styles.descricao}>{restaurante.description}</p>
        </div>
      </div>
      <Comments />
      <Footer />
    </div>
  );
}
