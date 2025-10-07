import styles from './ContentPage.module.css';
import { MdLocationOn, MdShare, MdFavorite } from 'react-icons/md';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContentPage({ name, description, city, type, images }) {
  const router = useRouter();
    const [mainIdx, setMainIdx] = useState(0);
    const hasImages = images && images.length > 0;
    const [isFavorited, setIsFavorited] = useState(false);
    const [loadingFav, setLoadingFav] = useState(false);

    // Identifica o id do local
    // placeId precisa ser um state para garantir atualização do botão
    const [placeId, setPlaceId] = useState(null);
    React.useEffect(() => {
      let id = null;
      if (images && images.length > 0 && images[0].touristSpotId) {
        id = images[0].touristSpotId;
      }
      if (!id && typeof window !== "undefined" && window.location.pathname.match(/\d+$/)) {
        id = parseInt(window.location.pathname.match(/\d+$/)[0]);
      }
      setPlaceId(id);
    }, [images]);

    // Checa se já está favoritado ao montar
    React.useEffect(() => {
      if (typeof window === "undefined" || placeId === null) return;
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) return;
      fetch(`http://localhost:3000/favorite/${user.id}`)
        .then(res => res.json())
        .then(data => {
          console.log('Verificando favoritos:', { placeId, favoritos: data });
          const favs = Array.isArray(data.favorites) ? data.favorites : [];
          const isFav = favs.some(fav => fav.placeId === placeId);
          console.log('Resultado da verificação:', isFav);
          setIsFavorited(isFav);
        });
  }, [placeId, images]);

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
        alert("Não foi possível identificar o local para favoritar/desfavoritar.");
        return;
      }
      setLoadingFav(true);
      if (!isFavorited) {
        // Favoritar
        try {
          const body = { userId: user.id, placeId };
          console.log('Enviando para favoritar:', body);
          const res = await fetch("http://localhost:3000/favorite", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
          });
          const data = await res.json();
          if (res.ok) {
            setIsFavorited(true);
            alert("Favorito salvo com sucesso!");
          } else {
            alert(data.error || data.message || "Erro ao favoritar. Verifique se já está favoritado ou tente novamente.");
          }
        } catch (err) {
          alert("Erro de conexão com o servidor. Tente novamente mais tarde.");
        }
      } else {
        // Desfavoritar
        try {
          // Busca o id do favorito para remover
          const favRes = await fetch(`http://localhost:3000/favorite/${user.id}`);
          const favsData = await favRes.json();
          const favs = Array.isArray(favsData.favorites) ? favsData.favorites : [];
          const fav = favs.find(f => f.placeId === placeId);
          if (fav && fav.id) {
            const res = await fetch(`http://localhost:3000/favorite/${fav.id}/${user.id}`, {
              method: "DELETE"
            });
            if (res.ok) {
              // Atualiza favoritos após remover
              fetch(`http://localhost:3000/favorite/${user.id}`)
                .then(res => res.json())
                .then(data => {
                  const favs = Array.isArray(data.favorites) ? data.favorites : [];
                  const isFav = favs.some(fav => fav.placeId === placeId);
                  setIsFavorited(isFav);
                });
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

  // Função para redirecionar para Pontos filtrando pela cidade, apenas se for ponto turístico
  const handleLocationClick = () => {
    if (type === 'PRAIA' || type === 'NATUREZA' || type === 'URBANO') {
    router.push(`/Pontos?city=${encodeURIComponent(city)}`);
    }
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
            <button className={styles.btnCidade} onClick={handleLocationClick}><MdLocationOn size={20} /> {city}</button>
            <button className={styles.btnCompartilhar}><MdShare size={20} /> Compartilhar</button>
            <button
              className={isFavorited ? styles.btnFavoritoActive : styles.btnFavorito}
              onClick={handleFavorite}
              disabled={loadingFav}
            >
              <MdFavorite size={20} /> {isFavorited ? "Desfavoritar" : "Favoritar"}
            </button>
          </div>
            {type && <span className={styles.tipo}>{type}</span>}
          <p className={styles.descricao}>{description}</p>
        </div>
      </div>
    </div>
  )
}