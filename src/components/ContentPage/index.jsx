
import styles from './ContentPage.module.css';
import { MdLocationOn, MdShare, MdFavorite } from 'react-icons/md';
import React, { useState } from 'react';

export default function ContentPage({ name, description, city, type, images }) {
    const [mainIdx, setMainIdx] = useState(0);
    const hasImages = images && images.length > 0;
    const [isFavorited, setIsFavorited] = useState(false);
    const [loadingFav, setLoadingFav] = useState(false);

    // Identifica o id do local
    let placeId = null;
    if (images && images.length > 0 && images[0].touristSpotId) {
      placeId = images[0].touristSpotId;
    } else if (images && images.length > 0 && images[0].restaurantId) {
      placeId = images[0].restaurantId;
    } else if (images && images.length > 0 && images[0].placeId) {
      placeId = images[0].placeId;
    } else if (typeof window !== "undefined" && window.location.pathname.match(/\d+$/)) {
      placeId = parseInt(window.location.pathname.match(/\d+$/)[0]);
    }

    // Checa se já está favoritado ao montar
    React.useEffect(() => {
      if (typeof window === "undefined" || !placeId) return;
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) return;
      fetch(`http://localhost:3000/favorite/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.some(fav => fav.placeId === placeId)) {
            setIsFavorited(true);
          }
        });
    }, [placeId]);

    // Função para favoritar/desfavoritar
    const handleFavorite = async () => {
  console.log('handleFavorite chamado, estado:', isFavorited);
      if (typeof window === "undefined") return;
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        alert("Você precisa estar logado para favoritar.");
        return;
      }
      if (!placeId) {
        alert("Não foi possível identificar o local para favoritar.");
        return;
      }
      setLoadingFav(true);
      if (!isFavorited) {
        // Favoritar
        try {
          const res = await fetch("http://localhost:3000/favorite", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: user.id, placeId })
          });
          const data = await res.json();
          if (res.ok) {
            setIsFavorited(true);
            alert("Favorito salvo com sucesso!");
          } else {
            alert(data.error || "Erro ao favoritar.");
          }
        } catch (err) {
          alert("Erro de conexão com o servidor.");
        }
      } else {
        // Desfavoritar
        try {
          // Busca o id do favorito para remover
          const favRes = await fetch(`http://localhost:3000/favorite/${user.id}`);
          const favsData = await favRes.json();
          const favs = Array.isArray(favsData.favorites) ? favsData.favorites : [];
          console.log('Favoritos recebidos:', favs);
          const fav = favs.find(f => f.placeId === placeId);
          console.log('Favorito encontrado para remover:', fav);
          if (fav && fav.id) {
            const res = await fetch(`http://localhost:3000/favorite/${fav.id}/${user.id}`, {
              method: "DELETE"
            });
            if (res.ok) {
              setIsFavorited(false);
              alert("Favorito removido!");
            } else {
              alert("Erro ao remover favorito.");
            }
          } else {
            alert("Favorito não encontrado para remover.");
          }
        } catch (err) {
          alert("Erro de conexão com o servidor.");
        }
      }
      setLoadingFav(false);
    };

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
                        <button
                          className={isFavorited ? styles.btnFavoritoActive : styles.btnFavorito}
                          onClick={handleFavorite}
                        >
                          <MdFavorite size={20} /> {isFavorited ? "Desfavoritar" : "Favorito"}
                        </button>
                    </div>
                        {type && <span className={styles.tipo}>{type}</span>}
                    <p className={styles.descricao}>{description}</p>
                </div>
            </div>
        </div>
    )
}