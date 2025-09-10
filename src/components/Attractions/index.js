import styles from './Attractions.module.css';

export default function Attractions() {
  return (
    <section className={styles.attractionsSection}>
      <h2 className={styles.title}>Atrações Imperdíveis</h2>
      <p className={styles.subtitle}>Descubra o que fazer no litoral norte além de tomar sol</p>
      <div className={styles.grid}>
        <div className={styles.item}>
          <span className={styles.icon}>🌳</span>
          <h3>Trilhas na Mata Atlântica</h3>
          <p>Explore trilhas em meio à natureza exuberante do Parque Estadual da Serra do Mar e outras reservas ambientais.</p>
        </div>
        <div className={styles.item}>
          <span className={styles.icon}>🎉</span>
          <h3>Festivais e Eventos</h3>
          <p>Festival de Maresias, Festa do Divino em Ilhabela, e muitos outros eventos culturais durante o ano todo.</p>
        </div>
        <div className={styles.item}>
          <span className={styles.icon}>💧</span>
          <h3>Esportes Aquáticos</h3>
          <p>Surf, mergulho, stand up paddle, kitesurf e muito mais para os amantes de aventura.</p>
        </div>
        <div className={styles.item}>
          <span className={styles.icon}>🍽️</span>
          <h3>Gastronomia Local</h3>
          <p>Delicie-se com frutos do mar frescos e a culinária caiçara em restaurantes à beira-mar.</p>
        </div>
      </div>
      <div className={styles.cards}>
        <div className={styles.card}>
          <img src="/images/trilha.jpg" alt="Trilhas Ecológicas" />
          <span>Trilhas Ecológicas<br />Explore o melhor da natureza</span>
        </div>
        <div className={styles.card}>
          <img src="/images/ondas.jpg" alt="Ondas Perfeitas" />
          <span>Ondas Perfeitas<br />Surfe em praias de classe mundial</span>
        </div>
        <div className={styles.card}>
          <img src="/images/barco.jpg" alt="Passeios de Barco" />
          <span>Passeios de Barco<br />Descubra ilhas e praias desertas</span>
        </div>
      </div>
    </section>
  );
}
