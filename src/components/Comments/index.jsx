"use client";
import styles from './Comments.module.css';
import { useState } from 'react';
import { MdModeComment } from 'react-icons/md';
import Link from 'next/link';

const initialComments = [
  {
    user: 'Nami da Shopee',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    comment: 'Um lugar incrível! Vi um amanhecer dos de tirar o fôlego e me viro lá simplesmente espetacular. Vale muito a pena pra quem gosta de natureza e tranquilidade.'
  },
  {
    user: 'Juliana Moura',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    comment: 'Já fui algumas vezes e sempre me encanto! Caminhar por aqui no fim do tarde é maravilhoso, principalmente para ver o pôr do sol. Super recomendo!'
  },
  {
    user: 'Gojo Sigma da Bahia102',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    comment: 'Excelente para quem gosta de fotografar! Tiral várias fotos incríveis do mar e do farol. O visual é realmente de cartão postal.'
  },
  {
    user: 'MagaliTurmadaMonica223',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    comment: 'Lugar lindo e tranquilo, ótimo para passear com a família. Só recomendo levar água e lanchinho, porque não há muitas opções de venda por perto.'
  },
  {
    user: 'Itadure Yudi',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
    comment: 'Um dos melhores pontos turísticos da região. Caminhar até o final do molhe é uma experiência única principalmente ao entardecer.'
  },
  {
    user: 'Lucey1997',
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
    comment: 'Visito mais à noite, principalmente por ser pé da sol. Já achei o caminho um pouco longo, mas vale muito a pena.'
  },
  {
    user: 'Wiss do Vale',
    avatar: 'https://randomuser.me/api/portraits/men/99.jpg',
    comment: 'Adorei! Me emocionei! O local é encantador e o lugar transmite uma paz incrível. Quero voltar em breve!'
  },
];

const places = [
  {
    title: 'Parque Estadual da Serra do Mar',
    img: '/images/parque.jpg',
    desc: 'Trilhas, cachoeiras e natureza preservada! Uma opção para quem ama principal biologia de ecossistemas da região. Comunica uma área de Mata Atlântica nativa, ideal para explorar a pé.',
    link: '#'
  },
  {
    title: 'Praia Martim de Sá',
    img: '/images/cocanha.jpg',
    desc: 'A mais famosa de Caraguatatuba, é conhecida por seu belo movimento, infraestrutura e quiosques. Ideal para famílias, amigos e jovens em uma das praias mais agitadas, onde surfistas e jovens tem diversão à parte.',
    link: '#'
  },
  {
    title: 'Praia da Cocanha',
    img: '/images/indaia.jpg',
    desc: 'Com ambiente tranquilo e familiar, a Praia da Cocanha é ideal para quem busca sossego e águas calmas. Possui passeios de caiaque e stand up, e ótimas opções de alimentação na orla. A praia também é de destaque entre famílias, e abriga também de adoção de tartarugas.',
    link: '#'
  },
  {
    title: 'Morro Santo Antônio',
    img: '/images/martim.jpg',
    desc: 'Um dos pontos turísticos mais procurados de Caraguatatuba, o Morro Santo Antônio oferece uma vista incrível da cidade e do mar, sendo local de decolagem de asa-delta e parapente nos finais de semana. O local é de fácil acesso por trilha ou de carro, só vá em dias ensolarados!',
    link: '#'
  },
];

export default function CommentsSection() {
  const [comments, setComments] = useState(initialComments);
  const [input, setInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (input.trim()) {
      setComments([
        { user: 'Mano Sunga', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', comment: input },
        ...comments,
      ]);
      setInput("");
    }
  }

  return (
    <section className={styles.commentsSection}>
      <div className={styles.commentsCol}>
        <h2 className={styles.title}>Comentarios</h2>
        <div className={styles.commentsList}>
          <form className={styles.commentInputCard} onSubmit={handleSubmit} style={{marginBottom: 0}}>
            <img className={styles.avatar} src="https://randomuser.me/api/portraits/men/32.jpg" alt="Mano Sunga" />
            <div style={{flex: 1}}>
              <div className={styles.user}>Mano Sunga</div>
              <input
                className={styles.input}
                type="text"
                placeholder="Escreva um comentário..."
                value={input}
                onChange={e => setInput(e.target.value)}
                maxLength={180}
                autoComplete="off"
                style={{ marginTop: 4 }}
              />
            </div>
          </form>
          {comments.map((c, i) => (
            <div className={styles.commentCard} key={i}>
              <img className={styles.avatar} src={c.avatar} alt={c.user} />
              <div>
                <div className={styles.user}>{c.user}</div>
                <div className={styles.text}>{c.comment}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.placesCol}>
        <h2 className={styles.title}>Outros locais</h2>
        <div className={styles.placesList}>
          {places.map((p, i) => (
            <div className={styles.placeCard} key={i}>
              <img className={styles.placeImg} src={p.img} alt={p.title} />
              <div className={styles.placeInfo}>
                <div className={styles.placeTitle}>{p.title}</div>
                <div className={styles.placeDesc}>{p.desc}</div>
                <Link className={styles.placeLink} href={`/point`}>Ver mais</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
