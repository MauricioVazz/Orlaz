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

    // Helper para ler usuário do localStorage (ou fallback para userId/isLoggedIn)
    const getStoredUser = () => {
      if (typeof window === 'undefined') return null;
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.id) return parsed;
        }
      } catch (e) {
        // ignore parse errors
      }
      const id = localStorage.getItem('userId');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (id && (isLoggedIn === 'true' || isLoggedIn === true)) {
        return { id: Number(id) };
      }
      return null;
    };

    // helper to build Authorization header when token exists
    const getAuthHeaders = () => {
      if (typeof window === 'undefined') return {};
      const token = localStorage.getItem('token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    };

    React.useEffect(() => {
      let id = null;
      if (images && images.length > 0 && images[0].touristSpotId) {
        // garantir number
        id = Number(images[0].touristSpotId);
        if (Number.isNaN(id)) id = null;
      }
      if (!id && typeof window !== "undefined" && window.location.pathname.match(/\d+$/)) {
        id = Number(window.location.pathname.match(/\d+$/)[0]);
        if (Number.isNaN(id)) id = null;
      }
      setPlaceId(id);
    }, [images]);

    // Checa se já está favoritado ao montar
    React.useEffect(() => {
      if (typeof window === "undefined" || placeId === null) return;
      const user = getStoredUser();
      console.log('ContentPage: stored user for fav check', user);
      if (!user || !user.id) return;
      fetch(`http://localhost:3000/favorite/${Number(user.id)}`, { headers: getAuthHeaders() })
        .then(res => res.json())
        .then(data => {
          console.log('Verificando favoritos:', { placeId, favoritos: data });
          const favs = Array.isArray(data.favorites) ? data.favorites : [];
          console.log('favoritos recebidos:', favs);
          // comparar como number para evitar mismatch de tipo
          const isFav = favs.some(fav => Number(fav.placeId) === Number(placeId));
          console.log('Resultado da verificação:', isFav);
          setIsFavorited(isFav);
        });
    }, [placeId, images]);

    // Função para favoritar/desfavoritar
    const handleFavorite = async () => {
  console.log('handleFavorite chamado, estado:', isFavorited, 'placeId:', placeId);
      if (typeof window === "undefined") return;
      const user = getStoredUser();
      console.log('handleFavorite user:', user);
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
              "Content-Type": "application/json",
              ...getAuthHeaders(),
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
          const favRes = await fetch(`http://localhost:3000/favorite/${user.id}`, { headers: getAuthHeaders() });
          const favsData = await favRes.json();
          const favs = Array.isArray(favsData.favorites) ? favsData.favorites : [];
          const fav = favs.find(f => f.placeId === placeId);
          if (fav && fav.id) {
            const res = await fetch(`http://localhost:3000/favorite/${fav.id}/${user.id}`, {
              method: "DELETE",
              headers: getAuthHeaders(),
            });
            if (res.ok) {
              // Atualiza favoritos após remover
              fetch(`http://localhost:3000/favorite/${user.id}`, { headers: getAuthHeaders() })
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