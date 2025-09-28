
"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './Point.module.css';
import HeaderBlue from '../../components/HeaderBlue';
import ContentPage from '../../components/ContentPage';
import Comments from '../../components/Comments';
import Footer from '@/components/Footer';

export default function PointPage() {
  // Recebe os dados via query string
  const [data, setData] = useState(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('name');
      const description = params.get('description');
      const city = params.get('city');
      const type = params.get('type');
      const images = JSON.parse(params.get('images') || '[]');
      if (name) {
        setData({ name, description, city, type, images });
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
      <Comments />
      <Footer />
    </div>
  );
}
