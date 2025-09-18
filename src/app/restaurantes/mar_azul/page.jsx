import styles from "./page.module.css";

export default function RestauranteMarAzul() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Restaurante Mar Azul – Frutos do Mar</h2>
      <div className={styles.content}>
        <div className={styles.mainImage}>
          <img src="/images/mar_azul.png" alt="Restaurante Mar Azul" />
        </div>

        <div className={styles.info}>
          <div className={styles.buttons}>
            <button className={styles.location}>📍 Caraguatatuba</button>
            <button className={styles.share}>🔗 Compartilhar</button>
            <button className={styles.review}>⭐ Avaliar</button>
          </div>
          <p>
            O Restaurante Mar Azul, em Caraguatatuba, é especializado em frutos do mar frescos preparados com receitas
            caiçaras e um toque de modernidade. O cardápio traz desde moquecas e peixes assados até criações exclusivas
            que valorizam a pesca local, sempre com muito sabor e autenticidade.
          </p>
          <p>
            O ambiente é acolhedor e familiar, com decoração inspirada no mar e atendimento atencioso, ideal para
            momentos em família, encontros românticos ou celebrações especiais. Aos finais de semana, música ao vivo
            completa a experiência, tornando o Mar Azul uma referência gastronômica no litoral norte paulista.
          </p>
        </div>
      </div>

      {/* <div className={styles.gallery}>
        <img src="/images/mar-azul1.jpg" alt="Mesa frente ao mar" />
        <img src="/images/mar-azul2.jpg" alt="Prato de frutos do mar" />
        <img src="/images/mar-azul3.jpg" alt="Ambiente do restaurante" />
        <img src="/images/mar-azul4.jpg" alt="Vista da praia" />
      </div> */}
    </div>
  );
}
