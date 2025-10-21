
"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './Point.module.css';
import HeaderBlue from '../../components/HeaderBlue';
import ContentPage from '../../components/ContentPage';
import Comments from '../../components/CommentsRetaurant';
import Footer from '@/components/Footer';
import CommentsTourist from '@/components/CommentsTourist';

export default function PointPage() {
  // Recebe os dados via query string
  const [data, setData] = useState(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      // tentar obter um id do ponto turístico (query param 'id')
      let id = params.get('id');
      const name = params.get('name');
      const description = params.get('description');
      const city = params.get('city');
      const type = params.get('type');
      const images = JSON.parse(params.get('images') || '[]');
      // se não veio id pela query, tentar extrair dos images ou do pathname (como em ContentPage)
      if (!id) {
        if (images && images.length > 0 && images[0].touristSpotId) {
          id = images[0].touristSpotId;
        }
        if (!id && window.location.pathname.match(/\d+$/)) {
          id = parseInt(window.location.pathname.match(/\d+$/)[0]);
        }
      }

      // Se houver id ou name, guardamos os dados (permitindo passar touristId ao componente)
      if (id || name) {
        setData({ name, description, city, type, images, id });
      }
    }
  }, []);

  if (!data) return <div style={{textAlign:'center',marginTop:40}}>Nenhum dado recebido.</div>;

  return (
    <div>
      <HeaderBlue />
      <ContentPage
        name={data.name}
        description={data.description}
        city={data.city}
        type={data.type}
        images={data.images}
      />
  <CommentsTourist touristId={data.id || data.touristId || null} />
      <Footer />
    </div>
  );
}
