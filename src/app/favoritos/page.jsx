'use client';

import React from "react";
import styles from "./favoritos.module.css";
import Headerblue from "@/components/HeaderBlue";
import Footer from "@/components/Footer";
import Link from "next/link";
import { MdLocationOn } from "react-icons/md";


export default function MeusFavoritos() {
  const [favoritos, setFavoritos] = React.useState([]);
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;
    fetch(`http://localhost:3000/favorite/${user.id}`)
      .then(res => res.json())
      .then(async data => {
        const favs = Array.isArray(data.favorites) ? data.favorites : [];
        // Busca dados completos do ponto turístico para cada favorito
        const pontos = await Promise.all(
          favs.map(async fav => {
            const res = await fetch(`http://localhost:3000/tourist-spot/${fav.placeId}`);
            const ponto = await res.json();
            return { ...ponto.touristSpot, favId: fav.id };
          })
        );
        setFavoritos(pontos);
      });
  }, []);

  const handleRemover = async (favId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) return;
    await fetch(`http://localhost:3000/favorite/${favId}/${user.id}`, { method: "DELETE" });
    // Atualiza lista após remover
    fetch(`http://localhost:3000/favorite/${user.id}`)
      .then(res => res.json())
      .then(async data => {
        const favs = Array.isArray(data.favorites) ? data.favorites : [];
        const pontos = await Promise.all(
          favs.map(async fav => {
            const res = await fetch(`http://localhost:3000/tourist-spot/${fav.placeId}`);
            const ponto = await res.json();
            return { ...ponto.touristSpot, favId: fav.id };
          })
        );
        setFavoritos(pontos);
      });
  };

  return (
    <>
      <Headerblue />
      <section className={styles.container}>
        <h1 className={styles.title}>Meus Favoritos</h1>
        <p className={styles.subtitle}>
          Aqui estão seus pontos turísticos favoritos do Litoral Norte. Lembre os lugares incríveis que deseja visitar novamente ou guardar para futuras viagens.
        </p>

        <div className={styles.cardsGrid}>
          {favoritos.length === 0 && (
            <div style={{textAlign:'center',width:'100%'}}>Nenhum favorito encontrado.</div>
          )}
          {favoritos.map((ponto) => (
            <div key={ponto.favId} className={styles.card}>
              <div className={styles.imgContainer} aria-label={ponto.name}>
                <img
                  src={ponto.images && ponto.images.length > 0 ? ponto.images[0].url : '/images/sem-imagem.png'}
                  alt={ponto.name}
                  className={styles.cardImg}
                />
                <button
                  className={styles.btnFavorito}
                  aria-label={`Remover dos favoritos: ${ponto.name}`}
                  onClick={() => handleRemover(ponto.favId)}
                >
                  <div className={styles.iconWrapper}>
                    <span className={styles.starIcon}>★</span>
                    <span className={styles.removeIcon}>×</span>
                  </div>
                </button>
              </div>

              <div className={styles.cardContent}>
                <p className={styles.cidade}><MdLocationOn size={18} style={{verticalAlign:'middle',marginRight:4}} /> {ponto.city}</p>
                <strong className={styles.cardTitle}>{ponto.name}</strong>
                <p className={styles.cardDesc}>{ponto.description}</p>
                <Link
                  href={{
                    pathname: '/Point',
                    query: {
                      name: ponto.name,
                      description: ponto.description,
                      city: ponto.city,
                      type: ponto.type,
                      images: JSON.stringify(ponto.images || [])
                    }
                  }}
                  className={styles.btnVerMais}
                >Ver Mais</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
